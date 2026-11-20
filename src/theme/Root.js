import React from 'react';
import {AdPreferenceProvider} from '@site/src/components/AdPreference';
import ReadingNavigator from '@site/src/components/ReadingNavigator';

export default function Root({children}) {
  return <AdPreferenceProvider>{children}<ReadingNavigator /></AdPreferenceProvider>;
}
