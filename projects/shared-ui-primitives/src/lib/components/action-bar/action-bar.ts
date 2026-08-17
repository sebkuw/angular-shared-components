import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ActionBarAlignment = 'start' | 'end' | 'space-between';

@Component({
  selector: 'shared-action-bar',
  standalone: true,
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBarComponent {
  @Input() ariaLabel = 'Actions';
  @Input() alignment: ActionBarAlignment = 'end';
  @Input() wrap = true;
  @Input() sticky = false;
}
