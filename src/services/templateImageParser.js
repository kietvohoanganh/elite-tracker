const IMAGE_PARSER_ENDPOINT = '/api/parse-workout-image';
const PARSER_NOT_CONFIGURED_MESSAGE = 'Image parser service is not configured.';

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
  import.meta.env.VITE_USE_MOCK_IMAGE_PARSER === 'true'
);

const canFallbackToMockParser = () => (
  import.meta.env.DEV && isMockParserEnabled()
);

const getMockParsedTemplate = async () => {
  await new Promise(resolve => setTimeout(resolve, 650));
  return mockParsedTemplate;
};

const getParserEndpoints = () => {
  const endpoints = [IMAGE_PARSER_ENDPOINT];

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const portSegment = port ? `:${port}` : '';
    const hostAliases = hostname === 'localhost'
      ? ['127.0.0.1']
      : hostname === '127.0.0.1'
        ? ['localhost']
        : [];

    hostAliases.forEach(host => {
      endpoints.push(`${protocol}//${host}${portSegment}${IMAGE_PARSER_ENDPOINT}`);
    });
  }

  return [...new Set(endpoints)];
};

const parseEndpointResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    if (response.status === 404 || !contentType.includes('application/json')) {
      throw new Error(PARSER_NOT_CONFIGURED_MESSAGE);
    }

    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Could not detect a workout plan from this image. Try a clearer image or enter the template manually.');
  }

  if (!contentType.includes('application/json')) {
    throw new Error(PARSER_NOT_CONFIGURED_MESSAGE);
  }

  const parsed = await response.json();
  if (!Array.isArray(parsed.exercises)) {
    throw new Error('Could not detect a workout plan from this image. Try a clearer image or enter the template manually.');
  }

  return parsed;
};

export const parseWorkoutTemplateImage = async (imageBase64) => {
  if (!imageBase64) {
    throw new Error('Please upload an image before parsing.');
  }

  if (isMockParserEnabled()) {
    return getMockParsedTemplate();
  }

  const requestBody = JSON.stringify({ imageBase64 });
  let unavailableError = null;

  for (const endpoint of getParserEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });

      return await parseEndpointResponse(response);
    } catch (error) {
      const isUnavailable = (
        error.message === PARSER_NOT_CONFIGURED_MESSAGE ||
        error instanceof TypeError ||
        /failed to fetch|networkerror|load failed/i.test(error.message || '')
      );

      if (!isUnavailable) {
        throw error;
      }

      unavailableError = new Error(PARSER_NOT_CONFIGURED_MESSAGE);
    }
  }

  if (canFallbackToMockParser()) return getMockParsedTemplate();

  throw unavailableError || new Error(PARSER_NOT_CONFIGURED_MESSAGE);
};
