import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type LoadingMode = 'inline' | 'block' | 'overlay';

export type LoadingSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'shared-loading',
  standalone: true,
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() label = 'Loading';
  @Input() mode: LoadingMode = 'inline';
  @Input() size: LoadingSize = 'medium';
  @Input() showLabel = false;

  get containerClasses(): string {
    return ['shared-loading', `shared-loading--${this.mode}`, `shared-loading--${this.size}`].join(
      ' ',
    );
  }
}
