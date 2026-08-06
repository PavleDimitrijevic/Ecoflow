// import {
//   calculateCalculatorResult,
//   calculateWastePeriods,
//   estimateDailyWasteKg,
//   getGriffonRecommendation,
//   normalizeNumericValue,
// } from './calculator.formulas';

// describe('calculator formulas', () => {
//   it('calculates meal-based waste for 100 meals per day', () => {
//     const result = estimateDailyWasteKg({
//       categoryId: 'fullServiceRestaurant',
//       methodId: 'meals',
//       quantity: 100,
//       operatingDaysPerWeek: 7,
//     });

//     expect(result).toBe(40);
//   });

//   it('calculates meal-based waste for 250 meals per day', () => {
//     const result = estimateDailyWasteKg({
//       categoryId: 'fullServiceRestaurant',
//       methodId: 'meals',
//       quantity: 250,
//       operatingDaysPerWeek: 7,
//     });

//     expect(result).toBe(100);
//   });

//   it('returns known daily waste directly', () => {
//     const result = estimateDailyWasteKg({
//       categoryId: 'supermarket',
//       methodId: 'knownDailyWaste',
//       quantity: 125.5,
//       operatingDaysPerWeek: 7,
//     });

//     expect(result).toBe(125.5);
//   });

//   it('calculates weekly, monthly, and annual waste totals', () => {
//     const periods = calculateWastePeriods(100, 5);

//     expect(periods).not.toBeNull();
//     expect(periods?.weeklyWasteKg).toBe(500);
//     expect(periods?.annualWasteKg).toBe(26000);
//     expect(periods?.monthlyWasteKg).toBeCloseTo(26000 / 12, 1);
//   });

//   it('returns no valid recommendation for zero or negative daily waste', () => {
//     expect(getGriffonRecommendation(0).type).toBe('none');
//     expect(getGriffonRecommendation(-1).type).toBe('none');
//   });

//   it('matches all recommendation boundaries', () => {
//     expect(getGriffonRecommendation(0.1).model?.id).toBe('g50');
//     expect(getGriffonRecommendation(50).model?.id).toBe('g50');
//     expect(getGriffonRecommendation(50.01).model?.id).toBe('g100g150');
//     expect(getGriffonRecommendation(150).model?.id).toBe('g100g150');
//     expect(getGriffonRecommendation(150.01).model?.id).toBe('g250');
//     expect(getGriffonRecommendation(250).model?.id).toBe('g250');
//     expect(getGriffonRecommendation(250.01).model?.id).toBe('g500');
//     expect(getGriffonRecommendation(500).model?.id).toBe('g500');
//     expect(getGriffonRecommendation(500.01).model?.id).toBe('g1000');
//     expect(getGriffonRecommendation(1000).model?.id).toBe('g1000');
//     expect(getGriffonRecommendation(1000.01).type).toBe('custom');
//   });

//   it('safely rejects invalid numeric values', () => {
//     expect(normalizeNumericValue(Number.NaN, { min: 1 })).toBeNull();
//     expect(normalizeNumericValue(Number.POSITIVE_INFINITY, { min: 1 })).toBeNull();
//     expect(normalizeNumericValue(Number.NEGATIVE_INFINITY, { min: 1 })).toBeNull();
//     expect(normalizeNumericValue(-25, { min: 0.1 })).toBeNull();
//   });

//   it('builds a full calculator result for valid input', () => {
//     const result = calculateCalculatorResult({
//       categoryId: 'fullServiceRestaurant',
//       methodId: 'meals',
//       quantity: 250,
//       operatingDaysPerWeek: 7,
//     });

//     expect(result).not.toBeNull();
//     expect(result?.dailyWasteKg).toBe(100);
//     expect(result?.recommendation.model?.id).toBe('g100g150');
//   });
// });
