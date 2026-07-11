-- ===================================================================
-- SUPABASE AUTHENTICATION SIGNUP FIX MIGRATION
-- ===================================================================
-- This migration fixes the "Database error saving new user" issue
-- Root cause: trigger_create_subscription fails when pricing_plans is empty
-- 
-- Safe to run multiple times (idempotent)
-- Preserves existing users and subscriptions
-- ===================================================================

-- ===================================================================
-- PHASE 1: Ensure tables exist and have correct structure
-- ===================================================================

-- 1a. Create pricing_plans table if not exists (defensive)
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  price_original DECIMAL(10, 2),
  description TEXT,
  max_projects INTEGER NOT NULL DEFAULT 15,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1b. Create user_subscriptions table if not exists (defensive)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_id UUID REFERENCES pricing_plans(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 year',
  trial_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 year',
  is_trial BOOLEAN DEFAULT true,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1c. Ensure profiles table has subscription columns (safe if they exist)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_plan VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES pricing_plans(id),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
ADD COLUMN IF NOT EXISTS is_on_trial BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS plan_selected_at TIMESTAMP WITH TIME ZONE;

-- ===================================================================
-- PHASE 2: Ensure pricing_plans data exists (idempotent)
-- ===================================================================

-- 2a. Insert pricing plans (or update if they exist)
-- Using UPSERT pattern to ensure data exists without conflicts
INSERT INTO pricing_plans (id, name, slug, price_monthly, price_original, description, max_projects, features, display_order, is_active)
SELECT 
  gen_random_uuid(),
  'Free',
  'free',
  0.00,
  29.00,
  'Perfect for getting started',
  3,
  '["Up to 3 projects", "AI scope analysis", "Basic client portal", "Email support", "Monthly analytics"]'::jsonb,
  1,
  true
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE slug = 'free')
UNION ALL
SELECT 
  gen_random_uuid(),
  'Pro',
  'pro',
  0.00,
  199.00,
  'For growing agencies',
  999,
  '["Unlimited projects", "Advanced AI analysis", "Team collaboration", "Premium integrations", "Priority support", "Advanced analytics", "Custom branding"]'::jsonb,
  2,
  true
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE slug = 'pro')
UNION ALL
SELECT 
  gen_random_uuid(),
  'Enterprise',
  'enterprise',
  0.00,
  NULL,
  'For large teams',
  999,
  '["Everything in Pro", "Custom integrations", "Dedicated support", "SLA guarantee", "On-premise option", "Advanced security"]'::jsonb,
  3,
  true
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE slug = 'enterprise');

-- 2b. Update existing plans to ensure they're free (idempotent)
UPDATE pricing_plans
SET price_monthly = 0.00, updated_at = NOW()
WHERE slug IN ('free', 'pro', 'enterprise')
  AND price_monthly != 0.00;

-- ===================================================================
-- PHASE 3: Drop old problematic trigger and function
-- ===================================================================

-- 3a. Drop the old trigger if it exists
DROP TRIGGER IF EXISTS trigger_create_subscription ON auth.users CASCADE;

-- 3b. Drop the old function if it exists
DROP FUNCTION IF EXISTS create_subscription_for_user() CASCADE;

-- ===================================================================
-- PHASE 4: Create NEW defensive trigger function
-- ===================================================================

-- 4a. Create improved function with error handling
CREATE OR REPLACE FUNCTION create_subscription_for_user()
RETURNS TRIGGER AS $$
DECLARE
  v_free_plan_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Safety check: only proceed if pricing_plans table has data
  SELECT id INTO v_free_plan_id 
  FROM pricing_plans 
  WHERE slug = 'free' AND is_active = true 
  LIMIT 1;
  
  -- If no free plan exists, skip subscription creation (don't fail auth)
  IF v_free_plan_id IS NULL THEN
    RAISE NOTICE 'create_subscription_for_user: Free plan not found, skipping subscription creation for user %', NEW.id;
    RETURN NEW;
  END IF;
  
  -- Check if profile exists (might be created by client code later)
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = NEW.id) INTO v_profile_exists;
  
  -- Try to create subscription (if it already exists, ON CONFLICT handles it)
  BEGIN
    INSERT INTO user_subscriptions (user_id, plan_id, status, is_trial, trial_end)
    VALUES (NEW.id, v_free_plan_id, 'active', true, NOW() + INTERVAL '1 year')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- If profile exists, update it with subscription info
    IF v_profile_exists THEN
      UPDATE profiles 
      SET 
        current_plan = 'free',
        plan_id = v_free_plan_id,
        is_on_trial = true,
        trial_end_date = NOW() + INTERVAL '1 year',
        subscription_status = 'active'
      WHERE id = NEW.id;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the auth signup
    RAISE NOTICE 'create_subscription_for_user: Error creating subscription for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- PHASE 5: Create NEW trigger (with error handling)
-- ===================================================================

-- 5a. Create the new, safer trigger
CREATE TRIGGER trigger_create_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_subscription_for_user();

-- ===================================================================
-- PHASE 6: Enable RLS on all tables
-- ===================================================================

-- 6a. Enable RLS on pricing_plans
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read pricing plans" ON pricing_plans;
CREATE POLICY "Anyone can read pricing plans"
  ON pricing_plans
  FOR SELECT
  USING (is_active = true);

-- 6b. Enable RLS on user_subscriptions  
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can update their own subscriptions"
  ON user_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ===================================================================
-- PHASE 7: Create helper functions for plan management
-- ===================================================================

-- 7a. Function to get user's current plan
DROP FUNCTION IF EXISTS get_user_plan(UUID);
CREATE OR REPLACE FUNCTION get_user_plan(user_id UUID)
RETURNS TABLE (
  plan_name VARCHAR,
  plan_slug VARCHAR,
  max_projects INTEGER,
  is_trial BOOLEAN,
  trial_end TIMESTAMP WITH TIME ZONE
) AS $$
SELECT 
  COALESCE(pp.name, 'Free'::VARCHAR),
  COALESCE(pp.slug, 'free'::VARCHAR),
  COALESCE(pp.max_projects, 3),
  COALESCE(us.is_trial, true),
  COALESCE(us.trial_end, NOW() + INTERVAL '1 year')
FROM user_subscriptions us
LEFT JOIN pricing_plans pp ON us.plan_id = pp.id
WHERE us.user_id = user_id AND us.status = 'active'
LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- 7b. Function to update user's plan
CREATE OR REPLACE FUNCTION update_user_plan(
  p_user_id UUID,
  p_plan_slug VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_id UUID;
BEGIN
  -- Get plan ID (return FALSE if plan doesn't exist)
  SELECT id INTO v_plan_id 
  FROM pricing_plans 
  WHERE slug = p_plan_slug AND is_active = true 
  LIMIT 1;
  
  IF v_plan_id IS NULL THEN
    RAISE NOTICE 'update_user_plan: Plan % not found', p_plan_slug;
    RETURN FALSE;
  END IF;
  
  -- Update subscription
  UPDATE user_subscriptions
  SET plan_id = v_plan_id, updated_at = NOW()
  WHERE user_id = p_user_id AND status = 'active';
  
  -- Update profile if it exists
  UPDATE profiles
  SET 
    current_plan = p_plan_slug, 
    plan_id = v_plan_id, 
    plan_selected_at = NOW()
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- PHASE 8: Create indexes for performance
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_slug ON pricing_plans(slug);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_current_plan ON profiles(current_plan);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ===================================================================
-- PHASE 9: Verify setup
-- ===================================================================

SELECT '✓ MIGRATION COMPLETE' as status;
SELECT 'Pricing plans available:' as info;
SELECT id, name, slug, price_monthly, max_projects, is_active FROM pricing_plans ORDER BY display_order;

-- Verify trigger exists
SELECT 'Triggers on auth.users:' as info;
SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'users';

-- ===================================================================
-- PHASE 10: Migration Notes
-- ===================================================================

-- WHAT THIS FIXES:
-- 1. ✓ Prevents "Database error saving new user" by making trigger fail-safe
-- 2. ✓ Ensures pricing_plans table has data before trigger runs
-- 3. ✓ Makes trigger skip subscription creation if plans not found (doesn't fail auth)
-- 4. ✓ Adds error handling to trigger (EXCEPTION clause)
-- 5. ✓ Separates profile creation (client) from subscription creation (trigger)
-- 6. ✓ Ensures data consistency with idempotent operations
-- 7. ✓ Adds comprehensive RLS policies
-- 8. ✓ Provides helper functions for plan management
--
-- HOW IT WORKS:
-- 1. User signs up via auth.ts: supabase.auth.signUp()
-- 2. Supabase creates auth.users record
-- 3. trigger_create_subscription fires
-- 4. Trigger checks if pricing_plans has 'free' plan
-- 5. If plan found: creates user_subscriptions record (safe with ON CONFLICT)
-- 6. If plan not found: trigger skips gracefully, auth still succeeds
-- 7. Client code creates profiles table after auth succeeds
-- 8. Trigger updates profile if it exists
-- 9. User can now sign in and access dashboard
--
-- SAFE TO RUN MULTIPLE TIMES:
-- - All INSERT operations use ON CONFLICT or WHERE NOT EXISTS
-- - All ALTER TABLE uses IF NOT EXISTS
-- - All DROP uses IF EXISTS
-- - Existing user data is never modified
-- - Existing subscriptions are never deleted
--
-- COMPATIBLE WITH EXISTING DATA:
-- - Doesn't delete or modify existing users, profiles, or subscriptions
-- - Only updates pricing_plans prices to 0.00 if not already
-- - Only creates new subscriptions for users without subscriptions
