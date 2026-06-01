export const createDefaultTemplateSet = (count = 1, reps = '', weight = '') => {
  const parsedCount = Number.parseInt(count, 10);
  const setCount = Number.isFinite(parsedCount) && parsedCount > 0 ? Math.min(parsedCount, 50) : 1;

  return Array.from({ length: setCount }, () => ({
    reps: String(reps ?? ''),
    weight: String(weight ?? ''),
  }));
};

export const normalizeTemplateExercise = (exercise = {}) => {
  const sets = Array.isArray(exercise.sets) && exercise.sets.length > 0
    ? exercise.sets.map(set => ({
        reps: String(set?.reps ?? ''),
        weight: String(set?.weight ?? ''),
      }))
    : createDefaultTemplateSet(1);

  const normalizedExercise = {
    exerciseId: String(exercise.exerciseId ?? exercise.exerciseName ?? ''),
    exerciseName: String(exercise.exerciseName ?? exercise.name ?? '').trim(),
    muscleGroup: String(exercise.muscleGroup ?? exercise.category ?? 'Other').trim() || 'Other',
    sets,
  };

  const notes = String(exercise.notes ?? '').trim();
  if (notes) normalizedExercise.notes = notes;

  return normalizedExercise;
};

export const convertTemplateToActiveWorkout = (template = {}) => {
  const exercises = Array.isArray(template.exercises) ? template.exercises : [];

  return exercises.reduce((workout, exercise) => {
    const normalizedExercise = normalizeTemplateExercise(exercise);
    if (!normalizedExercise.exerciseName) return workout;

    workout[normalizedExercise.exerciseName] = normalizedExercise.sets.map(set => ({
      reps: set.reps,
      weight: set.weight,
      completed: false,
    }));

    return workout;
  }, {});
};

export const validateTemplate = (template = {}) => {
  const name = String(template.name ?? '').trim();
  if (!name) {
    return { isValid: false, message: 'Template name is required.' };
  }

  const exercises = Array.isArray(template.exercises) ? template.exercises : [];
  if (exercises.length === 0) {
    return { isValid: false, message: 'Add at least one exercise to this template.' };
  }

  const invalidExercise = exercises
    .map(normalizeTemplateExercise)
    .find(exercise => !exercise.exerciseName || !exercise.muscleGroup || exercise.sets.length === 0);

  if (invalidExercise) {
    return { isValid: false, message: 'Each template exercise needs a name, muscle group, and at least one set.' };
  }

  return { isValid: true, message: '' };
};
