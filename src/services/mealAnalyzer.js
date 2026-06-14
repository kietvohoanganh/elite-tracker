import { estimateMealDescriptionLocally } from './localMealEstimator';

const IMAGE_ANALYSIS_PROMPT =
  'Analyze the food in this image. Estimate ingredients, portion size, calories, protein, carbs, and fat. Return JSON only. Do not include markdown. If uncertain, lower the confidence and explain in notes.';

const DESCRIPTION_ANALYSIS_PROMPT =
  'Analyze this meal description. Estimate calories, protein, carbs, and fat for each food item and the total meal. Return JSON only. Do not include markdown. If portion size is missing, make a reasonable estimate and mark confidence lower.';

const DEFAULT_ERROR_MESSAGE = 'AI meal analysis failed. Please try again.';
const NOT_CONFIGURED_MESSAGE = 'AI meal analysis service is not configured yet.';

const clampNumber = (value, min = 0, max = Number.POSITIVE_INFINITY) => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) return min;
  return Math.min(max, Math.max(min, parsedValue));
};

const cleanString = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback;
  const trimmedValue = value.trim();
  return trimmedValue || fallback;
};

const parseJsonPayload = (payload) => {
  if (payload && typeof payload === 'object') return payload;
  if (typeof payload !== 'string') {
    throw new Error('The AI returned an invalid meal response. Please try again.');
  }

  const trimmedPayload = payload
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  try {
    return JSON.parse(trimmedPayload);
  } catch {
    throw new Error('The AI returned invalid JSON. Please try the analysis again.');
  }
};

const unwrapAnalysisPayload = (payload) => {
  const parsedPayload = parseJsonPayload(payload);
  const wrappedPayload =
    parsedPayload.result ??
    parsedPayload.analysis ??
    parsedPayload.data ??
    parsedPayload.meal;

  return wrappedPayload === undefined ? parsedPayload : parseJsonPayload(wrappedPayload);
};

const normalizeItem = (item, index) => ({
  name: cleanString(item?.name, `Meal item ${index + 1}`),
  estimatedGrams: clampNumber(item?.estimatedGrams),
  kcal: clampNumber(item?.kcal),
  protein: clampNumber(item?.protein),
  carbs: clampNumber(item?.carbs),
  fat: clampNumber(item?.fat),
  confidence: clampNumber(item?.confidence, 0, 1),
});

export const normalizeMealAnalysis = (payload) => {
  const meal = unwrapAnalysisPayload(payload);

  if (!meal || typeof meal !== 'object' || Array.isArray(meal)) {
    throw new Error('The AI returned an invalid meal response. Please try again.');
  }

  const items = Array.isArray(meal.items)
    ? meal.items.filter(item => item && typeof item === 'object').map(normalizeItem)
    : [];

  if (items.length === 0) {
    throw new Error('No food items were detected. Try a clearer photo or add more detail.');
  }

  return {
    mealName: cleanString(meal.mealName, 'AI Meal'),
    totalKcal: clampNumber(meal.totalKcal),
    totalProtein: clampNumber(meal.totalProtein),
    totalCarbs: clampNumber(meal.totalCarbs),
    totalFat: clampNumber(meal.totalFat),
    confidence: clampNumber(meal.confidence, 0, 1),
    items,
    notes: cleanString(
      meal.notes,
      'Portions are estimated. Please review each item before saving.',
    ),
  };
};

const requestMealAnalysis = async (endpoint, body, fallback) => {
  let response;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    if (fallback) return fallback();
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 501 || response.status === 503) {
      if (fallback) return fallback();
      throw new Error(NOT_CONFIGURED_MESSAGE);
    }

    let errorMessage = '';
    try {
      const errorPayload = await response.json();
      errorMessage = cleanString(errorPayload?.message || errorPayload?.error);
    } catch {
      // The backend may return an empty or non-JSON error response.
    }

    throw new Error(errorMessage || DEFAULT_ERROR_MESSAGE);
  }

  let responsePayload;
  try {
    responsePayload = await response.json();
  } catch {
    if (fallback) return fallback();
    throw new Error('The AI returned invalid JSON. Please try the analysis again.');
  }

  return normalizeMealAnalysis(responsePayload);
};

export const analyzeMealImage = async (imageBase64) => {
  if (!cleanString(imageBase64)) {
    throw new Error('Choose a meal photo before analyzing.');
  }

  /*
   * TODO: Implement POST /api/analyze-meal-image in a Firebase Function or
   * another trusted backend. Keep the AI API key server-side.
   *
   * Request:  { imageBase64: "...", userPrompt: "..." }
   * Response: { mealName, totalKcal, totalProtein, totalCarbs, totalFat,
   *             confidence, items: [...], notes }
   */
  return requestMealAnalysis('/api/analyze-meal-image', {
    imageBase64,
    userPrompt: IMAGE_ANALYSIS_PROMPT,
  });
};

export const analyzeMealDescription = async (description) => {
  const cleanDescription = cleanString(description);
  if (!cleanDescription) {
    throw new Error('Describe your meal before analyzing.');
  }

  /*
   * TODO: Implement POST /api/analyze-meal-description in a Firebase Function
   * or another trusted backend. Never expose the production AI API key here.
   *
   * Request:  { description: "...", userPrompt: "..." }
   * Response: { mealName, totalKcal, totalProtein, totalCarbs, totalFat,
   *             confidence, items: [...], notes }
   */
  return requestMealAnalysis(
    '/api/analyze-meal-description',
    {
      description: cleanDescription,
      userPrompt: DESCRIPTION_ANALYSIS_PROMPT,
    },
    () => normalizeMealAnalysis(estimateMealDescriptionLocally(cleanDescription)),
  );
};
