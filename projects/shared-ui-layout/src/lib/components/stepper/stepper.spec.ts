import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject } from 'rxjs';
import { StepperStepComponent } from './stepper-step';
import { StepperComponent } from './stepper';

class BreakpointObserverStub {
  readonly state = new BehaviorSubject<BreakpointState>({
    matches: false,
    breakpoints: {},
  });

  observe(): BehaviorSubject<BreakpointState> {
    return this.state;
  }
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, StepperComponent, StepperStepComponent],
  template: `
    <shared-stepper
      ariaLabel="Application wizard"
      [linear]="true"
      (stepSkipped)="skippedIndex = $event"
      (finished)="finished = true"
    >
      <shared-stepper-step label="Required details" [stepControl]="detailsForm">
        <form [formGroup]="detailsForm">
          <label for="customer-name">Customer name</label>
          <input id="customer-name" formControlName="name" />
        </form>
      </shared-stepper-step>
      <shared-stepper-step label="Optional note" [optional]="true">
        <p>Projected optional content</p>
      </shared-stepper-step>
      <shared-stepper-step label="Review" [completed]="true">
        <p>Review the application</p>
      </shared-stepper-step>
    </shared-stepper>
  `,
})
class StepperHostComponent {
  readonly detailsForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  skippedIndex?: number;
  finished = false;
}

describe('StepperComponent', () => {
  let fixture: ComponentFixture<StepperHostComponent>;
  let breakpointObserver: BreakpointObserverStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHostComponent, NoopAnimationsModule],
      providers: [{ provide: BreakpointObserver, useClass: BreakpointObserverStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperHostComponent);
    breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;
    fixture.detectChanges();
  });

  it('projects step content and exposes labelled step tabs', () => {
    const region = fixture.nativeElement.querySelector(
      'section[aria-label="Application wizard"]',
    ) as HTMLElement;
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');

    expect(region).not.toBeNull();
    expect(tabs.length).toBe(3);
    expect(tabs[0].textContent).toContain('Required details');
    expect(fixture.nativeElement.textContent).toContain('Projected optional content');
  });

  it('switches to vertical orientation at the configured responsive breakpoint', () => {
    breakpointObserver.state.next({ matches: true, breakpoints: {} });
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('mat-stepper') as HTMLElement;
    expect(stepper.classList).toContain('mat-stepper-vertical');
  });

  it('marks an invalid linear step and focuses its first invalid control', fakeAsync(() => {
    const nextButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Next')!;

    nextButton.click();
    fixture.detectChanges();
    tick();

    const input = fixture.nativeElement.querySelector('#customer-name') as HTMLInputElement;
    const selectedTab = fixture.nativeElement.querySelector(
      '[role="tab"][aria-selected="true"]',
    ) as HTMLElement;
    expect(fixture.componentInstance.detailsForm.controls.name.touched).toBeTrue();
    expect(document.activeElement).toBe(input);
    expect(selectedTab.textContent).toContain('Required details');
  }));

  it('supports next, optional skip, back and finish actions', fakeAsync(() => {
    fixture.componentInstance.detailsForm.controls.name.setValue('Meblicz customer');
    fixture.detectChanges();

    const buttonNamed = (name: string): HTMLButtonElement =>
      Array.from(
        fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
      ).find((button) => button.textContent?.trim() === name)!;

    buttonNamed('Next').click();
    fixture.detectChanges();
    tick();
    expect(fixture.nativeElement.querySelector('[aria-selected="true"]').textContent).toContain(
      'Optional note',
    );

    buttonNamed('Skip').click();
    fixture.detectChanges();
    tick();
    expect(fixture.componentInstance.skippedIndex).toBe(1);
    expect(fixture.nativeElement.querySelector('[aria-selected="true"]').textContent).toContain(
      'Review',
    );

    buttonNamed('Back').click();
    fixture.detectChanges();
    tick();
    buttonNamed('Skip').click();
    fixture.detectChanges();
    tick();
    buttonNamed('Finish').click();
    expect(fixture.componentInstance.finished).toBeTrue();
  }));

  it('retains Material keyboard navigation between step headers', () => {
    fixture.componentInstance.detailsForm.controls.name.setValue('Meblicz customer');
    fixture.detectChanges();
    const nextButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Next')!;
    nextButton.click();
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll(
      '[role="tab"]',
    ) as NodeListOf<HTMLElement>;
    headers[1].focus();
    const arrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    Object.defineProperty(arrowRight, 'keyCode', { get: () => 39 });
    headers[1].dispatchEvent(arrowRight);
    fixture.detectChanges();

    expect(document.activeElement).toBe(headers[2]);
  });

  it('guards invalid-control focus when rendered on the server', () => {
    const setTimeoutSpy = spyOn(window, 'setTimeout');
    const component = new StepperComponent(
      new BreakpointObserverStub() as unknown as BreakpointObserver,
      { markForCheck: () => undefined } as ChangeDetectorRef,
      new ElementRef(document.createElement('div')),
      'server' as unknown as object,
    );
    const step = new StepperStepComponent();
    step.stepControl = new FormControl('', Validators.required);
    component.linear = true;

    component.next({ next: () => undefined } as unknown as MatStepper, step, 0);

    expect(step.stepControl.touched).toBeTrue();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});
