import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  CALCULATOR_DEFAULTS,
  CALCULATION_METHODS,
  CATEGORY_CONFIGS,
  OPERATING_DAYS_LIMITS,
} from './calculator.config';
import { calculateCalculatorResult } from './calculator.formulas';
import {
  CalculationMethodConfig,
  CalculationMethodId,
  CalculatorInput,
  CalculatorResult,
  BusinessCategoryId,
  CategoryConfig,
  WizardStep,
} from './calculator.models';

type CalculatorFormGroup = FormGroup<{
  category: FormControl<BusinessCategoryId | null>;
  method: FormControl<CalculationMethodId | null>;
  quantity: FormControl<number | null>;
  operatingDaysPerWeek: FormControl<number | null>;
}>;

const finiteNumberValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (value === null || value === undefined) {
    return null;
  }

  return Number.isFinite(value) ? null : { finite: true };
};

const positiveNumberValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (value === null || value === undefined) {
    return null;
  }

  return value > 0 ? null : { positive: true };
};

const integerValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (value === null || value === undefined) {
    return null;
  }

  return Number.isInteger(value) ? null : { integer: true };
};

function maxValueValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined) {
      return null;
    }

    return value <= max ? null : { maxValue: true };
  };
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  readonly categories = CATEGORY_CONFIGS;
  readonly methodConfigs = CALCULATION_METHODS;
  readonly operatingDaysLimits = OPERATING_DAYS_LIMITS;
  readonly steps: readonly WizardStep[] = ['category', 'method', 'result'];

  readonly form: CalculatorFormGroup = new FormGroup({
    category: new FormControl<BusinessCategoryId | null>(null, {
      validators: [Validators.required],
    }),
    method: new FormControl<CalculationMethodId | null>(null, {
      validators: [Validators.required],
    }),
    quantity: new FormControl<number | null>(null),
    operatingDaysPerWeek: new FormControl<number | null>(
      CALCULATOR_DEFAULTS.operatingDaysPerWeek,
      {
        validators: [
          Validators.required,
          finiteNumberValidator,
          positiveNumberValidator,
          integerValidator,
          Validators.min(OPERATING_DAYS_LIMITS.min),
          Validators.max(OPERATING_DAYS_LIMITS.max),
        ],
      },
    ),
  });

  currentStep: WizardStep = 'category';
  result: CalculatorResult | null = null;
  hasSubmittedStepTwo = false;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });

    this.form.controls.category.valueChanges.subscribe((categoryId) => {
      this.result = null;

      if (!categoryId) {
        this.form.controls.method.reset(null, { emitEvent: false });
        this.form.controls.quantity.reset(null, { emitEvent: false });
        return;
      }

      const availableMethods = this.getMethodsForCategory(categoryId);
      const selectedMethod = this.form.controls.method.value;

      if (!selectedMethod || !availableMethods.some((method) => method.id === selectedMethod)) {
        this.form.controls.method.reset(null);
      }
    });

    this.form.controls.method.valueChanges.subscribe((methodId) => {
      this.result = null;
      this.hasSubmittedStepTwo = false;

      const quantityControl = this.form.controls.quantity;

      if (!methodId) {
        quantityControl.reset(null, { emitEvent: false });
        quantityControl.clearValidators();
        quantityControl.updateValueAndValidity({ emitEvent: false });
        return;
      }

      const methodConfig = this.methodConfigs[methodId];
      const validators: ValidatorFn[] = [
        Validators.required,
        finiteNumberValidator,
        positiveNumberValidator,
        maxValueValidator(methodConfig.max),
      ];

      if (methodConfig.integerOnly) {
        validators.push(integerValidator);
      }

      quantityControl.setValidators(validators);
      quantityControl.reset(null, { emitEvent: false });
      quantityControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  get selectedCategory(): CategoryConfig | null {
    const categoryId = this.form.controls.category.value;

    return categoryId
      ? this.categories.find((category) => category.id === categoryId) ?? null
      : null;
  }

  get availableMethods(): CalculationMethodConfig[] {
    if (!this.selectedCategory) {
      return [];
    }

    return this.getMethodsForCategory(this.selectedCategory.id);
  }

  get selectedMethod(): CalculationMethodConfig | null {
    const methodId = this.form.controls.method.value;

    return methodId ? this.methodConfigs[methodId] : null;
  }

  get quantityInputStep(): number {
    return this.selectedMethod?.step ?? 1;
  }

  get quantityInputMode(): 'decimal' | 'numeric' {
    return this.selectedMethod?.integerOnly ? 'numeric' : 'decimal';
  }

  isStepActive(step: WizardStep): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: WizardStep): boolean {
    return this.steps.indexOf(step) < this.steps.indexOf(this.currentStep);
  }

  isCategorySelected(categoryId: BusinessCategoryId): boolean {
    return this.form.controls.category.value === categoryId;
  }

  isMethodSelected(methodId: CalculationMethodId): boolean {
    return this.form.controls.method.value === methodId;
  }

  continueToMethodStep(): void {
    if (this.form.controls.category.invalid) {
      this.form.controls.category.markAsTouched();
      return;
    }

    this.currentStep = 'method';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    if (this.currentStep === 'result') {
      this.currentStep = 'method';
      return;
    }

    this.currentStep = 'category';
  }

  calculate(): void {
    this.hasSubmittedStepTwo = true;

    this.form.controls.method.markAsTouched();
    this.form.controls.quantity.markAsTouched();
    this.form.controls.operatingDaysPerWeek.markAsTouched();

    if (!this.selectedMethod || this.form.controls.method.invalid) {
      return;
    }

    if (
      this.form.controls.quantity.invalid ||
      this.form.controls.operatingDaysPerWeek.invalid ||
      this.form.controls.category.invalid
    ) {
      return;
    }

    const formValue = this.form.getRawValue();

    if (
      !formValue.category ||
      !formValue.method ||
      formValue.quantity === null ||
      formValue.operatingDaysPerWeek === null
    ) {
      return;
    }

    const input: CalculatorInput = {
      categoryId: formValue.category,
      methodId: formValue.method,
      quantity: formValue.quantity,
      operatingDaysPerWeek: formValue.operatingDaysPerWeek,
    };

    this.result = calculateCalculatorResult(input);

    if (!this.result) {
      return;
    }

    this.currentStep = 'result';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startAgain(): void {
    this.form.reset({
      category: null,
      method: null,
      quantity: null,
      operatingDaysPerWeek: CALCULATOR_DEFAULTS.operatingDaysPerWeek,
    });

    this.result = null;
    this.hasSubmittedStepTwo = false;
    this.currentStep = 'category';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getControlErrorKey(controlName: 'category' | 'method' | 'quantity' | 'operatingDaysPerWeek'): string | null {
    const control = this.form.controls[controlName];
    const shouldShow = control.touched || this.hasSubmittedStepTwo;

    if (!shouldShow || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'CALCULATOR_REQUIRED_ERROR';
    }

    if (control.errors['positive']) {
      return 'CALCULATOR_POSITIVE_NUMBER_ERROR';
    }

    if (control.errors['integer']) {
      return 'CALCULATOR_INTEGER_ERROR';
    }

    if (control.errors['min'] || control.errors['max']) {
      return controlName === 'operatingDaysPerWeek'
        ? 'CALCULATOR_DAYS_RANGE_ERROR'
        : 'CALCULATOR_POSITIVE_NUMBER_ERROR';
    }

    if (control.errors['maxValue']) {
      return 'CALCULATOR_MAX_VALUE_ERROR';
    }

    if (control.errors['finite']) {
      return 'CALCULATOR_POSITIVE_NUMBER_ERROR';
    }

    return null;
  }

  private getMethodsForCategory(categoryId: BusinessCategoryId): CalculationMethodConfig[] {
    const category = this.categories.find((item) => item.id === categoryId);

    if (!category) {
      return [];
    }

    return category.methods.map((methodId) => this.methodConfigs[methodId]);
  }
}
