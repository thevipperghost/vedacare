import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const blankCase = () => ({
  id: `c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
  createdAt: new Date().toISOString(),
  step: 1,
  personal: { name:'', age:'', gender:'Male', phone:'', email:'', blood:'O+', occupation:'', address:'', emergencyName:'', emergencyPhone:'' },
  complaint: { primary:'', duration:'', severity:'Moderate', location:'', nature:'', aggravating:'', relieving:'', symptoms:[] },
  history: { pastIllness:[], medications:[], allergies:[], familyHistory:[], diet:'', sleep:'', exercise:'', stress:'', bowel:'' },
  ayurvedic: { prakriti:'', vikriti:'', vata:0, pitta:0, kapha:0, nadi:'', jihva:'', mootra:'', mala:'', shabda:'', sparsha:'', drik:'', akriti:'', notes:'' },
  diagnosis: '',
  instructions: '',
  followUp: '',
  schedule: { date: '', time: '', status: 'pending', notes: '' },
  progression: 0,
});

const USERS = {
  'admin@ayur.com': { name: 'Dr. Priya Sharma', role: 'admin', password: 'admin123' },
  'doctor@ayur.com': { name: 'Dr. Rajesh Vaidya', role: 'doctor', password: 'doctor123' },
};

export const useStore = create(
  persist((set, get) => ({
    user: null,
    isLoggedIn: false,
    loginError: '',
    login: (email, password) => {
      const u = USERS[email];
      if (!u) { set({ loginError: 'No account found with this email' }); return false; }
      if (u.password !== password) { set({ loginError: 'Incorrect password' }); return false; }
      set({ user: { email, name: u.name, role: u.role }, isLoggedIn: true, loginError: '' });
      return true;
    },
    logout: () => set({ user: null, isLoggedIn: false, loginError: '' }),
    clearLoginError: () => set({ loginError: '' }),

    cases: [],
    active: blankCase(),
    voiceTranscript: '',
    extractedSymptoms: [],

    setPersonal: (k, v) => set(s => ({ active: { ...s.active, personal: { ...s.active.personal, [k]: v } } })),
    setComplaint: (k, v) => set(s => ({ active: { ...s.active, complaint: { ...s.active.complaint, [k]: v } } })),
    addSymptom: (sym) => set(s => ({ active: { ...s.active, complaint: { ...s.active.complaint, symptoms: [...s.active.complaint.symptoms, sym] } } })),
    removeSymptom: (i) => set(s => ({ active: { ...s.active, complaint: { ...s.active.complaint, symptoms: s.active.complaint.symptoms.filter((_,idx) => idx !== i) } } })),
    setHistory: (k, v) => set(s => ({ active: { ...s.active, history: { ...s.active.history, [k]: v } } })),
    addHistoryItem: (k, v) => set(s => ({ active: { ...s.active, history: { ...s.active.history, [k]: [...s.active.history[k], v] } } })),
    removeHistoryItem: (k, i) => set(s => ({ active: { ...s.active, history: { ...s.active.history, [k]: s.active.history[k].filter((_,idx) => idx !== i) } } })),
    setAyurvedic: (k, v) => set(s => ({ active: { ...s.active, ayurvedic: { ...s.active.ayurvedic, [k]: v } } })),
    setDiagnosis: (v) => set(s => ({ active: { ...s.active, diagnosis: v } })),
    setInstructions: (v) => set(s => ({ active: { ...s.active, instructions: v } })),
    setFollowUp: (v) => set(s => ({ active: { ...s.active, followUp: v } })),
    setStep: (n) => set(s => ({ active: { ...s.active, step: n } })),
    setVoiceTranscript: (t) => set({ voiceTranscript: t }),
    setExtractedSymptoms: (s) => set({ extractedSymptoms: s }),
    setSchedule: (k, v) => set(s => ({ active: { ...s.active, schedule: { ...s.active.schedule, [k]: v } } })),
    setProgression: (v) => set(s => ({ active: { ...s.active, progression: v } })),
    applySymptoms: () => {
      const { extractedSymptoms, active } = get();
      if (!extractedSymptoms.length) return;
      set({ active: {
        ...active,
        complaint: {
          ...active.complaint,
          primary: active.complaint.primary || extractedSymptoms[0],
          symptoms: [...active.complaint.symptoms, ...extractedSymptoms.slice(1)],
        }
      }, extractedSymptoms: [], voiceTranscript: '' });
    },
    saveCase: () => set(s => ({ cases: [{ ...s.active, savedAt: new Date().toISOString() }, ...s.cases], active: blankCase() })),
    deleteCase: (id) => set(s => ({ cases: s.cases.filter(c => c.id !== id) })),
    updateCase: (id, updates) => set(s => ({ cases: s.cases.map(c => c.id === id ? { ...c, ...updates } : c) })),
    reset: () => set({ active: blankCase() }),
  }), { name: 'pct-store', version: 4 })
);
