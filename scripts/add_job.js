import pg from 'pg';

const { Client } = pg;

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

// Load job data from command line args or environment
const jobDataJson = process.env.NEW_JOB_DATA;
if (!jobDataJson) {
  console.error('❌ Missing NEW_JOB_DATA env variable containing the job JSON.');
  process.exit(1);
}

async function addJob() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const job = JSON.parse(jobDataJson);
    await client.connect();

    console.log(`Inserting job: "${job.title}" at "${job.company_name}"...`);

    const query = `
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

    const values = [
      job.title,
      job.company_name,
      job.company_logo_url || null,
      job.location || 'Pan India',
      job.ctc_min,
      job.ctc_max,
      job.category || 'other',
      job.req_number || null,
      job.batch_year || '2026 Batch',
      job.bond_period || 'None',
      job.apply_url,
      job.posted_date || new Date().toISOString().split('T')[0],
      job.closing_date,
      job.is_active !== undefined ? job.is_active : true,
      job.source_url || job.apply_url,
      job.is_sample !== undefined ? job.is_sample : false, // real jobs are set to false
      job.description,
      job.eligibility,
      job.about_company,
      job.responsibilities || [],
      job.required_skills || [],
      job.nice_to_have_skills || [],
      job.perks_benefits || [],
      job.selection_process || [],
      job.how_to_apply
    ];

    const res = await client.query(query, values);
    console.log(`✅ Success! Job inserted with ID: ${res.rows[0].id}`);

  } catch (err) {
    console.error('❌ Failed to insert job:', err.message);
  } finally {
    await client.end();
  }
}

addJob();
