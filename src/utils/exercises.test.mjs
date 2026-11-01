import test from 'node:test';
import assert from 'node:assert/strict';
import { getPreviousSetSummaries } from './exercises.js';

test('previous sets use the latest session for each exercise, not an older personal best', () => {
  const history = [
    { data: { Squat: [{ weight: '80', reps: '8' }, { weight: '85', reps: '6' }], Empty: [] } },
    { data: { Squat: [{ weight: '100', reps: '5' }], Row: [{ weight: '40', reps: '10' }] } },
  ];
  const before = JSON.stringify(history);
  const result = getPreviousSetSummaries(history);
  assert.equal(result.Squat, '85kg x 6');
  assert.equal(result.Row, '40kg x 10');
  assert.equal(result.Empty, undefined);
  assert.equal(JSON.stringify(history), before);
  assert.equal(Object.keys(getPreviousSetSummaries([])).length, 0);
});
