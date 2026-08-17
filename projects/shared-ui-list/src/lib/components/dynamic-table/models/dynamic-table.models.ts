/**
 * @interface TableSort
 * @description Defines the sorting state used by the dynamic table.
 */
export interface TableSort {
  /**
   * @description Column/property name used for sorting.
   */
  column: string;

  /**
   * @description Sort direction. Empty value means no active sorting.
   */
  direction: 'asc' | 'desc' | '';
}

/**
 * @enum FilterOperation
 * @description Defines supported backend filter operations.
 */
export enum FilterOperation {
  Equal = 0,
  NotEqual = 1,
  GreaterThan = 2,
  LessThan = 3,
  GreaterThanOrEqual = 4,
  LessThanOrEqual = 5,
  Contains = 6,
  StartsWith = 7,
  EndsWith = 8,
  In = 9,
  NotIn = 10,
}

/**
 * @interface TableFilter
 * @description Generic filter definition emitted by the dynamic table.
 */
export interface TableFilter {
  /**
   * @description Column/property name.
   */
  id: string;

  /**
   * @description Filter operation.
   */
  operation: FilterOperation;

  /**
   * @description Filter value.
   */
  value: unknown;
}

/**
 * @interface TablePagination
 * @description Frontend table pagination state. Uses 0-based pageIndex for Angular Material compatibility.
 */
export interface TablePagination {
  /**
   * @description 0-based page index used by Angular Material paginator.
   */
  pageIndex: number;

  /**
   * @description Number of records displayed on one page.
   */
  pageSize: number;
}

/**
 * @interface TableDataRequestEvent
 * @description Event emitted by the dynamic table whenever data should be loaded again.
 */
export interface TableDataRequestEvent {
  /**
   * @description Pagination state for the request.
   */
  pagination: TablePagination;

  /**
   * @description Current sort state.
   */
  sort?: TableSort;

  /**
   * @description Current filter collection.
   */
  filters?: TableFilter[];
}

/**
 * @description Converts a table data request into a backend-friendly .NET-style request DTO.
 * @param event Table request emitted by the dynamic table.
 * @returns Backend request object with PascalCase property names.
 */
export function toPaginationRequestDto(
  event: TableDataRequestEvent,
): import('./pagination.model').RequestDto {
  return {
    SortParam:
      event.sort?.column && event.sort.direction
        ? `${event.sort.column} ${event.sort.direction}`
        : undefined,
    Filters: event.filters?.map((filter) => ({
      PropertyPath: filter.id,
      Operation: filter.operation,
      Value: filter.value,
    })),
    PaginationOptions: {
      PageNumber: event.pagination.pageIndex + 1,
      PageSize: event.pagination.pageSize,
    },
  };
}
