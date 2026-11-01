import { parseWorkoutTextToParsedTemplate } from '../utils/exerciseParsing.js';
import { recognizeWorkoutImage } from './workoutOcr.js';

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


export const parseWorkoutTemplateImage = async (imageBase64, mimeType = 'image/jpeg') => {
  if (!imageBase64) throw new Error('Please upload an image before parsing.');
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_IMAGE_PARSER === 'true') {
    return mockParsedTemplate;
  }
  const rawText = await recognizeWorkoutImage(imageBase64, mimeType);
  const parsed = parseWorkoutTextToParsedTemplate(rawText);
  if (!parsed.exercises.length) {
    throw new Error('Could not read exercises with sets and reps. Crop the image to the workout table and try a sharper image, or enter the template manually.');
  }
  return parsed;
};
