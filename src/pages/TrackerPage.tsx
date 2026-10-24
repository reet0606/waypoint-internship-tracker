import { useState } from 'react';
import { ClipboardList, Trash2, ChevronDown, StickyNote, X } from 'lucide-react';
import type { Application, Internship, TrackerStatus } from '@/types';
import { classNames } from '@/utils';

interface Props {
  apps: Record<string, Application>;
  internshipsById: Record<string, Internship>;
  onSetStatus: (id: string, status: TrackerStatus) => void;
  onRemove: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onOpen: (i: Internship) => void;
  onGoDiscover: () => void;
}

const columns: { id: TrackerStatus; label: string; accent: string; dot: string }[] = [
  { id: 'Saved', label: 'Saved', accent: 'border-t-blue-500', dot: 'bg-blue-500' },
  { id: 'Applied', label: 'Applied', accent: 'border-t-emerald-500', dot: 'bg-emerald-500' },
  { id: 'Interview', label: 'Interview', accent: 'border-t-amber-500', dot: 'bg-amber-500' },
  { id: 'Rejected', label: 'Rejected', accent: 'border-t-rose-500', dot: 'bg-rose-500' },
];

const statusOptions: TrackerStatus[] = ['Saved', 'Applied', 'Interview', 'Rejected'];

export function TrackerPage({
  apps,
  internshipsById,
  onSetStatus,
  onRemove,
  onUpdateNotes,
  onOpen,
  onGoDiscover,
}: Props) {
  const [notesFor, setNotesFor] = useState<string | null>(null);

  const allIds = Object.keys(apps);
  const total = allIds.length;

  if (total === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Application Tracker</h1>
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <ClipboardList size={22} />
          </div>
          <p className="mt-4 text-slate-600">Your tracker is empty.</p>
          <p className="mt-1 text-sm text-slate-400">
            Save an internship or hit Apply to start tracking your progress.
          </p>
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Application Tracker</h1>
          <p className="mt-1.5 text-slate-500">{total} {total === 1 ? 'application' : 'applications'} in your pipeline.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = allIds
            .filter((id) => apps[id].status === col.id)
            .map((id) => ({ app: apps[id], internship: internshipsById[id] }))
            .filter((x) => x.internship);

          return (
            <div key={col.id} className={`rounded-2xl border border-slate-200 border-t-4 bg-slate-50/50 p-3 ${col.accent}`}>
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-slate-800">{col.label}</span>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  {items.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {items.length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-slate-400">Nothing here yet.</p>
                )}
                {items.map(({ app, internship }) => (
                  <div key={app.internshipId} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <button
                      onClick={() => onOpen(internship)}
                      className="block w-full text-left"
                    >
                      <p className="truncate text-sm font-semibold text-slate-900 hover:text-slate-700">
                        {internship.title}
                      </p>
                      <p className="truncate text-xs text-slate-500">{internship.company}</p>
                      <p className="mt-1.5 text-xs text-slate-400">{internship.location}</p>
                    </button>

                    <div className="mt-3 flex items-center gap-1.5">
                      <StatusDropdown
                        current={app.status}
                        onChange={(s) => onSetStatus(app.internshipId, s)}
                      />
                      <button
                        onClick={() => setNotesFor(app.internshipId)}
                        aria-label="Notes"
                        className={`rounded-lg p-1.5 transition ${
                          app.notes ? 'text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <StickyNote size={15} />
                      </button>
                      <button
                        onClick={() => onRemove(app.internshipId)}
                        aria-label="Remove"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {notesFor && apps[notesFor] && (
        <NotesModal
          internship={internshipsById[notesFor]}
          notes={apps[notesFor].notes}
          onSave={(text) => {
            onUpdateNotes(notesFor, text);
            setNotesFor(null);
          }}
          onClose={() => setNotesFor(null)}
        />
      )}
    </div>
  );
}

function StatusDropdown({
  current,
  onChange,
}: {
  current: TrackerStatus;
  onChange: (s: TrackerStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300"
      >
        {current}
        <ChevronDown size={13} className="text-slate-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={classNames(
                  'block w-full px-3 py-1.5 text-left text-xs transition hover:bg-slate-50',
                  s === current ? 'font-semibold text-slate-900' : 'text-slate-600'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NotesModal({
  internship,
  notes,
  onSave,
  onClose,
}: {
  internship: Internship;
  notes: string;
  onSave: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(notes);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Notes</h3>
            <p className="text-sm text-slate-500">{internship.title} · {internship.company}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Interview dates, contact info, follow-up reminders…"
          className="mt-4 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={() => onSave(text)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}
