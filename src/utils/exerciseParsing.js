import { createDefaultTemplateSet } from './templates.js';

const normalizeSearchText = (value = '') => (
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
);

const slugify = (value = '') => (
  normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'exercise'
);

const cleanRange = (value = '') => String(value).replace(/\s*-\s*/g, '-').trim();

export const normalizeMuscleGroup = (label = '') => {
  const normalized = normalizeSearchText(label);
  if (!normalized) return 'Other';

  if (/\b(nguc|chest)\b/.test(normalized)) return 'Chest';
  if (/\b(cau vai|lung|xo|back|lat|traps?)\b/.test(normalized)) return 'Back';
  if (/\b(vai|shoulders?|delts?)\b/.test(normalized)) return 'Shoulders';
  if (/\b(dui|mong|bap chan|chan|legs?|quads?|hamstrings?|glutes?|calves|calf)\b/.test(normalized)) return 'Legs';
  if (/\b(tay truoc|tay sau|biceps|triceps|arms?)\b/.test(normalized)) return 'Arms';
  if (/\b(bung|core|abs)\b/.test(normalized)) return 'Core';

  return 'Other';
};

export const parseSetsAndReps = (text = '') => {
  const normalized = String(text)
    .replace(/[×–—]/g, match => (match === '×' ? 'x' : '-'))
    .replace(/\s+/g, ' ')
    .trim();

  const compactMatch = normalized.match(/\b(\d{1,2})\s*x\s*(\d{1,3}(?:\s*-\s*\d{1,3})?)\b/i);
  const setsMatch = normalized.match(/\b(\d{1,2})\s*(?:sets?|set|hiep|hiệp)\b/i);
  const repsAfterSetsMatch = normalized.match(/(?:sets?|set|hiep|hiệp)\s*(?:x|by|of)?\s*(\d{1,3}(?:\s*-\s*\d{1,3})?)/i);
  const repsMatch = normalized.match(/\b(\d{1,3}(?:\s*-\s*\d{1,3})?)\s*(?:reps?|rep|lan|lần)\b/i);

  return {
    sets: setsMatch?.[1] || compactMatch?.[1] || '',
    reps: cleanRange(repsAfterSetsMatch?.[1] || compactMatch?.[2] || repsMatch?.[1] || ''),
  };
};

export const normalizeExerciseName = (name = '') => (
  String(name)
    .replace(/^[\s#*-]*(?:\d+[.)-]\s*)?/, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s*[:：]\s*\d+.*$/i, '')
    .replace(/\s+\d+\s*(?:sets?|set|hiep|hiệp)\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
);

export const findExerciseLibraryMatch = (exerciseName = '', muscleGroup = '', exerciseLibrary = []) => {
  const normalizedName = normalizeSearchText(normalizeExerciseName(exerciseName));
  if (!normalizedName) return null;

  const matches = exerciseLibrary.filter(exercise => (
    normalizeSearchText(exercise.exerciseName) === normalizedName
  ));

  if (matches.length === 0) return null;

  const normalizedGroup = normalizeMuscleGroup(muscleGroup);
  return matches.find(exercise => exercise.muscleGroup === normalizedGroup) || matches[0];
};

export const convertParsedExerciseToTemplateSets = (parsedExercise = {}) => {
  const parsedFromText = parseSetsAndReps([
    parsedExercise.exerciseName,
    parsedExercise.name,
    parsedExercise.sets,
    parsedExercise.reps,
    parsedExercise.rawText,
  ].filter(Boolean).join(' '));

  const setCount = parsedExercise.sets || parsedExercise.setCount || parsedFromText.sets || 1;
  const reps = parsedExercise.reps || parsedFromText.reps || '';
  const weight = parsedExercise.weight || '';

  return createDefaultTemplateSet(setCount, reps, weight);
};

export const mapParsedExerciseToTemplateExercise = (parsedExercise = {}, exerciseLibrary = []) => {
  const exerciseName = normalizeExerciseName(parsedExercise.exerciseName || parsedExercise.name);
  const muscleGroup = normalizeMuscleGroup(parsedExercise.muscleGroup || parsedExercise.notes);
  const libraryMatch = findExerciseLibraryMatch(exerciseName, muscleGroup, exerciseLibrary);

  return {
    exerciseId: libraryMatch?.exerciseId || `import-${slugify(`${muscleGroup}-${exerciseName}`)}`,
    exerciseName: libraryMatch?.exerciseName || exerciseName,
    muscleGroup: libraryMatch?.muscleGroup || muscleGroup,
    sets: convertParsedExerciseToTemplateSets(parsedExercise),
    notes: String(parsedExercise.notes ?? '').trim(),
    confidence: Number.isFinite(Number(parsedExercise.confidence)) ? Number(parsedExercise.confidence) : 0,
    isNewExercise: !libraryMatch,
  };
};

export const detectNewExercises = (parsedExercises = [], exerciseLibrary = []) => (
  parsedExercises
    .map(exercise => mapParsedExerciseToTemplateExercise(exercise, exerciseLibrary))
    .filter(exercise => exercise.isNewExercise && exercise.exerciseName)
);
