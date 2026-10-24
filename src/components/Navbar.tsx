import { Compass, Bookmark, ClipboardList } from 'lucide-react';
import { classNames } from '@/utils';

export type Page = 'discover' | 'saved' | 'tracker' | 'admin';

interface Props {
  page: Page;
  setPage: (p: Page) => void;
  counts: { saved: number; tracker: number };
}

const items: { id: Page; label: string; icon: typeof Compass }[] = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'tracker', label: 'Tracker', icon: ClipboardList },
];

export function Navbar({ page, setPage, counts }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={() => setPage('discover')} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Compass size={18} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">Waypoint</span>
        </button>

        <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {items.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            const badge =
              id === 'saved' ? counts.saved : id === 'tracker' ? counts.tracker : 0;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={classNames(
                  'relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4',
                  active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
                {badge > 0 && (
                  <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
