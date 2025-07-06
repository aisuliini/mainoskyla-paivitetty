'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#3f704d] text-white p-4 text-sm flex flex-col md:flex-row items-center justify-between z-50">
      <p className="mb-2 md:mb-0">
        Käytämme evästeitä käyttökokemuksen parantamiseksi. Lue lisää tietosuojasta.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-white text-[#3f704d] px-4 py-2 rounded font-semibold hover:bg-gray-200"
      >
        Hyväksy evästeet
      </button>
    </div>
  );
}
