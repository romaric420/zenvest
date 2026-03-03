import React, { createContext, useContext, useState, useEffect } from 'react';
import { CODES } from '../config';

const ProgressContext = createContext();
const STORE_KEY = 'zenvest_progress_v3';
const USER_KEY = 'zenvest_user_v1';

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    try { const s = localStorage.getItem(STORE_KEY); if (s) return JSON.parse(s); } catch { }
    return { completed: {}, unlocked: { courses: false, simBasic: false, simAdvanced: false } };
  });
  const [user, setUser] = useState(() => {
    try { const u = localStorage.getItem(USER_KEY); if (u) return JSON.parse(u); } catch { }
    return { name: '', registered: false };
  });

  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { localStorage.setItem(USER_KEY, JSON.stringify(user)); }, [user]);

  const registerUser = (name) => { setUser({ name, registered: true }); };
  const isRegistered = () => user.registered && user.name;
  const getUserName = () => user.name || '';

  const unlock = (key, code) => {
    if (CODES[key] && code === CODES[key]) {
      setState(prev => ({ ...prev, unlocked: { ...prev.unlocked, [key]: true } }));
      return true;
    }
    return false;
  };
  const isUnlocked = (key) => state.unlocked[key] || false;
  const markComplete = (id) => { setState(prev => ({ ...prev, completed: { ...prev.completed, [id]: true } })); };
  const isCompleted = (id) => state.completed[id] || false;
  const canAccess = (courseId, moduleIndex, modules) => {
    if (moduleIndex === 0) return true;
    if (!isUnlocked('courses')) return false;
    const prev = modules[moduleIndex - 1];
    return prev && isCompleted(prev.id);
  };
  const getProgress = (courseId, modules) => {
    if (!modules || !modules.length) return 0;
    const done = modules.filter(m => isCompleted(m.id)).length;
    return Math.round((done / modules.length) * 100);
  };

  return (
    <ProgressContext.Provider value={{ ...state, unlock, isUnlocked, markComplete, isCompleted, canAccess, getProgress, registerUser, isRegistered, getUserName }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
