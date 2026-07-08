import { createClient } from '@supabase/supabase-js';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string;
  location: string;
  ctc_min: number | null;
  ctc_max: number | null;
  category: 'it_services' | 'product' | 'govt' | 'other';
  req_number: string;
  batch_year: string;
  bond_period: string;
  apply_url: string;
  posted_date: string;
  closing_date: string | null;
  is_active: boolean;
  source_url: string;
  is_sample: boolean;
  description: string;  // Detailed job description
  eligibility: string;  // Eligibility criteria details
  about_company: string;
  responsibilities: string[];
  required_skills: string[];
  nice_to_have_skills: string[];
  perks_benefits: string[];
  selection_process: string[];
  how_to_apply: string;
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
    description: 'Join Razorpay as a Software Engineer Intern and work on our core payment gateway team. You will build and scale high-throughput APIs, optimize database performance, and collaborate with product managers to deliver seamless developer experiences. Excellent opportunity to learn about scalable fintech architectures.',
    eligibility: 'Eligibility: 2026 Batch B.E. / B.Tech / M.Tech in CS/IT or equivalent. Good understanding of data structures, algorithms, and web development in Node.js, Go, or Java. No active backlogs. Minimum 7.5 CGPA.',
    about_company: 'Razorpay is India\'s leading fintech platform, helping businesses manage their payments, payouts, banking, and payroll in a single ecosystem. Founded in 2014, we power payments for over 8 million businesses across India, including top startups and enterprises.',
    responsibilities: [
      'Collaborate with senior engineers to design and implement highly scalable payment gateway endpoints.',
      'Optimize query performance and indexing across PostgreSQL and Redis databases.',
      'Participate in unit and integration testing, code reviews, and DevOps deployment pipelines.',
      'Investigate and troubleshoot transaction failures and API performance bottlenecks.'
    ],
    required_skills: ['Go', 'Node.js', 'Java', 'PostgreSQL', 'Data Structures', 'REST APIs'],
    nice_to_have_skills: ['Docker', 'Redis', 'AWS'],
    perks_benefits: ['Competitive stipend', 'Full remote work option', 'Wellness allowance & mental health support', 'Direct mentorship from tech leads'],
    selection_process: ['Resume shortlisting', 'Online coding assessment', 'Technical interview (DSA & System Design)', 'HR round & offer discussion'],
    how_to_apply: 'Apply directly on the Razorpay career portal using the link below. You will need to upload your resume, GitHub profile link, and latest college academic transcript.'
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
    description: 'As an Associate Systems Engineer at Infosys, you will undergo our world-class training program at Mysore. Post-training, you will work on software development, cloud operations, application maintenance, or system administration for our global clients. You will write code, troubleshoot issues, and contribute to software maintenance cycles.',
    eligibility: 'Eligibility: 2025/2026 Batch B.E. / B.Tech / M.E. / M.Tech in any engineering stream, or MCA / M.Sc (CS/IT). Minimum 60% or 6.0 CGPA throughout 10th, 12th, and graduation.',
    about_company: 'Infosys is a global leader in next-generation digital services and consulting. We operate in over 56 countries to navigate our clients\' digital transformation, enabling businesses to continuously improve and deliver value.',
    responsibilities: [
      'Develop, test, and document software applications under standard development cycles.',
      'Assist in cloud operations, software maintenance, and application troubleshooting.',
      'Participate in mandatory classroom and lab-based training at the Infosys Mysore Campus.',
      'Work in agile sprint teams to deliver quality features on client projects.'
    ],
    required_skills: ['Java or Python', 'SQL Basics', 'C++', 'HTML/CSS', 'Object-Oriented Programming', 'Communication Skills'],
    nice_to_have_skills: ['Cloud Fundamentals (AWS/Azure)', 'Unix/Linux Shell Scripting'],
    perks_benefits: ['Structured technical training program', 'Comprehensive medical insurance', 'Access to global client projects', 'Corporate shuttle & gym access'],
    selection_process: ['Online aptitude & coding test (InfyTQ/HackWithInfy)', 'Technical interview', 'HR interview'],
    how_to_apply: 'Register on the official Infosys careers site. Make sure to complete your profile details and submit your application via the job code referenced.'
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
    description: 'Bharat Electronics Limited (BEL), a Navratna PSU under the Ministry of Defence, is hiring Graduate Engineer Trainees for its Bengaluru unit. You will work on design, development, and testing of advanced electronics systems, radars, and communication equipment for defense forces. The position includes a 2-year bond period.',
    eligibility: 'Eligibility: 2026 Batch B.E. / B.Tech in Electronics & Communication, Telecommunication, or Electrical engineering. First class degree for General/OBC, pass class for SC/ST. Age limit: 25 years.',
    about_company: 'Bharat Electronics Limited (BEL) is a premier Navratna public sector enterprise under the Ministry of Defence, Government of India. Headquartered in Bengaluru, BEL manufactures state-of-the-art electronic equipment for the Indian Armed Forces.',
    responsibilities: [
      'Design and test RF components, microwave subsystems, and digital signal processing boards.',
      'Provide technical support for radar installations, sonar arrays, and military communication terminals.',
      'Prepare standard compliance reports and engineering drawings for military inspections.',
      'Collaborate with defense scientists and quality assurance teams for prototype validation.'
    ],
    required_skills: ['Electronics & Communication', 'MATLAB', 'Embedded Systems', 'Digital Signal Processing', 'Microcontrollers', 'VLSI Design'],
    nice_to_have_skills: ['Python scripting', 'LabVIEW'],
    perks_benefits: ['Government grade pay-scale & HRA', 'Medical facility for self & dependents', 'Provident fund & gratuity benefits', 'Subsidized canteen & housing quarters'],
    selection_process: ['GATE score / Written test score shortlisting', 'Technical interview', 'Document verification & medical fitness exam'],
    how_to_apply: 'Download the official application form from the BEL portal, fill in your details, and submit it along with your GATE scorecard and required academic certificates.'
  },
  {
    id: '77777777-1111-1111-1111-111111111111',
    title: 'TCS Ninja - Assistant System Engineer',
    company_name: 'Tata Consultancy Services',
    company_logo_url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Chennai',
    ctc_min: 3,
    ctc_max: 3,
    category: 'it_services',
    req_number: 'TCS-NIN-2026-CHN',
    batch_year: '2026 Batch',
    bond_period: '1 Year',
    apply_url: 'https://www.tcs.com/careers/india/ninja',
    posted_date: getRelativeDate(-1),
    closing_date: getRelativeDate(15),
    is_active: true,
    source_url: 'https://www.tcs.com/careers',
    is_sample: true,
    description: 'TCS is hiring for Assistant System Engineers under the Ninja category. You will be assigned to client projects across various domains including BFSI, retail, manufacturing, and health. Responsibilities include software coding, business analytics, QA testing, and systems support.',
    eligibility: 'Eligibility: 2026 Batch B.E. / B.Tech / M.E. / M.Tech / MCA / M.Sc. Minimum 60% throughout education. All academic courses must be completed in the stipulated duration. Maximum 1 backlog allowed at the time of application.',
    about_company: 'Tata Consultancy Services (TCS) is an IT services, consulting, and business solutions organization that has partnered with many of the world\'s largest businesses for over 50 years. We are a part of the Tata Group, India\'s largest multinational business group.',
    responsibilities: [
      'Perform application support, software coding, and system testing for global client accounts.',
      'Analyze user requirements, draft test cases, and document bug fixes.',
      'Undergo continuous upskilling on TCS iON digital learning platforms.',
      'Collaborate with database administrators and business analysts to resolve production issues.'
    ],
    required_skills: ['C/C++', 'Java or Python', 'Database Basics', 'Operating Systems', 'Algorithms & Logic', 'Data Analysis'],
    nice_to_have_skills: ['SDLC Methodologies', 'Git Version Control'],
    perks_benefits: ['Upskilling incentives via TCS Elevate', 'Comprehensive health insurance policy', 'Global career mobility opportunities', 'Defined retirement benefits (Gratuity/PF)'],
    selection_process: ['TCS NQT (National Qualifier Test)', 'Technical interview', 'Managerial & HR interview'],
    how_to_apply: 'Create a profile on the TCS NextStep portal, choose the IT category, register for the NQT, and apply to this role once qualified.'
  },
  {
    id: '88888888-1111-1111-1111-111111111111',
    title: 'ML Data Associate I',
    company_name: 'Amazon',
    company_logo_url: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Hyderabad',
    ctc_min: 10,
    ctc_max: 15,
    category: 'product',
    req_number: 'AMZN-MLDA-2026-HYD',
    batch_year: '2025/2026 Batch',
    bond_period: 'None',
    apply_url: 'https://www.amazon.jobs/en-gb/jobs/10460561/ml-data-associate-i',
    posted_date: getRelativeDate(-1),
    closing_date: getRelativeDate(10),
    is_active: true,
    source_url: 'https://www.amazon.jobs/',
    is_sample: true,
    description: 'The ML Data Associate I is responsible for labeling and annotating complex linguistic, audio, and visual datasets to train machine learning models for Amazon Alexa and search devices. You will work in a fast-paced environment verifying annotations, fixing transcription errors, and compiling metrics.',
    eligibility: 'Eligibility: 2025/2026 Batch graduates with any Bachelor\'s degree. Excellent written and verbal communication in English. Familiarity with basic office tools (Excel) and computer systems.',
    about_company: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking. We strive to be Earth’s most customer-centric company.',
    responsibilities: [
      'Label and annotate text, audio, and visual data for machine learning model training.',
      'Review dataset quality and flag errors in transcription or classification schemes.',
      'Contribute to daily annotation metrics and feedback loops for machine learning scientists.',
      'Collaborate with data managers to optimize data labelling guidelines.'
    ],
    required_skills: ['English Fluency', 'Analytical Skills', 'Microsoft Excel', 'Attention to Detail', 'Computer Literacy', 'Data Classification'],
    nice_to_have_skills: ['Basic Python', 'Linguistic Knowledge'],
    perks_benefits: ['Industry standard salary + night shift allowance', 'Free cab transport facility', 'Amazon corporate discount', 'Medical, accident, and life insurance'],
    selection_process: ['Online assessment (Grammar, listening & aptitude)', 'Technical assessment round', 'Operations manager interview'],
    how_to_apply: 'Apply via Amazon Jobs using your Amazon candidate profile. You must clear the automated online assessments before scheduling interviews.'
  },
  {
    id: '99999999-1111-1111-1111-111111111111',
    title: 'Combined Graduate Level (CGL) - Various Posts',
    company_name: 'Staff Selection Commission',
    company_logo_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Delhi NCR',
    ctc_min: 4,
    ctc_max: 8,
    category: 'govt',
    req_number: 'SSC-CGL-2026',
    batch_year: '2026 Batch',
    bond_period: 'None',
    apply_url: 'https://ssc.nic.in/notice-board',
    posted_date: getRelativeDate(-5),
    closing_date: null,
    is_active: true,
    source_url: 'https://ssc.nic.in/',
    is_sample: true,
    description: 'Staff Selection Commission conducts the CGL examination to recruit candidates for Group B and Group C posts in various ministries, departments, and organizations of the Government of India. Selected candidates will hold critical positions in administration, audit, and tax inspection.',
    eligibility: 'Eligibility: 2026 Batch graduates (Bachelor\'s degree in any discipline). Age limit varies by post (typically 18-32 years). Selection based on Tier-I and Tier-II computer-based examinations.',
    about_company: 'Staff Selection Commission (SSC) is an organization under the Government of India that recruits staff for various posts in the ministries, departments, and subordinate offices of the Government of India.',
    responsibilities: [
      'Draft official communications, process cabinet files, and compile department budgets.',
      'Perform field inspections, audit corporate tax returns, and inspect customs shipments.',
      'Assist senior bureaucrats in administrative policymaking and public service delivery.',
      'Manage public data files, file archiving systems, and official inventory lists.'
    ],
    required_skills: ['Quantitative Aptitude', 'General Awareness', 'Logical Reasoning', 'English Language', 'Basic Computer Operations', 'Indian Constitution Basics'],
    nice_to_have_skills: [],
    perks_benefits: ['Central government grade pay with DA & HRA', 'LTC (Leave Travel Concession) allowance', 'Pension scheme (NPS) contribution', 'Government quarters allotment eligibility'],
    selection_process: ['Tier-1 Computer Based Exam', 'Tier-2 Computer Based Exam', 'Physical efficiency test (for specific posts)', 'Document verification'],
    how_to_apply: 'Register on the official SSC website, upload your photograph/signature, pay the application fee, and select your exam center preferences.'
  },
  {
    id: 'aaaaaaaa-1111-1111-1111-111111111111',
    title: 'Probationary Officer (PO) - Public Sector Banks',
    company_name: 'Indian Banking Personnel Selection (IBPS)',
    company_logo_url: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=128&h=128&fit=crop&auto=format&q=80',
    location: 'Pan India',
    ctc_min: 8,
    ctc_max: 9,
    category: 'other',
    req_number: 'IBPS-PO-2026',
    batch_year: '2026 Batch',
    bond_period: 'None',
    apply_url: 'https://www.ibps.in/current-notifications',
    posted_date: getRelativeDate(-2),
    closing_date: getRelativeDate(25),
    is_active: true,
    source_url: 'https://www.ibps.in/',
    is_sample: true,
    description: 'The Institute of Banking Personnel Selection conducts the common recruitment process for Probationary Officers (PO) in public sector banks across India. Candidates undergo training in retail banking, credit operations, and branch administration.',
    eligibility: 'Eligibility: 2026 Batch graduates with any Bachelor\'s degree. Age limit: 20-30 years. Selection process consists of Preliminary and Main exams followed by a common interview.',
    about_company: 'Institute of Banking Personnel Selection (IBPS) is an autonomous body set up to recruit staff and officers for public sector banks, regional rural banks, and financial institutions in India.',
    responsibilities: [
      'Oversee retail banking counters, authorize deposit transactions, and verify account documents.',
      'Process agricultural, personal, and home loan files, evaluating creditworthiness.',
      'Participate in local marketing drives to promote banking products and deposits.',
      'Ensure compliance with Reserve Bank of India (RBI) directives and audit guidelines.'
    ],
    required_skills: ['Financial Literacy', 'Basic Accounting', 'Data Interpretation', 'Quantitative Aptitude', 'Customer Service', 'Reasoning Ability'],
    nice_to_have_skills: ['Sales experience', 'Local language proficiency'],
    perks_benefits: ['Bank officer grade pay with DA & CCA', 'Leased accommodation facility', 'Concessional loans for self (car/home)', 'Defined travel & medical reimbursements'],
    selection_process: ['Preliminary online examination', 'Mains online examination', 'Common group discussion & interview', 'Final merit listing & bank allocation'],
    how_to_apply: 'Submit your application online on the IBPS portal during the registration window, paying the exam fees online. Keep your scanned photographs and documents ready.'
  }
];

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const isCredentialsAvailable = supabaseUrl && supabaseAnonKey;

const supabase = isCredentialsAvailable 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function getJobs(): Promise<Job[]> {
  const rawJobs = await (async () => {
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
  })();

  // Expiry filter: Hide jobs whose closing_date has passed (relative to build time)
  // Nullable closing_date is never treated as expired
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return rawJobs.filter(job => {
    if (!job.is_active) return false;
    if (!job.closing_date) return true; // rolling basis, never expires
    const closing = new Date(job.closing_date);
    const closingEnd = new Date(closing.getFullYear(), closing.getMonth(), closing.getDate(), 23, 59, 59, 999);
    return closingEnd >= todayStart;
  });
}

export async function getJobById(id: string): Promise<Job | null> {
  if (!supabase) {
    console.log('⚠️ Supabase credentials missing. Searching local mock data.');
    return MOCK_JOBS.find((j) => j.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching job ${id} from Supabase:`, error.message);
      return MOCK_JOBS.find((j) => j.id === id) || null;
    }

    return (data as Job) || null;
  } catch (err) {
    console.error(`Exception caught during job ${id} fetch, falling back:`, err);
    return MOCK_JOBS.find((j) => j.id === id) || null;
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
