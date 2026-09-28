import React, {useEffect} from 'react';

const ADSENSE_SCRIPT_ID = 'site-adsense-script';
const ADSENSE_SCRIPT_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8741919641227561';

export default function Root({children}) {
  useEffect(() => {
    if (document.getElementById(ADSENSE_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.src = ADSENSE_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);

  return <>{children}</>;
}
