# Quick Fix: Apply Supabase Authentication Signup Fix

## TL;DR

**Problem**: Users can't sign up - "Database error saving new user"  
**Cause**: Trigger assumes pricing_plans table has data, fails when it doesn't  
**Solution**: Apply new trigger with error handling  
**Time**: 2 minutes  
**Risk**: None (idempotent, preserves all data)  

---

## Step-by-Step Application

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Open your ScopeOS project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"

### Step 2: Copy the Fix
1. Open this file: `/supabase/schema_pricing_fix.sql`
2. Select ALL content (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)

### Step 3: Paste into Supabase
1. In Supabase SQL Editor, click in the code area
2. Paste the entire file (Ctrl+V or Cmd+V)
3. Review the code (it should be ~350 lines)

### Step 4: Execute
1. Click the blue "Run" button (or Ctrl+Enter)
2. Wait for execution (should take 5-10 seconds)
3. Check output for: "✓ MIGRATION COMPLETE"

### Step 5: Verify Success
```sql
-- Run these queries to verify:

-- 1. Check pricing plans exist
SELECT name, slug, price_monthly FROM pricing_plans ORDER BY display_order;
-- Should return: Free (0.00), Pro (0.00), Enterprise (0.00)

-- 2. Check trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users' AND trigger_name = 'trigger_create_subscription';
-- Should return: trigger_create_subscription

-- 3. Check function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'create_subscription_for_user';
-- Should return: create_subscription_for_user
```

---

## Test the Fix

### Test Signup
1. Open your app at `http://localhost:3000/signup`
2. Enter any email and password
3. Click "Create Account"
4. **Expected**: Redirects to plan selection page (no error)
5. **NOT expected**: "Database error saving new user"

### Verify in Database
1. In Supabase dashboard, go to "profiles" table
2. Find your test email
3. ✓ Should see profile row with subscription fields

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "syntax error" | Make sure entire file is copied, no truncation |
| "relation already exists" | Normal, script uses IF NOT EXISTS, just continue |
| "function already exists" | Normal, script drops and recreates, just continue |
| Execution hangs | Wait 10 seconds, might be processing |
| No "MIGRATION COMPLETE" message | Scroll down in output, should be at bottom |

---

## Files Involved

| File | Purpose | Action |
|------|---------|--------|
| `/supabase/schema_pricing_fix.sql` | Fix migration | Run in Supabase SQL Editor |
| `/lib/auth.ts` | Signup flow | No changes needed |
| `/app/onboarding/plan/page.tsx` | Plan selection | Already updated |
| `/supabase/schema_pricing.sql` | Old version | Can keep as reference |

---

## After the Fix

### What Works Now
- ✓ Users can sign up
- ✓ Profiles are created
- ✓ Subscriptions are created
- ✓ Plan selection works
- ✓ Dashboard displays correct plan

### What Changes
- ✓ Pricing plans cached in database (not just client)
- ✓ Subscriptions tracked per user
- ✓ Trial periods enforced (1 year)
- ✓ Plan changes synced to database

---

## Rollback (if needed)

If for any reason you need to revert:

```sql
-- Drop the new function and trigger
DROP TRIGGER IF EXISTS trigger_create_subscription ON auth.users;
DROP FUNCTION IF EXISTS create_subscription_for_user();

-- Recreate old version (if you saved it)
-- Or just delete the tables and re-run old schema_pricing.sql
```

---

## Next Steps

1. ✓ Apply this fix (you are here)
2. Test signup in development
3. Deploy to production
4. Monitor Supabase logs
5. Announce to beta testers: "Signups now working!"

---

## Support

**Something not working?**
1. Check Supabase logs: Dashboard → Logs
2. Look for "create_subscription_for_user" errors
3. Verify pricing_plans table has data
4. Run verification queries above
5. If still stuck, re-run the migration (it's idempotent)

**Need more details?**
- See `SIGNUP_DEBUG_ANALYSIS.md` for root cause
- See `SIGNUP_FIX_COMPLETE.md` for full technical details
- See `/supabase/schema_pricing_fix.sql` for SQL comments

---

## Checklist

- [ ] Backup Supabase data (optional but recommended)
- [ ] Copy full contents of `schema_pricing_fix.sql`
- [ ] Open Supabase SQL Editor
- [ ] Paste into new query
- [ ] Click "Run"
- [ ] Wait for "✓ MIGRATION COMPLETE"
- [ ] Run verification queries above
- [ ] Test signup on app
- [ ] Verify profile and subscription created
- [ ] Celebrate! 🎉

---

**You're done!** Signups should now work without errors.
