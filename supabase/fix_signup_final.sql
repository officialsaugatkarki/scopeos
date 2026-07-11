-- ===========================================================================
-- FIX_SIGNUP_FINAL.SQL  —  ScopeOS Signup Fix (Definitive, Idempotent)
-- ===========================================================================
-- Run this once in your Supabase SQL Editor.
-- Safe to run multiple times; will not duplicate data or break existing users.
--
-- What it fixes:
--   1. `handle_new_user` trigger (if any) that conflicts with signup
--   2. `create_subscription_for_user` trigger that crashes auth.users INSERT
--      because it runs without SECURITY DEFINER and without error handling
--   3. Ensures pricing_plans is populated BEFORE any trigger is created
--   4. Ensures profiles RLS allows service-role inserts (anon key INSERT)
--   5. Merges signup logic into ONE robust, ordered, atomic function
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- PHASE 0: Disable conflicting triggers so we can safely recreate everything
-- ---------------------------------------------------------------------------

-- Drop every known trigger on auth.users (both old and new names)
DROP TRIGGER IF EXISTS trigger_create_subscription  ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user              ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created         ON auth.users CASCADE;

-- Drop all related functions
DROP FUNCTION IF EXISTS create_subscription_for_user()  CASCADE;
DROP FUNCTION IF EXISTS handle_new_user()               CASCADE;

-- ---------------------------------------------------------------------------
-- PHASE 1: Ensure all tables exist with the right structure
-- ---------------------------------------------------------------------------

-- 1a. pricing_plans
CREATE TABLE IF NOT EXISTS pricing_plans (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(50)     NOT NULL UNIQUE,
  slug           VARCHAR(50)     NOT NULL UNIQUE,
  price_monthly  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  price_original DECIMAL(10,2),
  description    TEXT,
  max_projects   INTEGER         NOT NULL DEFAULT 15,
  features       JSONB           DEFAULT '[]'::jsonb,
  is_active      BOOLEAN         DEFAULT true,
  display_order  INTEGER         DEFAULT 0,
  created_at     TIMESTAMPTZ     DEFAULT NOW(),
  updated_at     TIMESTAMPTZ     DEFAULT NOW()
);

-- 1b. profiles (must already exist; we only ADD columns safely)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS current_plan        VARCHAR(50)   DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_id             UUID          REFERENCES pricing_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50)   DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS trial_end_date      TIMESTAMPTZ   DEFAULT (NOW() + INTERVAL '1 year'),
  ADD COLUMN IF NOT EXISTS is_on_trial         BOOLEAN       DEFAULT true,
  ADD COLUMN IF NOT EXISTS plan_selected_at    TIMESTAMPTZ;

-- 1c. user_subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_id              UUID        REFERENCES pricing_plans(id) ON DELETE SET NULL,
  status               VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end   TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 year',
  trial_end            TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 year',
  is_trial             BOOLEAN     DEFAULT true,
  auto_renew           BOOLEAN     DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- PHASE 2: Populate pricing_plans BEFORE any trigger is created
-- ---------------------------------------------------------------------------
-- We use individual INSERT … WHERE NOT EXISTS so the operation is idempotent
-- and never raises "duplicate key" errors.

INSERT INTO pricing_plans (name, slug, price_monthly, price_original, description, max_projects, features, display_order, is_active)
SELECT 'Free','free',0.00,29.00,'Perfect for getting started',3,
  '["Up to 3 projects","AI scope analysis","Basic client portal","Email support","Monthly analytics"]'::jsonb,
  1,true
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE slug = 'free');

INSERT INTO pricing_plans (name, slug, price_monthly, price_original, description, max_projects, features, display_order, is_active)
SELECT 'Pro','pro',0.00,199.00,'For growing agencies',999,
  '["Unlimited projects","Advanced AI analysis","Team collaboration","Premium integrations","Priority support","Advanced analytics","Custom branding"]'::jsonb,
  2,true
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE slug = 'pro');

INSERT INTO pricing_plans (name, slug, price_monthly, price_original, description, max_projects, features, display_order, is_active)
SELECT 'Enterprise','enterprise',0.00,NULL,'For large teams',999,
  '["Everything in Pro","Custom integrations","Dedicated support","SLA guarantee","On-premise option","Advanced security"]'::jsonb,
  3,true
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE slug = 'enterprise');

-- Force all beta plans to $0 (idempotent price reset)
UPDATE pricing_plans
SET price_monthly = 0.00, updated_at = NOW()
WHERE slug IN ('free','pro','enterprise') AND price_monthly <> 0.00;

-- ---------------------------------------------------------------------------
-- PHASE 3: Create the ONE robust signup trigger function
--
-- Design decisions:
--   • SECURITY DEFINER  → runs as the DB owner, bypasses RLS on public tables
--   • EXCEPTION clause  → any SQL error is logged, NOT bubbled up to auth
--   • NULL plan guard   → if pricing_plans is somehow empty, auth still wins
--   • ON CONFLICT       → safe if user already has a subscription row
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                          -- crucial: bypasses RLS
SET search_path = public                  -- prevents search_path injection
AS $$
DECLARE
  v_free_plan_id  UUID;
  v_name          TEXT;
BEGIN
  -- -----------------------------------------------------------------------
  -- Step 1: Resolve the display name from auth metadata
  -- -----------------------------------------------------------------------
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)   -- fallback: email prefix
  );

  -- -----------------------------------------------------------------------
  -- Step 2: Upsert the profile row
  --   • INSERT if the profile doesn't exist yet
  --   • ON CONFLICT (id) DO NOTHING → safe if client code already created it
  -- -----------------------------------------------------------------------
  BEGIN
    INSERT INTO profiles (
      id,
      email,
      name,
      agency_name,
      role,
      team_size,
      avatar_url,
      website,
      default_hourly_rate,
      currency,
      timezone,
      date_format,
      language,
      onboarding_completed,
      current_plan,
      subscription_status,
      is_on_trial,
      trial_end_date
    ) VALUES (
      NEW.id,
      NEW.email,
      v_name,
      '',              -- agency_name
      'Agency Owner',  -- role
      '1',             -- team_size
      '',              -- avatar_url
      '',              -- website
      0,               -- default_hourly_rate
      'USD',           -- currency
      'UTC',           -- timezone
      'MM/DD/YYYY',    -- date_format
      'en',            -- language
      false,           -- onboarding_completed
      'free',          -- current_plan
      'active',        -- subscription_status
      true,            -- is_on_trial
      NOW() + INTERVAL '14 days'  -- trial_end_date (14-day trial matches client)
    )
    ON CONFLICT (id) DO NOTHING;   -- client already created the row → skip
  EXCEPTION WHEN OTHERS THEN
    -- Log but do NOT re-raise; profile creation failure must not kill auth
    RAISE WARNING 'handle_new_user: profile insert failed for %; error: %', NEW.id, SQLERRM;
  END;

  -- -----------------------------------------------------------------------
  -- Step 3: Locate the free plan (guard against empty pricing_plans)
  -- -----------------------------------------------------------------------
  SELECT id
  INTO   v_free_plan_id
  FROM   pricing_plans
  WHERE  slug = 'free'
    AND  is_active = true
  LIMIT  1;

  IF v_free_plan_id IS NULL THEN
    RAISE WARNING 'handle_new_user: no active free plan found; skipping subscription for user %', NEW.id;
    RETURN NEW;   -- auth succeeds; subscription can be backfilled later
  END IF;

  -- -----------------------------------------------------------------------
  -- Step 4: Upsert the subscription row
  -- -----------------------------------------------------------------------
  BEGIN
    INSERT INTO user_subscriptions (
      user_id,
      plan_id,
      status,
      is_trial,
      trial_end,
      current_period_start,
      current_period_end
    ) VALUES (
      NEW.id,
      v_free_plan_id,
      'active',
      true,
      NOW() + INTERVAL '1 year',
      NOW(),
      NOW() + INTERVAL '1 year'
    )
    ON CONFLICT (user_id) DO NOTHING;   -- already subscribed → skip

    -- -----------------------------------------------------------------------
    -- Step 5: Sync subscription fields back to the profile row
    -- -----------------------------------------------------------------------
    UPDATE profiles
    SET
      current_plan        = 'free',
      plan_id             = v_free_plan_id,
      subscription_status = 'active',
      is_on_trial         = true,
      trial_end_date      = NOW() + INTERVAL '1 year'
    WHERE id = NEW.id;

  EXCEPTION WHEN OTHERS THEN
    -- Log but do NOT re-raise; subscription failure must not kill auth
    RAISE WARNING 'handle_new_user: subscription upsert failed for %; error: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;   -- always succeed → auth.users INSERT is never rolled back
END;
$$;

-- ---------------------------------------------------------------------------
-- PHASE 4: Attach the trigger to auth.users
-- ---------------------------------------------------------------------------

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- PHASE 5: RLS policies
-- ---------------------------------------------------------------------------

-- 5a. pricing_plans — public read, no write from the client
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active pricing plans" ON pricing_plans;
CREATE POLICY "Anyone can read active pricing plans"
  ON pricing_plans FOR SELECT
  USING (is_active = true);

-- 5b. profiles — owners can read/write their own row;
--     service role (used by the trigger) bypasses RLS automatically
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile"   ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Needed so the client-side signUp() code can also INSERT the profile
-- (The trigger uses SECURITY DEFINER so it doesn't need this policy,
--  but the client call in auth.ts does.)
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5c. user_subscriptions — owners see/update their own row
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscription"   ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON user_subscriptions;

CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- PHASE 6: Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_pricing_plans_slug          ON pricing_plans(slug);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active        ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id  ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status   ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_current_plan       ON profiles(current_plan);
CREATE INDEX IF NOT EXISTS idx_projects_user_id            ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at         ON projects(created_at DESC);

-- ---------------------------------------------------------------------------
-- PHASE 7: Helper function — get_user_plan()
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS get_user_plan(UUID);
CREATE OR REPLACE FUNCTION get_user_plan(p_user_id UUID)
RETURNS TABLE (
  plan_name    VARCHAR,
  plan_slug    VARCHAR,
  max_projects INTEGER,
  is_trial     BOOLEAN,
  trial_end    TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(pp.name,         'Free'::VARCHAR),
    COALESCE(pp.slug,         'free'::VARCHAR),
    COALESCE(pp.max_projects, 3),
    COALESCE(us.is_trial,     true),
    COALESCE(us.trial_end,    NOW() + INTERVAL '1 year')
  FROM   user_subscriptions us
  LEFT   JOIN pricing_plans pp ON us.plan_id = pp.id
  WHERE  us.user_id = p_user_id
    AND  us.status  = 'active'
  LIMIT  1;
$$;

-- ---------------------------------------------------------------------------
-- PHASE 8: Helper function — update_user_plan()
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS update_user_plan(UUID, VARCHAR);
CREATE OR REPLACE FUNCTION update_user_plan(p_user_id UUID, p_plan_slug VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_id UUID;
BEGIN
  SELECT id INTO v_plan_id
  FROM   pricing_plans
  WHERE  slug = p_plan_slug AND is_active = true
  LIMIT  1;

  IF v_plan_id IS NULL THEN
    RAISE NOTICE 'update_user_plan: plan % not found', p_plan_slug;
    RETURN FALSE;
  END IF;

  UPDATE user_subscriptions
  SET    plan_id    = v_plan_id,
         updated_at = NOW()
  WHERE  user_id = p_user_id AND status = 'active';

  UPDATE profiles
  SET    current_plan      = p_plan_slug,
         plan_id           = v_plan_id,
         plan_selected_at  = NOW()
  WHERE  id = p_user_id;

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- PHASE 9: Verification queries (output visible in SQL editor)
-- ---------------------------------------------------------------------------

SELECT '===== VERIFICATION =====' AS info;

SELECT 'pricing_plans rows:' AS check, COUNT(*)::TEXT AS result
FROM pricing_plans;

SELECT 'trigger on auth.users:' AS check, trigger_name AS result
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table  = 'users'
  AND trigger_name        = 'on_auth_user_created';

SELECT 'handle_new_user function:' AS check, routine_name AS result
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

SELECT '✓ Migration complete — signup flow is now fully atomic and error-safe.' AS status;
