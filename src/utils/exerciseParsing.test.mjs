import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWorkoutTextToParsedTemplate, mapParsedExerciseToTemplateExercise, detectNewExercises, normalizeExerciseName } from './exerciseParsing.js';

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


test('numbered OCR names reuse existing library exercises', () => {
  const library = [{ exerciseId: 'press', exerciseName: 'Overhead Press', muscleGroup: 'Shoulders' }];
  for (const prefix of ['1. ', '1 . ', '1) ', '(1) ', '1: ', '1- ', '１． ', '• 1. ', '1 ']) {
    const parsed = { exerciseName: `${prefix}Overhead Press`, sets: '3', reps: '8-12' };
    const mapped = mapParsedExerciseToTemplateExercise(parsed, library);
    assert.equal(mapped.exerciseId, 'press', prefix);
    assert.equal(mapped.exerciseName, 'Overhead Press', prefix);
    assert.equal(mapped.isNewExercise, false, prefix);
    assert.equal(detectNewExercises([parsed], library).length, 0, prefix);
    const result = parseWorkoutTextToParsedTemplate(`${prefix}Overhead Press 3 x 8-12`);
    assert.equal(result.exercises[0].exerciseName, 'Overhead Press', prefix);
  }
});

test('legacy numbered library names match without creating duplicates', () => {
  const mapped = mapParsedExerciseToTemplateExercise({ exerciseName: 'Bench Press' }, [
    { exerciseId: 'existing', exerciseName: '1. Bench Press', muscleGroup: 'Chest' },
  ]);
  assert.equal(mapped.exerciseId, 'existing');
  assert.equal(mapped.exerciseName, 'Bench Press');
  assert.equal(mapped.isNewExercise, false);
  assert.equal(normalizeExerciseName('3D Cable Raise'), '3D Cable Raise');
  assert.equal(detectNewExercises([{ exerciseName: '1 . New Movement' }], []).length, 1);
});
