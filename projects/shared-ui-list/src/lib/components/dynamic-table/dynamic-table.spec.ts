import { provideHttpClient } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatSelect } from '@angular/material/select';
import { PermissionContext, providePermissionContext } from '@sebkuw/shared-ui-core';
import { DynamicTableComponent } from './dynamic-table';
import { BaseRow, Column } from './models/table-config.model';

interface TestRow extends BaseRow {
  name: string;
}

describe('DynamicTableComponent', () => {
  let fixture: ComponentFixture<DynamicTableComponent<TestRow>>;
  let component: DynamicTableComponent<TestRow>;
  let dataSignal: WritableSignal<TestRow[]>;
  let errorSignal: WritableSignal<string | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        providePermissionContext(
          signal<PermissionContext>({
            status: 'ready',
            authenticated: true,
            permissions: [],
            claims: {},
          }),
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTableComponent<TestRow>);
    component = fixture.componentInstance;
    const columns: Column[] = [
      {
        name: 'name',
        displayName: 'Name',
        type: 'string',
        filterable: true,
        filterFieldConfig: { type: 'text', filterType: 'single' },
      },
    ];

    fixture.componentRef.setInput('columns', columns);
    dataSignal = signal<TestRow[]>([{ Id: 1, name: 'First' }]);
    errorSignal = signal<string | null>(null);
    fixture.componentRef.setInput('data', dataSignal);
    fixture.componentRef.setInput('totalItems', signal(1));
    fixture.componentRef.setInput('pageSize', signal(10));
    fixture.componentRef.setInput('pageIndex', signal(0));
    fixture.componentRef.setInput('loading', signal(false));
    fixture.componentRef.setInput('errorMessage', errorSignal);
    fixture.detectChanges();
  });

  it('shows and clears the shared clear-filters action reactively', () => {
    component.showFilters.set(true);
    component.filterForm.get('name')?.setValue('First');
    fixture.detectChanges();

    expect(component.hasActiveFilters()).toBeTrue();
    expect(fixture.nativeElement.querySelector('shared-button')).not.toBeNull();

    component.clearFilters();
    fixture.detectChanges();

    expect(component.hasActiveFilters()).toBeFalse();
    expect(fixture.nativeElement.querySelector('shared-button')).toBeNull();
  });

  it('renders the configurable shared empty state and hides pagination', () => {
    fixture.componentRef.setInput('emptyState', {
      title: 'No matching orders',
      description: 'Change the active filters.',
    });
    dataSignal.set([]);
    fixture.detectChanges();

    const state = fixture.nativeElement.querySelector('shared-empty-state') as HTMLElement;
    expect(state.textContent).toContain('No matching orders');
    expect(state.textContent).toContain('Change the active filters.');
    expect(fixture.nativeElement.querySelector('mat-paginator')).toBeNull();
  });

  it('renders an error state and emits retry without exposing stale data', () => {
    let retried = false;
    component.retry.subscribe(() => (retried = true));
    fixture.componentRef.setInput('errorState', {
      title: 'Orders unavailable',
      action: { label: 'Try again' },
    });
    errorSignal.set('The server did not respond.');
    fixture.detectChanges();

    const state = fixture.nativeElement.querySelector('shared-error-state') as HTMLElement;
    expect(state.textContent).toContain('Orders unavailable');
    expect(state.textContent).toContain('The server did not respond.');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();

    (state.querySelector('button') as HTMLButtonElement).click();
    expect(retried).toBeTrue();
  });

  it('renders exactly one persistent visible label per filter control and distinct placeholders', () => {
    fixture.componentRef.setInput('columns', [
      {
        name: 'name',
        displayName: 'Name',
        type: 'string',
        filterable: true,
        filterFieldConfig: {
          type: 'text',
          filterType: 'single',
          placeholder: 'Search names',
        },
      },
      {
        name: 'category',
        displayName: 'Category',
        type: 'enum',
        filterable: true,
        filterFieldConfig: {
          type: 'select',
          filterType: 'single',
          placeholder: 'Choose a category',
          options: [{ key: 'one', value: 'One' }],
        },
      },
      {
        name: 'amount',
        displayName: 'Amount',
        type: 'decimal',
        filterable: true,
        filterFieldConfig: {
          type: 'number',
          filterType: 'range',
          placeholderFrom: 'Minimum amount',
          placeholderTo: 'Maximum amount',
        },
      },
    ] satisfies Column[]);
    component.showFilters.set(true);
    fixture.detectChanges();

    const filterForm = fixture.nativeElement.querySelector('.filters-section') as HTMLElement;
    const controls = Array.from(filterForm.querySelectorAll('input[matinput], mat-select'));
    const labels = Array.from(filterForm.querySelectorAll('label.filter-label'));
    expect(filterForm.querySelectorAll('mat-label').length).toBe(0);
    expect(labels.length).toBe(controls.length);

    for (const label of labels) {
      const control = filterForm.querySelector(`#${label.getAttribute('for')}`);
      expect(control).not.toBeNull();
      expect(label.textContent?.trim()).toBeTruthy();
    }

    const nameInput = filterForm.querySelector('input[type="text"]') as HTMLInputElement;
    expect(nameInput.placeholder).toBe('Search names');
    expect(nameInput.placeholder).not.toBe('Name');
    const select = fixture.debugElement.query(By.directive(MatSelect))
      .componentInstance as MatSelect;
    const selectLabel = filterForm.querySelector(`label[for="${select.id}"]`) as HTMLLabelElement;
    expect(select.placeholder).toBe('Choose a category');
    expect(select.placeholder).not.toBe('Category');
    expect(select.ariaLabelledby).toBe(selectLabel.id);
  });

  it('integrates signal-backed async options and emits the debounced column query', fakeAsync(() => {
    const asyncOptions = signal([{ key: 'acme', value: 'Acme' }]);
    fixture.componentRef.setInput('columns', [
      {
        name: 'customerId',
        displayName: 'Customer',
        type: 'guid',
        filterable: true,
        filterFieldConfig: {
          type: 'async-select',
          filterType: 'single',
          placeholder: 'Search customers',
          debounceMs: 50,
          asyncOptions,
        },
      },
    ] satisfies Column[]);
    component.showFilters.set(true);
    const queries: unknown[] = [];
    component.asyncFilterQuery.subscribe((event) => queries.push(event));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'shared-async-search-select input',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(component.getAsyncFilterOptions(component.filterableColumns()[0])).toEqual([
      { key: 'acme', value: 'Acme' },
    ]);
    input.value = 'ac';
    input.dispatchEvent(new Event('input'));
    tick(49);
    expect(queries).toEqual([]);
    tick(1);
    expect(queries).toEqual([{ columnName: 'customerId', query: 'ac' }]);
  }));
});
