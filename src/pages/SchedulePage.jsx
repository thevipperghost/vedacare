import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, ArrowRight, User, Search, ChevronDown } from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const scheduledCases = cases.filter(c => {
    const matchDate = filter === 'today' ? c.schedule?.date === today : true;
    const matchSearch = c.personal.name.toLowerCase().includes(search.toLowerCase()) || c.complaint.primary.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchSearch;
  }).sort((a, b) => {
    if (!a.schedule?.date || !b.schedule?.date) return 1;
    if (a.schedule.date !== b.schedule.date) return a.schedule.date.localeCompare(b.schedule.date);
    if (!a.schedule?.time || !b.schedule?.time) return 1;
    return a.schedule.time.localeCompare(b.schedule.time);
  });

  const todayCases = scheduledCases.filter(c => c.schedule?.date === today);
  const upcomingCases = scheduledCases.filter(c => c.schedule?.date && c.schedule.date > today);
  const unscheduledCases = scheduledCases.filter(c => !c.schedule?.date);

  const statusColors = {
    pending: { bg: 'bg-amber-100/60', text: 'text-amber-700', icon: Circle },
    'in-progress': { bg: 'bg-blue-100/60', text: 'text-blue-700', icon: AlertCircle },
    completed: { bg: 'bg-emerald-100/60', text: 'text-emerald-700', icon: CheckCircle2 },
  };

  const updateStatus = (id, status) => updateCase(id, { schedule: { ...cases.find(c => c.id === id)?.schedule, status } });
  const updateScheduleTime = (id, date, time) => {
    updateCase(id, { schedule: { ...cases.find(c => c.id === id)?.schedule, date, time } });
    setEditingId(null);
  };

  const ScheduleCard = ({ c }) => {
    const sched = c.schedule || {};
    const status = sched.status || 'pending';
    const StatusIcon = statusColors[status]?.icon || Circle;
    const prog = c.progression || 0;

    return (
      <div className="card p-5 hover:bg-white/70 transition-all duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20">
              {c.personal.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-emerald-900 truncate">{c.personal.name}</p>
              <p className="text-xs text-emerald-700/50 truncate">{c.complaint.primary || 'No complaint'} · {c.personal.age || '—'} yrs</p>
              <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                {sched.date && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600/70">
                    <Calendar size={12} /> {new Date(sched.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                )}
                {sched.time && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600/70">
                    <Clock size={12} /> {sched.time}
                  </span>
                )}
              </div>
              {/* Progression Bar */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-emerald-100/60 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-700" style={{ width: `${prog}%` }} />
                </div>
                <span className="text-[10px] font-bold text-emerald-600/60 w-8 text-right">{prog}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status */}
            <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusColors[status]?.bg} ${statusColors[status]?.text}`}>
              <StatusIcon size={12} />
              <span className="capitalize hidden sm:inline">{status.replace('-', ' ')}</span>
            </div>

            {/* Edit Schedule */}
            {editingId === c.id ? (
              <div className="flex gap-2 items-center">
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
              <button onClick={() => setEditingId(c.id)}
                className="rounded-lg bg-white/50 px-2.5 py-1.5 text-xs font-medium text-emerald-600 hover:bg-white/70 transition">
                {sched.date ? 'Edit' : 'Schedule'}
              </button>
            )}

            {/* Status buttons */}
            {status !== 'completed' && (
              <button onClick={() => updateStatus(c.id, status === 'pending' ? 'in-progress' : 'completed')}
                className="rounded-lg bg-white/50 p-1.5 text-emerald-500 hover:bg-emerald-50 transition">
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent animate-slide-up">Schedule</h1>
        <p className="mt-1.5 text-sm text-emerald-700/60">Manage patient appointments and treatment timeline</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-slide-up">
        {[
          { label: 'Today', value: todayCases.length, color: 'text-emerald-700', bg: 'bg-emerald-100/40' },
          { label: 'Upcoming', value: upcomingCases.length, color: 'text-blue-700', bg: 'bg-blue-100/40' },
          { label: 'Unscheduled', value: unscheduledCases.length, color: 'text-amber-700', bg: 'bg-amber-100/40' },
          { label: 'Completed', value: cases.filter(c => c.schedule?.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-100/40' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl ${bg} p-4 text-center hover:scale-[1.02] transition-all`}>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            <p className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/40" />
          <input className="input pl-11" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['today', 'Today']].map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                filter === k
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-800 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/40 text-emerald-600/50 hover:bg-white/60'
              }`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      {todayCases.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={14} className="text-emerald-500" /> Today's Schedule
          </h2>
          <div className="space-y-3">
            {todayCases.map(c => <ScheduleCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcomingCases.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-emerald-500" /> Upcoming
          </h2>
          <div className="space-y-3">
            {upcomingCases.map(c => <ScheduleCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* Unscheduled */}
      {unscheduledCases.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500" /> Needs Scheduling
          </h2>
          <div className="space-y-3">
            {unscheduledCases.map(c => <ScheduleCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {cases.length === 0 && (
        <div className="card p-14 text-center animate-fade-in">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100/60">
            <Calendar size={32} className="text-emerald-400" />
          </div>
          <p className="font-bold text-emerald-900 text-lg">No patients yet</p>
          <p className="mt-1.5 text-sm text-emerald-700/50">Register patients to start scheduling</p>
          <Link to="/register" className="btn-primary mt-5 inline-flex">
            Register Patient <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </>
  );
}
