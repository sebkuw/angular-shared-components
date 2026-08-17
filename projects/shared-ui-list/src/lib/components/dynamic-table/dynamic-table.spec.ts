import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
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
    fixture.componentRef.setInput('data', signal<TestRow[]>([{ Id: 1, name: 'First' }]));
    fixture.componentRef.setInput('totalItems', signal(1));
    fixture.componentRef.setInput('pageSize', signal(10));
    fixture.componentRef.setInput('pageIndex', signal(0));
    fixture.componentRef.setInput('loading', signal(false));
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
});
