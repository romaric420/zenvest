import React, { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { LOGO_PATH } from '../../config';

export default function WelcomeModal() {
  const { isRegistered, registerUser } = useProgress();
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isRegistered()) setShow(true);
  }, []); // eslint-disable-line

  if (!show || isRegistered()) return null;

  const submit = () => {
    if (name.trim().length >= 2) {
      registerUser(name.trim());
      setShow(false);
    }
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <img
          src={LOGO_PATH}
          alt="ZENVEST"
          className="welcome-modal__logo"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
        />
        <div className="welcome-modal__logo-fb" style={{ display: 'none' }}>Z</div>
        <h2>Bienvenue !</h2>
        <p>Votre plateforme de formation en trading & investissement. Entrez votre prenom pour commencer.</p>
        <input
          type="text"
          placeholder="Votre prenom..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
        <button onClick={submit} disabled={name.trim().length < 2}>Commencer l'aventure →</button>
      </div>
    </div>
  );
}
