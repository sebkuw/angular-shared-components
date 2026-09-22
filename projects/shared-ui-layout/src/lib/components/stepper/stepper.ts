import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ButtonComponent } from '@sebkuw/shared-ui-primitives';
import { Subscription } from 'rxjs';
import { StepperStepComponent } from './stepper-step';

@Component({
  selector: 'shared-stepper',
  standalone: true,
  imports: [MatStepperModule, NgTemplateOutlet, ButtonComponent],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orientation: StepperOrientation = 'horizontal';
  @Input() responsive = true;
  @Input() responsiveBreakpoint = '(max-width: 48rem)';
  @Input() linear = false;
  @Input() ariaLabel = 'Step-by-step form';
  @Input() navigationAriaLabel = 'Step navigation';
  @Input() backLabel = 'Back';
  @Input() nextLabel = 'Next';
  @Input() skipLabel = 'Skip';
  @Input() finishLabel = 'Finish';
  @Input() showNavigation = true;

  @Output() readonly selectedIndexChange = new EventEmitter<number>();
  @Output() readonly stepSkipped = new EventEmitter<number>();
  @Output() readonly finished = new EventEmitter<void>();

  @ContentChildren(StepperStepComponent)
  private readonly stepDefinitions!: QueryList<StepperStepComponent>;

  effectiveOrientation: StepperOrientation = this.orientation;

  private breakpointSubscription?: Subscription;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  get steps(): readonly StepperStepComponent[] {
    return this.stepDefinitions?.toArray() ?? [];
  }

  ngOnInit(): void {
    this.observeBreakpoint();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orientation'] || changes['responsive'] || changes['responsiveBreakpoint']) {
      this.observeBreakpoint();
    }
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  previous(stepper: MatStepper): void {
    stepper.previous();
  }

  next(stepper: MatStepper, step: StepperStepComponent, index: number): void {
    if (!this.canLeaveStep(step, index, stepper)) {
      return;
    }

    stepper.next();
  }

  skip(stepper: MatStepper, index: number): void {
    this.stepSkipped.emit(index);
    stepper.next();
  }

  finish(stepper: MatStepper, step: StepperStepComponent, index: number): void {
    if (this.canLeaveStep(step, index, stepper)) {
      this.finished.emit();
    }
  }

  onSelectedIndexChange(index: number): void {
    this.selectedIndexChange.emit(index);
  }

  private observeBreakpoint(): void {
    this.breakpointSubscription?.unsubscribe();
    this.effectiveOrientation = this.orientation;

    if (!this.responsive) {
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.breakpointSubscription = this.breakpointObserver
      .observe(this.responsiveBreakpoint)
      .subscribe(({ matches }) => {
        this.effectiveOrientation = matches ? 'vertical' : this.orientation;
        this.changeDetectorRef.markForCheck();
      });
  }

  private canLeaveStep(step: StepperStepComponent, index: number, stepper: MatStepper): boolean {
    if (!this.linear || step.optional || step.completed) {
      return true;
    }

    const control = step.stepControl;
    control?.markAllAsTouched();
    control?.updateValueAndValidity();

    if (control && !control.invalid && !control.pending) {
      return true;
    }

    stepper.next();
    this.focusFirstInvalidControl(index);
    return false;
  }

  private focusFirstInvalidControl(index: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => {
      const stepContent = this.elementRef.nativeElement.querySelector<HTMLElement>(
        `[data-shared-step-index="${index}"]`,
      );
      const invalidControl = stepContent?.querySelector<HTMLElement>(
        [
          'input.ng-invalid:not([disabled])',
          'select.ng-invalid:not([disabled])',
          'textarea.ng-invalid:not([disabled])',
          '[aria-invalid="true"]:not([disabled])',
          '.ng-invalid input:not([disabled])',
          '.ng-invalid select:not([disabled])',
          '.ng-invalid textarea:not([disabled])',
          '.ng-invalid [tabindex]:not([tabindex="-1"]):not([disabled])',
        ].join(', '),
      );

      invalidControl?.focus();
    });
  }
}
