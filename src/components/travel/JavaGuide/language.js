import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';

// Query-driven and shareable. The first browser render matches the static page.
export default function useGuideLanguage() {
  const location = useLocation();
  const isBrowser = useIsBrowser();
  return isBrowser && new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
}
