import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageActivityStore, startForegroundInterval } from './pageActivity.js';

function setup() {
  const page = new EventTarget();
  page.visibilityState = 'visible';
  const host = new EventTarget();
  const activity = createPageActivityStore(page, host);
  const intervals = new Map();
  let id = 0;
  const scheduler = {
    setInterval: callback => { intervals.set(++id, callback); return id; },
    clearInterval: key => intervals.delete(key),
  };
  const visibility = value => {
    page.visibilityState = value;
    page.dispatchEvent(new Event('visibilitychange'));
  };
  return { page, host, activity, intervals, scheduler, visibility };
}

test('timer sleeps in background and catches up from the original start time', () => {
  const { activity, intervals, scheduler, visibility } = setup();
  let now = 1000;
  const readings = [];
  const stop = startForegroundInterval(activity, () => readings.push(Math.floor(now / 1000)), scheduler);
  assert.deepEqual(readings, [1]);
  assert.equal(intervals.size, 1);
  visibility('hidden');
  assert.equal(intervals.size, 0);
  now += 3600000;
  assert.deepEqual(readings, [1]);
  visibility('visible');
  assert.deepEqual(readings, [1, 3601]);
  assert.equal(intervals.size, 1);
  visibility('visible');
  assert.equal(intervals.size, 1, 'duplicate lifecycle events do not accumulate timers');
  stop();
  assert.equal(intervals.size, 0);
  visibility('hidden');
  visibility('visible');
  assert.equal(intervals.size, 0, 'unmounted timers stay stopped');
});

test('pagehide/pageshow and initially hidden pages suspend work', () => {
  const { activity, host, intervals, scheduler, visibility } = setup();
  visibility('hidden');
  const stop = startForegroundInterval(activity, () => {}, scheduler);
  assert.equal(intervals.size, 0);
  visibility('visible');
  assert.equal(intervals.size, 1);
  host.dispatchEvent(new Event('pagehide'));
  assert.equal(activity.getSnapshot(), false);
  assert.equal(intervals.size, 0);
  host.dispatchEvent(new Event('pageshow'));
  assert.equal(activity.getSnapshot(), true);
  assert.equal(intervals.size, 1);
  stop();
});

test('one consumer can unsubscribe without stopping the others', () => {
  const { activity, visibility } = setup();
  let first = 0;
  let second = 0;
  const unsubscribeFirst = activity.subscribe(() => first++);
  const unsubscribeSecond = activity.subscribe(() => second++);
  unsubscribeFirst();
  visibility('hidden');
  assert.equal(first, 0);
  assert.equal(second, 1);
  unsubscribeSecond();
  visibility('visible');
  assert.equal(second, 1);
});
