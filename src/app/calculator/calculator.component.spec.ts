import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(CalculatorComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('starts on the category step', () => {
    const fixture = TestBed.createComponent(CalculatorComponent);
    const component = fixture.componentInstance;

    expect(component.currentStep).toBe('category');
  });

  it('does not show a result before calculation', () => {
    const fixture = TestBed.createComponent(CalculatorComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.result).toBeNull();
    expect(fixture.nativeElement.querySelector('.calculator-result')).toBeNull();
  });

  it('resets back to the initial state', () => {
    const fixture = TestBed.createComponent(CalculatorComponent);
    const component = fixture.componentInstance;

    component.form.patchValue({
      category: 'fullServiceRestaurant',
      method: 'meals',
      quantity: 250,
      operatingDaysPerWeek: 7,
    });
    component.currentStep = 'result';
    component.calculate();
    component.startAgain();

    expect(component.currentStep).toBe('category');
    expect(component.result).toBeNull();
    expect(component.form.controls.category.value).toBeNull();
    expect(component.form.controls.method.value).toBeNull();
    expect(component.form.controls.quantity.value).toBeNull();
    expect(component.form.controls.operatingDaysPerWeek.value).toBe(7);
  });

  it('moves through the steps one at a time', () => {
    const fixture = TestBed.createComponent(CalculatorComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.continueToMethodStep();
    expect(component.currentStep).toBe('category');

    component.form.patchValue({ category: 'hotel' });
    component.continueToMethodStep();
    expect(component.currentStep).toBe('method');

    component.calculate();
    expect(component.currentStep).toBe('method');

    expect(component.methodView).toBe('choose');
    component.form.patchValue({ method: 'rooms' });
    component.showValues();
    expect(component.methodView).toBe('values');
    component.form.patchValue({ quantity: 120 });
    component.calculate();
    expect(component.currentStep).toBe('result');
    expect(component.result?.dailyWasteKg).toBe(78);

    component.goBack();
    expect(component.currentStep).toBe('method');
    expect(component.methodView).toBe('values');
    component.goBack();
    expect(component.currentStep).toBe('method');
    expect(component.methodView).toBe('choose');
    component.goBack();
    expect(component.currentStep).toBe('category');
  });

  it('skips the method list when a category has only one method', () => {
    const fixture = TestBed.createComponent(CalculatorComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.form.patchValue({ category: 'foodWholesale' });
    component.continueToMethodStep();

    expect(component.currentStep).toBe('method');
    expect(component.methodView).toBe('values');
    component.goBack();
    expect(component.currentStep).toBe('category');
  });
});
