import { useMemo, useState } from 'react';
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Link2,
  CalendarClock,
} from 'lucide-react';
import type { Internship, Role, WorkMode, VerificationState, ListingStatus } from '@/types';
import { ROLE_OPTIONS, WORK_MODE_OPTIONS } from '@/types';
import { indianStates } from '@/data';
import { classNames } from '@/utils';

interface Props {
  unlocked: boolean;
  onUnlock: (passphrase: string) => boolean;
  onLock: () => void;
  internships: Internship[];
  onUpsert: (i: Internship) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  isDev?: boolean;
}

const ACCENTS = ['#2563eb', '#0f766e', '#1f2937', '#b45309', '#1d4ed8', '#db2777', '#7c3aed', '#15803d', '#0369a1', '#ea580c', '#0891b2', '#475569', '#ca8a04', '#4338ca', '#334155'];

function genId() {
  return `admin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDraft(): Internship {
  return {
    id: genId(),
    title: '',
    company: '',
    logoColor: ACCENTS[0],
    role: 'Software Development',
    location: '',
    state: 'Karnataka',
    workMode: 'Remote',
    duration: '',
    stipend: '',
    postedDaysAgo: 0,
    deadline: '',
    description: '',
    responsibilities: [],
    requirements: [],
    skills: [],
    openings: 1,
    applyUrl: '',
    sourceUrl: null,
    applicationDeadline: '',
    lastVerifiedAt: null,
    listingStatus: 'open',
    isDemo: false,
    verification: 'unverified',
    eligibility: '',
  };
}

export function AdminPage({ unlocked, onUnlock, onLock, internships, onUpsert, onRemove, onReset, isDev = false }: Props) {
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState(false);

  const adminListings = useMemo(() => internships.filter((i) => !i.id.startsWith('demo-')), [internships]);
  const demoListings = useMemo(() => internships.filter((i) => i.id.startsWith('demo-')), [internships]);

  const [editing, setEditing] = useState<Internship | null>(null);

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Lock size={22} />
          </div>
          <h1 className="text-center text-xl font-semibold tracking-tight text-slate-900">Admin access</h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            This area is for opportunity managers. Enter the admin passphrase to continue.
          </p>
          {isDev && (
            <p className="mt-2 text-center text-xs text-amber-700">
              Development/demo mode: any passphrase will unlock. This is not secure.
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = onUnlock(passphrase);
              if (!ok) setAuthError(true);
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setAuthError(false);
              }}
              placeholder="Admin passphrase"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
            {authError && (
              <p className="text-sm text-rose-600">Incorrect passphrase, or no passphrase has been configured yet.</p>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Lock size={16} /> Unlock
            </button>
          </form>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
            <p className="flex items-center gap-1.5 font-semibold">
              <ShieldAlert size={14} /> Before going live
            </p>
            <p className="mt-1">
              This is a local-only prototype. Admin changes are stored in your browser, not a database. Before publishing,
              you will need real authentication and server-side storage (see the notes at the bottom of this page).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {isDev && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          <p>
            <strong>Development/demo mode.</strong> The admin panel is unlocked and changes are saved only in this browser.
            This is not secure and must not be used in production. See the setup notes at the bottom of this page.
          </p>
        </div>
      )}
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Opportunity management</h1>
          <p className="mt-1 text-sm text-slate-500">Add, edit and remove internship listings. Mark a listing Verified only after checking the original source.</p>
        </div>
        <button
          onClick={onLock}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <LogOut size={15} /> Lock
        </button>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setEditing(emptyDraft())}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={16} /> Add listing
        </button>
        <span className="text-sm text-slate-400">
          {adminListings.length} managed · {demoListings.length} demo
        </span>
        {adminListings.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Remove all managed listings? Demo listings are not affected.')) onReset();
            }}
            className="ml-auto text-sm font-medium text-slate-500 hover:text-rose-600"
          >
            Reset managed
          </button>
        )}
      </div>

      {/* Managed listings */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Managed listings</h2>
        {adminListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
            <p className="text-sm text-slate-500">No managed listings yet. Add your first opportunity to get started.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {adminListings.map((i) => (
              <li
                key={i.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{i.title || 'Untitled'}</h3>
                    <VerificationBadge state={i.verification} />
                  </div>
                  <p className="truncate text-sm text-slate-500">
                    {i.company} · {i.location} · {i.role}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Deadline {i.applicationDeadline || '—'} · Source {i.sourceUrl ?? 'none'}
                    {i.lastVerifiedAt ? ` · Verified ${i.lastVerifiedAt}` : ' · Not verified'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => setEditing(i)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${i.title}"? This cannot be undone in this prototype.`)) onRemove(i.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Demo catalog (read-only) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Demo catalog (read-only)</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {demoListings.map((i) => (
              <li key={i.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{i.title}</p>
                  <p className="truncate text-xs text-slate-500">{i.company} · {i.location}</p>
                </div>
                <button
                  onClick={() => setEditing({ ...i, id: genId(), isDemo: false, verification: 'unverified', lastVerifiedAt: null, listingStatus: 'open' })}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <Plus size={13} /> Duplicate as managed
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pre-publish notes */}
      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-amber-800">
          <ShieldAlert size={15} /> What you need before publishing admin features
        </h2>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-amber-800">
          <li><strong>Authentication:</strong> Replace the local passphrase with real admin sign-in (e.g. Supabase email/password or SSO) and restrict the admin page to an <code>admin</code> role. Store the role in a trusted profile, never in client-editable metadata.</li>
          <li><strong>Database storage:</strong> Move listings from localStorage into a Supabase <code>internships</code> table with row-level security. Public users get read-only access to verified rows; only the service role or an admin role can insert, update or delete.</li>
          <li><strong>Server-side verification:</strong> Verification should be set by a server function after an admin checks the source — not by a field anyone can flip in the browser. Store <code>last_verified_at</code> and <code>verified_by</code> on the row.</li>
          <li><strong>URL validation:</strong> Validate the application URL server-side (HTTPS, allowed domains) before a listing is marked Verified and the Apply button is shown to users.</li>
          <li><strong>Audit trail:</strong> Log who created, edited, verified or removed each listing, so verification claims are accountable.</li>
        </ul>
      </section>

      {editing && (
        <ListingEditor
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(i) => {
            onUpsert(i);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function VerificationBadge({ state }: { state: VerificationState }) {
  if (state === 'verified')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 size={11} /> Verified
      </span>
    );
  if (state === 'demo')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
        <AlertTriangle size={11} /> Demo
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
      Unverified
    </span>
  );
}

function ListingEditor({ draft, onClose, onSave }: { draft: Internship; onClose: () => void; onSave: (i: Internship) => void }) {
  const [form, setForm] = useState<Internship>(draft);
  const [skillsText, setSkillsText] = useState(draft.skills.join(', '));
  const [responsibilitiesText, setResponsibilitiesText] = useState(draft.responsibilities.join('\n'));
  const [requirementsText, setRequirementsText] = useState(draft.requirements.join('\n'));
  const [sourceUrl, setSourceUrl] = useState(draft.sourceUrl ?? '');
  const [applyUrl, setApplyUrl] = useState(draft.applyUrl);
  const [lastVerifiedAt, setLastVerifiedAt] = useState(draft.lastVerifiedAt ?? '');
  const [confirmVerified, setConfirmVerified] = useState(draft.verification === 'verified');

  const set = <K extends keyof Internship>(key: K, value: Internship[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const urlValid = (u: string) => {
    if (!u) return true;
    try {
      const parsed = new URL(u);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const canVerify = urlValid(sourceUrl) && !!sourceUrl && !!lastVerifiedAt && confirmVerified;

  const handleSave = () => {
    const parsedSkills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedResp = responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const parsedReq = requirementsText.split('\n').map((s) => s.trim()).filter(Boolean);

    const verification: VerificationState = form.verification === 'demo' ? 'demo' : canVerify ? 'verified' : 'unverified';
    const listingStatus: ListingStatus = verification === 'verified' ? 'open' : form.listingStatus === 'closed' ? 'closed' : 'open';

    const finalInternship: Internship = {
      ...form,
      skills: parsedSkills,
      responsibilities: parsedResp,
      requirements: parsedReq,
      eligibility: parsedReq.join(' · '),
      sourceUrl: sourceUrl.trim() ? sourceUrl.trim() : null,
      applyUrl: applyUrl.trim(),
      applicationDeadline: form.applicationDeadline || form.deadline,
      lastVerifiedAt: verification === 'verified' ? lastVerifiedAt : null,
      verification,
      listingStatus,
      isDemo: false,
      postedDaysAgo: Number.isFinite(form.postedDaysAgo) ? Math.max(0, form.postedDaysAgo) : 0,
      openings: Number.isFinite(form.openings) ? Math.max(0, form.openings) : 0,
    };

    if (verification === 'verified' && !urlValid(finalInternship.applyUrl)) {
      alert('A Verified listing needs a valid HTTPS application URL before it can be shown with an Apply button.');
      return;
    }

    onSave(finalInternship);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{draft.title ? 'Edit listing' : 'New listing'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
          <Field label="Role title">
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Product Manager Intern" className={inputCls} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" className={inputCls} />
            </Field>
            <Field label="Logo color">
              <div className="flex items-center gap-2">
                <input type="color" value={form.logoColor} onChange={(e) => set('logoColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
                <span className="text-xs text-slate-500">{form.logoColor}</span>
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category / role">
              <select value={form.role} onChange={(e) => set('role', e.target.value as Role)} className={inputCls}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Work mode">
              <select value={form.workMode} onChange={(e) => set('workMode', e.target.value as WorkMode)} className={inputCls}>
                {WORK_MODE_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location (City, State)">
              <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Bengaluru, Karnataka" className={inputCls} />
            </Field>
            <Field label="State">
              <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls}>
                {indianStates.filter((s) => s !== 'All States').map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Duration">
              <input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="6 months" className={inputCls} />
            </Field>
            <Field label="Stipend">
              <input value={form.stipend} onChange={(e) => set('stipend', e.target.value)} placeholder="₹30,000 / month" className={inputCls} />
            </Field>
            <Field label="Openings">
              <input type="number" min={0} value={form.openings} onChange={(e) => set('openings', Number(e.target.value))} className={inputCls} />
            </Field>
          </div>

          <Field label="Eligibility criteria (one per line)">
            <textarea value={requirementsText} onChange={(e) => setRequirementsText(e.target.value)} rows={3} placeholder="Pursuing BTech, graduating 2027 or later" className={inputCls} />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Short summary of the role" className={inputCls} />
          </Field>

          <Field label="Responsibilities (one per line)">
            <textarea value={responsibilitiesText} onChange={(e) => setResponsibilitiesText(e.target.value)} rows={3} placeholder="Write product briefs" className={inputCls} />
          </Field>

          <Field label="Skills (comma separated)">
            <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="SQL, Analytics, Roadmapping" className={inputCls} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Application deadline">
              <input value={form.applicationDeadline} onChange={(e) => set('applicationDeadline', e.target.value)} placeholder="15 Nov 2026" className={inputCls} />
            </Field>
            <Field label="Posted days ago">
              <input type="number" min={0} value={form.postedDaysAgo} onChange={(e) => set('postedDaysAgo', Number(e.target.value))} className={inputCls} />
            </Field>
          </div>

          <Field label="Original application URL">
            <div className="relative">
              <Link2 size={16} className="absolute left-3 top-3 text-slate-400" />
              <input value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https://careers.example.com/role/123" className={classNames(inputCls, 'pl-9')} />
            </div>
            {!urlValid(applyUrl) && <p className="mt-1 text-xs text-rose-600">Enter a valid http(s) URL.</p>}
          </Field>

          <Field label="Source URL (where you verified the listing)">
            <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://company.com/careers" className={inputCls} />
            {!urlValid(sourceUrl) && <p className="mt-1 text-xs text-rose-600">Enter a valid http(s) URL.</p>}
          </Field>

          {/* Verification */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Verification</h3>
            <p className="mt-1 text-xs text-slate-500">
              Mark a listing Verified only after you have personally opened the source URL and confirmed the opportunity is currently open.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Last verified date">
                <div className="relative">
                  <CalendarClock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input type="date" value={lastVerifiedAt} onChange={(e) => setLastVerifiedAt(e.target.value)} className={classNames(inputCls, 'pl-9')} />
                </div>
              </Field>
              <div className="flex items-end">
                <label className={classNames('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition', confirmVerified ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600')}>
                  <input
                    type="checkbox"
                    checked={confirmVerified}
                    onChange={(e) => setConfirmVerified(e.target.checked)}
                    disabled={!sourceUrl || !lastVerifiedAt}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  I have checked the source
                </label>
              </div>
            </div>
            <div className="mt-3">
              <VerificationBadge state={canVerify ? 'verified' : 'unverified'} />
              {!canVerify && confirmVerified && (
                <p className="mt-1 text-xs text-slate-500">Add a valid source URL, verification date and application URL to mark this Verified.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <CheckCircle2 size={16} /> Save listing
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}
