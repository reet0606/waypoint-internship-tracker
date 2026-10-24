import { useEffect } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  CalendarDays,
  Users,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Link2,
} from 'lucide-react';
import type { Internship, TrackerStatus } from '@/types';
import { postedLabel } from '@/utils';

interface Props {
  internship: Internship;
  status: TrackerStatus | null;
  onClose: () => void;
  onToggleSave: () => void;
  onApply: () => void;
  applied: boolean;
}

const statusLabels: Record<TrackerStatus, string> = {
  Saved: 'Saved',
  Applied: 'Applied',
  Interview: 'Interview stage',
  Rejected: 'Rejected',
};

const statusStyle: Record<TrackerStatus, string> = {
  Saved: 'bg-blue-50 text-blue-700 ring-blue-200',
  Applied: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Interview: 'bg-amber-50 text-amber-700 ring-amber-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export function InternshipDetail({ internship, status, onClose, onToggleSave, onApply, applied }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const initials = internship.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const isApplied = applied;

const hasValidApplyUrl = (i: Internship) => {
  if (!i.applyUrl) return false;
  try {
    const u = new URL(i.applyUrl);
    return (u.protocol === 'http:' || u.protocol === 'https:') && i.verification === 'verified';
  } catch {
    return false;
  }
};

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
          <button
            onClick={onToggleSave}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              status === 'Saved'
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {status === 'Saved' ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {status === 'Saved' ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Scroll body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
              style={{ backgroundColor: internship.logoColor }}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">{internship.title}</h2>
              <p className="text-slate-500">{internship.company}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {internship.verification === 'verified' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 size={13} /> Verified listing
              </span>
            ) : internship.verification === 'demo' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                <AlertTriangle size={13} /> DEMO DATA — NOT A REAL VACANCY
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                <AlertTriangle size={13} /> Unverified listing
              </span>
            )}
            {status && (
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusStyle[status]}`}>
                {statusLabels[status]}
              </span>
            )}
          </div>

          {/* Meta grid */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetaItem icon={MapPin} label="Location" value={internship.location} />
            <MetaItem icon={Briefcase} label="Work mode" value={internship.workMode} />
            <MetaItem icon={Clock} label="Duration" value={internship.duration} />
            <MetaItem icon={IndianRupee} label="Stipend" value={internship.stipend} />
            <MetaItem icon={CalendarDays} label="Application deadline" value={internship.applicationDeadline} />
            <MetaItem icon={Users} label="Openings" value={String(internship.openings)} />
          </div>

          {/* Description */}
          <Section title="About the role">
            <p className="text-sm leading-relaxed text-slate-600">{internship.description}</p>
          </Section>

          <Section title="What you'll do">
            <ul className="space-y-2">
              {internship.responsibilities.map((r, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Who you are">
            <ul className="space-y-2">
              {internship.requirements.map((r, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((s) => (
                <span key={s} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <p className="mt-6 text-xs text-slate-400">
            Posted {postedLabel(internship.postedDaysAgo)} · Listing status: {internship.listingStatus}
            {internship.lastVerifiedAt ? ` · Last verified ${internship.lastVerifiedAt}` : ' · Not verified'}
          </p>

          {(internship.sourceUrl || internship.verification === 'verified') && (
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600">
              {internship.sourceUrl && (
                <p className="flex items-center gap-1.5">
                  <Link2 size={13} className="text-slate-400" />
                  Source:{' '}
                  <a href={internship.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                    {internship.sourceUrl}
                  </a>
                </p>
              )}
              <p className="mt-1 text-slate-400">
                {internship.verification === 'verified'
                  ? `Verified by an administrator on ${internship.lastVerifiedAt ?? '—'}`
                  : 'This listing has not been verified by an administrator.'}
              </p>
            </div>
          )}
        </div>

        {/* Sticky apply bar */}
        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          {isApplied ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 size={20} className="shrink-0" />
                <p className="text-sm font-medium">Added to your tracker as <span className="font-semibold">{statusLabels[status as TrackerStatus]}</span></p>
              </div>
              {hasValidApplyUrl(internship) ? (
                <a
                  href={internship.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Apply on company site <ExternalLink size={15} />
                </a>
              ) : (
                <span className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800">
                  Demo listing — no application link
                </span>
              )}
            </div>
          ) : hasValidApplyUrl(internship) ? (
            <a
              href={internship.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
            >
              Apply on company site <ExternalLink size={16} />
            </a>
          ) : (
            <button
              onClick={onApply}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
            >
              Add to tracker <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon size={14} />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}
