import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Leaf } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';

export default function LoginPage() {
  const { t } = useLang();
  const { login, loginError, clearLoginError } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login(email, password); setLoading(false); }, 500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding */}
      <div className="hidden flex-1 items-center justify-center p-12 lg:flex relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10" />
        <div className="absolute top-20 left-20 h-80 w-80 rounded-full bg-emerald-400/15 blur-[100px]" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-green-400/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/8 blur-[80px]" />

        <div className="relative max-w-md text-center text-emerald-900">
          <div className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-2xl shadow-emerald-500/30">
            <Leaf size={48} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="mb-4 text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent">{t('app.name')}</h1>
          <div className="mt-14 grid grid-cols-3 gap-5">
            {[
              { n: '5', l: 'Languages' },
              { n: '8', l: 'Pariksha' },
              { n: '100%', l: 'Ayurvedic' },
            ].map(({ n, l }) => (
              <div key={l} className="rounded-2xl bg-white/40 backdrop-blur px-5 py-5 hover:bg-white/60 transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{n}</p>
                <p className="mt-1 text-[11px] text-emerald-700/60 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-400/8 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-green-400/8 blur-[60px]" />

        <div className="w-full max-w-md animate-fade-in relative">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-xl shadow-emerald-500/25">
              <Leaf size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-bold text-emerald-900">{t('app.name')}</p>
            </div>
          </div>

          <h2 className="mb-2 text-4xl font-extrabold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">Welcome back</h2>
          <p className="mb-8 text-sm text-emerald-800/70">Sign in to access the case management system</p>

          {loginError && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-red-50/60 px-5 py-4 text-sm text-red-600 animate-slide-up">
              <AlertCircle size={18} /> {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50" />
                <input type="email" required value={email} onChange={e => { clearLoginError(); setEmail(e.target.value); }}
                  className="input pl-12" placeholder="doctor@ayur.com" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-emerald-800/70 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50" />
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => { clearLoginError(); setPassword(e.target.value); }}
                  className="input pl-12 pr-12" placeholder="Enter password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600/50 hover:text-emerald-600 transition">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base group">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" style={{borderColor:'rgba(255,255,255,0.3)', borderTopColor:'transparent'}} />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-2xl bg-white/40 backdrop-blur p-5">
            <p className="mb-3 text-xs font-bold text-emerald-600/60 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2.5">
                <span className="font-semibold text-emerald-800">Doctor</span>
                <code className="text-xs text-emerald-700/60 font-mono">doctor@ayur.com / doctor123</code>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2.5">
                <span className="font-semibold text-emerald-800">Admin</span>
                <code className="text-xs text-emerald-700/60 font-mono">admin@ayur.com / admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
