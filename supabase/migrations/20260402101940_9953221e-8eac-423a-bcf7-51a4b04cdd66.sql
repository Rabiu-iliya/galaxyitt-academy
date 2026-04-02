
-- 1. Create enums
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'instructor', 'student');
CREATE TYPE public.cohort_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'completed', 'dropped');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- 2. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT NOT NULL DEFAULT '12 weeks',
  icon TEXT,
  highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create cohorts table
CREATE TABLE public.cohorts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_students INT NOT NULL DEFAULT 30,
  status public.cohort_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON public.cohorts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  status public.enrollment_status NOT NULL DEFAULT 'pending',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, cohort_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  method TEXT DEFAULT 'mock',
  status public.payment_status NOT NULL DEFAULT 'pending',
  invoice_reference TEXT,
  payment_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Helper functions (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

-- 10. RLS Policies

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin_or_super_admin(auth.uid()));

-- programs (public read)
CREATE POLICY "Anyone can view programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage programs" ON public.programs FOR ALL TO authenticated USING (public.is_admin_or_super_admin(auth.uid())) WITH CHECK (public.is_admin_or_super_admin(auth.uid()));

-- cohorts (public read)
CREATE POLICY "Anyone can view cohorts" ON public.cohorts FOR SELECT USING (true);
CREATE POLICY "Admins can manage cohorts" ON public.cohorts FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can update cohorts" ON public.cohorts FOR UPDATE TO authenticated USING (public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can delete cohorts" ON public.cohorts FOR DELETE TO authenticated USING (public.is_admin_or_super_admin(auth.uid()));

-- enrollments
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Users can create own enrollment" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update enrollments" ON public.enrollments FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can delete enrollments" ON public.enrollments FOR DELETE TO authenticated USING (public.is_admin_or_super_admin(auth.uid()));

-- payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_admin_or_super_admin(auth.uid())) WITH CHECK (public.is_admin_or_super_admin(auth.uid()));

-- 11. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''));
  -- Default role: student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Seed programs
INSERT INTO public.programs (name, slug, description, price, duration, icon, highlights) VALUES
('AI & Machine Learning', 'ai-machine-learning', 'Master artificial intelligence and machine learning algorithms. Build intelligent systems using Python, TensorFlow, and PyTorch. From neural networks to natural language processing.', 220000, '12 weeks', 'Brain', ARRAY['Deep Learning & Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Model Deployment']),
('Software Engineering', 'software-engineering', 'Learn software engineering principles, design patterns, and best practices. Build scalable applications with modern architectures and agile methodologies.', 200000, '12 weeks', 'Code2', ARRAY['Design Patterns', 'System Architecture', 'Agile & Scrum', 'Testing & CI/CD']),
('Cybersecurity', 'cybersecurity', 'Protect digital assets and infrastructure. Learn ethical hacking, penetration testing, network security, and incident response strategies.', 200000, '12 weeks', 'Shield', ARRAY['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Incident Response']),
('Data Science', 'data-science', 'Transform data into actionable insights. Master statistics, data visualization, machine learning, and big data technologies.', 180000, '12 weeks', 'BarChart3', ARRAY['Statistical Analysis', 'Data Visualization', 'Big Data Tools', 'Predictive Modeling']),
('Cloud Computing', 'cloud-computing', 'Design and deploy cloud infrastructure on AWS, Azure, and GCP. Learn cloud architecture, serverless computing, and cloud security.', 170000, '12 weeks', 'Cloud', ARRAY['AWS & Azure & GCP', 'Cloud Architecture', 'Serverless', 'Cloud Security']),
('Full Stack Web Development', 'full-stack-web-development', 'Build complete web applications from frontend to backend. Master React, Node.js, databases, and deployment pipelines.', 150000, '12 weeks', 'Globe', ARRAY['React & Next.js', 'Node.js & Express', 'Database Design', 'API Development']),
('Mobile App Development', 'mobile-app-development', 'Create cross-platform mobile applications. Master React Native, Flutter, and native development for iOS and Android.', 150000, '12 weeks', 'Smartphone', ARRAY['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment']),
('DevOps Engineering', 'devops-engineering', 'Bridge development and operations. Master CI/CD pipelines, containerization, infrastructure as code, and monitoring.', 170000, '12 weeks', 'Settings', ARRAY['Docker & Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging']),
('Blockchain Development', 'blockchain-development', 'Build decentralized applications and smart contracts. Learn Solidity, Web3, DeFi protocols, and blockchain architecture.', 180000, '12 weeks', 'Link', ARRAY['Smart Contracts', 'Solidity & Web3', 'DeFi Protocols', 'dApp Development']),
('Game Development', 'game-development', 'Create immersive games using Unity and Unreal Engine. Learn game design, 3D modeling, physics engines, and multiplayer networking.', 160000, '12 weeks', 'Gamepad2', ARRAY['Unity & Unreal Engine', 'Game Design', '3D Modeling', 'Multiplayer Systems']),
('UI/UX Design', 'ui-ux-design', 'Design beautiful, user-centered digital experiences. Master Figma, prototyping, user research, and design systems.', 120000, '12 weeks', 'Palette', ARRAY['Figma & Design Tools', 'User Research', 'Prototyping', 'Design Systems']),
('Network Engineering', 'network-engineering', 'Design and manage enterprise networks. Master routing, switching, network security, and wireless technologies.', 130000, '12 weeks', 'Network', ARRAY['Routing & Switching', 'Network Security', 'Wireless Technologies', 'Network Monitoring']),
('Database Administration', 'database-administration', 'Manage and optimize enterprise databases. Master SQL, NoSQL, database security, backup strategies, and performance tuning.', 120000, '12 weeks', 'Database', ARRAY['SQL & NoSQL', 'Performance Tuning', 'Backup & Recovery', 'Database Security']),
('Internet of Things (IoT)', 'internet-of-things', 'Build connected devices and IoT ecosystems. Learn embedded systems, sensor networks, edge computing, and IoT security.', 140000, '12 weeks', 'Cpu', ARRAY['Embedded Systems', 'Sensor Networks', 'Edge Computing', 'IoT Security']);
