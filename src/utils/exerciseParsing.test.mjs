import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWorkoutTextToParsedTemplate } from './exerciseParsing.js';

test('screenshot table keeps exercise names, ranges and rest separate', () => {
  const result = parseWorkoutTextToParsedTemplate(`
Screenshot 2026-11-01 at 23.30.48.png
# Bài tập Sets × Reps Nghỉ
1 Incline Machine Chest Press 3×6–10 150s
2 Chest-Supported Row 3x8-12 120s
3 Neutral-Grip Lat Pulldown 2x8-12 120s
4 Flat Machine Chest Press 2x8-12 120s
5 Cable Lateral Raise 3 x 12-20 75s
6 Cable Rear Delt Fly 2 x 12-20 75s
7 Rope Triceps Pushdown 2 x 10-15 75s
8 Preacher Curl 2 x 10-15 75s
Firebase AI could not authorize this request.
Cloud project.
`);
  assert.equal(result.templateName, 'Imported Workout Template');
  assert.equal(result.exercises.length, 8);
  assert.deepEqual(result.exercises.map(({ exerciseName, sets, reps, notes }) =>
    [exerciseName, sets, reps, notes]), [
    ['Incline Machine Chest Press', '3', '6-10', 'Rest: 150s'],
    ['Chest-Supported Row', '3', '8-12', 'Rest: 120s'],
    ['Neutral-Grip Lat Pulldown', '2', '8-12', 'Rest: 120s'],
    ['Flat Machine Chest Press', '2', '8-12', 'Rest: 120s'],
    ['Cable Lateral Raise', '3', '12-20', 'Rest: 75s'],
    ['Cable Rear Delt Fly', '2', '12-20', 'Rest: 75s'],
    ['Rope Triceps Pushdown', '2', '10-15', 'Rest: 75s'],
    ['Preacher Curl', '2', '10-15', 'Rest: 75s'],
  ]);
  assert.equal(result.exercises[0].muscleGroup, 'Chest');
});

test('existing prose format and headings still parse', () => {
  const result = parseWorkoutTextToParsedTemplate('BUỔI 3: ANTERIOR B\nIncline Dumbbell Press (Ngực trên): 4 Sets x 8-12 Reps\nHanging Leg Raises (Bụng): 3 Sets x Max Reps');
  assert.equal(result.templateName, 'BUỔI 3: ANTERIOR B');
  assert.equal(result.exercises[0].exerciseName, 'Incline Dumbbell Press');
  assert.equal(result.exercises[0].sets, '4');
  assert.equal(result.exercises[1].reps, 'Max');
  assert.equal(result.exercises[1].muscleGroup, 'Core');
});

test('unrelated text does not invent exercises', () => {
  assert.equal(parseWorkoutTextToParsedTemplate('No workout here.').exercises.length, 0);
});
