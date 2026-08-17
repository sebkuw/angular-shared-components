import { provideHttpClient } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
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
});
