// Share one set of lifecycle listeners across timers, data subscriptions and UI.
export function createPageActivityStore(page, host) {
  const subscribers = new Set();
  let pageHidden = false;
  const getSnapshot = () => !pageHidden && page.visibilityState !== 'hidden';
  const notify = () => subscribers.forEach(callback => callback());
  const hide = () => { pageHidden = true; notify(); };
  const show = () => { pageHidden = false; notify(); };
  const subscribe = (callback) => {
    if (!subscribers.size) {
      page.addEventListener('visibilitychange', notify);
      host.addEventListener('pagehide', hide);
      host.addEventListener('pageshow', show);
    }
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
      if (!subscribers.size) {
        page.removeEventListener('visibilitychange', notify);
        host.removeEventListener('pagehide', hide);
        host.removeEventListener('pageshow', show);
      }
    };
  };
  return { getSnapshot, subscribe };
}

export function startForegroundInterval(activity, tick, scheduler, intervalMs = 1000) {
  let interval;
  const stop = () => {
    if (interval !== undefined) scheduler.clearInterval(interval);
    interval = undefined;
  };
  const sync = () => {
    stop();
    if (!activity.getSnapshot()) return;
    tick(); // Recompute from the start timestamp; never count background ticks.
    interval = scheduler.setInterval(tick, intervalMs);
  };
  const unsubscribe = activity.subscribe(sync);
  sync();
  return () => { stop(); unsubscribe(); };
}
