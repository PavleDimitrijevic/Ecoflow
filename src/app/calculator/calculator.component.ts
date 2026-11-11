import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

// keep in step with the max-width: 48rem rule that hides the Continue button
const SMALL_SCREEN_QUERY = '(max-width: 48rem)';

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

  @ViewChild('wizard') private wizard?: ElementRef<HTMLElement>;

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

  result: CalculatorResult | null = null;
  currentStep: WizardStep = 'category';
  // step 2 shows one card at a time: the method list, then the values for it
  methodView: 'choose' | 'values' = 'choose';
  // field errors stay hidden until the visitor first presses Calculate
  submitAttempted = false;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });

    this.form.controls.category.valueChanges.subscribe((categoryId) => {
      if (!categoryId) {
        this.form.controls.method.reset(null, { emitEvent: false });
        this.form.controls.quantity.reset(null, { emitEvent: false });
        return;
      }

      const availableMethods = this.getMethodsForCategory(categoryId);
      const selectedMethod = this.form.controls.method.value;

      if (
        !selectedMethod ||
        !availableMethods.some((method) => method.id === selectedMethod)
      ) {
        // a category with a single method needs no second choice
        this.form.controls.method.reset(
          availableMethods.length === 1 ? availableMethods[0].id : null,
        );
      }
    });

    this.form.controls.method.valueChanges.subscribe((methodId) => {
      const quantityControl = this.form.controls.quantity;

      if (!methodId) {
        quantityControl.reset(null, { emitEvent: false });
        quantityControl.clearValidators();
        quantityControl.updateValueAndValidity({ emitEvent: false });
        return;
      }

      // a new method brings a new empty field; don't greet it with an error
      this.submitAttempted = false;

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

    // the result follows the form: every change recalculates it
    this.form.valueChanges.subscribe(() => this.recalculate());
  }

  get selectedCategory(): CategoryConfig | null {
    const categoryId = this.form.controls.category.value;

    return categoryId
      ? (this.categories.find((category) => category.id === categoryId) ?? null)
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

  // photo of the recommended model, when the result names one
  get resultPhoto(): { src: string; altKey?: string } | null {
    const recommendation = this.result?.recommendation;

    if (recommendation?.type !== 'model' || !recommendation.model.imagePath) {
      return null;
    }

    return {
      src: recommendation.model.imagePath,
      altKey: recommendation.model.imageAltKey,
    };
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

  continueToMethodStep(): void {
    if (!this.selectedCategory) {
      return;
    }

    this.methodView =
      this.availableMethods.length === 1 && this.selectedMethod
        ? 'values'
        : 'choose';
    this.goToStep('method');
  }

  // small screens: picking a category goes straight on, there is no Continue button
  onCategoryPicked(): void {
    if (!window.matchMedia(SMALL_SCREEN_QUERY).matches) {
      return;
    }

    // the radio's value lands after the click; a short pause also lets the chip
    // light up before the step changes
    setTimeout(() => this.continueToMethodStep(), 200);
  }

  showValues(): void {
    this.methodView = 'values';

    // once the values card has taken focus, put the cursor in its first field; on narrow
    // screens the card sits below the methods, so bring it into view
    setTimeout(() => {
      document
        .getElementById('calculator-quantity')
        ?.focus({ preventScroll: true });
      document
        .querySelector('.calc__card--values')
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 450);
  }

  calculate(): void {
    this.submitAttempted = true;

    if (!this.result) {
      return;
    }

    this.goToStep('result');
  }

  goBack(): void {
    if (this.currentStep === 'result') {
      this.methodView = 'values';
      this.goToStep('method');
      return;
    }

    if (
      this.currentStep === 'method' &&
      this.methodView === 'values' &&
      this.availableMethods.length > 1
    ) {
      this.methodView = 'choose';
      return;
    }

    this.goToStep('category');
  }

  isCategorySelected(categoryId: BusinessCategoryId): boolean {
    return this.form.controls.category.value === categoryId;
  }

  isMethodSelected(methodId: CalculationMethodId): boolean {
    return this.form.controls.method.value === methodId;
  }

  startAgain(): void {
    this.form.reset({
      category: null,
      method: null,
      quantity: null,
      operatingDaysPerWeek: CALCULATOR_DEFAULTS.operatingDaysPerWeek,
    });

    this.result = null;
    this.submitAttempted = false;
    this.methodView = 'choose';
    this.goToStep('category');
  }

  getControlErrorKey(
    controlName: 'quantity' | 'operatingDaysPerWeek',
  ): string | null {
    const control = this.form.controls[controlName];

    if (!this.submitAttempted || !control.errors) {
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

  // swaps the step in place; scrolls back only if the top of the calculator has left the screen
  private goToStep(step: WizardStep): void {
    this.currentStep = step;

    const wizard = this.wizard?.nativeElement;
    if (!wizard) {
      return;
    }

    const navHeight = document.querySelector('.nav')?.getBoundingClientRect().height ?? 0;
    const top = wizard.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    if (window.scrollY > top) {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  private recalculate(): void {
    const formValue = this.form.getRawValue();

    if (
      this.form.invalid ||
      !formValue.category ||
      !formValue.method ||
      formValue.quantity === null ||
      formValue.operatingDaysPerWeek === null
    ) {
      this.result = null;
      return;
    }

    const input: CalculatorInput = {
      categoryId: formValue.category,
      methodId: formValue.method,
      quantity: formValue.quantity,
      operatingDaysPerWeek: formValue.operatingDaysPerWeek,
    };

    this.result = calculateCalculatorResult(input);
  }

  private getMethodsForCategory(
    categoryId: BusinessCategoryId,
  ): CalculationMethodConfig[] {
    const category = this.categories.find((item) => item.id === categoryId);

    if (!category) {
      return [];
    }

    return category.methods.map((methodId) => this.methodConfigs[methodId]);
  }
}
