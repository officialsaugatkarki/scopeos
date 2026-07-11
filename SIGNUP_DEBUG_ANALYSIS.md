# Supabase Authentication Signup Failure - Debug Analysis

## Root Cause Analysis

### The Problem
When users click "Create Account", signup fails with: **"Database error saving new user"**

### Investigation Results

#### Step 1: Triggers on auth.users
**Finding**: ONE trigger exists:
- `trigger_create_subscription` - fires AFTER INSERT on auth.users

**Issue**: This trigger attempts to execute complex operations that can fail, causing the entire auth.users INSERT to fail.

#### Step 2: Functions Executed During Signup

**Function: `create_subscription_for_user()` (TRIGGER FUNCTION)**

Executes:
1. `SELECT id FROM pricing_plans WHERE slug = 'free'` → Stores in `free_plan_id`
2. `INSERT INTO user_subscriptions (...)` with foreign key reference to pricing_plans
3. `UPDATE profiles SET ...` where id = NEW.id

**Problems Identified**:
- ❌ If `pricing_plans` table is empty or doesn't exist → SELECT returns NULL
- ❌ If `free_plan_id` is NULL → INSERT into user_subscriptions fails (foreign key violation)
- ❌ If `profiles` table doesn't have a record for NEW.id → UPDATE has no effect, but trigger continues
- ❌ No error handling or TRY-CATCH
- ❌ Trigger fires BEFORE profile exists (created by client code after auth.signUp returns)
- ❌ Race condition between trigger and client-side profile creation

#### Step 3: Profiles Table
**Current State**:
- ✓ Table exists in Supabase
- ✓ Primary key: `id` (UUID)
- ✓ Foreign key: `id` references `auth.users(id)`
- ✓ New columns added via ALTER TABLE: current_plan, plan_id, trial_end_date, is_on_trial
- ❌ Profile is created by CLIENT CODE, not by trigger
- ❌ Trigger tries to UPDATE profile that may not exist yet

#### Step 4: Table Constraints

**`pricing_plans` table**:
- ✓ Has UNIQUE constraint on (name, slug)
- ✓ Columns: id, name, slug, price_monthly, features, max_projects
- ❌ Must be POPULATED with data before trigger can use it
- ❌ INSERT in schema_pricing.sql uses `ON CONFLICT (slug) DO NOTHING` - data may not exist if this is first run

**`user_subscriptions` table**:
- ✓ Primary key: `id` (UUID)
- ✓ Foreign key: `user_id` references `auth.users(id)` ON DELETE CASCADE
- ✓ Foreign key: `plan_id` references `pricing_plans(id)` ← CRITICAL ISSUE
- ❌ Has `UNIQUE(user_id)` constraint - if trigger tries to insert twice, second attempt fails
- ✓ RLS enabled: users see only their own subscriptions

**`profiles` table**:
- ✓ Primary key: `id` (UUID)
- ✓ Foreign key: `id` references `auth.users(id)`
- ✓ New columns for subscription tracking added
- ✓ RLS enabled

#### Step 5: Signup Flow Analysis

**Current Signup Flow** (BROKEN):

```
User clicks "Create Account"
    ↓
auth.ts calls supabase.auth.signUp()
    ↓
Supabase creates auth.users record
    ↓
trigger_create_subscription FIRES (AFTER INSERT on auth.users)
    ↓
Trigger tries to SELECT free plan from pricing_plans
    ↓
IF pricing_plans is empty → free_plan_id = NULL
    ↓
Trigger tries INSERT into user_subscriptions with plan_id = NULL
    ↓
FOREIGN KEY CONSTRAINT VIOLATION ❌
    ↓
Trigger fails, entire transaction ROLLS BACK
    ↓
auth.users record is DELETED
    ↓
Client receives: "Database error saving new user"
```

#### Step 6: Secondary Conflicts

**Dual Profile Creation Issue**:
- Trigger tries to UPDATE profiles.* where id = NEW.id
- Client code tries to INSERT into profiles
- If profile doesn't exist when trigger updates, UPDATE is no-op
- Then client INSERT works, but subscription was never created

**Execution Order**:
1. `supabase.auth.signUp()` → Creates auth.users record (synchronous)
2. Trigger fires immediately (synchronous in same transaction)
3. If trigger fails → Entire transaction rolls back, auth.users deleted
4. Client code (profile INSERT) never executes because auth failed

## Root Cause Summary

**PRIMARY CAUSE**: The `create_subscription_for_user()` trigger assumes:
- `pricing_plans` table has data
- `user_subscriptions` can insert successfully
- Profile already exists

If ANY of these fail, the trigger fails, the transaction rolls back, and auth.users is deleted.

**SECONDARY CAUSE**: Schema execution order - `pricing_plans` data insert happens AFTER `user_subscriptions` table is created, but schema import might not execute sequentially.

**TERTIARY CAUSE**: No error handling in trigger - failures are silent at the trigger level but surface as cryptic "Database error" at the auth level.

## The Exact SQL Error

When the trigger executes and `free_plan_id` is NULL:

```sql
INSERT INTO user_subscriptions (user_id, plan_id, status, is_trial, trial_end)
VALUES (NEW.id, NULL, 'active', true, NOW() + INTERVAL '1 year')
```

Fails with: **FOREIGN KEY CONSTRAINT VIOLATION** (plan_id cannot be NULL if it references pricing_plans)

OR if pricing_plans doesn't exist:

```sql
SELECT id INTO free_plan_id FROM pricing_plans WHERE slug = 'free'
```

Fails with: **TABLE DOES NOT EXIST** or **RELATION NOT FOUND**

Both cause the trigger to fail, rolling back the entire auth.users INSERT.

## Impact

- ✓ Auth.users record IS created (briefly)
- ✓ Trigger fires
- ✗ Trigger fails (NULL plan_id or missing table)
- ✗ Transaction rolls back
- ✗ Auth.users record is DELETED
- ✗ Client receives error
- ✗ User cannot sign up

## Why "Database error saving new user" is misleading

The error occurs during auth.users creation, but the user sees it as a profile/data error. The real issue is the trigger failure.

---

## Solution Overview

The fix requires:

1. **Redesign the trigger** - Make it defensive and error-tolerant
2. **Ensure data exists** - pricing_plans must be populated before trigger runs
3. **Simplify the trigger** - Only create subscription, don't touch profile
4. **Add error handling** - Silently skip subscription creation if data missing
5. **Separate concerns** - Profile creation by client, subscription creation by trigger
6. **Create migration** - Idempotent, safe to rerun, preserves existing data

**Next Step**: Execute fixes in this order:
1. Create new, defensive trigger function
2. Ensure pricing_plans is populated
3. Test signup flow
4. Verify subscription and profile creation
