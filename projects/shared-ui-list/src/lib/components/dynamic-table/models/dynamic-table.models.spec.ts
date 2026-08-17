import {
  FilterOperation,
  TableDataRequestEvent,
  toPaginationRequestDto,
} from './dynamic-table.models';

describe('toPaginationRequestDto', () => {
  it('maps table event to backend pagination request', () => {
    const event: TableDataRequestEvent = {
      pagination: {
        pageIndex: 2,
        pageSize: 25,
      },
      sort: {
        column: 'createdAt',
        direction: 'desc',
      },
      filters: [
        {
          id: 'name',
          operation: FilterOperation.Contains,
          value: 'ann',
        },
      ],
    };

    expect(toPaginationRequestDto(event)).toEqual({
      SortParam: 'createdAt desc',
      Filters: [
        {
          PropertyPath: 'name',
          Operation: FilterOperation.Contains,
          Value: 'ann',
        },
      ],
      PaginationOptions: {
        PageNumber: 3,
        PageSize: 25,
      },
    });
  });

  it('omits sort parameter when sort direction is empty', () => {
    const event: TableDataRequestEvent = {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sort: {
        column: 'name',
        direction: '',
      },
      filters: [],
    };

    expect(toPaginationRequestDto(event).SortParam).toBeUndefined();
  });
});
