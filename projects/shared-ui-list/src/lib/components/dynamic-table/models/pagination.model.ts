import { FilterOperation } from './dynamic-table.models';

/**
 * @interface FilterCondition
 * @description Backend-friendly filter condition model. Uses PascalCase names to match common .NET DTO conventions.
 */
export interface FilterCondition {
  /**
   * @description Property path used by the backend query/filter engine.
   */
  PropertyPath: string;

  /**
   * @description Filter operation used by the backend.
   */
  Operation: FilterOperation;

  /**
   * @description Filter value sent to the backend.
   */
  Value: unknown;
}

/**
 * @interface PaginationOptions
 * @description Backend-friendly pagination options model. PageNumber is 1-based.
 */
export interface PaginationOptions {
  /**
   * @description 1-based page number expected by the backend.
   */
  PageNumber: number;

  /**
   * @description Number of records requested for a single page.
   */
  PageSize: number;
}

/**
 * @interface RequestDto
 * @description Generic backend request model containing sorting, filtering and pagination data.
 */
export interface RequestDto {
  /**
   * @description Optional sorting parameter, for example `Name asc` or `CreatedDate desc`.
   */
  SortParam?: string;

  /**
   * @description Optional backend filter collection.
   */
  Filters?: FilterCondition[];

  /**
   * @description Optional backend pagination options.
   */
  PaginationOptions?: PaginationOptions;
}

/**
 * @interface PaginationResponse
 * @description Generic backend pagination response model.
 * @template T Response item type.
 */
export interface PaginationResponse<T> {
  /**
   * @description Current page records.
   */
  Data: T[];

  /**
   * @description Total item count matching the request.
   */
  TotalItems: number;

  /**
   * @description Total page count.
   */
  TotalPages: number;

  /**
   * @description 1-based current page number.
   */
  PageNumber: number;

  /**
   * @description Current page size.
   */
  PageSize: number;

  /**
   * @description Indicates whether another page is available.
   */
  HasNextPage: boolean;
}
