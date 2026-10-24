import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import type { Internship, Role, WorkMode } from '@/types';
import { InternshipCard } from '@/components/InternshipCard';
import { classNames, timeAgo } from '@/utils';

interface Props {
  internships: Internship[];
  states: string[];
  loading: boolean;
  error: string | null;
  lastRefreshed: number | null;
  onRefresh: () => void;
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onOpen: (i: Internship) => void;
}

const roles: ('All Roles' | Role)[] = [
  'All Roles',
  'Product Management',
  'Product Analyst',
  'Software Development',
  'iOS Development',
  'Business Analyst',
  'Strategy',
  'Marketing',
  'Growth',
  'Data Analytics',
];
const modes: ('All Modes' | WorkMode)[] = ['All Modes', 'Remote', 'Hybrid', 'On-site'];

export function DiscoverPage({ internships, states, loading, error, lastRefreshed, onRefresh, savedIds, onToggleSave, onOpen }: Props) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<typeof roles[number]>('All Roles');
  const [mode, setMode] = useState<typeof modes[number]>('All Modes');
  const [state, setState] = useState('All States');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return internships.filter((i) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !i.title.toLowerCase().includes(q) &&
          !i.role.toLowerCase().includes(q) &&
          !i.company.toLowerCase().includes(q) &&
          !i.location.toLowerCase().includes(q) &&
          !i.skills.some((s) => s.toLowerCase().includes(q))
        )
          return false;
      }
      if (role !== 'All Roles' && i.role !== role) return false;
      if (mode !== 'All Modes' && i.workMode !== mode) return false;
      if (state !== 'All States' && i.state !== state) return false;
      return true;
    });
  }, [internships, query, role, mode, state]);

  const activeCount =
    (role !== 'All Roles' ? 1 : 0) + (mode !== 'All Modes' ? 1 : 0) + (state !== 'All States' ? 1 : 0);

  const clearAll = () => {
    setRole('All Roles');
    setMode('All Modes');
    setState('All States');
    setQuery('');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Find your next internship
        </h1>
        <p className="mt-1.5 text-slate-500">
          Demo opportunities for Indian students across product, engineering, strategy, marketing and analytics.
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company, city or skill"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={classNames(
            'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
            filtersOpen || activeCount > 0
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          )}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[11px] font-bold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter row */}
      {filtersOpen && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <FilterSelect label="Role" value={role} onChange={(v) => setRole(v as typeof roles[number])} options={roles} />
            <FilterSelect label="Work mode" value={mode} onChange={(v) => setMode(v as typeof modes[number])} options={modes} />
            <FilterSelect label="State" value={state} onChange={setState} options={states} />
          </div>
          {activeCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button onClick={clearAll} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
                <X size={14} /> Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'opportunity' : 'opportunities'}`}
          {!loading && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">Demo data</span>}
          {lastRefreshed && !loading && (
            <span className="ml-2 text-slate-400">· Updated {timeAgo(lastRefreshed)}</span>
          )}
        </p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-600">{error ?? (loading ? 'Loading demo opportunities…' : 'No demo opportunities match your filters.')}</p>
          {error ? (
            <button onClick={onRefresh} className="mt-3 text-sm font-medium text-blue-600 hover:underline">
              Try again
            </button>
          ) : (
            <button onClick={clearAll} className="mt-3 text-sm font-medium text-blue-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <InternshipCard
              key={i.id}
              internship={i}
              saved={savedIds.has(i.id)}
              onToggleSave={() => onToggleSave(i.id)}
              onOpen={() => onOpen(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
