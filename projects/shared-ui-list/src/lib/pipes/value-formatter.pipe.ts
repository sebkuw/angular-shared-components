import { DatePipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Column } from '../components/dynamic-table/models/table-config.model';

@Pipe({
  name: 'valueFormatter',
  standalone: true
})
export class ValueFormatterPipe implements PipeTransform {
  private datePipe = new DatePipe('pl-PL');
  private decimalPipe = new DecimalPipe('pl-PL');

  transform(value: any, column: Column): string {
    if (value === null || value === undefined) return '';

    switch (column.type) {
      case 'date':
        return this.formatDate(value, column.format);
      case 'decimal':
        return this.formatNumber(value, column.format || '1.2-2');
      case 'int':
        return this.formatNumber(value, column.format || '1.0-0');
      case 'enum':
        return column.enumValues?.[value] || value;
      case 'boolean':
        return value ? 'Tak' : 'Nie';
      default:
        return String(value);
    }
  }

  private formatDate(value: any, format?: string): string {
    const date = new Date(value);
    return this.datePipe.transform(date, format || 'mediumDate') || '';
  }

  private formatNumber(value: any, format: string): string {
    const number = Number(value);
    return this.decimalPipe.transform(number, format) || '';
  }
}