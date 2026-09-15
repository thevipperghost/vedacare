import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserPlus, LayoutDashboard, Calendar, Globe, Menu, X, LogOut, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';

export default function Layout() {
  const { t, lang, setLang, languages } = useLang();
  const { user, logout } = useStore();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => { logout(); nav('/login'); };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/register', icon: UserPlus, label: t('nav.register') },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/30 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-2 text-emerald-600/60 hover:bg-white/50 transition md:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/25">
                <Leaf size={20} className="text-white" />
              </div>
              <div className="hidden sm:flex sm:flex-col sm:justify-center">
                <p className="font-bold text-emerald-900 leading-none text-sm">Vedacare</p>
              </div>
            </NavLink>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-emerald-600/60 hover:text-emerald-800 hover:bg-white/40'
                }`}>
                <l.icon size={16} /> {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-xl bg-white/50 px-3 py-2 text-xs font-medium text-emerald-600/70 hover:bg-white/70 hover:text-emerald-800 transition-all">
                <Globe size={14} /> {languages.find(l => l.code === lang)?.flag}
              </button>
              {langOpen && <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white/80 backdrop-blur-2xl py-2 shadow-xl z-50">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition ${lang === l.code ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-emerald-700/60 hover:bg-emerald-50/40'}`}>
                      <span className="w-7 text-center text-[10px] font-bold rounded-lg bg-emerald-100 py-1">{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              </>}
            </div>

            <div className="hidden items-center gap-3 pl-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-900 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-emerald-500/60 capitalize font-medium">{user?.role}</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                {user?.name?.charAt(0)}
              </div>
              <button onClick={handleLogout} title="Logout"
                className="rounded-xl p-2.5 text-emerald-700/60 hover:bg-red-50 hover:text-red-500 transition-all">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="bg-white/40 backdrop-blur-2xl px-4 py-3 md:hidden animate-slide-up">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-emerald-600/60 hover:bg-white/40'}`}>
                <l.icon size={16} /> {l.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50/50">
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 animate-fade-in"><Outlet /></main>

      <footer className="py-6 text-center text-xs text-emerald-700/60 font-medium">
        <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-bold">Vedacare</span>
      </footer>
    </div>
  );
}
