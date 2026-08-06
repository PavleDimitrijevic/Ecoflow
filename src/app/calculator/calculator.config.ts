import {
  CalculationMethodConfig,
  CalculationMethodId,
  CategoryConfig,
  GriffonModel,
} from './calculator.models';

export const FOOD_WASTE_PER_MEAL_KG = 0.4;

export const CALCULATOR_DEFAULTS = {
  operatingDaysPerWeek: 7,
} as const;

export const OPERATING_DAYS_LIMITS = {
  min: 1,
  max: 7,
} as const;

export const CATEGORY_CONFIGS: readonly CategoryConfig[] = [
  {
    id: 'universityNoAccommodation',
    labelKey: 'CALCULATOR_CATEGORY_UNIVERSITY_NO_ACCOMMODATION',
    methods: ['students', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'universityWithAccommodation',
    labelKey: 'CALCULATOR_CATEGORY_UNIVERSITY_WITH_ACCOMMODATION',
    methods: ['students', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'corporateCafeteria',
    labelKey: 'CALCULATOR_CATEGORY_CORPORATE_CAFETERIA',
    methods: ['employees', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'institution',
    labelKey: 'CALCULATOR_CATEGORY_INSTITUTION',
    methods: ['residents', 'beds', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'foodWholesale',
    labelKey: 'CALCULATOR_CATEGORY_FOOD_WHOLESALE',
    methods: ['knownDailyWaste'],
  },
  {
    id: 'groceryStore',
    labelKey: 'CALCULATOR_CATEGORY_GROCERY_STORE',
    methods: ['employees', 'knownDailyWaste'],
  },
  {
    id: 'hospital',
    labelKey: 'CALCULATOR_CATEGORY_HOSPITAL',
    methods: ['beds', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'hotel',
    labelKey: 'CALCULATOR_CATEGORY_HOTEL',
    methods: ['rooms', 'meals', 'employees', 'knownDailyWaste'],
  },
  {
    id: 'careHome',
    labelKey: 'CALCULATOR_CATEGORY_CARE_HOME',
    methods: ['residents', 'beds', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'household',
    labelKey: 'CALCULATOR_CATEGORY_HOUSEHOLD',
    methods: ['householdMembers', 'knownDailyWaste'],
  },
  {
    id: 'fullServiceRestaurant',
    labelKey: 'CALCULATOR_CATEGORY_FULL_SERVICE_RESTAURANT',
    methods: ['meals', 'employees', 'knownDailyWaste'],
  },
  {
    id: 'limitedServiceRestaurant',
    labelKey: 'CALCULATOR_CATEGORY_LIMITED_SERVICE_RESTAURANT',
    methods: ['meals', 'employees', 'knownDailyWaste'],
  },
  {
    id: 'school',
    labelKey: 'CALCULATOR_CATEGORY_SCHOOL',
    methods: ['students', 'meals', 'knownDailyWaste'],
  },
  {
    id: 'supermarket',
    labelKey: 'CALCULATOR_CATEGORY_SUPERMARKET',
    methods: ['knownDailyWaste'],
  },
  {
    id: 'venue',
    labelKey: 'CALCULATOR_CATEGORY_VENUE',
    methods: ['visitors', 'seats', 'meals', 'knownDailyWaste'],
  },
] as const;

export const CALCULATION_METHODS: Readonly<
  Record<CalculationMethodId, CalculationMethodConfig>
> = {
  meals: {
    id: 'meals',
    labelKey: 'CALCULATOR_METHOD_MEALS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_MEALS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_MEALS_LABEL',
    integerOnly: true,
    min: 1,
    max: 500000,
    step: 1,
  },
  students: {
    id: 'students',
    labelKey: 'CALCULATOR_METHOD_STUDENTS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_STUDENTS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_STUDENTS_LABEL',
    integerOnly: true,
    min: 1,
    max: 200000,
    step: 1,
  },
  employees: {
    id: 'employees',
    labelKey: 'CALCULATOR_METHOD_EMPLOYEES_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_EMPLOYEES_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_EMPLOYEES_LABEL',
    integerOnly: true,
    min: 1,
    max: 200000,
    step: 1,
  },
  beds: {
    id: 'beds',
    labelKey: 'CALCULATOR_METHOD_BEDS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_BEDS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_BEDS_LABEL',
    integerOnly: true,
    min: 1,
    max: 100000,
    step: 1,
  },
  rooms: {
    id: 'rooms',
    labelKey: 'CALCULATOR_METHOD_ROOMS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_ROOMS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_ROOMS_LABEL',
    integerOnly: true,
    min: 1,
    max: 100000,
    step: 1,
  },
  residents: {
    id: 'residents',
    labelKey: 'CALCULATOR_METHOD_RESIDENTS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_RESIDENTS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_RESIDENTS_LABEL',
    integerOnly: true,
    min: 1,
    max: 100000,
    step: 1,
  },
  householdMembers: {
    id: 'householdMembers',
    labelKey: 'CALCULATOR_METHOD_HOUSEHOLD_MEMBERS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_HOUSEHOLD_MEMBERS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_HOUSEHOLD_MEMBERS_LABEL',
    integerOnly: true,
    min: 1,
    max: 50,
    step: 1,
  },
  seats: {
    id: 'seats',
    labelKey: 'CALCULATOR_METHOD_SEATS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_SEATS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_SEATS_LABEL',
    integerOnly: true,
    min: 1,
    max: 100000,
    step: 1,
  },
  visitors: {
    id: 'visitors',
    labelKey: 'CALCULATOR_METHOD_VISITORS_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_VISITORS_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_VISITORS_LABEL',
    integerOnly: true,
    min: 1,
    max: 500000,
    step: 1,
  },
  knownDailyWaste: {
    id: 'knownDailyWaste',
    labelKey: 'CALCULATOR_METHOD_KNOWN_DAILY_WASTE_LABEL',
    descriptionKey: 'CALCULATOR_METHOD_KNOWN_DAILY_WASTE_DESCRIPTION',
    inputLabelKey: 'CALCULATOR_INPUT_KNOWN_DAILY_WASTE_LABEL',
    integerOnly: false,
    min: 0.1,
    max: 100000,
    step: 0.1,
  },
};

// TODO: Replace with confirmed Ecoflow business factor.
export const WASTE_FACTORS: Readonly<
  Record<Exclude<CalculationMethodId, 'meals' | 'knownDailyWaste'>, number>
> = {
  students: 0.12,
  employees: 0.18,
  beds: 0.95,
  rooms: 0.65,
  residents: 0.75,
  householdMembers: 0.25,
  seats: 0.16,
  visitors: 0.08,
};

export const GRIFFON_MODELS: readonly GriffonModel[] = [
  {
    id: 'g50',
    nameKey: 'PRODUCT1_TITLE',
    calculatorMinKgPerDayExclusive: 0,
    calculatorMaxKgPerDay: 50,
    publishedCapacityKey: 'PRODUCT1_CAPACITY',
    weightValueKey: 'PRODUCT1_WEIGHT_VALUE',
    dimensionsValueKey: 'PRODUCT1_DIMENSIONS_VALUE',
    motorValueKey: 'PRODUCT1_MOTOR_VALUE',
    idealForKey: 'PRODUCT1_IDEAL_FOR',
    imagePath: 'images/gr50.png',
    imageAltKey: 'CALCULATOR_PRODUCT1_IMAGE_ALT',
  },
  {
    id: 'g100g150',
    nameKey: 'PRODUCT2_TITLE',
    calculatorMinKgPerDayExclusive: 50,
    calculatorMaxKgPerDay: 150,
    publishedCapacityKey: 'PRODUCT2_CAPACITY',
    weightValueKey: 'PRODUCT2_WEIGHT_VALUE',
    dimensionsValueKey: 'PRODUCT2_DIMENSIONS_VALUE',
    motorValueKey: 'PRODUCT2_MOTOR_VALUE',
    idealForKey: 'PRODUCT2_IDEAL_FOR',
    imagePath: 'images/gr150.png',
    imageAltKey: 'CALCULATOR_PRODUCT2_IMAGE_ALT',
  },
  {
    id: 'g250',
    nameKey: 'PRODUCT3_TITLE',
    calculatorMinKgPerDayExclusive: 150,
    calculatorMaxKgPerDay: 250,
    publishedCapacityKey: 'PRODUCT3_CAPACITY',
    weightValueKey: 'PRODUCT3_WEIGHT_VALUE',
    dimensionsValueKey: 'PRODUCT3_DIMENSIONS_VALUE',
    motorValueKey: 'PRODUCT3_MOTOR_VALUE',
    idealForKey: 'PRODUCT3_IDEAL_FOR',
    imagePath: 'images/gr250.png',
    imageAltKey: 'CALCULATOR_PRODUCT3_IMAGE_ALT',
  },
  {
    id: 'g500',
    nameKey: 'PRODUCT4_TITLE',
    calculatorMinKgPerDayExclusive: 250,
    calculatorMaxKgPerDay: 500,
    publishedCapacityKey: 'PRODUCT4_CAPACITY',
    weightValueKey: 'PRODUCT4_WEIGHT_VALUE',
    dimensionsValueKey: 'PRODUCT4_DIMENSIONS_VALUE',
    motorValueKey: 'PRODUCT4_MOTOR_VALUE',
    idealForKey: 'PRODUCT4_IDEAL_FOR',
    imagePath: 'images/gr500.png',
    imageAltKey: 'CALCULATOR_PRODUCT4_IMAGE_ALT',
  },
  {
    id: 'g1000',
    nameKey: 'PRODUCT5_TITLE',
    calculatorMinKgPerDayExclusive: 500,
    calculatorMaxKgPerDay: 1000,
    publishedCapacityKey: 'PRODUCT5_CAPACITY',
    weightValueKey: 'PRODUCT5_WEIGHT_VALUE',
    dimensionsValueKey: 'PRODUCT5_DIMENSIONS_VALUE',
    motorValueKey: 'PRODUCT5_MOTOR_VALUE',
    idealForKey: 'PRODUCT5_IDEAL_FOR',
    imagePath: 'images/gr1000.png',
    imageAltKey: 'CALCULATOR_PRODUCT5_IMAGE_ALT',
  },
  {
    id: 'custom',
    nameKey: 'CALCULATOR_CUSTOM_SOLUTION',
    calculatorMinKgPerDayExclusive: 1000,
    calculatorMaxKgPerDay: Number.POSITIVE_INFINITY,
    customDescriptionKey: 'CALCULATOR_CUSTOM_SOLUTION_DESCRIPTION',
  },
] as const;
