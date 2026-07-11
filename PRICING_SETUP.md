# ScopeOS Pricing Setup Guide

This guide walks you through setting up the pricing and subscription system for ScopeOS.

## Overview

The system now has:
- **Free Plan**: 3 projects, $0/month (limited time offer)
- **Pro Plan**: Unlimited projects, $99/month (50% off from $199)
- **Enterprise Plan**: Custom pricing, contact sales

Each user starts on the Free plan with a 14-day trial.

## Setup Instructions

### 1. Run the Supabase SQL Schema

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your ScopeOS project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `/supabase/schema_pricing.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press `Cmd + Enter`)

The script will:
- Create `pricing_plans` table
- Create `user_subscriptions` table
- Add plan columns to `profiles` table
- Insert the 3 default plans (Free, Pro, Enterprise)
- Set up Row Level Security (RLS) policies
- Create helper functions and triggers
- Auto-subscribe new users to the Free plan

### 2. Verify the Setup

After running the SQL, you can verify it worked by running this query in the SQL Editor:

```sql
SELECT id, name, slug, price_monthly, max_projects FROM pricing_plans ORDER BY display_order;
```

You should see 3 plans returned:
- Free ($0, 3 projects)
- Pro ($99, 999 projects)
- Enterprise ($0, 999 projects)

### 3. App Flow

The new signup and onboarding flow works like this:

1. **User signs up** at `/signup`
   - Creates auth account
   - Redirects to `/onboarding/plan`

2. **Plan selection** at `/onboarding/plan`
   - User sees all 3 plans
   - Selects a plan (defaults to Free)
   - Selection is saved to localStorage as `scopeos_selected_plan`
   - Redirects to `/onboarding`

3. **Onboarding** at `/onboarding`
   - User enters agency name
   - Plan selection is validated
   - Account data is initialized
   - Redirects to `/dashboard`

4. **Dashboard** 
   - Shows "Free Plan" in sidebar
   - Shows "Using X of 3 projects" for Free plan
   - "Using X of Unlimited projects" for Pro plan

### 4. Frontend Integration

The frontend already has:

- **Plan Selection Page**: `/app/onboarding/plan/page.tsx`
  - Shows all 3 plans with pricing and features
  - Highlights the Pro plan as "Most Popular"
  - Displays original crossed-out prices
  - Shows "Limited time offer" discount messaging

- **Updated Dashboard Sidebar**: Shows current plan and project usage
  - Free: 3 projects max
  - Pro: Unlimited projects

- **Mock Data Fixed**: New accounts start with 0 projects (not auto-seeded with 3)

### 5. Update Pricing Display

To change the pricing or features later, edit `/supabase/schema_pricing.sql` and re-run it, or update directly via Supabase dashboard:

```sql
UPDATE pricing_plans 
SET price_monthly = 129.00, price_original = 249.00
WHERE slug = 'pro';
```

## Project Limits

- **Free Plan**: Max 3 projects
- **Pro Plan**: Max 999 projects (effectively unlimited)
- **Enterprise Plan**: Max 999 projects (custom)

The dashboard sidebar displays these limits dynamically based on the user's subscription.

## Trial Period

All users get a 14-day free trial. This is stored in:
- `user_subscriptions.trial_end`
- `user_subscriptions.is_trial`
- `profiles.trial_end_date`
- `profiles.is_on_trial`

To change the trial period, modify the `INTERVAL '14 days'` in the SQL schema.

## User Subscription Fields

The `user_subscriptions` table tracks:
- `user_id`: Reference to auth user
- `plan_id`: Reference to pricing plan
- `status`: 'active', 'canceled', 'expired'
- `current_period_start/end`: Billing cycle dates
- `trial_end`: When trial expires
- `is_trial`: Boolean flag
- `auto_renew`: Whether to auto-renew

## Transitioning Plans

To upgrade/downgrade a user's plan:

```sql
UPDATE user_subscriptions
SET plan_id = (SELECT id FROM pricing_plans WHERE slug = 'pro')
WHERE user_id = 'USER_ID_HERE' AND status = 'active';
```

## Next Steps

1. **Add Payment Processing**: Integrate Stripe or another payment provider
2. **Add Plan Upgrade UI**: Create a settings page to change plans
3. **Add Billing**: Show invoices, manage payment methods
4. **Add Usage Tracking**: Monitor project usage and warn when approaching limits
5. **Add Admin Dashboard**: Manage subscriptions and view analytics

## Support

For questions or issues, check:
- Supabase documentation: https://supabase.com/docs
- ScopeOS project structure: See `/supabase/` directory
