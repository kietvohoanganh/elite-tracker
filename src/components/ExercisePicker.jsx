import { memo, useMemo } from 'react';
import FitnessIcon from './FitnessIcon';

const getExerciseKey = (exercise) => (
  exercise.exerciseId || `${exercise.muscleGroup}-${exercise.exerciseName}`
);

function ExercisePicker({
  exerciseLibrary,
  searchQuery,
  onSearchChange,
  onSelectExercise,
  onOpenCreateExercise,
  showHistoryButton = false,
  onOpenHistory,
  favoriteExercises = [],
  onToggleFavorite,
  isExerciseSelected,
  getSelectLabel,
  highlightedExerciseId,
  compact = false,
  styles,
  theme,
}) {
  const favoriteExerciseSet = useMemo(() => new Set(favoriteExercises), [favoriteExercises]);

  const exerciseGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return exerciseLibrary
      .map((exercise, index) => ({ ...exercise, libraryIndex: index }))
      .filter(exercise => !query || exercise.exerciseName.toLowerCase().includes(query))
      .sort((a, b) => {
        const aFav = favoriteExerciseSet.has(a.exerciseName);
        const bFav = favoriteExerciseSet.has(b.exerciseName);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return a.libraryIndex - b.libraryIndex;
      })
      .reduce((groups, exercise) => {
        if (!groups[exercise.muscleGroup]) groups[exercise.muscleGroup] = [];
        groups[exercise.muscleGroup].push(exercise);
        return groups;
      }, {});
  }, [exerciseLibrary, favoriteExerciseSet, searchQuery]);

  const groupEntries = Object.entries(exerciseGroups);
  const hasResults = groupEntries.length > 0;

  const handleSelect = (event, exercise, selected) => {
    event.stopPropagation();
    if (selected) return;
    onSelectExercise(exercise);
  };

  return (
    <div style={compact ? styles.templatePickerShell : styles.exercisePickerShell}>
      <div style={compact ? styles.templatePickerSearchPanel : styles.exerciseSearchPanel}>
        <input
          aria-label="Search exercises"
          type="search"
          autoComplete="off"
          style={{...styles.authInput, marginBottom: 0, flex: 1}}
          placeholder="Search exercise by name..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault();
          }}
        />
        <button
          onClick={onOpenCreateExercise}
          className="mu-icon-button"
          style={styles.createExerciseIconBtn}
          aria-label="Create Exercise"
          title="Create Exercise"
        >
          <FitnessIcon name="plus" size={21} />
        </button>
      </div>

      <div style={compact ? styles.templateExercisePickerList : styles.exercisePickerList}>
        {searchQuery.trim() && hasResults && (
          <p style={styles.searchResultLabel}>Search results for "{searchQuery.trim()}"</p>
        )}

        {!hasResults ? (
          <div style={compact ? styles.templatePickerEmptyState : styles.emptyExerciseState}>
            <p style={{margin: '0 0 18px 0', color: theme.textSecondary}}>No exercise found.</p>
            <button
              className="mu-icon-button"
              onClick={onOpenCreateExercise}
              style={styles.emptyCreateExerciseBtn}
              aria-label="Create Exercise"
            >
              <FitnessIcon name="plus" size={21} />
            </button>
          </div>
        ) : (
          groupEntries.map(([muscleGroup, exercises]) => (
            <div key={muscleGroup} style={compact ? styles.templateLibraryGroup : styles.exercisePickerGroup}>
              <h3 style={compact ? styles.templateLibraryGroupTitle : styles.exercisePickerGroupTitle}>{muscleGroup}</h3>
              {exercises.map(exercise => {
                const isFav = favoriteExerciseSet.has(exercise.exerciseName);
                const selected = Boolean(isExerciseSelected?.(exercise));
                const isHighlighted = highlightedExerciseId && highlightedExerciseId === exercise.exerciseId;
                const selectLabel = getSelectLabel ? getSelectLabel(exercise, selected) : '+';

                return (
                  <div
                    className="mu-list-item"
                    key={getExerciseKey(exercise)}
                    onClick={(event) => handleSelect(event, exercise, selected)}
                    style={{
                      ...(compact ? styles.templateLibraryRow : styles.exerciseListItem),
                      ...(isHighlighted ? styles.exercisePickerHighlightedRow : {}),
                      cursor: selected ? 'default' : 'pointer',
                    }}
                  >
                    <div style={styles.exercisePickerPrimary}>
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(event) => onToggleFavorite(event, exercise)}
                          className={`favorite-button${isFav ? ' favorite-button--selected' : ''}`}
                          style={{
                            cursor: 'pointer',
                            color: isFav ? theme.accentGold : theme.border,
                            transition: 'color 0.2s',
                            flexShrink: 0,
                          }}
                          aria-label={`${isFav ? 'Remove' : 'Add'} ${exercise.exerciseName} ${isFav ? 'from' : 'to'} favorites`}
                          aria-pressed={isFav}
                        >
                          <FitnessIcon name="favorites" size={20} />
                        </button>
                      )}
                      <div style={{minWidth: 0}}>
                        <p style={compact ? styles.templateLibraryName : {
                          ...styles.exercisePickerName,
                          color: isFav ? theme.textPrimary : theme.textSecondary,
                          fontWeight: isFav ? 'bold' : 'normal',
                        }}>
                          {exercise.exerciseName}
                        </p>
                        {exercise.isCustom && <p style={styles.templateLibraryMeta}>Custom exercise</p>}
                      </div>
                    </div>

                    <div style={styles.exerciseListActions}>
                      {showHistoryButton && (
                        <button
                          className="mu-button mu-secondary-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenHistory?.(event, exercise);
                          }}
                          style={styles.exerciseHistoryBtn}
                        >
                          History
                        </button>
                      )}
                      <button
                        className={compact ? 'mu-button mu-secondary-btn' : 'mu-icon-button'}
                        onClick={(event) => handleSelect(event, exercise, selected)}
                        disabled={selected}
                        style={{
                          ...(compact ? styles.templateLibraryAddBtn : styles.addExerciseIconBtn),
                          opacity: selected ? 0.45 : 1,
                        }}
                        aria-label={`${selected ? 'Selected' : 'Add'} ${exercise.exerciseName}`}
                      >
                        {selectLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default memo(ExercisePicker);
