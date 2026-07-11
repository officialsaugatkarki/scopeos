-- ScopeOS Pricing & Subscription Schema for Beta
-- Run this SQL in your Supabase SQL editor
-- ALL PLANS ARE FREE DURING BETA

-- 1. Create pricing_plans table
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

-- 2. Create user_subscriptions table
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

-- 3. Insert default pricing plans
INSERT INTO pricing_plans (name, slug, price_monthly, price_original, description, max_projects, features, display_order)
VALUES 
  (
    'Free',
    'free',
    0.00,
    29.00,
    'Perfect for getting started',
    3,
    '["Up to 3 projects", "AI scope analysis", "Basic client portal", "Email support", "Monthly analytics"]'::jsonb,
    1
  ),
  (
    'Pro',
    'pro',
    0.00,
    199.00,
    'For growing agencies',
    999,
    '["Unlimited projects", "Advanced AI analysis", "Team collaboration", "Premium integrations", "Priority support", "Advanced analytics", "Custom branding"]'::jsonb,
    2
  ),
  (
    'Enterprise',
    'enterprise',
    0.00,
    NULL,
    'For large teams',
    999,
    '["Everything in Pro", "Custom integrations", "Dedicated support", "SLA guarantee", "On-premise option", "Advanced security"]'::jsonb,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. Add subscription columns to existing profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_plan VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES pricing_plans(id),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
ADD COLUMN IF NOT EXISTS is_on_trial BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS plan_selected_at TIMESTAMP WITH TIME ZONE;

-- 5. Create RLS policies for pricing_plans (everyone can read)
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read pricing plans" ON pricing_plans;
CREATE POLICY "Anyone can read pricing plans"
  ON pricing_plans
  FOR SELECT
  USING (is_active = true);

-- 6. Create RLS policies for user_subscriptions (users see their own)
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

-- 7. Create helper function to get user's current plan
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
  pp.name,
  pp.slug,
  pp.max_projects,
  us.is_trial,
  us.trial_end
FROM user_subscriptions us
JOIN pricing_plans pp ON us.plan_id = pp.id
WHERE us.user_id = user_id AND us.status = 'active'
LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- 8. Drop old trigger FIRST (before dropping function it depends on)
DROP TRIGGER IF EXISTS trigger_create_subscription ON auth.users CASCADE;

-- 9. Then drop old function
DROP FUNCTION IF EXISTS create_subscription_for_user() CASCADE;

-- 10. Create new function with error handling
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

-- 11. Create trigger to auto-subscribe new users to Free plan
CREATE TRIGGER trigger_create_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_subscription_for_user();

-- 12. Drop old update_user_plan function if exists
DROP FUNCTION IF EXISTS update_user_plan(UUID, VARCHAR);

-- 13. Create function to update user's plan
CREATE OR REPLACE FUNCTION update_user_plan(
  user_id UUID,
  plan_slug VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  plan_id UUID;
BEGIN
  SELECT id INTO plan_id FROM pricing_plans WHERE slug = plan_slug LIMIT 1;
  
  IF plan_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  UPDATE user_subscriptions
  SET plan_id = plan_id, updated_at = NOW()
  WHERE user_id = user_id AND status = 'active';
  
  UPDATE profiles
  SET current_plan = plan_slug, plan_id = plan_id, plan_selected_at = NOW()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 14. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_slug ON pricing_plans(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_current_plan ON profiles(current_plan);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 15. Verify setup
SELECT 'Beta Pricing Plans (All Free):' as section;
SELECT id, name, slug, price_monthly, max_projects FROM pricing_plans ORDER BY display_order;

SELECT '✓ Schema created successfully!' as status;
SELECT '✓ All plans are FREE for beta testers!' as note;
SELECT '✓ New users auto-assigned to Free plan with 1 year trial' as info;
