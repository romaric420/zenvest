import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ percent = 0, label, sublabel, variant = 'green' }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill ${variant === 'orange' ? 'progress-bar__fill--orange' : ''}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {(label || sublabel) && (
        <div className="progress-bar__label">
          <span>{label}</span>
          <span>{sublabel || `${percent}%`}</span>
        </div>
      )}
    </div>
  );
}
