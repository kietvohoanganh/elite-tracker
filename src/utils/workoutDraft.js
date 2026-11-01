const draftKey = (userId) => `eliteTrackerWorkout:${userId}`;

export function readWorkoutDraft(userId) {
  if (!userId) return null;
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey(userId)));
    if (draft?.version !== 1 || !Number.isFinite(draft.workoutStartedAt)
      || draft.workoutStartedAt <= 0 || !draft.activeWorkout
      || typeof draft.activeWorkout !== 'object' || Array.isArray(draft.activeWorkout)
      || !Object.values(draft.activeWorkout).every(sets => Array.isArray(sets)
        && sets.every(set => set && typeof set === 'object' && !Array.isArray(set)))) return null;
    return draft;
  } catch (error) {
    console.warn('Could not restore workout draft:', error);
    return null;
  }
}

export function saveWorkoutDraft(userId, draft) {
  if (!userId) return true;
  try {
    if (draft) {
      localStorage.setItem(draftKey(userId), JSON.stringify({ ...draft, version: 1 }));
    } else {
      localStorage.removeItem(draftKey(userId));
    }
    return true;
  } catch (error) {
    console.warn('Could not save workout draft:', error);
    return false;
  }
}
