import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Users, Activity, AlertCircle, ArrowRight, TrendingUp, UserPlus, Stethoscope } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';

export default function DashboardPage() {
  const { t } = useLang();
  const { cases, deleteCase, user } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = cases.filter(c => {
    const matchSearch = c.personal.name.toLowerCase().includes(search.toLowerCase()) || c.complaint.primary.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'severe' ? c.complaint.severity === 'Severe' : true);
    return matchSearch && matchFilter;
  });

  const severeCount = cases.filter(c => c.complaint.severity === 'Severe').length;
  const todayCount = cases.filter(c => { const d = new Date(c.createdAt); const now = new Date(); return d.toDateString() === now.toDateString(); }).length;
  const vataCount = cases.filter(c => c.ayurvedic.vikriti?.includes('Vata')).length;
  const pittaCount = cases.filter(c => c.ayurvedic.vikriti?.includes('Pitta')).length;
  const kaphaCount = cases.filter(c => c.ayurvedic.vikriti?.includes('Kapha')).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent animate-slide-up">{t('dash.title')}</h1>
          <p className="mt-1.5 text-sm text-emerald-800/70">Welcome back, <span className="font-semibold text-emerald-700">{user?.name}</span></p>
        </div>
        <Link to="/register" className="btn-primary group">
          <UserPlus size={16} /> New Patient <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        {[
          { icon: Users, label: t('dash.total'), value: cases.length, bg: 'bg-gradient-to-br from-emerald-400/25 to-green-400/25', iconColor: 'text-emerald-600' },
          { icon: Activity, label: t('dash.today'), value: todayCount, bg: 'bg-gradient-to-br from-amber-400/25 to-orange-400/25', iconColor: 'text-amber-600' },
          { icon: AlertCircle, label: t('dash.severe'), value: severeCount, bg: 'bg-gradient-to-br from-red-400/25 to-rose-400/25', iconColor: 'text-red-500' },
          { icon: TrendingUp, label: 'Recovery Rate', value: cases.length ? `${Math.round((cases.length - severeCount) / Math.max(cases.length,1) * 100)}%` : '—', bg: 'bg-gradient-to-br from-teal-400/25 to-cyan-400/25', iconColor: 'text-teal-600' },
        ].map(({ icon: Icon, label, value, bg, iconColor }) => (
          <div key={label} className={`group relative overflow-hidden rounded-2xl ${bg} p-6 hover:scale-[1.02] transition-all duration-300 cursor-default hover:shadow-xl hover:shadow-emerald-500/10`}>
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
            <Icon size={22} className={`mb-3 ${iconColor}`} />
            <p className="text-3xl font-extrabold text-emerald-900">{value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-800/70 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Dosha Distribution */}
      {cases.length > 0 && (
        <div className="mb-8 card p-6 animate-slide-up">
          <div className="mb-4 flex items-center gap-2">
            <Stethoscope size={18} className="text-emerald-600" />
            <h3 className="font-bold text-emerald-900">Dosha Distribution</h3>
          </div>
          <div className="flex h-10 overflow-hidden rounded-full bg-white/30">
            {[
              { count: vataCount, color: 'bg-gradient-to-r from-violet-500 to-violet-400', label: 'Vata' },
              { count: pittaCount, color: 'bg-gradient-to-r from-orange-500 to-amber-400', label: 'Pitta' },
              { count: kaphaCount, color: 'bg-gradient-to-r from-teal-500 to-emerald-400', label: 'Kapha' },
            ].map(({ count, color, label }) => count > 0 && (
              <div key={label} className={`${color} flex items-center justify-center text-[11px] font-bold text-white transition-all duration-700`}
                style={{ width: `${(count / cases.length) * 100}%` }}>
                {label} ({count})
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-5 text-xs text-emerald-800/70">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Vata</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Pitta</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-400" /> Kapha</span>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50" />
          <input className="input pl-11" placeholder={t('dash.search')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[['all', t('dash.filterAll')], ['severe', t('dash.severe')]].map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                filter === k
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-800 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/40 text-emerald-800/70 hover:bg-white/60'
              }`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card p-14 text-center animate-fade-in">
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100/60">
              <Users size={32} className="text-emerald-400" />
            </div>
            <p className="font-bold text-emerald-900 text-lg">{cases.length === 0 ? 'No cases yet' : 'No matches found'}</p>
            <p className="mt-1.5 text-sm text-emerald-700/60 max-w-xs mx-auto">{cases.length === 0 ? 'Register your first patient to start case-taking' : 'Try a different search term'}</p>
            {cases.length === 0 && (
              <Link to="/register" className="btn-primary mt-5 inline-flex group">
                <UserPlus size={16} /> Register First Patient <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}
        {filtered.map((c, idx) => (
          <Link key={c.id} to={`/case/${c.id}`}
            className="card group flex items-center justify-between p-5 hover:bg-white/60 transition-all duration-300 hover:scale-[1.005] animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                {c.personal.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-emerald-900">{c.personal.name || 'Unknown'}</p>
                <p className="text-xs text-emerald-700/50 mt-0.5">{c.complaint.primary || 'No complaint'} · {c.personal.age || '—'} yrs · {c.personal.gender}</p>
                <div className="mt-2 flex gap-1.5">
                  {c.ayurvedic.vikriti && <span className="badge bg-emerald-100/60 text-emerald-700">{c.ayurvedic.vikriti}</span>}
                  {c.complaint.severity === 'Severe' && <span className="badge bg-red-100/60 text-red-600">{t('dash.severe')}</span>}
                  {c.complaint.severity === 'Moderate' && <span className="badge bg-amber-100/60 text-amber-700">Moderate</span>}
                  {c.complaint.severity === 'Mild' && <span className="badge bg-green-100/60 text-green-700">Mild</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-emerald-700/50">{new Date(c.savedAt || c.createdAt).toLocaleDateString()}</span>
              <button onClick={e => { e.preventDefault(); deleteCase(c.id); }}
                className="rounded-xl p-2 text-emerald-700/50 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/40 text-emerald-400 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-green-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
