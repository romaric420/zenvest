import React from 'react';
import { Check, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import './ModuleList.css';

export default function ModuleList({ modules, activeModuleId, onSelect }) {
  const { t } = useLanguage();
  const { isCompleted, isUnlocked } = useProgress();

  return (
    <ul className="module-list">
      {modules.map((mod, idx) => {
        const completed = isCompleted(mod.id);
        const unlocked = isUnlocked(mod.id, modules);
        const active = mod.id === activeModuleId;

        return (
          <li
            key={mod.id}
            className={`module-list__item ${active ? 'module-list__item--active' : ''} ${completed ? 'module-list__item--completed' : ''} ${!unlocked ? 'module-list__item--locked' : ''}`}
            onClick={() => unlocked && onSelect(mod.id)}
          >
            <div className="module-list__status">
              {completed ? <Check size={16} /> : !unlocked ? <Lock size={14} /> : idx + 1}
            </div>
            <div className="module-list__info">
              <div className="module-list__title">{mod.title}</div>
              <div className="module-list__meta">
                <span className={`module-list__level module-list__level--${mod.level}`}>
                  {mod.level}
                </span>
                <span>{mod.duration}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
