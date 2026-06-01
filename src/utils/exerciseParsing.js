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

  if (/\b(nguc|ngyc|ngc|ngllc|nglfc|chest)\b/.test(normalized)) return 'Chest';
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
    .replace(/(\d)\s*\.\s*(\d)/g, '$1-$2')
    .replace(/\s+/g, ' ')
    .trim();

  const repValuePattern = '(?:\\d{1,3}(?:\\s*-\\s*\\d{1,3})?|max)';
  const compactMatch = normalized.match(new RegExp(`\\b(\\d{1,2})\\s*x\\s*(${repValuePattern})\\b`, 'i'));
  const setsMatch = normalized.match(/\b(\d{1,2})\s*(?:sets?|set|hiep|hiệp)\b/i);
  const repsAfterSetsMatch = normalized.match(new RegExp(`(?:sets?|set|hiep|hiệp)\\s*(?:x|by|of)?\\s*(${repValuePattern})`, 'i'));
  const repsMatch = normalized.match(new RegExp(`\\b(${repValuePattern})\\s*(?:reps?|rep|lan|lần)\\b`, 'i'));

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

const cleanOcrLine = (line = '') => (
  String(line)
    .replace(/^[\s•*-]*(?:o|0|○|◦|▪|●)?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
);

const getExerciseNameFromLine = (line = '') => {
  const withoutBullet = cleanOcrLine(line);
  const beforeParenthesis = withoutBullet.split('(')[0];
  const beforeColon = beforeParenthesis.split(':')[0];
  const withoutMalformedMuscleLabel = beforeColon
    .replace(/\s+[il1]?(?:vai|nguc|ngyc|ngllc|nglfc|dui|bung|lung|mong)\b.*$/i, '');

  return normalizeExerciseName(withoutMalformedMuscleLabel);
};

const getParentheticalNotes = (line = '') => (
  [...String(line).matchAll(/\(([^)]*)\)/g)]
    .map(match => match[1].trim())
    .filter(Boolean)
);

export const parseWorkoutTextToParsedTemplate = (rawText = '') => {
  const lines = String(rawText)
    .split(/\r?\n/)
    .map(cleanOcrLine)
    .filter(Boolean);

  const exerciseLineEntries = lines.map((line, index) => ({ line, index })).filter(({ line }) => {
    const parsed = parseSetsAndReps(line);
    return parsed.sets && parsed.reps && getExerciseNameFromLine(line);
  });
  const exerciseLines = exerciseLineEntries.map(entry => entry.line);

  const firstExerciseIndex = exerciseLineEntries[0]?.index ?? lines.length;
  const ignoredHeadingPattern = /^(upload image|parse image|png,|screenshot |image parser service)/i;
  const headingCandidates = lines
    .slice(0, firstExerciseIndex)
    .filter(line => !ignoredHeadingPattern.test(line))
    .filter(line => !parseSetsAndReps(line).sets);

  const templateName = (
    headingCandidates[headingCandidates.length - 1] ||
    lines.find(line => !exerciseLines.includes(line) && !parseSetsAndReps(line).sets && !ignoredHeadingPattern.test(line)) ||
    lines[0] ||
    'Imported Workout Template'
  ).replace(/^[#\s]+/, '').trim();

  const exercises = exerciseLines.map(line => {
    const parsed = parseSetsAndReps(line);
    const notes = getParentheticalNotes(line);
    const muscleLabel = notes.find(note => normalizeMuscleGroup(note) !== 'Other') || '';

    return {
      exerciseName: getExerciseNameFromLine(line),
      muscleGroup: normalizeMuscleGroup(muscleLabel || notes.join(' ')),
      sets: parsed.sets,
      reps: parsed.reps,
      weight: '',
      notes: notes.join('. '),
      confidence: 0.82,
    };
  });

  return {
    templateName,
    exercises,
    rawText: String(rawText || ''),
  };
};
