import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cast' })
export class CastPipe implements PipeTransform {
  transform<T>(value: unknown): T {
    return value as T;
  }
}
