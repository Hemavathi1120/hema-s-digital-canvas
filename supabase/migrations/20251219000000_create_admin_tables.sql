-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  location TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  color TEXT,
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  grade TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'frontend', 'backend', 'tools', 'other'
  proficiency INTEGER DEFAULT 50, -- 0-100
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leadership table
CREATE TABLE IF NOT EXISTS leadership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  achievements TEXT[],
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  category TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leadership_updated_at BEFORE UPDATE ON leadership
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access for skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access for leadership" ON leadership FOR SELECT USING (true);
CREATE POLICY "Public read access for achievements" ON achievements FOR SELECT USING (true);

-- Create policies for admin write access
CREATE POLICY "Admin full access for profiles" ON profiles
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin full access for projects" ON projects
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin full access for education" ON education
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin full access for skills" ON skills
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin full access for leadership" ON leadership
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin full access for achievements" ON achievements
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin read own profile" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Insert default profile data
INSERT INTO profiles (full_name, title, subtitle, location, bio, email) VALUES
(
  'Hema Saidhu',
  'Full Stack Developer',
  'Crafting elegant digital experiences through code. B.Tech student, passionate developer, and Toastmaster leader shaping tomorrow''s innovations.',
  'Andhra Pradesh, India',
  'I''m Hema Saidhu, a B.Tech student at KIET Group of Engineering & Technology with a deep passion for building exceptional digital experiences. My journey in tech began with curiosity and has evolved into a commitment to excellence.',
  'contact@hemasaidhu.dev'
);

-- Insert default projects
INSERT INTO projects (title, description, tags, featured, color, order_index) VALUES
(
  'Sahayak',
  'A comprehensive Teaching Assistant Platform designed to streamline educational interactions between students and teachers.',
  ARRAY['React', 'Node.js', 'MongoDB', 'Real-time'],
  true,
  'from-primary/20 to-gold-dark/20',
  1
),
(
  'Expense Manager',
  'Smart financial tracking application helping users manage their expenses with intuitive visualizations and insights.',
  ARRAY['React', 'Firebase', 'Charts', 'PWA'],
  true,
  'from-emerald-500/20 to-cyan-500/20',
  2
),
(
  'UI Clones',
  'Pixel-perfect recreations of popular applications including Instagram and WhatsApp, showcasing frontend mastery.',
  ARRAY['React', 'CSS', 'Responsive', 'Animations'],
  false,
  'from-pink-500/20 to-orange-500/20',
  3
);

-- Insert default education
INSERT INTO education (institution, degree, field, start_date, current, grade, order_index) VALUES
(
  'KIET Group of Engineering & Technology',
  'B.Tech',
  'Computer Science & Engineering',
  '2022-09-01',
  true,
  'In Progress',
  1
),
(
  'Intermediate',
  'MPC',
  'Mathematics, Physics, Chemistry',
  '2020-06-01',
  false,
  '92%',
  2
),
(
  '10th Grade',
  'SSC',
  'Secondary School',
  '2018-06-01',
  false,
  '95.6%',
  3
);
