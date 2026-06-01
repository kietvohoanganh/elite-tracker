const IMAGE_PARSER_ENDPOINT = '/api/parse-workout-image';

const mockParsedTemplate = {
  templateName: 'BUỔI 1: ANTERIOR A',
  exercises: [
    {
      exerciseName: 'Dumbbell Bench Press',
      muscleGroup: 'Chest',
      sets: '4',
      reps: '8-12',
      weight: '',
      notes: 'Ngực lớn',
      confidence: 0.95,
    },
    {
      exerciseName: 'Incline Barbell Bench Press',
      muscleGroup: 'Chest',
      sets: '3',
      reps: '8-10',
      weight: '',
      notes: 'Ngực trên',
      confidence: 0.95,
    },
    {
      exerciseName: 'Chest Press',
      muscleGroup: 'Chest',
      sets: '3',
      reps: '10-12',
      weight: '',
      notes: 'Máy ép ngực. Hoàn thành 10 sets Ngực cho nửa đầu tuần',
      confidence: 0.9,
    },
    {
      exerciseName: 'Hack Squat / Leg Press',
      muscleGroup: 'Legs',
      sets: '3',
      reps: '8-12',
      weight: '',
      notes: 'Đùi trước',
      confidence: 0.9,
    },
    {
      exerciseName: 'Seated Dumbbell Overhead Press',
      muscleGroup: 'Shoulders',
      sets: '4',
      reps: '8-12',
      weight: '',
      notes: 'Vai trước',
      confidence: 0.9,
    },
    {
      exerciseName: 'Dumbbell Lateral Raises',
      muscleGroup: 'Shoulders',
      sets: '3',
      reps: '12-15',
      weight: '',
      notes: 'Vai giữa',
      confidence: 0.9,
    },
  ],
  rawText: [
    'BUỔI 1: ANTERIOR A',
    'Dumbbell Bench Press (Ngực lớn): 4 Sets x 8-12 Reps',
    'Incline Barbell Bench Press (Ngực trên): 3 Sets x 8-10 Reps',
    'Chest Press (Máy ép ngực): 3 Sets x 10-12 Reps',
    'Hack Squat / Leg Press (Đùi trước): 3 Sets x 8-12 Reps',
    'Seated Dumbbell Overhead Press (Vai trước): 4 Sets x 8-12 Reps',
    'Dumbbell Lateral Raises (Vai giữa): 3 Sets x 12-15 Reps',
  ].join('\n'),
};

const isDevelopmentMockEnabled = () => (
  import.meta.env.DEV && import.meta.env.VITE_USE_REAL_IMAGE_PARSER !== 'true'
);

export const parseWorkoutTemplateImage = async (imageBase64) => {
  if (!imageBase64) {
    throw new Error('Please upload an image before parsing.');
  }

  if (isDevelopmentMockEnabled()) {
    await new Promise(resolve => setTimeout(resolve, 650));
    return mockParsedTemplate;
  }

  let response;
  try {
    response = await fetch(IMAGE_PARSER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
  } catch {
    throw new Error('Image parser service is not configured.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    throw new Error(response.status === 404
      ? 'Image parser service is not configured.'
      : 'Could not detect a workout plan from this image. Try a clearer image or enter the template manually.');
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Image parser service is not configured.');
  }

  const parsed = await response.json();
  if (!Array.isArray(parsed.exercises)) {
    throw new Error('Could not detect a workout plan from this image. Try a clearer image or enter the template manually.');
  }

  return parsed;
};
