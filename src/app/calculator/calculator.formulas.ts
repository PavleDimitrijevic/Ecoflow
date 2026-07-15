import {
  CALCULATION_METHODS,
  FOOD_WASTE_PER_MEAL_KG,
  GRIFFON_MODELS,
  OPERATING_DAYS_LIMITS,
  WASTE_FACTORS,
} from './calculator.config';
import {
  CalculationMethodId,
  CalculatorInput,
  CalculatorResult,
  GriffonRecommendation,
} from './calculator.models';

interface NumericValidationOptions {
  min?: number;
  max?: number;
  integerOnly?: boolean;
}

function parseNumericValue(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function normalizeNumericValue(
  value: unknown,
  options: NumericValidationOptions = {},
): number | null {
  const parsed = parseNumericValue(value);

  if (parsed === null) {
    return null;
  }

  const { min, max, integerOnly } = options;

  if (min !== undefined && parsed < min) {
    return null;
  }

  if (max !== undefined && parsed > max) {
    return null;
  }

  if (integerOnly && !Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

export function roundWasteValue(value: number, decimals: number = 1): number {
  const factor = 10 ** decimals;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;

  return Number.isInteger(rounded) ? rounded : rounded;
}

function getQuantityLimit(methodId: CalculationMethodId) {
  const method = CALCULATION_METHODS[methodId];

  return {
    min: method.min,
    max: method.max,
    integerOnly: method.integerOnly,
  };
}

export function estimateDailyWasteKg(input: CalculatorInput): number | null {
  const quantity = normalizeNumericValue(
    input.quantity,
    getQuantityLimit(input.methodId),
  );

  if (quantity === null) {
    return null;
  }

  switch (input.methodId) {
    case 'meals':
      return quantity * FOOD_WASTE_PER_MEAL_KG;
    case 'knownDailyWaste':
      return quantity;
    default:
      return quantity * WASTE_FACTORS[input.methodId];
  }
}

export function calculateWastePeriods(
  dailyWasteKg: unknown,
  operatingDaysPerWeek: unknown,
) {
  const normalizedDailyWaste = normalizeNumericValue(dailyWasteKg, {
    min: 0.000001,
  });
  const normalizedDays = normalizeNumericValue(operatingDaysPerWeek, {
    min: OPERATING_DAYS_LIMITS.min,
    max: OPERATING_DAYS_LIMITS.max,
    integerOnly: true,
  });

  if (normalizedDailyWaste === null || normalizedDays === null) {
    return null;
  }

  const weeklyWasteKg = normalizedDailyWaste * normalizedDays;
  const annualWasteKg = weeklyWasteKg * 52;
  const monthlyWasteKg = annualWasteKg / 12;

  return {
    dailyWasteKg: roundWasteValue(normalizedDailyWaste),
    weeklyWasteKg: roundWasteValue(weeklyWasteKg),
    monthlyWasteKg: roundWasteValue(monthlyWasteKg, 1),
    annualWasteKg: roundWasteValue(annualWasteKg),
  };
}

export function getGriffonRecommendation(
  dailyWasteKg: unknown,
): GriffonRecommendation {
  const normalizedDailyWaste = normalizeNumericValue(dailyWasteKg, {
    min: 0.000001,
  });

  if (normalizedDailyWaste === null) {
    return {
      type: 'none',
      model: null,
    };
  }

  const model =
    GRIFFON_MODELS.find(
      (candidate) =>
        normalizedDailyWaste > candidate.calculatorMinKgPerDayExclusive &&
        normalizedDailyWaste <= candidate.calculatorMaxKgPerDay,
    ) ?? null;

  if (!model) {
    return {
      type: 'none',
      model: null,
    };
  }

  if (model.id === 'custom') {
    return {
      type: 'custom',
      model,
    };
  }

  return {
    type: 'model',
    model,
  };
}

export function calculateCalculatorResult(
  input: CalculatorInput,
): CalculatorResult | null {
  const dailyWasteKg = estimateDailyWasteKg(input);

  if (dailyWasteKg === null) {
    return null;
  }

  const periods = calculateWastePeriods(dailyWasteKg, input.operatingDaysPerWeek);

  if (!periods) {
    return null;
  }

  return {
    ...periods,
    recommendation: getGriffonRecommendation(dailyWasteKg),
  };
}
