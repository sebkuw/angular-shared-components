import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge, startWith, Subscription } from 'rxjs';
import { resolveFormErrorMessage } from '../../utils/form-error-message';
import { FormErrorSummaryField, FormErrorSummaryItem } from './form-error-summary.models';

@Component({
  selector: 'shared-form-error-summary',
  standalone: true,
  templateUrl: './form-error-summary.html',
  styleUrl: './form-error-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorSummaryComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Input() fields: readonly FormErrorSummaryField[] = [];
  @Input() title = 'Check the form';
  @Input() description = 'Correct the following fields before continuing.';
  @Input() visible = true;

  @ViewChild('summary') private summary?: ElementRef<HTMLElement>;

  private formSubscription = new Subscription();

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}

  get errors(): readonly FormErrorSummaryItem[] {
    if (!this.form) {
      return [];
    }

    return this.fields.flatMap((field) => {
      const control = this.form.get(field.key);
      if (!control?.invalid || !control.errors) {
        return [];
      }

      return [
        {
          key: field.key,
          label: field.label,
          controlId: field.controlId ?? field.key,
          message: resolveFormErrorMessage(control, field.errorMessages),
        },
      ];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.bindForm();
    }
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  focus(): void {
    this.summary?.nativeElement.focus();
  }

  focusControl(event: Event, controlId: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const target = this.document.getElementById(controlId);
    target?.focus();
  }

  private bindForm(): void {
    this.formSubscription.unsubscribe();
    this.formSubscription = new Subscription();

    if (!this.form) {
      return;
    }

    this.formSubscription.add(
      merge(this.form.valueChanges, this.form.statusChanges)
        .pipe(startWith(null))
        .subscribe(() => this.changeDetectorRef.markForCheck()),
    );
  }
}
