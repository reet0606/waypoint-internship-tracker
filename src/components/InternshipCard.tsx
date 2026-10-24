import type { Internship } from '@/types';
import { Bookmark, BookmarkCheck, MapPin, Briefcase, Clock, IndianRupee, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { postedLabel } from '@/utils';

interface Props {
  internship: Internship;
  saved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}

const roleBadge: Record<string, string> = {
  'Product Management': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Software Development': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Product Analyst': 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  'iOS Development': 'bg-slate-100 text-slate-700 ring-slate-200',
  'Business Analyst': 'bg-amber-50 text-amber-700 ring-amber-200',
  Strategy: 'bg-orange-50 text-orange-700 ring-orange-200',
  Marketing: 'bg-pink-50 text-pink-700 ring-pink-200',
  Growth: 'bg-rose-50 text-rose-700 ring-rose-200',
  'Data Analytics': 'bg-lime-50 text-lime-700 ring-lime-200',
};

const modeIcon: Record<string, string> = {
  Remote: 'bg-teal-50 text-teal-700 ring-teal-200',
  Hybrid: 'bg-sky-50 text-sky-700 ring-sky-200',
  'On-site': 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function InternshipCard({ internship, saved, onToggleSave, onOpen }: Props) {
  const initials = internship.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <article
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: internship.logoColor }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-slate-900 group-hover:text-slate-950">
              {internship.title}
            </h3>
            <p className="truncate text-sm text-slate-500">{internship.company}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          aria-label={saved ? 'Unsave' : 'Save'}
          className={`shrink-0 rounded-lg p-2 transition-colors ${
            saved ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          }`}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} className="text-slate-400" />
          {internship.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase size={14} className="text-slate-400" />
          {internship.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <IndianRupee size={14} className="text-slate-400" />
          {internship.stipend.replace('₹', '')}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {internship.verification === 'verified' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 size={12} /> Verified
          </span>
        ) : internship.verification === 'demo' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
            <AlertTriangle size={12} /> DEMO DATA — NOT A REAL VACANCY
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
            <AlertTriangle size={12} /> Unverified
          </span>
        )}
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${roleBadge[internship.role]}`}>
          {internship.role}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${modeIcon[internship.workMode]}`}>
          {internship.workMode}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Clock size={12} /> {postedLabel(internship.postedDaysAgo)}
        </span>
      </div>
    </article>
  );
}
