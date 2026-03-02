import React, { createContext, useContext, useState, useCallback } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ta_progress') || '[]');
    } catch { return []; }
  });

  const save = (data) => {
    localStorage.setItem('ta_progress', JSON.stringify(data));
  };

  const completeModule = useCallback((moduleId) => {
    setCompleted(prev => {
      if (prev.includes(moduleId)) return prev;
      const next = [...prev, moduleId];
      save(next);
      return next;
    });
  }, []);

  const isCompleted = useCallback((moduleId) => {
    return completed.includes(moduleId);
  }, [completed]);

  const isUnlocked = useCallback((moduleId, modules) => {
    const idx = modules.findIndex(m => m.id === moduleId);
    if (idx === 0) return true;
    return completed.includes(modules[idx - 1].id);
  }, [completed]);

  const getProgress = useCallback((modules) => {
    const done = modules.filter(m => completed.includes(m.id)).length;
    return { done, total: modules.length, percent: Math.round((done / modules.length) * 100) };
  }, [completed]);

  const resetProgress = useCallback(() => {
    setCompleted([]);
    localStorage.removeItem('ta_progress');
  }, []);

  return (
    <ProgressContext.Provider value={{ completed, completeModule, isCompleted, isUnlocked, getProgress, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
