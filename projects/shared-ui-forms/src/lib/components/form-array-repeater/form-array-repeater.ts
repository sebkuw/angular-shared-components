import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  APP_ID,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ButtonComponent } from '@sebkuw/shared-ui-primitives';
import {
  FormArrayRepeaterRowContext,
  FormArrayRepeaterRowDirective,
} from './form-array-repeater-row.directive';

let nextRepeaterId = 0;

export interface FormArrayRepeaterRowEvent {
  row: FormGroup;
  index: number;
}

export type FormArrayRepeaterCardTitle = (index: number, row: FormGroup) => string;

@Component({
  selector: 'shared-form-array-repeater',
  standalone: true,
  imports: [NgTemplateOutlet, ButtonComponent],
  templateUrl: './form-array-repeater.html',
  styleUrl: './form-array-repeater.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayRepeaterComponent implements OnInit, OnChanges, AfterContentInit {
  @Input({ required: true }) formArray!: FormArray<FormGroup>;
  @Input({ required: true }) rowFactory!: () => FormGroup;
  @Input() minRows = 0;
  @Input() maxRows?: number;
  @Input() groupColumns: 1 | 2 | 3 = 1;
  @Input() cardTitle: string | FormArrayRepeaterCardTitle = 'Item';
  @Input() addLabel = 'Add item';
  @Input() removeLabel = 'Remove';
  @Input() emptyLabel = 'No items added.';
  @Input() ariaLabel = 'Repeated form rows';
  @Input() idPrefix?: string;
  @Input() removeAriaLabel?: (index: number, row: FormGroup) => string;

  @Output() readonly rowAdded = new EventEmitter<FormArrayRepeaterRowEvent>();
  @Output() readonly rowRemoved = new EventEmitter<FormArrayRepeaterRowEvent>();

  @ContentChild(FormArrayRepeaterRowDirective)
  rowTemplate?: FormArrayRepeaterRowDirective;

  private readonly generatedIdPrefix: string;
  private readonly rowIds = new WeakMap<FormGroup, string>();
  private nextRowId = 0;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(APP_ID) appId: string,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.generatedIdPrefix = `${appId}-form-repeater-${nextRepeaterId++}`;
  }

  get rows(): readonly FormGroup[] {
    return this.formArray?.controls ?? [];
  }

  get addDisabled(): boolean {
    return this.maxRows !== undefined && this.rows.length >= Math.max(0, this.maxRows);
  }

  get groupColumnsClass(): string {
    const columns = Math.min(3, Math.max(1, this.groupColumns));
    return `shared-form-array-repeater__groups--${columns}`;
  }

  ngOnInit(): void {
    this.ensureMinimumRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formArray'] || changes['minRows'] || changes['rowFactory']) {
      this.ensureMinimumRows();
    }
  }

  ngAfterContentInit(): void {
    if (!this.rowTemplate) {
      throw new Error(
        'FormArrayRepeaterComponent requires an ng-template with sharedFormArrayRepeaterRow.',
      );
    }
  }

  addRow(): void {
    if (this.addDisabled) {
      return;
    }

    const row = this.rowFactory();
    const index = this.formArray.length;
    this.formArray.push(row);
    this.formArray.markAsDirty();
    this.formArray.updateValueAndValidity();
    this.rowAdded.emit({ row, index });
    this.focusAddedRow(row);
  }

  removeRow(index: number): void {
    if (this.rows.length <= this.normalizedMinRows || index < 0 || index >= this.rows.length) {
      return;
    }

    const row = this.formArray.at(index);
    const focusTarget = this.rows[index + 1] ?? this.rows[index - 1];
    this.formArray.removeAt(index);
    this.formArray.markAsDirty();
    this.formArray.updateValueAndValidity();
    this.rowRemoved.emit({ row, index });
    this.restoreFocusAfterRemoval(focusTarget);
  }

  canRemove(): boolean {
    return this.rows.length > this.normalizedMinRows;
  }

  titleFor(row: FormGroup, index: number): string {
    return typeof this.cardTitle === 'function'
      ? this.cardTitle(index, row)
      : `${this.cardTitle} ${index + 1}`;
  }

  removeLabelFor(row: FormGroup, index: number): string {
    return this.removeAriaLabel?.(index, row) ?? `${this.removeLabel} ${this.titleFor(row, index)}`;
  }

  cardTitleId(row: FormGroup): string {
    return `${this.rowId(row)}-title`;
  }

  rowId(row: FormGroup): string {
    let id = this.rowIds.get(row);
    if (!id) {
      id = `${this.resolvedIdPrefix}-row-${this.nextRowId++}`;
      this.rowIds.set(row, id);
    }
    return id;
  }

  rowContext(row: FormGroup, index: number): FormArrayRepeaterRowContext {
    return {
      $implicit: row,
      row,
      index,
      controlId: (controlName: string) => `${this.rowId(row)}-${this.sanitizeId(controlName)}`,
    };
  }

  private get normalizedMinRows(): number {
    return Math.max(0, this.minRows);
  }

  private get resolvedIdPrefix(): string {
    return this.sanitizeId(this.idPrefix || this.generatedIdPrefix);
  }

  private ensureMinimumRows(): void {
    if (!this.formArray || !this.rowFactory) {
      return;
    }

    while (this.formArray.length < this.normalizedMinRows) {
      this.formArray.push(this.rowFactory());
    }
  }

  private focusAddedRow(row: FormGroup): void {
    this.scheduleFocus(() => {
      const card = this.elementRef.nativeElement.querySelector<HTMLElement>(
        `[data-repeater-row-id="${this.rowId(row)}"]`,
      );
      return (
        card?.querySelector<HTMLElement>(
          '.shared-form-array-repeater__groups input:not([disabled]), ' +
            '.shared-form-array-repeater__groups select:not([disabled]), ' +
            '.shared-form-array-repeater__groups textarea:not([disabled]), ' +
            '.shared-form-array-repeater__groups [tabindex]:not([tabindex="-1"]):not([disabled])',
        ) ?? card?.querySelector<HTMLElement>('.shared-form-array-repeater__remove button')
      );
    });
  }

  private restoreFocusAfterRemoval(row?: FormGroup): void {
    this.scheduleFocus(() => {
      if (row) {
        const card = this.elementRef.nativeElement.querySelector<HTMLElement>(
          `[data-repeater-row-id="${this.rowId(row)}"]`,
        );
        const removeButton = card?.querySelector<HTMLElement>(
          '.shared-form-array-repeater__remove button:not([disabled])',
        );
        if (removeButton) {
          return removeButton;
        }
      }

      return this.elementRef.nativeElement.querySelector<HTMLElement>(
        '.shared-form-array-repeater__add button:not([disabled])',
      );
    });
  }

  private scheduleFocus(resolveElement: () => HTMLElement | null | undefined): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => resolveElement()?.focus());
  }

  private sanitizeId(value: string): string {
    const sanitized = value.trim().replace(/[^a-zA-Z0-9_-]+/g, '-');
    return sanitized || 'shared-form-repeater';
  }
}
