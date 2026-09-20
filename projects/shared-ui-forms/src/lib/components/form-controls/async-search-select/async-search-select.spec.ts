import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AsyncSearchSelectComponent,
  AsyncSearchSelectOption,
  AsyncSearchSelectSelection,
} from './async-search-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, AsyncSearchSelectComponent],
  template: `
    <shared-async-search-select
      id="customer-filter"
      label="Customer"
      placeholder="Search customers"
      [formControl]="control"
      [options]="options"
      [loading]="loading"
      [error]="error"
      [debounceMs]="200"
      (queryChange)="queries.push($event)"
      (selectionChange)="selection = $event"
    />
  `,
})
class TestHostComponent {
  readonly control = new FormControl<string | null>(null);
  options: readonly AsyncSearchSelectOption[] = [
    { key: '1', value: 'Ada Lovelace' },
    { key: '2', value: 'Grace Hopper' },
  ];
  loading = false;
  error: string | null = null;
  queries: string[] = [];
  selection: AsyncSearchSelectSelection | null = null;
}

describe('AsyncSearchSelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('associates one persistent visible label and a distinct placeholder with the combobox', () => {
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;

    expect(label.textContent?.trim()).toBe('Customer');
    expect(label.htmlFor).toBe('customer-filter');
    expect(input.id).toBe('customer-filter');
    expect(input.placeholder).toBe('Search customers');
    expect(input.placeholder).not.toBe(label.textContent?.trim());
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
  });

  it('emits remote queries after the configured debounce', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'gra';
    input.dispatchEvent(new Event('input'));

    tick(199);
    expect(host.queries).toEqual([]);
    tick(1);
    expect(host.queries).toEqual(['gra']);
  }));

  it('supports keyboard navigation and writes the selected key while emitting key and value', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.control.value).toBe('2');
    expect(host.selection).toEqual({ key: '2', value: 'Grace Hopper' });
    expect(input.value).toBe('Grace Hopper');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('exposes loading, empty and error states without selectable placeholder options', () => {
    host.loading = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'Loading options',
    );

    host.loading = false;
    host.options = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'No options found',
    );

    host.error = 'Customers are unavailable';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Customers are unavailable',
    );
  });
});
