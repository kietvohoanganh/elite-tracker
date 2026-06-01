const IMAGE_PARSER_ENDPOINT = '/api/parse-workout-image';

const mockParsedTemplate = {
  templateName: 'BUỔI 3: ANTERIOR B',
  exercises: [
    {
      exerciseName: 'Incline Dumbbell Press',
      muscleGroup: 'Chest',
      sets: '4',
      reps: '8-12',
      weight: '',
      notes: 'Ngực trên',
      confidence: 0.95,
    },
    {
      exerciseName: 'Flat Barbell Bench Press',
      muscleGroup: 'Chest',
      sets: '3',
      reps: '8-10',
      weight: '',
      notes: 'Ngực lớn',
      confidence: 0.95,
    },
    {
      exerciseName: 'Cable Pec Flyes',
      muscleGroup: 'Chest',
      sets: '3',
      reps: '12-15',
      weight: '',
      notes: 'Ép ngực ngang. Hoàn thành đủ 20 sets Ngực/tuần',
      confidence: 0.9,
    },
    {
      exerciseName: 'Bulgarian Split Squat',
      muscleGroup: 'Legs',
      sets: '3',
      reps: '10-12',
      weight: '',
      notes: 'Đùi trước/Mông',
      confidence: 0.9,
    },
    {
      exerciseName: 'Cable Lateral Raises',
      muscleGroup: 'Shoulders',
      sets: '4',
      reps: '12-15',
      weight: '',
      notes: 'Vai giữa',
      confidence: 0.9,
    },
    {
      exerciseName: 'Dumbbell Lateral Raises',
      muscleGroup: 'Shoulders',
      sets: '3',
      reps: '12-15',
      weight: '',
      notes: 'Vai giữa. Hoàn thành đủ 20 sets Vai/tuần khi tính cả vai sau ở buổi Posterior',
      confidence: 0.9,
    },
    {
      exerciseName: 'Hanging Leg Raises',
      muscleGroup: 'Core',
      sets: '3',
      reps: 'Max',
      weight: '',
      notes: 'Bụng',
      confidence: 0.9,
    },
  ],
  rawText: [
    'BUỔI 3: ANTERIOR B (Tập trung Ngực & Vai giữa)',
    'Incline Dumbbell Press (Ngực trên): 4 Sets x 8-12 Reps',
    'Flat Barbell Bench Press (Ngực lớn): 3 Sets x 8-10 Reps',
    'Cable Pec Flyes (Ép ngực ngang): 3 Sets x 12-15 Reps (Hoàn thành đủ 20 sets Ngực/tuần)',
    'Bulgarian Split Squat (Đùi trước/Mông): 3 Sets x 10-12 Reps/bên',
    'Cable Lateral Raises (Vai giữa): 4 Sets x 12-15 Reps',
    'Dumbbell Lateral Raises (Vai giữa): 3 Sets x 12-15 Reps (Hoàn thành đủ 20 sets Vai/tuần khi tính cả vai sau ở buổi Posterior)',
    'Hanging Leg Raises (Bụng): 3 Sets x Max Reps',
  ].join('\n'),
};

const isMockParserEnabled = () => (
  import.meta.env.VITE_USE_REAL_IMAGE_PARSER !== 'true'
);

const canFallbackToMockParser = () => (
  import.meta.env.DEV && import.meta.env.VITE_DISABLE_IMAGE_PARSER_MOCK !== 'true'
);

const getMockParsedTemplate = async () => {
  await new Promise(resolve => setTimeout(resolve, 650));
  return mockParsedTemplate;
};

export const parseWorkoutTemplateImage = async (imageBase64) => {
  if (!imageBase64) {
    throw new Error('Please upload an image before parsing.');
  }

  if (isMockParserEnabled()) {
    return getMockParsedTemplate();
  }

  let response;
  try {
    response = await fetch(IMAGE_PARSER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
  } catch {
    if (canFallbackToMockParser()) return getMockParsedTemplate();
    throw new Error('Image parser service is not configured.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    if (response.status === 404 && canFallbackToMockParser()) return getMockParsedTemplate();

    throw new Error(response.status === 404
      ? 'Image parser service is not configured.'
      : 'Could not detect a workout plan from this image. Try a clearer image or enter the template manually.');
  }

  if (!contentType.includes('application/json')) {
    if (canFallbackToMockParser()) return getMockParsedTemplate();

    throw new Error('Image parser service is not configured.');
  }

  const parsed = await response.json();
  if (!Array.isArray(parsed.exercises)) {
    throw new Error('Could not detect a workout plan from this image. Try a clearer image or enter the template manually.');
  }

  return parsed;
};
