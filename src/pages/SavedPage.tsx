import { Bookmark } from 'lucide-react';
import type { Internship } from '@/types';
import { InternshipCard } from '@/components/InternshipCard';

interface Props {
  saved: Internship[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onOpen: (i: Internship) => void;
  onGoDiscover: () => void;
}

export function SavedPage({ saved, savedIds, onToggleSave, onOpen, onGoDiscover }: Props) {
  if (saved.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Saved opportunities</h1>
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Bookmark size={22} />
          </div>
          <p className="mt-4 text-slate-600">You haven't saved any internships yet.</p>
          <button
            onClick={onGoDiscover}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse opportunities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Saved opportunities</h1>
      <p className="mt-1.5 text-slate-500">{saved.length} bookmarked for later.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((i) => (
          <InternshipCard
            key={i.id}
            internship={i}
            saved={savedIds.has(i.id)}
            onToggleSave={() => onToggleSave(i.id)}
            onOpen={() => onOpen(i)}
          />
        ))}
      </div>
    </div>
  );
}
