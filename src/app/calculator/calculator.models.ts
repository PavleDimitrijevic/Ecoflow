export type BusinessCategoryId =
  | 'universityNoAccommodation'
  | 'universityWithAccommodation'
  | 'corporateCafeteria'
  | 'institution'
  | 'foodWholesale'
  | 'groceryStore'
  | 'hospital'
  | 'hotel'
  | 'careHome'
  | 'household'
  | 'fullServiceRestaurant'
  | 'limitedServiceRestaurant'
  | 'school'
  | 'supermarket'
  | 'venue';

export type CalculationMethodId =
  | 'meals'
  | 'students'
  | 'employees'
  | 'beds'
  | 'rooms'
  | 'residents'
  | 'householdMembers'
  | 'seats'
  | 'visitors'
  | 'knownDailyWaste';

export type GriffonModelId =
  | 'g50'
  | 'g100g150'
  | 'g250'
  | 'g500'
  | 'g1000'
  | 'custom';

export type WizardStep = 'category' | 'method' | 'result';

export interface CategoryConfig {
  id: BusinessCategoryId;
  labelKey: string;
  methods: readonly CalculationMethodId[];
}

export interface CalculationMethodConfig {
  id: CalculationMethodId;
  labelKey: string;
  descriptionKey: string;
  inputLabelKey: string;
  integerOnly: boolean;
  min: number;
  max: number;
  step: number;
}

export interface CalculatorInput {
  categoryId: BusinessCategoryId;
  methodId: CalculationMethodId;
  quantity: number;
  operatingDaysPerWeek: number;
}

export interface GriffonModel {
  id: GriffonModelId;
  nameKey: string;
  calculatorMinKgPerDayExclusive: number;
  calculatorMaxKgPerDay: number;
  publishedCapacityKey?: string;
  weightValueKey?: string;
  dimensionsValueKey?: string;
  motorValueKey?: string;
  idealForKey?: string;
  customDescriptionKey?: string;
}

export type GriffonRecommendation =
  | {
      type: 'none';
      model: null;
    }
  | {
      type: 'model';
      model: GriffonModel;
    }
  | {
      type: 'custom';
      model: GriffonModel;
    };

export interface CalculatorResult {
  dailyWasteKg: number;
  weeklyWasteKg: number;
  monthlyWasteKg: number;
  annualWasteKg: number;
  recommendation: GriffonRecommendation;
}
