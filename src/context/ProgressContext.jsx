import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'zenvest_progress_v2';
const CODES = { courses: 'Zenvest33', simBasic: 'Zenvest15', simAdvanced: 'Zenvest30' };

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
    return { completed: {}, unlocked: { courses: false, simBasic: false, simAdvanced: false } };
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  const isCompleted = (id) => !!state.completed[id];
  const markComplete = (id) => setState(prev => ({ ...prev, completed: { ...prev.completed, [id]: true } }));
  const isUnlocked = (key) => !!state.unlocked[key];

  const unlock = (key, code) => {
    if (CODES[key] && code === CODES[key]) {
      setState(prev => ({ ...prev, unlocked: { ...prev.unlocked, [key]: true } }));
      return true;
    }
    return false;
  };

  const getProgress = (courseId, modules) => {
    if (!modules || modules.length === 0) return 0;
    const done = modules.filter(m => state.completed[`${courseId}-${m.id}`]).length;
    return Math.round((done / modules.length) * 100);
  };

  const canAccess = (courseId, moduleIndex, modules) => {
    if (moduleIndex === 0) return true; // intro always accessible
    if (!state.unlocked.courses) return false;
    // Must complete previous module
    const prev = modules[moduleIndex - 1];
    return !!state.completed[`${courseId}-${prev.id}`];
  };

  return (
    <ProgressContext.Provider value={{ isCompleted, markComplete, isUnlocked, unlock, getProgress, canAccess }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
