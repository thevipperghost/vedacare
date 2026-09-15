import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Save, Plus, X, Check, Stethoscope, User, Activity, ClipboardList, Calendar, Clock } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';
import VoiceAssistant from '../components/VoiceAssistant.jsx';

const STEPS = [
  { key: 'reg.step1', icon: User, gradient: 'from-blue-400 to-indigo-500' },
  { key: 'reg.step2', icon: Activity, gradient: 'from-amber-400 to-orange-500' },
  { key: 'reg.step3', icon: ClipboardList, gradient: 'from-emerald-400 to-teal-500' },
  { key: 'reg.step4', icon: Stethoscope, gradient: 'from-green-400 to-emerald-500' },
];

function Input({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">{label} {required && <span className="text-red-400">*</span>}</span>
      <input type={type} className="input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </label>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">{label}</span>
      <select className="input" value={value} onChange={e => onChange(e.target.value)}>{children}</select>
    </label>
  );
}

export default function RegisterPage() {
  const { t } = useLang();
  const nav = useNavigate();
  const { active, setStep, setPersonal, setComplaint, addSymptom, removeSymptom,
    setHistory, addHistoryItem, removeHistoryItem, setAyurvedic, setSchedule, setProgression, saveCase } = useStore();
  const [newSym, setNewSym] = useState('');
  const [newItem, setNewItem] = useState('');
  const [listTarget, setListTarget] = useState('pastIllness');
  const [showSuccess, setShowSuccess] = useState(false);

  const s = active.step;

  const handleSave = () => { saveCase(); setShowSuccess(true); setTimeout(() => nav('/dashboard'), 1500); };

  if (showSuccess) {
    return (
      <div className="card mx-auto max-w-lg p-14 text-center ">
        <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-2xl shadow-emerald-500/30">
          <Check size={44} strokeWidth={3} />
        </div>
        <h2 className="mb-2 text-3xl font-extrabold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">{t('reg.success')}</h2>
        <p className="text-sm text-emerald-700/60">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent">{t('reg.title')}</h1>
        <p className="mt-1.5 text-sm text-emerald-800/70">Complete all steps to register a new patient case</p>
      </div>

      {/* Steps indicator */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = s === i + 1;
          const isDone = s > i + 1;
          return (
            <button key={i} onClick={() => setStep(i + 1)}
              className={`relative overflow-hidden flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                isActive ? `bg-gradient-to-r ${step.gradient} text-white shadow-xl shadow-emerald-500/20 scale-[1.02]` :
                isDone ? 'bg-white/60 text-emerald-700 hover:bg-white/70' :
                'bg-white/30 text-emerald-700/60 hover:bg-white/40'
              }`}>
              <div className={`relative grid h-8 w-8 place-items-center rounded-xl text-xs font-bold ${
                isActive ? 'bg-white/20' : isDone ? 'bg-emerald-100/60 text-emerald-600' : 'bg-white/20 text-emerald-600/60'
              }`}>
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span className="relative hidden sm:inline">{t(step.key)}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1 */}
      {s === 1 && (
        <div className="card p-8 ">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/20"><User size={22} /></div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{t('reg.step1')}</h2>
              <p className="text-xs text-emerald-700/60">Basic patient demographics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Input label={t('reg.name')} value={active.personal.name} onChange={v => setPersonal('name', v)} placeholder={t('reg.nameP')} required />
            <Input label={t('reg.age')} value={active.personal.age} onChange={v => setPersonal('age', v)} type="number" />
            <Select label={t('reg.gender')} value={active.personal.gender} onChange={v => setPersonal('gender', v)}>
              <option>{t('reg.male')}</option><option>{t('reg.female')}</option><option>{t('reg.other')}</option>
            </Select>
            <Input label={t('reg.phone')} value={active.personal.phone} onChange={v => setPersonal('phone', v)} type="tel" required />
            <Input label={t('reg.email')} value={active.personal.email} onChange={v => setPersonal('email', v)} type="email" />
            <Select label={t('reg.blood')} value={active.personal.blood} onChange={v => setPersonal('blood', v)}>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
            </Select>
            <Input label={t('reg.occupation')} value={active.personal.occupation} onChange={v => setPersonal('occupation', v)} />
            <Input label={t('reg.address')} value={active.personal.address} onChange={v => setPersonal('address', v)} />
            <Input label={t('reg.emergencyName')} value={active.personal.emergencyName} onChange={v => setPersonal('emergencyName', v)} />
            <Input label={t('reg.emergencyPhone')} value={active.personal.emergencyPhone} onChange={v => setPersonal('emergencyPhone', v)} type="tel" />
          </div>
        </div>
      )}

      {/* Step 2 */}
      {s === 2 && (
        <div className="card p-8 ">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20"><Activity size={22} /></div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{t('reg.step2')}</h2>
              <p className="text-xs text-emerald-700/60">Current symptoms and complaints</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label={t('reg.complaint')} value={active.complaint.primary} onChange={v => setComplaint('primary', v)} placeholder={t('reg.complaintP')} required />
            </div>
            <Input label={t('reg.duration')} value={active.complaint.duration} onChange={v => setComplaint('duration', v)} placeholder={t('reg.durationP')} />
            <Select label={t('reg.severity')} value={active.complaint.severity} onChange={v => setComplaint('severity', v)}>
              <option value="Mild">{t('reg.mild')}</option>
              <option value="Moderate">{t('reg.moderate')}</option>
              <option value="Severe">{t('reg.severe')}</option>
            </Select>
            <Input label={t('reg.location')} value={active.complaint.location} onChange={v => setComplaint('location', v)} placeholder={t('reg.locationP')} />
            <Input label={t('reg.nature')} value={active.complaint.nature} onChange={v => setComplaint('nature', v)} placeholder={t('reg.natureP')} />
            <Input label={t('reg.aggravating')} value={active.complaint.aggravating} onChange={v => setComplaint('aggravating', v)} />
            <Input label={t('reg.relieving')} value={active.complaint.relieving} onChange={v => setComplaint('relieving', v)} />

            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">{t('reg.symptoms')}</span>
              <div className="flex gap-2">
                <input className="input flex-1" value={newSym} onChange={e => setNewSym(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newSym.trim()) { addSymptom(newSym.trim()); setNewSym(''); } }}
                  placeholder={t('reg.addSymptom')} />
                <button className="btn-primary" onClick={() => { if (newSym.trim()) { addSymptom(newSym.trim()); setNewSym(''); } }}><Plus size={16} /></button>
              </div>
              {active.complaint.symptoms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.complaint.symptoms.map((sym, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/60 text-emerald-700 px-3 py-1.5 text-xs font-semibold">
                      {sym}
                      <button onClick={() => removeSymptom(i)} className="rounded-full p-0.5 hover:bg-red-100 hover:text-red-500 transition"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {s === 3 && (
        <div className="card p-8 ">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/20"><ClipboardList size={22} /></div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{t('reg.step3')}</h2>
              <p className="text-xs text-emerald-700/60">Past history and lifestyle</p>
            </div>
          </div>

          {[
            { key: 'pastIllness', label: t('reg.pastIllness') },
            { key: 'medications', label: t('reg.medications') },
            { key: 'allergies', label: t('reg.allergies') },
            { key: 'familyHistory', label: t('reg.familyHistory') },
          ].map(({ key, label }) => (
            <div key={key} className="mb-5">
              <p className="mb-2 text-sm font-bold text-emerald-800">{label}</p>
              <div className="flex gap-2">
                <input className="input flex-1" value={listTarget === key ? newItem : ''} onChange={e => { setListTarget(key); setNewItem(e.target.value); }}
                  onKeyDown={e => { if (e.key === 'Enter' && newItem.trim()) { addHistoryItem(key, newItem.trim()); setNewItem(''); } }}
                  placeholder={`Add ${label}...`} />
                <button className="btn-outline" onClick={() => { if (newItem.trim()) { addHistoryItem(key, newItem.trim()); setNewItem(''); } }}>{t('common.add')}</button>
              </div>
              {active.history[key].length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {active.history[key].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-white/60 text-emerald-800 px-3 py-1.5 text-xs font-medium">
                      {item}
                      <button onClick={() => removeHistoryItem(key, i)} className="rounded-full p-0.5 hover:bg-red-100 hover:text-red-500 transition"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <p className="mb-3 mt-6 text-sm font-bold text-emerald-800 pt-5">Lifestyle</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Input label={t('reg.diet')} value={active.history.diet} onChange={v => setHistory('diet', v)} placeholder="e.g. Vegetarian" />
            <Input label={t('reg.sleep')} value={active.history.sleep} onChange={v => setHistory('sleep', v)} placeholder="e.g. 7 hours" />
            <Input label={t('reg.exercise')} value={active.history.exercise} onChange={v => setHistory('exercise', v)} placeholder="e.g. Daily walk" />
            <Input label={t('reg.stress')} value={active.history.stress} onChange={v => setHistory('stress', v)} placeholder="e.g. Low / Medium / High" />
            <Input label={t('reg.bowel')} value={active.history.bowel} onChange={v => setHistory('bowel', v)} placeholder="e.g. Regular" />
          </div>
        </div>
      )}

      {/* Step 4 */}
      {s === 4 && (
        <div className="card p-8 ">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/20"><Stethoscope size={22} /></div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{t('reg.step4')}</h2>
              <p className="text-xs text-emerald-700/60">Prakriti, Vikriti & Ashtavidha Pariksha</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
            <Select label={t('reg.prakriti')} value={active.ayurvedic.prakriti} onChange={v => setAyurvedic('prakriti', v)}>
              <option value="">Select constitution</option>
              {['Vata','Pitta','Kapha','Vata-Pitta','Pitta-Kapha','Vata-Kapha','Tridosha'].map(d => <option key={d}>{d}</option>)}
            </Select>
            <Select label={t('reg.vikriti')} value={active.ayurvedic.vikriti} onChange={v => setAyurvedic('vikriti', v)}>
              <option value="">Select imbalance</option>
              {['Vata','Pitta','Kapha','Vata-Pitta','Pitta-Kapha','Vata-Kapha','Tridosha'].map(d => <option key={d}>{d}</option>)}
            </Select>
          </div>

          {/* Dosha */}
          <div className="rounded-2xl bg-white/30 p-6 mb-8">
            <p className="mb-4 text-sm font-bold text-emerald-800">{t('reg.ashtavidha')}</p>
            <div className="grid grid-cols-3 gap-6">
              {[['vata', t('reg.vata'), 'from-violet-500 to-violet-400', 'text-violet-600'],
                ['pitta', t('reg.pitta'), 'from-orange-500 to-amber-400', 'text-orange-600'],
                ['kapha', t('reg.kapha'), 'from-teal-500 to-emerald-400', 'text-teal-600']
              ].map(([k, label, gradient, textColor]) => (
                <div key={k} className="text-center">
                  <div className={`mx-auto mb-2 grid h-20 w-20 place-items-center rounded-2xl text-2xl font-extrabold bg-white/50 ${textColor}`}>
                    {active.ayurvedic[k]}%
                  </div>
                  <p className="mb-2 text-xs font-bold text-emerald-700/60 uppercase tracking-wider">{label}</p>
                  <input type="range" min="0" max="100" value={active.ayurvedic[k]}
                    onChange={e => setAyurvedic(k, parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-2 rounded-full cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <p className="mb-4 text-sm font-bold text-emerald-800">Ashtavidha Pariksha</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[['nadi',t('reg.nadi')],['jihva',t('reg.jihva')],['mootra',t('reg.mootra')],['mala',t('reg.mala')],
              ['shabda',t('reg.shabda')],['sparsha',t('reg.sparsha')],['drik',t('reg.drik')],['akriti',t('reg.akriti')]
            ].map(([k, label]) => (
              <Input key={k} label={label} value={active.ayurvedic[k]} onChange={v => setAyurvedic(k, v)} />
            ))}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">{t('reg.notes')}</span>
            <textarea className="input min-h-[100px] resize-y" value={active.ayurvedic.notes} onChange={e => setAyurvedic('notes', e.target.value)} placeholder={t('reg.notesP')} />
          </label>

          {/* Schedule */}
          <div className="mt-6 rounded-2xl bg-white/40 p-5">
            <p className="mb-4 text-sm font-bold text-emerald-800 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" /> Appointment Schedule
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">Date</span>
                <input type="date" className="input" value={active.schedule.date} onChange={e => setSchedule('date', e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">Time</span>
                <select className="input" value={active.schedule.time} onChange={e => setSchedule('time', e.target.value)}>
                  <option value="">Select time</option>
                  {['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Progression */}
          <div className="mt-5 rounded-2xl bg-white/40 p-5">
            <p className="mb-3 text-sm font-bold text-emerald-800 flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" /> Treatment Progression
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 rounded-full bg-white/30 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700" style={{ width: `${active.progression}%` }} />
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/60 text-sm font-extrabold text-emerald-700">
                {active.progression}%
              </div>
            </div>
            <p className="mt-2 text-[10px] font-bold text-emerald-600/50 uppercase tracking-wider text-center">Auto-updates after each session</p>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-6 flex justify-between">
        <button className="btn-ghost group" onClick={() => setStep(Math.max(1, s - 1))} disabled={s === 1}>
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> {t('common.back')}
        </button>
        {s < 4 ? (
          <button className="btn-primary group" onClick={() => setStep(s + 1)}>
            {t('common.next')} <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <button className="btn-primary group" onClick={handleSave}>
            <Save size={16} /> {t('reg.submit')}
          </button>
        )}
      </div>

      <VoiceAssistant />
    </>
  );
}
