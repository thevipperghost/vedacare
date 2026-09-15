import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Activity, Stethoscope, ClipboardList, FileText, Heart, Brain, Pill, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';

export default function CaseSheetPage() {
  const { id } = useParams();
  const { t } = useLang();
  const { cases, updateCase } = useStore();
  const c = cases.find(c => c.id === id);
  const [tab, setTab] = useState('overview');
  const [diagnosis, setDiagnosis] = useState(c?.diagnosis || '');
  const [instructions, setInstructions] = useState(c?.instructions || '');
  const [followUp, setFollowUp] = useState(c?.followUp || '');
  const [saved, setSaved] = useState(false);

  if (!c) return (
    <div className="card p-14 text-center animate-fade-in">
      <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-3xl bg-emerald-100/60">
        <Leaf size={48} className="text-emerald-300" strokeWidth={1.5} />
      </div>
      <p className="text-xl font-bold text-emerald-900">Case not found</p>
      <p className="mt-1.5 text-sm text-emerald-700/60">This case may have been removed</p>
      <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Go to Dashboard</Link>
    </div>
  );

  const tabs = [
    { key: 'overview', icon: User, label: t('case.patientInfo') },
    { key: 'complaint', icon: Activity, label: t('case.complaint') },
    { key: 'ayurvedic', icon: Stethoscope, label: t('case.ayurvedic') },
    { key: 'diagnosis', icon: ClipboardList, label: t('case.diagnosis') },
  ];

  const Row = ({ label, value }) => (
    <div className="flex justify-between gap-3 py-2.5">
      <span className="text-sm text-emerald-800/70">{label}</span>
      <span className="text-sm font-semibold text-emerald-900 text-right">{value || '—'}</span>
    </div>
  );

  const severityColor = c.complaint.severity === 'Severe'
    ? 'from-red-400 to-rose-500 shadow-red-500/20'
    : c.complaint.severity === 'Moderate'
    ? 'from-amber-400 to-orange-500 shadow-amber-500/20'
    : 'from-emerald-400 to-teal-500 shadow-emerald-500/20';

  return (
    <>
      <Link to="/dashboard" className="mb-5 inline-flex items-center gap-1.5 text-sm text-emerald-800/70 hover:text-emerald-800 transition group">
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      {/* Patient Header */}
      <div className="card mb-8 overflow-hidden animate-fade-in">
        <div className={`h-1 bg-gradient-to-r ${severityColor}`} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white font-bold text-2xl shadow-xl shadow-emerald-500/20">
              {c.personal.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">{c.personal.name}</h1>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {[
                  c.personal.age && `${c.personal.age} yrs`,
                  c.personal.gender,
                  c.personal.blood,
                  new Date(c.savedAt || c.createdAt).toLocaleDateString(),
                ].filter(Boolean).map((tag, i) => (
                  <span key={i} className="badge bg-white/40 text-emerald-600/60">{tag}</span>
                ))}
              </div>
            </div>
            {c.complaint.severity && (
              <span className={`badge bg-gradient-to-r ${severityColor} text-white shadow-lg text-xs px-3 py-1.5`}>{c.complaint.severity}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1.5 overflow-x-auto rounded-2xl bg-white/30 p-1.5 animate-slide-up">
        {tabs.map(tab_ => (
          <button key={tab_.key} onClick={() => setTab(tab_.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              tab === tab_.key
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-emerald-800/70 hover:text-emerald-800 hover:bg-white/40'
            }`}>
            <tab_.icon size={16} /> {tab_.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in">
          <div className="card p-6">
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-emerald-900">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
                <User size={16} />
              </div>
              {t('case.patientInfo')}
            </h3>
            <Row label={t('reg.name')} value={c.personal.name} />
            <Row label={t('reg.age')} value={`${c.personal.age} yrs`} />
            <Row label={t('reg.gender')} value={c.personal.gender} />
            <Row label={t('reg.phone')} value={c.personal.phone} />
            <Row label={t('reg.email')} value={c.personal.email} />
            <Row label={t('reg.blood')} value={c.personal.blood} />
            <Row label={t('reg.occupation')} value={c.personal.occupation} />
            <Row label={t('reg.address')} value={c.personal.address} />
            <Row label={t('reg.emergency')} value={`${c.personal.emergencyName} — ${c.personal.emergencyPhone}`} />
          </div>
          <div className="card p-6">
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-emerald-900">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                <ClipboardList size={16} />
              </div>
              {t('case.history')}
            </h3>
            {['pastIllness','medications','allergies','familyHistory'].map(k => (
              <div key={k} className="mb-4">
                <p className="mb-1.5 text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{t(`reg.${k}`)}</p>
                {c.history[k].length > 0
                  ? <div className="flex flex-wrap gap-1.5">{c.history[k].map((v,i) => <span key={i} className="badge bg-white/50 text-emerald-700">{v}</span>)}</div>
                  : <p className="text-xs text-emerald-600/50 italic">None recorded</p>}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4">
              <Row label={t('reg.diet')} value={c.history.diet} />
              <Row label={t('reg.sleep')} value={c.history.sleep} />
              <Row label={t('reg.exercise')} value={c.history.exercise} />
              <Row label={t('reg.stress')} value={c.history.stress} />
            </div>
          </div>
        </div>
      )}

      {/* Complaint */}
      {tab === 'complaint' && (
        <div className="card p-6 animate-fade-in">
          <h3 className="mb-5 flex items-center gap-2.5 font-bold text-emerald-900">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Activity size={16} />
            </div>
            {t('case.complaint')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <Row label={t('reg.complaint')} value={c.complaint.primary} />
            <Row label={t('reg.duration')} value={c.complaint.duration} />
            <Row label={t('reg.severity')} value={c.complaint.severity} />
            <Row label={t('reg.location')} value={c.complaint.location} />
            <Row label={t('reg.nature')} value={c.complaint.nature} />
            <Row label={t('reg.aggravating')} value={c.complaint.aggravating} />
            <Row label={t('reg.relieving')} value={c.complaint.relieving} />
          </div>
          {c.complaint.symptoms.length > 0 && (
            <div className="mt-5 pt-5">
              <p className="mb-2.5 text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{t('reg.symptoms')}</p>
              <div className="flex flex-wrap gap-2">{c.complaint.symptoms.map((s,i) => <span key={i} className="badge bg-emerald-100/60 text-emerald-700">{s}</span>)}</div>
            </div>
          )}
        </div>
      )}

      {/* Ayurvedic */}
      {tab === 'ayurvedic' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-emerald-900">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/20">
                <Stethoscope size={16} />
              </div>
              {t('case.ayurvedic')}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Row label={t('reg.prakriti')} value={c.ayurvedic.prakriti} />
              <Row label={t('reg.vikriti')} value={c.ayurvedic.vikriti} />
            </div>

            <div className="rounded-2xl bg-white/30 p-6 mb-8">
              <div className="grid grid-cols-3 gap-6">
                {[['vata', t('reg.vata'), 'from-violet-500 to-violet-400', 'text-violet-600'],
                  ['pitta', t('reg.pitta'), 'from-orange-500 to-amber-400', 'text-orange-600'],
                  ['kapha', t('reg.kapha'), 'from-teal-500 to-emerald-400', 'text-teal-600']
                ].map(([k, label, gradient, textColor]) => (
                  <div key={k} className="text-center">
                    <div className={`mx-auto mb-2 grid h-16 w-16 place-items-center rounded-2xl text-xl font-extrabold bg-white/50 ${textColor}`}>{c.ayurvedic[k]}%</div>
                    <p className="mb-2 text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{label}</p>
                    <div className="h-3 rounded-full bg-white/30 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${c.ayurvedic[k]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h4 className="mb-4 font-bold text-emerald-900">Ashtavidha Pariksha</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[['nadi',t('case.nadiV'),Brain],['jihva',t('case.jihvaV'),Heart],['mootra',t('case.mootraV'),Pill],['mala',t('case.malaV'),Activity],
                ['shabda',t('case.shabdaV'),Activity],['sparsha',t('case.sparshaV'),Activity],['drik',t('case.drikV'),Activity],['akriti',t('case.akritiV'),Activity]
              ].map(([k, label, Icon]) => (
                <div key={k} className="rounded-2xl bg-white/30 p-4 hover:bg-white/50 transition-all duration-300 hover:scale-105">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon size={14} className="text-emerald-500" />
                    <p className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">{label}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-900">{c.ayurvedic[k] || '—'}</p>
                </div>
              ))}
            </div>

            {c.ayurvedic.notes && (
              <div className="mt-6 rounded-2xl bg-white/30 p-5">
                <p className="mb-2 text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{t('reg.notes')}</p>
                <p className="text-sm text-emerald-800/70 leading-relaxed">{c.ayurvedic.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diagnosis */}
      {tab === 'diagnosis' && (
        <div className="card p-6 animate-fade-in">
          <h3 className="mb-5 flex items-center gap-2.5 font-bold text-emerald-900">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-500/20">
              <FileText size={16} />
            </div>
            {t('case.diagnosis')}
          </h3>
          <label className="block mb-5">
            <span className="mb-1.5 block text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{t('case.diagnosis')}</span>
            <textarea className="input min-h-[120px] resize-y" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder={t('case.diagnosisP')} />
          </label>
          <label className="block mb-5">
            <span className="mb-1.5 block text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{t('case.instructions')}</span>
            <textarea className="input min-h-[100px] resize-y" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder={t('case.instructionsP')} />
          </label>
          <label className="block mb-6">
            <span className="mb-1.5 block text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{t('case.followUp')}</span>
            <input type="date" className="input max-w-xs" value={followUp} onChange={e => setFollowUp(e.target.value)} />
          </label>
          <button className="btn-primary group" onClick={() => {
            const scheduleUpdate = followUp ? { date: followUp, status: 'pending' } : {};
            updateCase(id, { diagnosis, instructions, followUp, progression: Math.min(100, (c.progression || 0) + 10), schedule: { ...c.schedule, ...scheduleUpdate } });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}>
            <Save size={16} /> {saved ? 'Saved!' : t('case.save')}
          </button>
        </div>
      )}
    </>
  );
}
