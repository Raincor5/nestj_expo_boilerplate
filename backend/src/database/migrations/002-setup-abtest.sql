-- Create AB test tables
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ab_test_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  group_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(test_id, group_name)
);

CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES ab_test_groups(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, test_id)
);

CREATE TABLE IF NOT EXISTS ab_test_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES ab_test_groups(id) ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value VARCHAR(1024),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ab_test_groups_test_id ON ab_test_groups(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user_id ON ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test_id ON ab_test_assignments(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_group_id ON ab_test_assignments(group_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_metrics_user_id ON ab_test_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_metrics_test_id ON ab_test_metrics(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_metrics_group_id ON ab_test_metrics(group_id);

-- Insert default test and groups
INSERT INTO ab_tests (name, description, active)
VALUES ('home_ui_test', 'Testing home screen UI variants', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO ab_test_groups (test_id, group_name, description)
SELECT id, 'variant_a', 'Control variant - original UI'
FROM ab_tests
WHERE name = 'home_ui_test'
AND NOT EXISTS (
  SELECT 1 FROM ab_test_groups 
  WHERE test_id = ab_tests.id 
  AND group_name = 'variant_a'
);

INSERT INTO ab_test_groups (test_id, group_name, description)
SELECT id, 'variant_b', 'Treatment variant - new UI'
FROM ab_tests
WHERE name = 'home_ui_test'
AND NOT EXISTS (
  SELECT 1 FROM ab_test_groups 
  WHERE test_id = ab_tests.id 
  AND group_name = 'variant_b'
);
