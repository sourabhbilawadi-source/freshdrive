-- Seed mock data for FreshDrive
-- All items set is_sample = true so the UI can flag them as "Sample listings"

INSERT INTO companies (id, name, logo_url, career_page_url, category) VALUES
('11111111-1111-1111-1111-111111111111', 'Razorpay', 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&h=128&fit=crop&auto=format&q=80', 'https://razorpay.com/jobs/', 'product MNC'),
('22222222-2222-2222-2222-222222222222', 'Infosys', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&auto=format&q=80', 'https://www.infosys.com/careers/', 'IT Services'),
('33333333-3333-3333-3333-333333333333', 'Bharat Electronics Limited', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop&auto=format&q=80', 'https://bel-india.in/careers.aspx', 'Govt/PSU');

INSERT INTO jobs (
  id,
  title,
  company_name,
  company_logo_url,
  location,
  ctc_min,
  ctc_max,
  category,
  req_number,
  batch_year,
  bond_period,
  apply_url,
  posted_date,
  closing_date,
  is_active,
  source_url,
  is_sample
) VALUES
-- 1. Razorpay (Product/MNC) - CTC 8-12 LPA, Closing soon
(
  '44444444-4444-4444-4444-444444444444',
  'Software Engineer Intern',
  'Razorpay',
  'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&h=128&fit=crop&auto=format&q=80',
  'Bengaluru (ORR)',
  8,
  12,
  'product',
  'RZP-2026-SE901',
  '2026 Batch',
  'None',
  'https://razorpay.com/jobs/software-engineer-intern-bengaluru',
  CURRENT_DATE - INTERVAL '1 day',
  CURRENT_DATE + INTERVAL '4 days',
  TRUE,
  'https://razorpay.com/jobs/',
  TRUE
),
-- 2. Infosys (IT Services) - CTC 3-4 LPA
(
  '55555555-5555-5555-5555-555555555555',
  'Associate Systems Engineer',
  'Infosys',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&auto=format&q=80',
  'Bengaluru (Electronic City)',
  3,
  4,
  'it_services',
  'INF-ASE-2026-102',
  '2025/2026 Batch',
  '1 Year',
  'https://career.infosys.com/jobdesc?jobReferenceCode=INF-ASE-2026-102',
  CURRENT_DATE - INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '12 days',
  TRUE,
  'https://www.infosys.com/careers/',
  TRUE
),
-- 3. BEL (Govt/PSU) - CTC 12 LPA
(
  '66666666-6666-6666-6666-666666666666',
  'Graduate Engineer Trainee',
  'Bharat Electronics Limited',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop&auto=format&q=80',
  'Bengaluru (Jalahalli)',
  12,
  12,
  'govt',
  'BEL-GET-2026-ECE',
  '2026 Batch',
  '2 Years',
  'https://bel-india.in/careers/graduate-engineer-trainee-recruitment',
  CURRENT_DATE - INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '20 days',
  TRUE,
  'https://bel-india.in/careers.aspx',
  TRUE
);
