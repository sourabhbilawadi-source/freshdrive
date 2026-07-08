import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Simple .env loader
try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key && val) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  console.warn('⚠️ Error loading .env file:', e.message);
}

const url = process.env.PUBLIC_SUPABASE_URL || '';
const password = process.env.SUPABASE_DB_PASSWORD || '';

if (!url || !password) {
  console.error('❌ Missing PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD in environment.');
  process.exit(1);
}

const projectIdMatch = url.match(/https:\/\/([^.]+)\.supabase/);
if (!projectIdMatch) {
  console.error('❌ Could not parse project ID from Supabase URL:', url);
  process.exit(1);
}
const projectId = projectIdMatch[1];
const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.${projectId}.supabase.co:6543/postgres`;

const ibpsLogoUrl = 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=128&h=128&fit=crop&auto=format&q=80';

const companyData = {
  name: 'IBPS (Institute of Banking Personnel Selection)',
  category: 'Govt/PSU',
  career_page_url: 'https://www.ibps.in',
  logo_url: ibpsLogoUrl
};

const jobData = {
  title: 'Probationary Officer / Management Trainee (PO/MT)',
  company_name: 'IBPS (Institute of Banking Personnel Selection)',
  company_logo_url: ibpsLogoUrl,
  location: 'Pan India',
  ctc_min: null,
  ctc_max: null,
  category: 'govt',
  req_number: 'IBPS-PO-2026',
  batch_year: '2026',
  bond_period: 'None',
  apply_url: 'https://www.ibps.in',
  source_url: 'https://www.ibps.in',
  posted_date: '2026-06-30',
  closing_date: '2026-07-21',
  is_active: true,
  is_sample: false,
  about_company: 'IBPS (Institute of Banking Personnel Selection) conducts nationwide recruitment exams on behalf of India\'s public sector banks, running a common, standardized selection process used across the participating banks for Probationary Officer and Management Trainee positions.',
  description: 'This is a pan-India recruitment drive to fill Probationary Officer / Management Trainee roles across public sector banks in India. Selected candidates go through a structured banking induction, working across core banking operations, credit, customer service, and branch management functions before progressing into officer-level roles.',
  eligibility: 'Bachelor\'s degree in any discipline from a recognized university. Strong numerical ability and reasoning skills. Basic computer literacy and digital/financial awareness. Good written and spoken English and Hindi. Willingness to be posted anywhere in India.',
  responsibilities: [
    'Handle day-to-day branch banking operations including customer service, account management, and transaction processing',
    'Support credit appraisal and loan processing functions under supervision',
    'Assist in achieving branch business targets across deposits, advances, and cross-selling of banking products',
    'Ensure compliance with RBI guidelines and internal banking policies and procedures',
    'Rotate across departments during the probation/training period to build broad-based banking exposure',
    'Handle customer grievances and ensure quality service delivery'
  ],
  required_skills: [
    'Bachelor\'s degree in any discipline from a recognized university',
    'Strong numerical ability and reasoning skills',
    'Basic computer literacy and digital/financial awareness',
    'Good written and spoken English and Hindi',
    'Willingness to be posted anywhere in India'
  ],
  nice_to_have_skills: [
    'Prior exposure to banking, finance, or commerce coursework',
    'Familiarity with current affairs and RBI circulars'
  ],
  perks_benefits: [
    'Officer-level entry into India\'s public sector banking system',
    'Structured induction training and career progression path',
    'Government-bank job security and standard PSU banking benefits',
    'Pan-India posting exposure across participating banks'
  ],
  selection_process: [
    'Preliminary Examination (qualifying, objective type — English, Reasoning, Quantitative Aptitude)',
    'Main Examination (objective + descriptive paper)',
    'Personality Test (newly introduced this cycle, non-qualifying)',
    'Interview',
    'Final merit list and allotment'
  ],
  how_to_apply: 'Apply online directly through the official IBPS website during the open application window.'
};

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to live database.');

    // 1. Update/Insert Company
    const compCheck = await client.query('SELECT id FROM companies WHERE name = $1', [companyData.name]);
    let companyId;
    if (compCheck.rows.length > 0) {
      companyId = compCheck.rows[0].id;
      console.log(`ℹ️ Company "${companyData.name}" already exists with ID: ${companyId}. Updating details...`);
      await client.query(
        'UPDATE companies SET logo_url = $1, career_page_url = $2, category = $3 WHERE id = $4',
        [companyData.logo_url, companyData.career_page_url, companyData.category, companyId]
      );
    } else {
      // Also check if we should rename the old company name if it existed as 'Indian Banking Personnel Selection (IBPS)'
      const oldCompCheck = await client.query('SELECT id FROM companies WHERE name = $1', ['Indian Banking Personnel Selection (IBPS)']);
      if (oldCompCheck.rows.length > 0) {
        companyId = oldCompCheck.rows[0].id;
        console.log(`ℹ️ Renaming existing company ID: ${companyId} to "${companyData.name}"...`);
        await client.query(
          'UPDATE companies SET name = $1, logo_url = $2, career_page_url = $3, category = $4 WHERE id = $5',
          [companyData.name, companyData.logo_url, companyData.career_page_url, companyData.category, companyId]
        );
      } else {
        const compInsert = await client.query(
          'INSERT INTO companies (name, logo_url, career_page_url, category) VALUES ($1, $2, $3, $4) RETURNING id',
          [companyData.name, companyData.logo_url, companyData.career_page_url, companyData.category]
        );
        companyId = compInsert.rows[0].id;
        console.log(`✅ Company "${companyData.name}" inserted with ID: ${companyId}`);
      }
    }

    // 2. Update Job (by req_number or existing ID)
    const jobCheck = await client.query('SELECT id FROM jobs WHERE req_number = $1', [jobData.req_number]);
    if (jobCheck.rows.length > 0) {
      const jobId = jobCheck.rows[0].id;
      console.log(`✅ Job with req_number "${jobData.req_number}" exists with ID: ${jobId}. Updating to real listing in-place...`);
      const updateQuery = `
        UPDATE jobs SET
          title = $1, company_name = $2, company_logo_url = $3, location = $4,
          ctc_min = $5, ctc_max = $6, category = $7, batch_year = $8,
          bond_period = $9, apply_url = $10, posted_date = $11, closing_date = $12,
          is_active = $13, source_url = $14, is_sample = $15, description = $16,
          eligibility = $17, about_company = $18, responsibilities = $19,
          required_skills = $20, nice_to_have_skills = $21, perks_benefits = $22,
          selection_process = $23, how_to_apply = $24
        WHERE id = $25;
      `;
      const updateValues = [
        jobData.title, jobData.company_name, jobData.company_logo_url, jobData.location,
        jobData.ctc_min, jobData.ctc_max, jobData.category, jobData.batch_year,
        jobData.bond_period, jobData.apply_url, jobData.posted_date, jobData.closing_date,
        jobData.is_active, jobData.source_url, jobData.is_sample, jobData.description,
        jobData.eligibility, jobData.about_company, jobData.responsibilities,
        jobData.required_skills, jobData.nice_to_have_skills, jobData.perks_benefits,
        jobData.selection_process, jobData.how_to_apply, jobId
      ];
      await client.query(updateQuery, updateValues);
      console.log(`✅ Job updated successfully to real listing.`);
    } else {
      console.log(`ℹ️ Job with req_number "${jobData.req_number}" not found. Inserting new...`);
      const insertQuery = `
        INSERT INTO jobs (
          title, company_name, company_logo_url, location, ctc_min, ctc_max,
          category, req_number, batch_year, bond_period, apply_url,
          posted_date, closing_date, is_active, source_url, is_sample,
          description, eligibility, about_company, responsibilities,
          required_skills, nice_to_have_skills, perks_benefits,
          selection_process, how_to_apply
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING id;
      `;
      const insertValues = [
        jobData.title, jobData.company_name, jobData.company_logo_url, jobData.location,
        jobData.ctc_min, jobData.ctc_max, jobData.category, jobData.req_number,
        jobData.batch_year, jobData.bond_period, jobData.apply_url, jobData.posted_date,
        jobData.closing_date, jobData.is_active, jobData.source_url, jobData.is_sample,
        jobData.description, jobData.eligibility, jobData.about_company, jobData.responsibilities,
        jobData.required_skills, jobData.nice_to_have_skills, jobData.perks_benefits,
        jobData.selection_process, jobData.how_to_apply
      ];
      const res = await client.query(insertQuery, insertValues);
      console.log(`✅ Job inserted successfully with ID: ${res.rows[0].id}`);
    }

  } catch (err) {
    console.error('❌ Database operation failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
