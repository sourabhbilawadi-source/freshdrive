import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $selectedJob, closeJobModal } from '../stores/jobModalStore';
import { X, ExternalLink, MapPin, IndianRupee, Briefcase, FileSignature, Calendar } from 'lucide-react';

export default function JobDetailModal() {
  const selectedJob = useStore($selectedJob);

  // Scroll lock and Escape key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeJobModal();
      }
    };

    if (selectedJob) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedJob]);

  if (!selectedJob) return null;

  const isClosingSoon = (() => {
    const now = new Date();
    const closing = new Date(selectedJob.closing_date);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 5;
  })();

  const formatClosingDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'it_services': return 'IT Services';
      case 'product': return 'Product / MNC';
      case 'govt': return 'Govt / PSU';
      default: return 'Other';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-ink/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={closeJobModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Card */}
      <div 
        className="bg-cream border-brutal-3 rounded-2xl shadow-brutal max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card contents
      >
        {/* Close Button (X) */}
        <button 
          onClick={closeJobModal}
          className="absolute top-4 right-4 w-10 h-10 border-brutal bg-white rounded-full flex items-center justify-center hover:bg-coral text-ink transition-colors cursor-pointer focus-visible:outline-3 focus-visible:outline-coral"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Header Area */}
          <div>
            {/* Req Code & Batch info */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold text-slate uppercase">
                {selectedJob.batch_year} &middot; {selectedJob.req_number || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5 bg-white border-2 border-ink px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-ink">
                <span className={`w-2.5 h-2.5 rounded-full border border-ink ${isClosingSoon ? 'bg-amber animate-pulse' : 'bg-coral'}`}></span>
                {isClosingSoon ? 'CLOSING SOON' : 'OPEN'}
              </span>
            </div>

            {/* Job Title */}
            <h2 id="modal-title" className="font-display text-2xl sm:text-3xl font-black text-ink leading-tight pr-10 mb-3">
              {selectedJob.title}
            </h2>

            {/* Company Name & Logo */}
            <div className="flex items-center gap-3">
              {selectedJob.company_logo_url && (
                <img 
                  src={selectedJob.company_logo_url} 
                  alt={`${selectedJob.company_name} Logo`} 
                  className="w-7 h-7 rounded-full border border-ink object-cover"
                />
              )}
              <span className="font-sans text-base font-bold text-ink">{selectedJob.company_name}</span>
            </div>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 bg-lime text-ink font-sans text-xs font-bold border-2 border-ink px-3 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_0px_var(--ink)]">
              <MapPin className="w-4 h-4" />
              {selectedJob.location}
            </span>
            <span className="inline-flex items-center gap-1 bg-lime text-ink font-sans text-xs font-bold border-2 border-ink px-3 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_0px_var(--ink)]">
              <IndianRupee className="w-4 h-4" />
              {selectedJob.ctc_min === selectedJob.ctc_max ? `${selectedJob.ctc_min} LPA` : `${selectedJob.ctc_min} - ${selectedJob.ctc_max} LPA`}
            </span>
            <span className="inline-flex items-center gap-1 bg-white text-ink font-sans text-xs font-bold border-2 border-ink px-3 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_0px_var(--ink)]">
              <Briefcase className="w-4 h-4 text-slate" />
              {getCategoryLabel(selectedJob.category)}
            </span>
            <span className="inline-flex items-center gap-1 bg-white text-ink font-sans text-xs font-bold border-2 border-ink px-3 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_0px_var(--ink)]">
              <FileSignature className="w-4 h-4 text-slate" />
              Bond: {selectedJob.bond_period}
            </span>
          </div>

          {/* Job Profile & Details */}
          <div className="flex flex-col gap-4">
            {/* Description Card */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-xs font-bold text-slate uppercase tracking-wider">Job Description</h3>
              <div className="bg-white border-brutal p-5 rounded-xl shadow-button font-sans text-sm text-ink/90 leading-relaxed">
                {selectedJob.description}
              </div>
            </div>

            {/* Eligibility Card */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-xs font-bold text-slate uppercase tracking-wider">Eligibility Criteria</h3>
              <div className="bg-white border-brutal p-5 rounded-xl shadow-button font-sans text-sm text-ink/90 leading-relaxed">
                {selectedJob.eligibility}
              </div>
            </div>
          </div>

          {/* Modal Footer Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t-2 border-ink/10">
            <div className="flex items-center gap-1.5 font-mono text-sm font-semibold">
              <Calendar className="w-4 h-4 text-slate" />
              <span className="text-slate">Closing Date:</span>
              <span className={isClosingSoon ? 'text-coral font-bold' : 'text-ink font-bold'}>
                {formatClosingDate(selectedJob.closing_date)}
              </span>
            </div>

            <a 
              href={selectedJob.apply_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-brutal bg-coral text-ink font-sans font-bold py-3 px-6 rounded-full text-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-coral/95 transition-all text-center w-full sm:w-auto"
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
