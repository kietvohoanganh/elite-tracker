const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const hasTextValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

const cleanSetValue = (value) => {
  if (!hasTextValue(value)) return '';
  return String(value).trim();
};

const parseStrictNumber = (value) => {
  if (!hasTextValue(value)) return null;

  const normalized = String(value).trim().replace(',', '.');
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};

const parseDateWithYearGuard = (value) => {
  if (!hasTextValue(value)) return null;

  const dateText = String(value).trim();
  if (/\b\d{4}\b/.test(dateText)) {
    const parsedDate = new Date(dateText);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  const monthDayMatch = dateText.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}\b/i);
  if (!monthDayMatch) return null;

  const inferredDate = new Date(`${monthDayMatch[0]}, ${new Date().getFullYear()}`);
  return Number.isNaN(inferredDate.getTime()) ? null : inferredDate;
};

const getSortableTimestamp = (entry = {}) => {
  const timestamp = Number(entry.timestamp);
  if (Number.isFinite(timestamp)) return timestamp;

  const parsedDate = parseDateWithYearGuard(entry.date || entry.matchDate || '');
  return parsedDate ? parsedDate.getTime() : 0;
};

const formatHistoryDate = (entry = {}) => {
  const timestamp = Number(entry.timestamp);
  if (Number.isFinite(timestamp)) {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return DATE_FORMATTER.format(date);
  }

  const rawDate = entry.date || entry.matchDate;
  if (hasTextValue(rawDate)) {
    const parsedDate = parseDateWithYearGuard(rawDate);
    if (parsedDate) return DATE_FORMATTER.format(parsedDate);
    return String(rawDate).trim();
  }

  return 'Unknown date';
};

export const getExerciseHistory = (workoutHistory = [], exerciseName = '') => {
  const targetExercise = String(exerciseName || '').trim().toLowerCase();
  if (!targetExercise || !Array.isArray(workoutHistory)) return [];

  return workoutHistory
    .map((entry, entryIndex) => {
      const data = entry?.data && typeof entry.data === 'object' ? entry.data : {};
      const exerciseKey = Object.keys(data).find(key => key.toLowerCase() === targetExercise);
      const rawSets = exerciseKey && Array.isArray(data[exerciseKey]) ? data[exerciseKey] : [];
      const sets = rawSets
        .map((set = {}, setIndex) => ({
          setNumber: setIndex + 1,
          weight: cleanSetValue(set.weight),
          reps: cleanSetValue(set.reps),
          ...(typeof set.completed === 'boolean' ? { completed: set.completed } : {}),
        }))
        .filter(set => hasTextValue(set.weight) || hasTextValue(set.reps));

      if (!exerciseKey || sets.length === 0) return null;

      return {
        date: formatHistoryDate(entry),
        duration: cleanSetValue(entry?.duration),
        sets,
        sortTimestamp: getSortableTimestamp(entry),
        entryIndex,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.sortTimestamp !== a.sortTimestamp) return b.sortTimestamp - a.sortTimestamp;
      return a.entryIndex - b.entryIndex;
    })
    .map(session => ({
      date: session.date,
      duration: session.duration,
      sets: session.sets,
    }));
};

export const getBestSetForExercise = (exerciseHistory = []) => {
  if (!Array.isArray(exerciseHistory)) return null;

  return exerciseHistory.reduce((bestSet, session) => {
    const sets = Array.isArray(session?.sets) ? session.sets : [];

    sets.forEach(set => {
      const weight = parseStrictNumber(set.weight);
      const reps = parseStrictNumber(set.reps);
      if (weight === null || reps === null) return;

      const currentSet = {
        weight,
        reps,
        date: hasTextValue(session?.date) ? String(session.date).trim() : 'Unknown date',
      };

      if (
        !bestSet ||
        currentSet.weight > bestSet.weight ||
        (currentSet.weight === bestSet.weight && currentSet.reps > bestSet.reps)
      ) {
        bestSet = currentSet;
      }
    });

    return bestSet;
  }, null);
};
