import { atom } from 'nanostores';
import type { Job } from '../lib/supabase';

export const $selectedJob = atom<Job | null>(null);

export function openJobModal(job: Job) {
  $selectedJob.set(job);
}

export function closeJobModal() {
  $selectedJob.set(null);
}
