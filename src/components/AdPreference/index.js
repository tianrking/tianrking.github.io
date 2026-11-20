import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

const PREFERENCE_KEY = 'w0x7ce.ads.enabled';
const SCRIPT_ID = 'site-adsense-script';
const SCRIPT_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8741919641227561';
const AdPreferenceContext = createContext(null);

function readPreference() {
  try {
    return window.localStorage.getItem(PREFERENCE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AdPreferenceProvider({children}) {
  const [enabled, setEnabled] = useState(null);
  const initializedAds = useRef(false);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === PREFERENCE_KEY || event.key === null) {
        setEnabled(readPreference());
      }
    }

    function onPageShow(event) {
      if (event.persisted) {
        setEnabled(readPreference());
      }
    }

    window.addEventListener('storage', onStorage);
    window.addEventListener('pageshow', onPageShow);
    setEnabled(readPreference());
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  useEffect(() => {
    if (enabled === null) {
      return;
    }

    const script = document.getElementById(SCRIPT_ID);
    if (!enabled) {
      if (initializedAds.current) {
        // A new document unloads the vendor's existing frames and listeners.
        window.location.reload();
      }
      return;
    }

    initializedAds.current = true;
    if (!script) {
      const loader = document.createElement('script');
      loader.id = SCRIPT_ID;
      loader.src = SCRIPT_URL;
      loader.async = true;
      loader.crossOrigin = 'anonymous';
      document.head.appendChild(loader);
    }
  }, [enabled]);

  function togglePreference() {
    const next = !enabled;
    try {
      if (next) {
        window.localStorage.setItem(PREFERENCE_KEY, 'true');
      } else {
        window.localStorage.removeItem(PREFERENCE_KEY);
      }
    } catch {
      // Keep the control usable in this document if storage is blocked.
    }
    setEnabled(next);
  }

  return (
    <AdPreferenceContext.Provider value={{enabled, togglePreference}}>
      {children}
    </AdPreferenceContext.Provider>
  );
}

export default function NavbarAdSwitch({mobile}) {
  const {enabled, togglePreference} = useContext(AdPreferenceContext);

  if (mobile) {
    return null;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-label="廣告"
      aria-checked={enabled === true}
      disabled={enabled === null}
      className={styles.button}
      title={enabled ? '關閉廣告' : '允許顯示 Google 廣告'}
      onClick={togglePreference}>
      <span aria-hidden="true">廣告</span>
      <span className={styles.track} aria-hidden="true" />
    </button>
  );
}
