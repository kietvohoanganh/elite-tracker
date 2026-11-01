import { useEffect, useSyncExternalStore } from 'react';
import { createPageActivityStore } from '../utils/pageActivity';

export const pageActivity = createPageActivityStore(document, window);

export function usePageActive() {
  const active = useSyncExternalStore(pageActivity.subscribe, pageActivity.getSnapshot);
  useEffect(() => {
    document.documentElement.dataset.appActive = String(active);
  }, [active]);
  return active;
}
