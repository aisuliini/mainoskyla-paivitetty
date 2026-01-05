'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setVisible(false);
    // tänne voisi laittaa esim. Google Analytic
  };

  const declineAll = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
<div
  className="fixed inset-x-0 bottom-0 bg-[#3f704d] text-white p-4 text-sm flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 z-50"
  style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
>
      <p>
        Käytämme evästeitä käyttökokemuksen parantamiseksi.{' '}
        <Link href="/tietosuoja" className="underline text-white hover:text-gray-200">
          Lue lisää tietosuojasta
        </Link>.
      </p>
      <div className="flex gap-2">
        <button
          onClick={declineAll}
          className="bg-white text-[#3f704d] px-3 py-1 rounded"
        >
          Salli vain välttämättömät
        </button>
        <button
          onClick={acceptAll}
          className="bg-white text-[#3f704d] px-3 py-1 rounded font-semibold"
        >
          Hyväksy kaikki
        </button>
      </div>
    </div>
  );
}
