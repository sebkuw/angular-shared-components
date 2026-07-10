import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Signal,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ValueFormatterPipe } from '../../pipes/value-formatter.pipe';
import {
  FilterOperation,
  TableDataRequestEvent,
  TableFilter,
  TableSort,
} from './models/dynamic-table.models';
import { BaseRow, Column, CustomButton } from './models/table-config.model';
import { ExportRequest } from './models/table-export.model';
import { TableFeatures } from './models/table-features.models';
import { FilterFieldConfig } from './models/table-filter.model';
import { TableExportService } from './services/table-export.service';

/**
 * @component DynamicTableComponent
 * @description Reusable server-side table with filtering, sorting, pagination, selection, column visibility and CSV export.
 * @template T Row type. It must expose an `Id` property used by selection logic.
 */
@Component({
  selector: 'shared-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    ValueFormatterPipe,
  ],
  templateUrl: './dynamic-table.html',
  styleUrls: ['./dynamic-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTableComponent<T extends BaseRow>
  implements OnInit, OnChanges, OnDestroy
{
  @Input() columns: Column[] = [];
  @Input({ required: true }) data!: Signal<T[]>;
  @Input({ required: true }) totalItems!: Signal<number>;
  @Input({ required: true }) pageSize!: Signal<number>;
  @Input({ required: true }) pageIndex!: Signal<number>;
  @Input({ required: true }) loading!: Signal<boolean>;
  @Input() showFilterButton = true;
  @Input() showCustomMenu = false;
  @Input() customButtons: CustomButton[] = [];
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() features: TableFeatures = {
    filtering: true,
    sorting: true,
    selection: true,
    pagination: true,
    columnVisibility: {
      hidden: false,
      hideable: true,
      persistVisibility: false,
    },
    csvExport: {
      enabled: false,
    },
  };

  @Output() dataRequest = new EventEmitter<TableDataRequestEvent>();
  @Output() rowClick = new EventEmitter<{ column: Column; row: T }>();
  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() exportToCSV = new EventEmitter<void>();

  filterForm: FormGroup = new FormGroup({});
  showFilters = signal(false);
  sortState = signal<TableSort>({ column: '', direction: '' });
  visibleColumns = signal<Set<string>>(new Set());
  selectedIds = signal<Set<string>>(new Set());
  allElementsSelected = signal(false);
  excludedElements = signal<Set<string>>(new Set());
  isExporting = signal(false);

  private readonly destroy$ = new Subject<void>();
  private readonly exportService = inject(TableExportService);

  hiddenColumnCount = computed(() => {
    const hideableColumns = this.columns.filter(
      (column) => column.visibilityConfig?.hideable !== false,
    );

    return hideableColumns.filter(
      (column) => !this.visibleColumns().has(column.name),
    ).length;
  });

  selectionCount = computed(() => {
    if (this.allElementsSelected()) {
      return Math.max(this.totalItems() - this.excludedElements().size, 0);
    }

    return this.selectedIds().size;
  });

  displayedColumns = computed(() => {
    const columns = this.columns
      .filter((column) => column.name && this.isColumnVisible(column.name))
      .map((column) => column.name);

    return this.features.selection === false ? columns : ['select', ...columns];
  });

  filterableColumns = computed(() =>
    this.columns.filter((column) => column.filterable),
  );

  hasActiveFilters = computed(() => {
    const formValue = this.filterForm.value as Record<string, unknown>;

    return Object.values(formValue).some((value) => this.hasFilterValue(value));
  });

  hasCustomButtons = computed(() => this.customButtons.length > 0);

  canExport = computed(() => {
    const csvConfig = this.features.csvExport;

    if (!csvConfig?.enabled) {
      return false;
    }

    return !(csvConfig.requiredSelection && this.selectionCount() === 0);
  });

  totalPages = computed(() => {
    const size = this.pageSize();

    if (!size) {
      return 1;
    }

    return Math.max(Math.ceil(this.totalItems() / size), 1);
  });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * @description Initializes filters, column visibility and first data request.
   * @returns Void.
   */
  ngOnInit(): void {
    this.initializeColumnVisibility();
    this.initializeFilterForm();
    this.setupFilterListeners();
    this.emitDataRequest();
  }

  /**
   * @description Reinitializes table internals when columns change.
   * @param changes Angular input changes collection.
   * @returns Void.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && !changes['columns'].firstChange) {
      this.initializeColumnVisibility();
      this.initializeFilterForm();
    }
  }

  /**
   * @description Disposes all table subscriptions.
   * @returns Void.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @description Refreshes data using the current table state.
   * @returns Void.
   */
  public refresh(): void {
    this.emitDataRequest();
  }

  /**
   * @description Toggles the filter panel visibility.
   * @returns Void.
   */
  toggleFilters(): void {
    this.showFilters.update((value) => !value);
  }

  /**
   * @description Clears all filters and requests the first page.
   * @returns Void.
   */
  clearFilters(): void {
    this.filterForm.reset({}, { emitEvent: false });
    this.emitDataRequest({ resetPage: true });
  }

  /**
   * @description Handles column sorting and cycles between ascending, descending and no sorting.
   * @param columnName Column name to sort.
   * @returns Void.
   */
  onSort(columnName: string): void {
    const currentSort = this.sortState();
    let direction: 'asc' | 'desc' | '' = 'asc';

    if (currentSort.column === columnName) {
      direction = currentSort.direction === 'asc'
        ? 'desc'
        : currentSort.direction === 'desc'
          ? ''
          : 'asc';
    }

    this.sortState.set({ column: direction ? columnName : '', direction });
    this.emitDataRequest({ resetPage: true });
  }

  /**
   * @description Handles Angular Material paginator events.
   * @param event Paginator change event.
   * @returns Void.
   */
  onPageChange(event: PageEvent): void {
    this.emitDataRequest({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  /**
   * @description Returns the current sort icon name for a column.
   * @param columnName Column name.
   * @returns Material icon name or empty string.
   */
  getSortIcon(columnName: string): string {
    const currentSort = this.sortState();

    if (currentSort.column !== columnName || !currentSort.direction) {
      return '';
    }

    return currentSort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  /**
   * @description Returns sort icon CSS class for a column.
   * @param columnName Column name.
   * @returns CSS class name.
   */
  getSortIconClass(columnName: string): string {
    const currentSort = this.sortState();

    if (currentSort.column !== columnName) {
      return 'sort-icon-inactive';
    }

    if (currentSort.direction === 'asc') {
      return 'sort-icon-asc';
    }

    if (currentSort.direction === 'desc') {
      return 'sort-icon-desc';
    }

    return 'sort-icon-inactive';
  }

  /**
   * @description Returns a stable string row identifier.
   * @param row Row data.
   * @returns Row id as string.
   */
  getRowId(row: T): string {
    return String(row.Id);
  }

  /**
   * @description Resolves display value for a table cell.
   * @param row Row data.
   * @param column Column configuration.
   * @returns Raw cell value or custom value accessor result.
   */
  getCellValue(row: T, column: Column): unknown {
    if (column.valueAccessor) {
      return column.valueAccessor(row);
    }

    return (row as Record<string, unknown>)[column.name];
  }

  /**
   * @description Converts a Set to an array.
   * @param set Set to convert.
   * @returns Array of string values.
   */
  convertToArray(set: Set<string>): string[] {
    return Array.from(set);
  }

  /**
   * @description Gets the filter field configuration for a column.
   * @param column Column configuration.
   * @returns Filter field configuration or undefined.
   */
  getFilterFieldConfig(column: Column): FilterFieldConfig | undefined {
    return column.filterFieldConfig;
  }

  /**
   * @description Gets a single filter control for the provided column.
   * @param column Column configuration.
   * @returns Filter form control.
   */
  getFilterControl(column: Column): FormControl {
    const control = this.filterForm.get(column.name);

    return control instanceof FormControl ? control : new FormControl('');
  }

  /**
   * @description Gets a range filter control for the provided column and range side.
   * @param column Column configuration.
   * @param type Range side: from or to.
   * @returns Range filter form control.
   */
  getFilterRangeControl(column: Column, type: 'from' | 'to'): FormControl {
    const group = this.filterForm.get(column.name);

    if (!(group instanceof FormGroup)) {
      return new FormControl('');
    }

    const control = group.get(type);

    return control instanceof FormControl ? control : new FormControl('');
  }

  /**
   * @description Returns select options for a boolean filter.
   * @returns Boolean filter options.
   */
  getBooleanOptions(): { key: string; value: string }[] {
    return [
      { key: '', value: 'Wszystkie' },
      { key: 'true', value: 'Tak' },
      { key: 'false', value: 'Nie' },
    ];
  }

  /**
   * @description Checks if the provided column should use a range filter.
   * @param column Column configuration.
   * @returns True when the column has a range filter.
   */
  isRangeFilter(column: Column): boolean {
    return column.filterFieldConfig?.filterType === 'range';
  }

  /**
   * @description Checks whether the filter control has a range validation error.
   * @param columnName Column name.
   * @returns True when number or date range validation error exists.
   */
  hasRangeFilterError(columnName: string): boolean {
    const control = this.filterForm.get(columnName);

    if (!(control instanceof FormGroup)) {
      return false;
    }

    return !!control.errors?.['numberRange'] || !!control.errors?.['dateRange'];
  }

  /**
   * @description Returns range filter validation message.
   * @param column Column configuration.
   * @returns Validation message.
   */
  getRangeFilterErrorMessage(column: Column): string {
    return column.filterFieldConfig?.type === 'date'
      ? 'Data "Od" nie może być późniejsza niż "Do".'
      : 'Liczba "Od" nie może być większa niż "Do".';
  }

  /**
   * @description Toggles selection state for a single row id.
   * @param id Row id.
   * @returns Void.
   */
  toggleSelection(id: string): void {
    if (this.allElementsSelected()) {
      const excluded = new Set(this.excludedElements());

      if (excluded.has(id)) {
        excluded.delete(id);
      } else {
        excluded.add(id);
      }

      this.excludedElements.set(excluded);
    } else {
      const selected = new Set(this.selectedIds());

      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }

      this.selectedIds.set(selected);
    }

    this.emitSelectionChange();
  }

  /**
   * @description Checks whether a row id is selected.
   * @param id Row id.
   * @returns True when selected.
   */
  isSelected(id: string): boolean {
    if (this.allElementsSelected()) {
      return !this.excludedElements().has(id);
    }

    return this.selectedIds().has(id);
  }

  /**
   * @description Selects all rows on the current page.
   * @returns Void.
   */
  selectAllOnPage(): void {
    const selected = new Set(this.selectedIds());

    for (const item of this.data()) {
      selected.add(this.getRowId(item));
    }

    this.selectedIds.set(selected);
    this.emitSelectionChange();
  }

  /**
   * @description Selects all rows across all pages using inverse selection mode.
   * @returns Void.
   */
  selectAll(): void {
    this.allElementsSelected.set(true);
    this.excludedElements.set(new Set());
    this.selectedIds.set(new Set());
    this.emitSelectionChange();
  }

  /**
   * @description Clears all row selection state.
   * @returns Void.
   */
  clearSelection(): void {
    this.allElementsSelected.set(false);
    this.excludedElements.set(new Set());
    this.selectedIds.set(new Set());
    this.emitSelectionChange();
  }

  /**
   * @description Checks if all rows on the current page are selected.
   * @returns True when all current page rows are selected.
   */
  isAllSelected(): boolean {
    if (this.allElementsSelected()) {
      return true;
    }

    const rows = this.data();

    return rows.length > 0 && rows.every((row) => this.isSelected(this.getRowId(row)));
  }

  /**
   * @description Checks if the current selection is partial.
   * @returns True when only part of the page is selected.
   */
  isPartiallySelected(): boolean {
    if (this.allElementsSelected() && this.excludedElements().size > 0) {
      return true;
    }

    const selectedOnPage = this.data().filter((row) => this.isSelected(this.getRowId(row))).length;

    return selectedOnPage > 0 && selectedOnPage < this.data().length;
  }

  /**
   * @description Toggles header selection checkbox behavior.
   * @returns Void.
   */
  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.clearSelection();
      return;
    }

    this.selectAllOnPage();
  }

  /**
   * @description Checks whether the provided column is visible.
   * @param columnName Column name.
   * @returns True when visible.
   */
  public isColumnVisible(columnName: string): boolean {
    return this.visibleColumns().has(columnName);
  }

  /**
   * @description Toggles visibility for a single column.
   * @param columnName Column name.
   * @returns Void.
   */
  public toggleColumnVisibility(columnName: string): void {
    const column = this.columns.find((item) => item.name === columnName);

    if (column?.visibilityConfig?.hideable === false) {
      return;
    }

    const visible = new Set(this.visibleColumns());
    const isVisible = visible.has(columnName);

    if (isVisible) {
      visible.delete(columnName);
    } else {
      visible.add(columnName);
    }

    this.visibleColumns.set(visible);
    this.saveColumnVisibility(columnName, !isVisible);
  }

  /**
   * @description Shows all hideable columns.
   * @returns Void.
   */
  public showAllColumns(): void {
    const visible = new Set<string>();

    for (const column of this.columns) {
      if (column.visibilityConfig?.hideable !== false) {
        visible.add(column.name);
      }
    }

    this.visibleColumns.set(visible);
    this.saveAllColumnVisibility(true);
  }

  /**
   * @description Hides all hideable columns and keeps locked columns visible.
   * @returns Void.
   */
  public hideAllColumns(): void {
    const visible = new Set<string>();

    for (const column of this.columns) {
      if (column.visibilityConfig?.hideable === false) {
        visible.add(column.name);
      }
    }

    this.visibleColumns.set(visible);
    this.saveAllColumnVisibility(false);
  }

  /**
   * @description Resets column visibility to the configured default state.
   * @returns Void.
   */
  public resetColumnVisibility(): void {
    for (const column of this.columns) {
      if (column.visibilityConfig?.persistVisibility) {
        localStorage.removeItem(this.getColumnVisibilityStorageKey(column));
      }
    }

    this.initializeColumnVisibility();
  }

  /**
   * @description Exports table data using the configured export service.
   * @returns Void.
   */
  public exportToCSVFile(): void {
    const exportConfig = this.features.csvExport;

    if (!exportConfig?.enabled) {
      return;
    }

    this.isExporting.set(true);

    this.exportService.export(this.buildExportRequest(), exportConfig).subscribe({
      next: (response) => {
        this.exportService.downloadFile(response);
        this.isExporting.set(false);
      },
      error: (error) => {
        console.error('Export failed:', error);
        this.isExporting.set(false);
      },
    });
  }

  /**
   * @description Builds the filter form from filterable column configuration.
   * @returns Void.
   */
  private initializeFilterForm(): void {
    const controls: Record<string, FormControl | FormGroup> = {};

    for (const column of this.filterableColumns()) {
      const filterConfig = column.filterFieldConfig;

      if (filterConfig?.filterType === 'range') {
        controls[column.name] = this.fb.group(
          {
            from: new FormControl(''),
            to: new FormControl(''),
          },
          {
            validators: filterConfig.type === 'date'
              ? [this.dateRangeValidator]
              : [this.numberRangeValidator],
          },
        );

        continue;
      }

      controls[column.name] = new FormControl('', {
        validators: filterConfig?.validators ?? [],
      });
    }

    this.filterForm = this.fb.group(controls);
  }

  /**
   * @description Creates a debounced listener for filter changes.
   * @returns Void.
   */
  private setupFilterListeners(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.emitDataRequest({ resetPage: true }));
  }

  /**
   * @description Emits current table state through the `dataRequest` output.
   * @param options Optional page override and reset options.
   * @returns Void.
   */
  private emitDataRequest(options?: {
    resetPage?: boolean;
    pageIndex?: number;
    pageSize?: number;
  }): void {
    const request: TableDataRequestEvent = {
      pagination: {
        pageIndex: options?.resetPage ? 0 : options?.pageIndex ?? this.pageIndex(),
        pageSize: options?.pageSize ?? this.pageSize(),
      },
      sort: this.sortState(),
      filters: this.buildFilters(),
    };

    this.dataRequest.emit(request);
  }

  /**
   * @description Builds table filters from the filter form.
   * @returns Collection of table filters.
   */
  private buildFilters(): TableFilter[] {
    const filters: TableFilter[] = [];

    for (const column of this.columns) {
      if (!column.filterable) {
        continue;
      }

      const control = this.filterForm.get(column.name);

      if (!control || !this.hasFilterValue(control.value)) {
        continue;
      }

      const value = control.value;
      const filterConfig = column.filterFieldConfig;

      if (filterConfig?.filterType === 'range' || this.isRangeType(column.type)) {
        if (this.isRangeFilterValue(value)) {
          this.addRangeFilters(filters, column, value);
        }

        continue;
      }

      switch (filterConfig?.type ?? column.type) {
        case 'boolean':
          this.addBooleanFilter(filters, column, value as string);
          break;
        case 'select':
        case 'multi-select':
        case 'enum':
        case 'guid':
          this.addSelectFilter(filters, column, value as string | string[]);
          break;
        case 'number':
        case 'int':
        case 'decimal':
          this.addNumericFilter(filters, column, value as string | number);
          break;
        case 'text':
        case 'string':
        default:
          this.addStringFilter(filters, column, String(value));
          break;
      }
    }

    return filters;
  }

  /**
   * @description Adds range filters for date and numeric columns.
   * @param filters Filter collection to mutate.
   * @param column Column configuration.
   * @param value Range value.
   * @returns Void.
   */
  private addRangeFilters(
    filters: TableFilter[],
    column: Column,
    value: { from: unknown; to: unknown },
  ): void {
    if (value.from !== '' && value.from !== null && value.from !== undefined) {
      filters.push({
        id: column.name,
        operation: FilterOperation.GreaterThanOrEqual,
        value: this.normalizeFilterValue(column, value.from),
      });
    }

    if (value.to !== '' && value.to !== null && value.to !== undefined) {
      filters.push({
        id: column.name,
        operation: FilterOperation.LessThanOrEqual,
        value: this.normalizeFilterValue(column, value.to),
      });
    }
  }

  /**
   * @description Adds a boolean equality filter.
   * @param filters Filter collection to mutate.
   * @param column Column configuration.
   * @param value Boolean string value.
   * @returns Void.
   */
  private addBooleanFilter(filters: TableFilter[], column: Column, value: string): void {
    if (value === '' || value === null || value === undefined) {
      return;
    }

    filters.push({
      id: column.name,
      operation: FilterOperation.Equal,
      value: value === 'true',
    });
  }

  /**
   * @description Adds select or multi-select filters.
   * @param filters Filter collection to mutate.
   * @param column Column configuration.
   * @param value Selected value or values.
   * @returns Void.
   */
  private addSelectFilter(
    filters: TableFilter[],
    column: Column,
    value: string | string[],
  ): void {
    if (Array.isArray(value)) {
      if (!value.length) {
        return;
      }

      filters.push({
        id: column.name,
        operation: FilterOperation.In,
        value,
      });
      return;
    }

    if (value === '' || value === null || value === undefined) {
      return;
    }

    filters.push({
      id: column.name,
      operation: FilterOperation.Equal,
      value,
    });
  }

  /**
   * @description Adds a string contains filter.
   * @param filters Filter collection to mutate.
   * @param column Column configuration.
   * @param value Text value.
   * @returns Void.
   */
  private addStringFilter(filters: TableFilter[], column: Column, value: string): void {
    const minLength = column.filterFieldConfig?.minLength ?? 3;

    if (!value || value.length < minLength) {
      return;
    }

    filters.push({
      id: column.name,
      operation: FilterOperation.Contains,
      value,
    });
  }

  /**
   * @description Adds a numeric equality filter.
   * @param filters Filter collection to mutate.
   * @param column Column configuration.
   * @param value Numeric value.
   * @returns Void.
   */
  private addNumericFilter(
    filters: TableFilter[],
    column: Column,
    value: string | number,
  ): void {
    if (value === '' || value === null || value === undefined) {
      return;
    }

    filters.push({
      id: column.name,
      operation: FilterOperation.Equal,
      value: Number(value),
    });
  }

  /**
   * @description Initializes visible columns and restores persisted visibility state.
   * @returns Void.
   */
  private initializeColumnVisibility(): void {
    const visibleColumns = new Set<string>();

    for (const column of this.columns) {
      const savedVisibility = this.loadColumnVisibility(column);
      const hiddenByDefault = column.visibilityConfig?.hidden === true;

      if (savedVisibility === true || (savedVisibility === null && !hiddenByDefault)) {
        visibleColumns.add(column.name);
      }

      if (column.visibilityConfig?.hideable === false) {
        visibleColumns.add(column.name);
      }
    }

    this.visibleColumns.set(visibleColumns);
  }

  /**
   * @description Loads column visibility from localStorage when persistence is enabled.
   * @param column Column configuration.
   * @returns Stored visibility value or null.
   */
  private loadColumnVisibility(column: Column): boolean | null {
    if (!column.visibilityConfig?.persistVisibility) {
      return null;
    }

    const value = localStorage.getItem(this.getColumnVisibilityStorageKey(column));

    return value === null ? null : JSON.parse(value) as boolean;
  }

  /**
   * @description Saves column visibility to localStorage when persistence is enabled.
   * @param columnName Column name.
   * @param isVisible Visibility state.
   * @returns Void.
   */
  private saveColumnVisibility(columnName: string, isVisible: boolean): void {
    const column = this.columns.find((item) => item.name === columnName);

    if (!column?.visibilityConfig?.persistVisibility) {
      return;
    }

    localStorage.setItem(
      this.getColumnVisibilityStorageKey(column),
      JSON.stringify(isVisible),
    );
  }

  /**
   * @description Saves the same visibility state for all persistable columns.
   * @param isVisible Visibility state.
   * @returns Void.
   */
  private saveAllColumnVisibility(isVisible: boolean): void {
    for (const column of this.columns) {
      if (column.visibilityConfig?.persistVisibility) {
        this.saveColumnVisibility(column.name, isVisible);
      }
    }
  }

  /**
   * @description Builds localStorage key for column visibility persistence.
   * @param column Column configuration.
   * @returns Storage key.
   */
  private getColumnVisibilityStorageKey(column: Column): string {
    return `${column.visibilityConfig?.persistKey ?? 'column'}_${column.name}`;
  }

  /**
   * @description Emits current selection state.
   * @returns Void.
   */
  private emitSelectionChange(): void {
    if (this.allElementsSelected()) {
      this.selectionChange.emit([
        '*ALL*',
        ...Array.from(this.excludedElements()).map((id) => `!${id}`),
      ]);
      return;
    }

    this.selectionChange.emit(Array.from(this.selectedIds()));
  }

  /**
   * @description Builds export request from current table state.
   * @returns Export request.
   */
  private buildExportRequest(): ExportRequest {
    return {
      selectedRecordIds: this.getSelectedRecordIds(),
      filters: this.buildFilters(),
      sort: this.sortState(),
      visibleColumns: Array.from(this.visibleColumns()),
      exportConfig: {
        delimiter: this.features.csvExport?.delimiter ?? ',',
        includeHeaders: this.features.csvExport?.includeHeaders !== false,
        format: 'csv',
      },
      maxRecords: this.features.csvExport?.maxRecords,
    };
  }

  /**
   * @description Gets selected record ids for export.
   * @returns Selection ids or undefined.
   */
  private getSelectedRecordIds(): string[] | undefined {
    if (this.allElementsSelected()) {
      return [
        '*ALL*',
        ...Array.from(this.excludedElements()).map((id) => `!${id}`),
      ];
    }

    return this.selectedIds().size ? Array.from(this.selectedIds()) : undefined;
  }

  /**
   * @description Checks whether a form value should be treated as an active filter.
   * @param value Form value.
   * @returns True when value is active.
   */
  private hasFilterValue(value: unknown): boolean {
    if (this.isRangeFilterValue(value)) {
      return this.hasFilterValue(value.from) || this.hasFilterValue(value.to);
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && value !== '';
  }

  /**
   * @description Checks whether a value is a range filter value.
   * @param value Value to check.
   * @returns True when value has from/to shape.
   */
  private isRangeFilterValue(value: unknown): value is { from: unknown; to: unknown } {
    return !!value && typeof value === 'object' && ('from' in value || 'to' in value);
  }

  /**
   * @description Checks whether a column type usually uses range filters.
   * @param type Column type.
   * @returns True for date, int and decimal types.
   */
  private isRangeType(type: string): boolean {
    return ['date', 'int', 'decimal'].includes(type);
  }

  /**
   * @description Normalizes filter value based on column type.
   * @param column Column configuration.
   * @param value Raw filter value.
   * @returns Normalized filter value.
   */
  private normalizeFilterValue(column: Column, value: unknown): unknown {
    if (column.type === 'date') {
      return new Date(value as string | Date).toISOString();
    }

    if (column.type === 'int' || column.type === 'decimal') {
      return Number(value);
    }

    return value;
  }

  /**
   * @description Validates date range filters.
   * @param control Range form group.
   * @returns Validation errors or null.
   */
  private readonly dateRangeValidator = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const from = control.get('from')?.value;
    const to = control.get('to')?.value;

    if (!from || !to) {
      return null;
    }

    return new Date(from) <= new Date(to) ? null : { dateRange: true };
  };

  /**
   * @description Validates numeric range filters.
   * @param control Range form group.
   * @returns Validation errors or null.
   */
  private readonly numberRangeValidator = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const from = control.get('from')?.value;
    const to = control.get('to')?.value;

    if (from === '' || to === '' || from === null || to === null) {
      return null;
    }

    return Number(from) <= Number(to) ? null : { numberRange: true };
  };
}
