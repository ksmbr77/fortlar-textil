-- Drop existing public policies on dashboard_settings
DROP POLICY IF EXISTS "Allow public insert access" ON dashboard_settings;
DROP POLICY IF EXISTS "Allow public read access" ON dashboard_settings;
DROP POLICY IF EXISTS "Allow public update access" ON dashboard_settings;

-- Drop existing public policies on goals_history
DROP POLICY IF EXISTS "Allow public delete access" ON goals_history;
DROP POLICY IF EXISTS "Allow public insert access" ON goals_history;
DROP POLICY IF EXISTS "Allow public read access" ON goals_history;
DROP POLICY IF EXISTS "Allow public update access" ON goals_history;

-- Create authenticated-only policies for dashboard_settings
CREATE POLICY "Authenticated users can read settings" 
ON dashboard_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert settings" 
ON dashboard_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings" 
ON dashboard_settings FOR UPDATE TO authenticated USING (true);

-- Create authenticated-only policies for goals_history
CREATE POLICY "Authenticated users can read goals" 
ON goals_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert goals" 
ON goals_history FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update goals" 
ON goals_history FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete goals" 
ON goals_history FOR DELETE TO authenticated USING (true);