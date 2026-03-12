-- Trinity Remodeling CRM Schema
-- Leads, Activities, and Gallery Projects

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'website_contact'
    CHECK (source IN ('website_contact','website_quote','google','google_maps','yelp','nextdoor','referral','repeat_customer','yard_sign','manual')),
  service_interest TEXT,
  message TEXT,
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new','contacted','estimate_scheduled','estimate_done','proposal_sent','negotiating','won','in_progress','completed','lost','unresponsive')),
  notes TEXT,
  next_follow_up DATE,
  deal_value DECIMAL(10,2),
  lost_reason TEXT,
  project_address TEXT,
  project_timeline TEXT
    CHECK (project_timeline IN ('asap','1_3_months','3_6_months','6_plus_months','planning_phase')),
  property_type TEXT DEFAULT 'residential'
    CHECK (property_type IN ('residential','commercial')),
  archived BOOLEAN DEFAULT false
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up);
CREATE INDEX idx_leads_archived ON leads(archived);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can do everything with leads"
  ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role can insert leads"
  ON leads FOR INSERT TO service_role WITH CHECK (true);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  type TEXT NOT NULL
    CHECK (type IN ('note','email','call','text_message','site_visit','meeting','status_change','document_sent','payment_received')),
  description TEXT NOT NULL
);

CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can do everything with activities"
  ON activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- GALLERY PROJECTS TABLE
-- ============================================
CREATE TABLE gallery_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT,
  location TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  additional_images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);

CREATE TRIGGER gallery_projects_updated_at
  BEFORE UPDATE ON gallery_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE gallery_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published gallery projects"
  ON gallery_projects FOR SELECT TO anon USING (published = true);

CREATE POLICY "Authenticated users can do everything with gallery"
  ON gallery_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- SECURITY DEFINER FUNCTION for public lead submission
-- (avoids exposing service role key)
-- ============================================
CREATE OR REPLACE FUNCTION public.submit_lead(
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT DEFAULT NULL,
  lead_message TEXT DEFAULT NULL,
  lead_source TEXT DEFAULT 'website_contact',
  lead_service_interest TEXT DEFAULT NULL,
  lead_project_address TEXT DEFAULT NULL,
  lead_project_timeline TEXT DEFAULT NULL,
  lead_property_type TEXT DEFAULT 'residential'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO leads (name, email, phone, message, source, service_interest, project_address, project_timeline, property_type)
  VALUES (lead_name, lead_email, lead_phone, lead_message, lead_source, lead_service_interest, lead_project_address, lead_project_timeline, lead_property_type)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_lead TO anon;
