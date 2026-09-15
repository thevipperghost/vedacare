import { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import hi from './hi.json';
import gu from './gu.json';
import mr from './mr.json';
import kt from './kt.json';

const translations = { en, hi, gu, mr, kt };
const Ctx = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('pct-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('pct-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (path) => {
    let v = translations[lang];
    for (const k of path.split('.')) v = v?.[k];
    return v || path;
  };

  const languages = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'hi', label: 'हिन्दी', flag: 'HI' },
    { code: 'gu', label: 'ગુજરાતી', flag: 'GU' },
    { code: 'mr', label: 'मराठी', flag: 'MR' },
    { code: 'kt', label: 'કચ્છી', flag: 'KT' },
  ];

  return <Ctx.Provider value={{ lang, setLang, t, languages }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
