import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { merge, startWith, Subscription } from 'rxjs';
import {
  FormCompletionField,
  FormCompletionSummaryFormatter,
} from './form-completion-indicator.models';

@Component({
  selector: 'shared-form-completion-indicator',
  standalone: true,
  templateUrl: './form-completion-indicator.html',
  styleUrl: './form-completion-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCompletionIndicatorComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Input() fields: readonly FormCompletionField[] = [];
  @Input() label = 'Required fields completed';
  @Input() summaryFormatter: FormCompletionSummaryFormatter = (completed, total, percentage) =>
    `${completed} of ${total} required fields (${percentage}%)`;

  private formSubscription = new Subscription();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  get requiredFields(): readonly FormCompletionField[] {
    if (!this.form) {
      return [];
    }

    return this.fields.filter((field) => {
      const control = this.form.get(field.key);
      return !!control?.enabled && this.isRequired(field, control);
    });
  }

  get completed(): number {
    return this.requiredFields.filter((field) => {
      const control = this.form.get(field.key);
      return !!control && control.valid && this.hasValue(control.value);
    }).length;
  }

  get total(): number {
    return this.requiredFields.length;
  }

  get percentage(): number {
    return this.total === 0 ? 100 : Math.round((this.completed / this.total) * 100);
  }

  get summary(): string {
    return this.summaryFormatter(this.completed, this.total, this.percentage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.bindForm();
    }
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
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

  private isRequired(field: FormCompletionField, control: AbstractControl): boolean {
    return (
      field.required ??
      (control.hasValidator(Validators.required) || control.hasValidator(Validators.requiredTrue))
    );
  }

  private hasValue(value: unknown): boolean {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return true;
  }
}
