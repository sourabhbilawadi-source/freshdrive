import { createClient } from '@supabase/supabase-js';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string;
  location: string;
  ctc_min: number;
  ctc_max: number;
  category: 'it_services' | 'product' | 'govt' | 'other';
  req_number: string;
  batch_year: string;
  bond_period: string;
  apply_url: string;
  posted_date: string;
  closing_date: string;
  is_active: boolean;
  source_url: string;
  is_sample: boolean;
}

// Generate dynamic relative dates for the sample data so it's always current
const getRelativeDate = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export const MOCK_JOBS: Job[] = [
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Software Engineer Intern',
    company_name: 'Razorpay',
    company_logo_url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Bengaluru (ORR)',
    ctc_min: 8,
    ctc_max: 12,
    category: 'product',
    req_number: 'RZP-2026-SE901',
    batch_year: '2026 Batch',
    bond_period: 'None',
    apply_url: 'https://razorpay.com/jobs/software-engineer-intern-bengaluru',
    posted_date: getRelativeDate(-1),
    closing_date: getRelativeDate(4), // 4 days remaining (Closing soon)
    is_active: true,
    source_url: 'https://razorpay.com/jobs/',
    is_sample: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Associate Systems Engineer',
    company_name: 'Infosys',
    company_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Bengaluru (Electronic City)',
    ctc_min: 3,
    ctc_max: 4,
    category: 'it_services',
    req_number: 'INF-ASE-2026-102',
    batch_year: '2025/2026 Batch',
    bond_period: '1 Year',
    apply_url: 'https://career.infosys.com/jobdesc?jobReferenceCode=INF-ASE-2026-102',
    posted_date: getRelativeDate(-2),
    closing_date: getRelativeDate(12),
    is_active: true,
    source_url: 'https://www.infosys.com/careers/',
    is_sample: true,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'Graduate Engineer Trainee',
    company_name: 'Bharat Electronics Limited',
    company_logo_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Bengaluru (Jalahalli)',
    ctc_min: 12,
    ctc_max: 12,
    category: 'govt',
    req_number: 'BEL-GET-2026-ECE',
    batch_year: '2026 Batch',
    bond_period: '2 Years',
    apply_url: 'https://bel-india.in/careers/graduate-engineer-trainee-recruitment',
    posted_date: getRelativeDate(-3),
    closing_date: getRelativeDate(20),
    is_active: true,
    source_url: 'https://bel-india.in/careers.aspx',
    is_sample: true,
  }
];

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are set
const isCredentialsAvailable = supabaseUrl && supabaseAnonKey;

const supabase = isCredentialsAvailable 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function getJobs(): Promise<Job[]> {
  if (!supabase) {
    console.log('⚠️ Supabase credentials missing. Falling back to local mock data.');
    return MOCK_JOBS;
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('posted_date', { ascending: false });

    if (error) {
      console.error('Error fetching jobs from Supabase:', error.message);
      return MOCK_JOBS;
    }

    return (data as Job[]) || [];
  } catch (err) {
    console.error('Exception caught during job fetch, falling back:', err);
    return MOCK_JOBS;
  }
}

export interface JobStats {
  openRolesToday: number;
  companiesHiring: number;
  newLast24h: number;
  closingThisWeek: number;
}

export async function getStats(jobs: Job[]): Promise<JobStats> {
  const now = new Date();
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const companiesSet = new Set(jobs.map((j) => j.company_name));

  let openRolesToday = jobs.length;
  let companiesHiring = companiesSet.size;
  let newLast24h = 0;
  let closingThisWeek = 0;

  jobs.forEach((job) => {
    const posted = new Date(job.posted_date);
    if (posted >= oneDayAgo) {
      newLast24h++;
    }

    if (job.closing_date) {
      const closing = new Date(job.closing_date);
      if (closing >= now && closing <= sevenDaysFromNow) {
        closingThisWeek++;
      }
    }
  });

  return {
    openRolesToday,
    companiesHiring,
    newLast24h,
    closingThisWeek,
  };
}
