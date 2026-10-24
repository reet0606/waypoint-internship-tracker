import { useEffect, useState, useMemo } from 'react';
import type { Internship } from '@/types';
import { useApplications } from '@/hooks/useApplications';
import { useInternships } from '@/hooks/useInternships';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navbar, type Page } from '@/components/Navbar';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { SavedPage } from '@/pages/SavedPage';
import { TrackerPage } from '@/pages/TrackerPage';
import { AdminPage } from '@/pages/AdminPage';
import { InternshipDetail } from '@/components/InternshipDetail';

const ADMIN_HASH = '#admin';

function pageFromHash(): Page {
  if (typeof window !== 'undefined' && window.location.hash === ADMIN_HASH) return 'admin';
  return 'discover';
}

function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [openInternship, setOpenInternship] = useState<Internship | null>(null);
  const { apps, setStatus, remove, toggleSaved, updateNotes } = useApplications();
  const { internships, loading, error, refresh, lastRefreshed, indianStates, upsertInternship, removeInternship, resetAdmin } = useInternships();
  const { unlocked, unlock, lock, isDev } = useAdminAuth();

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (p: Page) => {
    if (p === 'admin') {
      window.location.hash = ADMIN_HASH;
    } else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setPage(p);
  };

  const savedIds = useMemo(
    () => new Set(Object.values(apps).filter((a) => a.status === 'Saved').map((a) => a.internshipId)),
    [apps]
  );

  const internshipsById = useMemo(() => {
    const map: Record<string, Internship> = {};
    for (const i of internships) map[i.id] = i;
    return map;
  }, [internships]);

  const savedInternships = useMemo(
    () => Array.from(savedIds).map((id) => internshipsById[id]).filter(Boolean),
    [savedIds, internshipsById]
  );

  const trackerCount = Object.keys(apps).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar page={page} setPage={go} counts={{ saved: savedIds.size, tracker: trackerCount }} />

      <main>
        {page === 'discover' && (
          <DiscoverPage
            internships={internships}
            states={indianStates}
            loading={loading}
            error={error}
            lastRefreshed={lastRefreshed}
            onRefresh={refresh}
            savedIds={savedIds}
            onToggleSave={toggleSaved}
            onOpen={setOpenInternship}
          />
        )}
        {page === 'saved' && (
          <SavedPage
            saved={savedInternships}
            savedIds={savedIds}
            onToggleSave={toggleSaved}
            onOpen={setOpenInternship}
            onGoDiscover={() => go('discover')}
          />
        )}
        {page === 'tracker' && (
          <TrackerPage
            apps={apps}
            internshipsById={internshipsById}
            onSetStatus={setStatus}
            onRemove={remove}
            onUpdateNotes={updateNotes}
            onOpen={setOpenInternship}
            onGoDiscover={() => go('discover')}
          />
        )}
        {page === 'admin' && (
          <AdminPage
            unlocked={unlocked}
            onUnlock={unlock}
            onLock={lock}
            internships={internships}
            onUpsert={upsertInternship}
            onRemove={removeInternship}
            onReset={resetAdmin}
            isDev={isDev}
          />
        )}
      </main>

      {openInternship && (
        <InternshipDetail
          internship={openInternship}
          status={apps[openInternship.id]?.status ?? null}
          applied={apps[openInternship.id]?.status !== undefined && apps[openInternship.id].status !== 'Saved'}
          onClose={() => setOpenInternship(null)}
          onToggleSave={() => toggleSaved(openInternship.id)}
          onApply={() => {
            setStatus(openInternship.id, 'Applied');
          }}
        />
      )}
    </div>
  );
}

export default App;
