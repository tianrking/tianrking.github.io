import React from 'react';
import {AdPreferenceProvider} from '@site/src/components/AdPreference';

export default function Root({children}) {
  return <AdPreferenceProvider>{children}</AdPreferenceProvider>;
}
