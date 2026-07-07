-- FreshDrive Supabase DB Schema
-- Location: Pan India (Fresher/Entry-Level & Government Jobs Tracker)

-- Enable uuid-ossp if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Category Enum type
CREATE TYPE job_category AS ENUM ('it_services', 'product', 'govt', 'other');

-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  career_page_url TEXT NOT NULL,
  category TEXT NOT NULL
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  location TEXT NOT NULL DEFAULT 'Pan India',
  ctc_min INTEGER, -- in LPA (e.g., 4)
  ctc_max INTEGER, -- in LPA (e.g., 6)
  category job_category NOT NULL,
  req_number TEXT, -- Requisition / Batch code (e.g., INF-2026-9812)
  batch_year TEXT, -- Eligible batch year (e.g., "2026", "2025/2026")
  bond_period TEXT, -- Bond duration details (e.g., "1 Year", "None")
  apply_url TEXT NOT NULL, -- Original external application link
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  closing_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  source_url TEXT, -- Link to original page where sourced
  is_sample BOOLEAN NOT NULL DEFAULT FALSE, -- Tagged as sample data in UI
  description TEXT, -- Detailed description of the job profile
  eligibility TEXT -- Detailed eligibility criteria
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- =========================================================================

-- Enable RLS on both tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 1. Create SELECT policies to allow public read-only access (for SEO crawling and client viewing)
CREATE POLICY "Allow public SELECT access to companies" 
  ON companies FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow public SELECT access to jobs" 
  ON jobs FOR SELECT 
  TO public 
  USING (true);

-- 2. Confirming write operations:
-- By enabling RLS and NOT defining any INSERT, UPDATE, or DELETE policies for 
-- the 'anon' or 'public' roles, Supabase Postgres will reject any write operations 
-- from unauthenticated/anonymous client requests by default. Only admin/service_role 
-- keys will bypass RLS.
