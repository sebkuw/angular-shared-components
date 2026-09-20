import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounce, Subject, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let nextAsyncSearchSelectId = 0;

export interface AsyncSearchSelectOption {
  key: string;
  value: string;
  disabled?: boolean;
}

export interface AsyncSearchSelectSelection {
  key: string;
  value: string;
}

@Component({
  selector: 'shared-async-search-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './async-search-select.html',
  styleUrl: './async-search-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsyncSearchSelectComponent),
      multi: true,
    },
  ],
})
export class AsyncSearchSelectComponent implements ControlValueAccessor, OnChanges {
  @ViewChildren('optionElement') private optionElements!: QueryList<ElementRef<HTMLElement>>;

  @Input({ required: true }) label = '';
  @Input() options: readonly AsyncSearchSelectOption[] = [];
  @Input() placeholder = 'Search options';
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() loadingText = 'Loading options';
  @Input() emptyText = 'No options found';
  @Input() debounceMs = 300;
  @Input() id = `shared-async-search-select-${nextAsyncSearchSelectId++}`;
  @Input() ariaDescribedBy: string | null = null;

  @Output() queryChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<AsyncSearchSelectSelection | null>();

  isOpen = false;
  searchText = '';
  activeIndex = -1;
  selectedKey: string | null = null;
  disabled = false;

  private readonly querySubject = new Subject<string>();
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.querySubject
      .pipe(
        debounce(() => timer(Math.max(0, this.debounceMs))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => this.queryChange.emit(query));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.syncSelectedOption();
      this.ensureActiveOption();
    }
  }

  get activeDescendantId(): string | null {
    return this.activeIndex >= 0 ? this.getOptionId(this.activeIndex) : null;
  }

  get listboxId(): string {
    return `${this.id}-listbox`;
  }

  get statusId(): string {
    return `${this.id}-status`;
  }

  get describedBy(): string | null {
    const ids = [this.ariaDescribedBy, this.statusId].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  get selectedOption(): AsyncSearchSelectSelection | null {
    const option = this.options.find((item) => item.key === this.selectedKey);
    return option ? { key: option.key, value: option.value } : null;
  }

  writeValue(value: string | null): void {
    this.selectedKey = value ?? null;
    this.syncSelectedOption();
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled) {
      this.closePanel();
    }
    this.changeDetector.markForCheck();
  }

  openPanel(): void {
    if (this.disabled) {
      return;
    }

    this.isOpen = true;
    this.ensureActiveOption();
  }

  closePanel(): void {
    this.isOpen = false;
    this.activeIndex = -1;
  }

  handleInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchText = query;

    const selected = this.selectedOption;
    if (selected && selected.value !== query) {
      this.selectedKey = null;
      this.onChange(null);
      this.selectionChange.emit(null);
    }

    this.openPanel();
    this.querySubject.next(query);
  }

  handleBlur(): void {
    this.onTouched();
    this.closePanel();
  }

  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openPanel();
          break;
        }
        this.openPanel();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.openPanel();
          this.activeIndex = this.findEnabledIndex(this.options.length - 1, -1);
          break;
        }
        this.openPanel();
        this.moveActive(-1);
        break;
      case 'Home':
        if (this.isOpen) {
          event.preventDefault();
          this.activeIndex = this.findEnabledIndex(0, 1);
          this.scrollActiveOptionIntoView();
        }
        break;
      case 'End':
        if (this.isOpen) {
          event.preventDefault();
          this.activeIndex = this.findEnabledIndex(this.options.length - 1, -1);
          this.scrollActiveOptionIntoView();
        }
        break;
      case 'Enter':
        if (this.isOpen && this.activeIndex >= 0) {
          event.preventDefault();
          this.selectOption(this.options[this.activeIndex]);
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.closePanel();
        }
        break;
      case 'Tab':
        this.closePanel();
        break;
    }
  }

  selectOption(option: AsyncSearchSelectOption | undefined): void {
    if (!option || option.disabled || this.disabled) {
      return;
    }

    this.selectedKey = option.key;
    this.searchText = option.value;
    this.onChange(option.key);
    this.onTouched();
    this.selectionChange.emit({ key: option.key, value: option.value });
    this.closePanel();
  }

  getOptionId(index: number): string {
    return `${this.id}-option-${index}`;
  }

  private syncSelectedOption(): void {
    const selected = this.options.find((option) => option.key === this.selectedKey);
    if (selected) {
      this.searchText = selected.value;
    } else if (this.selectedKey === null) {
      this.searchText = '';
    }
  }

  private ensureActiveOption(): void {
    if (this.loading || this.error || this.options.length === 0) {
      this.activeIndex = -1;
      return;
    }

    const selectedIndex = this.options.findIndex(
      (option) => option.key === this.selectedKey && !option.disabled,
    );
    this.activeIndex = selectedIndex >= 0 ? selectedIndex : this.findEnabledIndex(0, 1);
  }

  private moveActive(direction: 1 | -1): void {
    if (this.loading || this.error || this.options.length === 0) {
      this.activeIndex = -1;
      return;
    }

    const start =
      this.activeIndex < 0
        ? direction === 1
          ? 0
          : this.options.length - 1
        : this.activeIndex + direction;
    const next = this.findEnabledIndex(start, direction);
    if (next >= 0) {
      this.activeIndex = next;
      this.scrollActiveOptionIntoView();
    }
  }

  private findEnabledIndex(start: number, direction: 1 | -1): number {
    for (let index = start; index >= 0 && index < this.options.length; index += direction) {
      if (!this.options[index].disabled) {
        return index;
      }
    }

    return -1;
  }

  private scrollActiveOptionIntoView(): void {
    this.optionElements?.get(this.activeIndex)?.nativeElement.scrollIntoView({ block: 'nearest' });
  }
}
