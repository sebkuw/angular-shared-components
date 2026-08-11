import { DatePipe, DecimalPipe } from '@angular/common';
import {
  Inject,
  InjectionToken,
  LOCALE_ID,
  Optional,
  Pipe,
  PipeTransform,
  Provider,
} from '@angular/core';
import { Column } from '../components/dynamic-table/models/table-config.model';

export interface ValueFormatterOptions {
  booleanTrue: string;
  booleanFalse: string;
  emptyValue: string;
}

const DEFAULT_VALUE_FORMATTER_OPTIONS: ValueFormatterOptions = {
  booleanTrue: 'Tak',
  booleanFalse: 'Nie',
  emptyValue: '',
};

export const VALUE_FORMATTER_OPTIONS = new InjectionToken<ValueFormatterOptions>(
  'VALUE_FORMATTER_OPTIONS',
  {
    factory: () => DEFAULT_VALUE_FORMATTER_OPTIONS,
  },
);

export function provideValueFormatterOptions(options: Partial<ValueFormatterOptions>): Provider {
  return {
    provide: VALUE_FORMATTER_OPTIONS,
    useFactory: (): ValueFormatterOptions => ({
      ...DEFAULT_VALUE_FORMATTER_OPTIONS,
      ...options,
    }),
  };
}

@Pipe({
  name: 'valueFormatter',
  standalone: true,
})
export class ValueFormatterPipe implements PipeTransform {
  private readonly options: ValueFormatterOptions;
  private readonly datePipe: DatePipe;
  private readonly decimalPipe: DecimalPipe;

  constructor(
    @Inject(LOCALE_ID) @Optional() locale = 'pl-PL',
    @Inject(VALUE_FORMATTER_OPTIONS)
    @Optional()
    options?: ValueFormatterOptions,
  ) {
    this.options = options ?? DEFAULT_VALUE_FORMATTER_OPTIONS;
    this.datePipe = new DatePipe(locale);
    this.decimalPipe = new DecimalPipe(locale);
  }

  transform(value: unknown, column: Column): string {
    if (value === null || value === undefined) {
      return this.options.emptyValue;
    }

    switch (column.type) {
      case 'date':
        return this.formatDate(value, column.format);
      case 'decimal':
        return this.formatNumber(value, column.format ?? '1.2-2');
      case 'int':
        return this.formatNumber(value, column.format ?? '1.0-0');
      case 'enum':
        return column.enumValues?.[String(value)] ?? String(value);
      case 'boolean':
        return value ? this.options.booleanTrue : this.options.booleanFalse;
      default:
        return String(value);
    }
  }

  private formatDate(value: unknown, format?: string): string {
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime())
      ? this.options.emptyValue
      : (this.datePipe.transform(date, format ?? 'mediumDate') ?? this.options.emptyValue);
  }

  private formatNumber(value: unknown, format: string): string {
    const number = Number(value);
    return Number.isFinite(number)
      ? (this.decimalPipe.transform(number, format) ?? this.options.emptyValue)
      : this.options.emptyValue;
  }
}
