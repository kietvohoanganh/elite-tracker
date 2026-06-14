const FOOD_REFERENCES = [
  {
    name: 'Cooked white rice',
    aliases: [/\bwhite rice\b/i, /\bcooked rice\b/i, /\brice\b/i],
    defaultGrams: 200,
    per100g: { kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
  },
  {
    name: 'Cooked brown rice',
    aliases: [/\bbrown rice\b/i],
    defaultGrams: 200,
    per100g: { kcal: 123, protein: 2.7, carbs: 25.6, fat: 1 },
  },
  {
    name: 'Chicken breast',
    aliases: [/\bchicken breast\b/i, /\bgrilled chicken\b/i, /\bchicken\b/i],
    defaultGrams: 150,
    per100g: { kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  {
    name: 'Chicken thigh',
    aliases: [/\bchicken thigh\b/i],
    defaultGrams: 150,
    per100g: { kcal: 209, protein: 26, carbs: 0, fat: 10.9 },
  },
  {
    name: 'Fried egg',
    aliases: [/\bfried eggs?\b/i],
    defaultGrams: 50,
    per100g: { kcal: 196, protein: 13.6, carbs: 0.8, fat: 15 },
  },
  {
    name: 'Egg',
    aliases: [/\beggs?\b/i],
    defaultGrams: 50,
    per100g: { kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  },
  {
    name: 'Mixed vegetables',
    aliases: [/\bmixed vegetables?\b/i, /\bvegetables?\b/i, /\bveggies\b/i],
    defaultGrams: 100,
    per100g: { kcal: 65, protein: 3, carbs: 11, fat: 1 },
  },
  {
    name: 'Lean beef',
    aliases: [/\bsteak\b/i, /\blean beef\b/i, /\bbeef\b/i],
    defaultGrams: 150,
    per100g: { kcal: 217, protein: 26, carbs: 0, fat: 12 },
  },
  {
    name: 'Lean pork',
    aliases: [/\bpork loin\b/i, /\bpork\b/i],
    defaultGrams: 150,
    per100g: { kcal: 206, protein: 27, carbs: 0, fat: 10 },
  },
  {
    name: 'Salmon',
    aliases: [/\bsalmon\b/i],
    defaultGrams: 150,
    per100g: { kcal: 208, protein: 20, carbs: 0, fat: 13 },
  },
  {
    name: 'Tuna',
    aliases: [/\btuna\b/i],
    defaultGrams: 120,
    per100g: { kcal: 132, protein: 29, carbs: 0, fat: 1 },
  },
  {
    name: 'Tofu',
    aliases: [/\btofu\b/i],
    defaultGrams: 150,
    per100g: { kcal: 144, protein: 17, carbs: 2.8, fat: 8.7 },
  },
  {
    name: 'Cooked noodles',
    aliases: [/\bnoodles?\b/i, /\bramen\b/i],
    defaultGrams: 220,
    per100g: { kcal: 138, protein: 4.5, carbs: 25, fat: 2.1 },
  },
  {
    name: 'Cooked pasta',
    aliases: [/\bspaghetti\b/i, /\bpasta\b/i],
    defaultGrams: 220,
    per100g: { kcal: 157, protein: 5.8, carbs: 30.9, fat: 0.9 },
  },
  {
    name: 'Bread',
    aliases: [/\bbread\b/i, /\btoast\b/i],
    defaultGrams: 35,
    per100g: { kcal: 265, protein: 9, carbs: 49, fat: 3.2 },
  },
  {
    name: 'Oats',
    aliases: [/\boatmeal\b/i, /\boats\b/i],
    defaultGrams: 50,
    per100g: { kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  },
  {
    name: 'Potato',
    aliases: [/\bpotatoes\b/i, /\bpotato\b/i],
    defaultGrams: 180,
    per100g: { kcal: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
  },
  {
    name: 'Sweet potato',
    aliases: [/\bsweet potatoes\b/i, /\bsweet potato\b/i],
    defaultGrams: 180,
    per100g: { kcal: 90, protein: 2, carbs: 20.7, fat: 0.2 },
  },
  {
    name: 'Banana',
    aliases: [/\bbananas?\b/i],
    defaultGrams: 118,
    per100g: { kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  },
  {
    name: 'Apple',
    aliases: [/\bapples?\b/i],
    defaultGrams: 180,
    per100g: { kcal: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
  },
  {
    name: 'Avocado',
    aliases: [/\bavocados?\b/i],
    defaultGrams: 100,
    per100g: { kcal: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  },
  {
    name: 'Greek yogurt',
    aliases: [/\bgreek yogurt\b/i, /\byogurt\b/i],
    defaultGrams: 170,
    per100g: { kcal: 73, protein: 10, carbs: 3.9, fat: 2 },
  },
  {
    name: 'Milk',
    aliases: [/\bmilk\b/i],
    defaultGrams: 240,
    per100g: { kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  },
  {
    name: 'Peanut butter',
    aliases: [/\bpeanut butter\b/i],
    defaultGrams: 32,
    per100g: { kcal: 588, protein: 25, carbs: 20, fat: 50 },
  },
  {
    name: 'Cooking oil',
    aliases: [/\bolive oil\b/i, /\bcooking oil\b/i, /\boil\b/i],
    defaultGrams: 14,
    per100g: { kcal: 884, protein: 0, carbs: 0, fat: 100 },
  },
];

const GENERIC_REFERENCE = {
  defaultGrams: 100,
  per100g: { kcal: 150, protein: 7, carbs: 18, fat: 6 },
};

const round = value => Math.round(value * 10) / 10;
const roundConfidence = value => Math.round(value * 100) / 100;

const titleCase = value => value
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/\b\w/g, character => character.toUpperCase());

const splitDescription = (description) => {
  const normalizedDescription = description
    .replace(/\n+/g, ',')
    .replace(/\s+(?:and|with)\s+/gi, ',');

  return normalizedDescription
    .split(/[;,]+/)
    .map(part => part.trim())
    .filter(Boolean);
};

const findReference = (descriptionPart) => FOOD_REFERENCES
  .map(reference => ({
    reference,
    matchLength: Math.max(
      0,
      ...reference.aliases.map(alias => descriptionPart.match(alias)?.[0].length || 0),
    ),
  }))
  .filter(candidate => candidate.matchLength > 0)
  .sort((left, right) => right.matchLength - left.matchLength)[0]?.reference;

const parseExplicitGrams = (descriptionPart) => {
  const weightMatch = descriptionPart.match(/(\d+(?:\.\d+)?)\s*(kg|g|grams?|oz|ounces?)\b/i);
  if (!weightMatch) return null;

  const amount = Number(weightMatch[1]);
  const unit = weightMatch[2].toLowerCase();
  if (unit === 'kg') return amount * 1000;
  if (unit.startsWith('oz')) return amount * 28.35;
  return amount;
};

const parseCount = (descriptionPart) => {
  const countMatch = descriptionPart.match(/(?:^|\s)(\d+(?:\.\d+)?)\s*(?:x\s*)?(?=\w)/i);
  return countMatch ? Number(countMatch[1]) : 1;
};

const estimateGrams = (descriptionPart, reference) => {
  const explicitGrams = parseExplicitGrams(descriptionPart);
  if (explicitGrams !== null) {
    return { grams: explicitGrams, hasExplicitPortion: true };
  }

  const count = parseCount(descriptionPart);
  const unitRules = [
    { pattern: /\b(?:tbsp|tablespoons?)\b/i, grams: 15 },
    { pattern: /\b(?:tsp|teaspoons?)\b/i, grams: 5 },
    { pattern: /\bcups?\b/i, grams: reference?.name.includes('rice') ? 186 : 240 },
    { pattern: /\bbowls?\b/i, grams: reference?.defaultGrams || 250 },
    { pattern: /\bslices?\b/i, grams: reference?.defaultGrams || 35 },
    { pattern: /\b(?:pieces?|servings?)\b/i, grams: reference?.defaultGrams || 100 },
  ];
  const matchedRule = unitRules.find(rule => rule.pattern.test(descriptionPart));

  return {
    grams: count * (matchedRule?.grams || reference?.defaultGrams || GENERIC_REFERENCE.defaultGrams),
    hasExplicitPortion: Boolean(matchedRule || /^\s*\d/.test(descriptionPart)),
  };
};

const getDisplayName = (descriptionPart, reference) => {
  if (reference) return reference.name;

  const cleanedName = descriptionPart
    .replace(/\d+(?:\.\d+)?\s*(?:kg|g|grams?|oz|ounces?|cups?|bowls?|pieces?|servings?|slices?|tbsp|tablespoons?|tsp|teaspoons?)?/gi, '')
    .replace(/\b(?:of|a|an)\b/gi, '')
    .trim();

  return titleCase(cleanedName || 'Meal item');
};

const estimateItem = (descriptionPart) => {
  const reference = findReference(descriptionPart);
  const nutritionReference = reference || GENERIC_REFERENCE;
  const { grams, hasExplicitPortion } = estimateGrams(descriptionPart, reference);
  const ratio = grams / 100;

  return {
    name: getDisplayName(descriptionPart, reference),
    estimatedGrams: round(grams),
    kcal: round(nutritionReference.per100g.kcal * ratio),
    protein: round(nutritionReference.per100g.protein * ratio),
    carbs: round(nutritionReference.per100g.carbs * ratio),
    fat: round(nutritionReference.per100g.fat * ratio),
    confidence: reference ? (hasExplicitPortion ? 0.76 : 0.64) : 0.35,
  };
};

export const estimateMealDescriptionLocally = (description) => {
  const items = splitDescription(description).map(estimateItem);
  if (items.length === 0) {
    throw new Error('Describe at least one food item before analyzing.');
  }

  const totals = items.reduce((sum, item) => ({
    totalKcal: sum.totalKcal + item.kcal,
    totalProtein: sum.totalProtein + item.protein,
    totalCarbs: sum.totalCarbs + item.carbs,
    totalFat: sum.totalFat + item.fat,
    confidence: sum.confidence + item.confidence,
  }), {
    totalKcal: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    confidence: 0,
  });

  return {
    mealName: items.slice(0, 3).map(item => item.name).join(', ') || 'Estimated Meal',
    totalKcal: round(totals.totalKcal),
    totalProtein: round(totals.totalProtein),
    totalCarbs: round(totals.totalCarbs),
    totalFat: round(totals.totalFat),
    confidence: roundConfidence(totals.confidence / items.length),
    items,
    notes: 'The remote AI service is unavailable, so this estimate uses common nutrition values and reference portions. Review portions and macros before saving.',
  };
};
