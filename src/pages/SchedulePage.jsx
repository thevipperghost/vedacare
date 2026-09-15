import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, ArrowRight, User, Search, Eye, EyeOff, Leaf } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM',
  '04:00 PM','04:30 PM','05:00 PM','05:30 PM',
];

export default function SchedulePage() {
  const { t } = useLang();
  const { cases, updateCase } = useStore();
  const [filter, setFilter] = useState('today');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const activeCases = cases.filter(c => {
    if (!showCompleted && c.schedule?.status === 'completed') return false;
    const matchSearch = c.personal.name.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint.primary.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  }).sort((a, b) => {
    if (!a.schedule?.date || !b.schedule?.date) return 1;
    if (a.schedule.date !== b.schedule.date) return a.schedule.date.localeCompare(b.schedule.date);
    if (!a.schedule?.time || !b.schedule?.time) return 1;
    return a.schedule.time.localeCompare(b.schedule.time);
  });

  const todayCases = activeCases.filter(c => c.schedule?.date === today);
  const upcomingCases = activeCases.filter(c => c.schedule?.date && c.schedule.date > today);
  const unscheduledCases = activeCases.filter(c => !c.schedule?.date);

  const statusColors = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: Circle },
    'in-progress': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: AlertCircle },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: CheckCircle2 },
  };

  const updateStatus = (id, status) => {
    updateCase(id, { schedule: { ...cases.find(c => c.id === id)?.schedule, status } });
  };

  const updateScheduleTime = (id, date, time) => {
    updateCase(id, { schedule: { ...cases.find(c => c.id === id)?.schedule, date, time } });
    setEditingId(null);
  };

  const ScheduleCard = ({ c, accent }) => {
    const sched = c.schedule || {};
    const status = sched.status || 'pending';
    const StatusIcon = statusColors[status]?.icon || Circle;
    const prog = c.progression || 0;

    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />
        <div className="p-5 pl-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold text-base shadow-md shadow-emerald-500/15">
                {c.personal.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-emerald-900 truncate">{c.personal.name}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusColors[status]?.bg} ${statusColors[status]?.text} ${statusColors[status]?.border}`}>
                    <StatusIcon size={10} />
                    <span className="capitalize hidden sm:inline">{status.replace('-', ' ')}</span>
                  </span>
                </div>
                <p className="text-xs text-emerald-700/50 truncate mt-0.5">{c.complaint.primary || 'No complaint'} · {c.personal.age || '—'} yrs</p>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  {sched.date && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600/60">
                      <Calendar size={11} /> {new Date(sched.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {sched.time && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600/60">
                      <Clock size={11} /> {sched.time}
                    </span>
                  )}
                </div>
                {prog > 0 && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-emerald-100/60 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-700" style={{ width: `${prog}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600/50 w-7 text-right">{prog}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {editingId === c.id ? (
                <div className="flex gap-1.5 items-center">
                  <input type="date" defaultValue={sched.date || today} id={`date-${c.id}`}
                    className="input !py-1.5 !px-2 !text-xs w-28" />
                  <select defaultValue={sched.time || ''} id={`time-${c.id}`}
                    className="input !py-1.5 !px-2 !text-xs w-28">
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={() => {
                    const date = document.getElementById(`date-${c.id}`).value;
                    const time = document.getElementById(`time-${c.id}`).value;
                    updateScheduleTime(c.id, date, time);
                  }} className="btn-primary !px-3 !py-1.5 !text-xs">Save</button>
                </div>
              ) : (
                <>
                  <button onClick={() => setEditingId(c.id)}
                    className="rounded-lg bg-white/60 px-2.5 py-1.5 text-xs font-medium text-emerald-600 hover:bg-white transition">
                    {sched.date ? 'Edit' : 'Schedule'}
                  </button>
                  {status !== 'completed' && (
                    <button onClick={() => updateStatus(c.id, status === 'pending' ? 'in-progress' : 'completed')}
                      className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 p-1.5 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105">
                      <ArrowRight size={14} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, label, count, color }) => (
    <div className="mb-3 flex items-center gap-2">
      <div className={`grid h-7 w-7 place-items-center rounded-lg ${color}`}>
        <Icon size={13} className="text-white" />
      </div>
      <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">{label}</h2>
      <span className="rounded-md bg-emerald-100/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600">{count}</span>
    </div>
  );

  const totalVisible = todayCases.length + upcomingCases.length + unscheduledCases.length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent">Schedule</h1>
          <p className="mt-1.5 text-sm text-emerald-700/60">Manage patient appointments and treatment timeline</p>
        </div>
        <button onClick={() => setShowCompleted(!showCompleted)}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            showCompleted
              ? 'bg-emerald-100/60 text-emerald-700'
              : 'bg-white/40 text-emerald-600/50 hover:bg-white/60'
          }`}>
          {showCompleted ? <EyeOff size={14} /> : <Eye size={14} />}
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3 animate-slide-up">
        {[
          { label: 'Today', value: cases.filter(c => c.schedule?.date === today && c.schedule?.status !== 'completed').length, color: 'text-emerald-700', bg: 'bg-gradient-to-br from-emerald-50 to-green-50', icon: Calendar },
          { label: 'Upcoming', value: cases.filter(c => c.schedule?.date && c.schedule.date > today && c.schedule?.status !== 'completed').length, color: 'text-blue-700', bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', icon: Clock },
          { label: 'Pending', value: cases.filter(c => !c.schedule?.date).length, color: 'text-amber-700', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', icon: AlertCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`rounded-2xl ${bg} p-4 text-center hover:scale-[1.02] transition-all duration-300`}>
            <div className={`mx-auto mb-2 grid h-9 w-9 place-items-center rounded-xl bg-white/60 ${color}`}>
              <Icon size={16} />
            </div>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            <p className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/40" />
          <input className="input pl-11" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {[
          ['today', "Today's Schedule"],
          ['upcoming', 'Upcoming'],
          ['unscheduled', 'Needs Scheduling'],
          ['all', 'All'],
        ].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
              filter === k
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white/40 text-emerald-600/50 hover:bg-white/60'
            }`}>{v}</button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {(filter === 'all' || filter === 'today') && todayCases.length > 0 && (
          <div>
            <SectionHeader icon={Calendar} label="Today's Schedule" count={todayCases.length} color="bg-gradient-to-r from-emerald-400 to-green-500" />
            <div className="space-y-3">
              {todayCases.map(c => <ScheduleCard key={c.id} c={c} accent="bg-gradient-to-b from-emerald-400 to-green-500" />)}
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'upcoming') && upcomingCases.length > 0 && (
          <div>
            <SectionHeader icon={Clock} label="Upcoming" count={upcomingCases.length} color="bg-gradient-to-r from-blue-400 to-indigo-500" />
            <div className="space-y-3">
              {upcomingCases.map(c => <ScheduleCard key={c.id} c={c} accent="bg-gradient-to-b from-blue-400 to-indigo-500" />)}
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'unscheduled') && unscheduledCases.length > 0 && (
          <div>
            <SectionHeader icon={AlertCircle} label="Needs Scheduling" count={unscheduledCases.length} color="bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="space-y-3">
              {unscheduledCases.map(c => <ScheduleCard key={c.id} c={c} accent="bg-gradient-to-b from-amber-400 to-orange-500" />)}
            </div>
          </div>
        )}
      </div>

      {totalVisible === 0 && (
        <div className="card p-14 text-center animate-fade-in">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100/60">
            <Calendar size={32} className="text-emerald-400" />
          </div>
          <p className="font-bold text-emerald-900 text-lg">No appointments</p>
          <p className="mt-1.5 text-sm text-emerald-700/50">
            {search ? 'No results match your search' : 'Register patients to start scheduling'}
          </p>
          {!search && (
            <Link to="/register" className="btn-primary mt-5 inline-flex">
              Register Patient <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
