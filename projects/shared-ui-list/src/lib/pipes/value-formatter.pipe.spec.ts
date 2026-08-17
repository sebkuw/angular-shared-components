import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { ValueFormatterPipe } from './value-formatter.pipe';

describe('ValueFormatterPipe', () => {
  beforeAll(() => {
    registerLocaleData(localePl);
  });

  const pipe = new ValueFormatterPipe();

  it('returns empty string for nullish values', () => {
    expect(pipe.transform(null, { name: 'name', displayName: 'Name', type: 'string' })).toBe('');
    expect(pipe.transform(undefined, { name: 'name', displayName: 'Name', type: 'string' })).toBe(
      '',
    );
  });

  it('formats boolean values in Polish', () => {
    expect(pipe.transform(true, { name: 'active', displayName: 'Active', type: 'boolean' })).toBe(
      'Tak',
    );
    expect(pipe.transform(false, { name: 'active', displayName: 'Active', type: 'boolean' })).toBe(
      'Nie',
    );
  });

  it('formats enum values using configured labels', () => {
    expect(
      pipe.transform('admin', {
        name: 'role',
        displayName: 'Role',
        type: 'enum',
        enumValues: {
          admin: 'Administrator',
        },
      }),
    ).toBe('Administrator');
  });

  it('formats integer values without fractional digits', () => {
    const value = pipe
      .transform(1234.56, { name: 'count', displayName: 'Count', type: 'int' })
      .replace(/\s/g, ' ');

    expect(value).toBe('1 235');
  });
});
