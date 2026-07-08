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

// Define logo URL
const shellLogoUrl = 'https://images.unsplash.com/photo-1549923746-c502d488f3aa?w=128&h=128&fit=crop&auto=format&q=80';

const companyData = {
  name: 'Shell',
  category: 'product MNC',
  career_page_url: 'https://shell.wd3.myworkdayjobs.com/ShellCareers',
  logo_url: shellLogoUrl
};

const jobData = {
  title: 'Data Intern',
  company_name: 'Shell',
  company_logo_url: shellLogoUrl,
  location: 'Chennai',
  ctc_min: null,
  ctc_max: null,
  category: 'product',
  req_number: 'R205903-1',
  batch_year: 'Currently pursuing degree',
  bond_period: 'None',
  apply_url: 'https://shell.wd3.myworkdayjobs.com/ShellCareers/job/SHELL-CENTRE--CHENNAI/Data-Intern_R205903-1',
  source_url: 'https://shell.wd3.myworkdayjobs.com/ShellCareers',
  posted_date: '2026-07-07',
  closing_date: null,
  is_active: true,
  is_sample: false,
  about_company: 'Shell is a global energy and petrochemicals company operating in more than 70 countries, working across traditional and cleaner energy solutions as it transitions toward net-zero emissions.',
  description: 'This internship sits within Shell\'s US Direct Tax team and supports the company\'s broader Digital Finance and Tax transformation effort. The intern will help build a well-documented, organized view of how tax-related data moves through Shell\'s systems — from source data all the way to filings — laying the groundwork for future analytics and AI-driven tools in the tax function.',
  eligibility: 'Pursuing a degree in Data Analytics, Data Science, Information Systems, or Computer Science. Must be an Indian citizen or permanent resident. Strong Excel, basic SQL, and basic Python skills.',
  responsibilities: [
    'Locate and catalog tax-related data across internal systems, including SAP, tax software, and Excel-based models',
    'Build and maintain an inventory of tax data sources along with supporting metadata',
    'Trace how data flows end-to-end, from ERP systems through adjustments, provisioning, and final filings',
    'Create visual process maps documenting key tax workflows',
    'Contribute to a standardized way of categorizing and structuring tax data',
    'Spot data quality issues and help define rules to catch them going forward',
    'Prepare clean, structured data and documentation to support future AI/automation projects',
    'Work closely with tax, finance, and IT teams to understand needs and validate results'
  ],
  required_skills: [
    'Pursuing a degree in Data Analytics, Data Science, Information Systems, or Computer Science',
    'Strong Excel skills',
    'Basic SQL',
    'Basic Python',
    'Understanding of databases and ETL concepts',
    'Indian citizen or permanent resident'
  ],
  nice_to_have_skills: [
    'Power BI or Tableau',
    'Exposure to SAP or other enterprise systems',
    'Interest in AI/GenAI applications'
  ],
  perks_benefits: [
    'Hands-on exposure to enterprise-scale data systems and SAP',
    'Direct involvement in Shell\'s Finance and Tax digital transformation work',
    'Cross-functional collaboration across Tax, Finance, and Technology teams',
    'Hybrid work model (3 days/week in-office)'
  ],
  selection_process: [
    'Application review',
    'Interview(s) with the hiring team',
    'Offer'
  ],
  how_to_apply: 'Apply directly through Shell\'s Workday careers portal using the Apply Now button below.'
};

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to live database.');

    // 1. Idempotently insert Company
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
      const compInsert = await client.query(
        'INSERT INTO companies (name, logo_url, career_page_url, category) VALUES ($1, $2, $3, $4) RETURNING id',
        [companyData.name, companyData.logo_url, companyData.career_page_url, companyData.category]
      );
      companyId = compInsert.rows[0].id;
      console.log(`✅ Company "${companyData.name}" inserted with ID: ${companyId}`);
    }

    // 2. Idempotently insert Job
    const jobCheck = await client.query('SELECT id FROM jobs WHERE req_number = $1', [jobData.req_number]);
    if (jobCheck.rows.length > 0) {
      const jobId = jobCheck.rows[0].id;
      console.log(`ℹ️ Job with req_number "${jobData.req_number}" already exists with ID: ${jobId}. Updating details...`);
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
      console.log(`✅ Job updated successfully.`);
    } else {
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
