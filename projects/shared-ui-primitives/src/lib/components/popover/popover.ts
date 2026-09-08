import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { PopoverPlacement, PopoverRole, PopoverTriggerController } from './popover.models';
import { PopoverTriggerDirective } from './popover-trigger';

let nextPopoverId = 0;

@Component({
  selector: 'shared-popover',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './popover.html',
  styleUrl: './popover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent implements PopoverTriggerController, AfterViewInit, OnDestroy {
  @Input({ required: true }) ariaLabel!: string;
  @Input() role: PopoverRole = 'dialog';
  @Input() placement: PopoverPlacement = 'bottom';
  @Input() disabled = false;
  @Input() closeOnPanelClick = false;
  @Input() autoFocus = true;
  @Input() matchTriggerWidth = false;
  @Input() panelClass = '';

  @Output() readonly openedChange = new EventEmitter<boolean>();

  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;
  @ContentChild(PopoverTriggerDirective) private triggerDirective?: PopoverTriggerDirective;

  readonly panelId = `shared-popover-${++nextPopoverId}`;
  readonly openState = signal(false);
  panelMinWidth?: number;
  private trigger?: HTMLElement;
  private focusTimer?: ReturnType<typeof setTimeout>;

  get positions(): ConnectedPosition[] {
    const positions: Record<PopoverPlacement, ConnectedPosition[]> = {
      bottom: [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
      ],
      top: [
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
      ],
      start: [
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 },
      ],
      end: [
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
      ],
    };
    return positions[this.placement];
  }

  ngAfterViewInit(): void {
    this.triggerDirective?.connect(this);
    if (this.openState()) {
      this.focusPanel();
    }
  }

  ngOnDestroy(): void {
    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
    }
  }

  isOpen(): boolean {
    return this.openState();
  }

  open(trigger?: HTMLElement): void {
    if (this.disabled || this.openState()) {
      return;
    }
    this.trigger = trigger ?? this.trigger;
    this.panelMinWidth = this.matchTriggerWidth
      ? this.trigger?.getBoundingClientRect().width
      : undefined;
    this.trigger?.setAttribute('aria-haspopup', this.role);
    this.openState.set(true);
    this.triggerDirective?.updateExpanded(true);
    this.openedChange.emit(true);
    this.focusPanel();
  }

  toggle(trigger: HTMLElement): void {
    this.trigger = trigger;
    this.openState() ? this.close(true) : this.open(trigger);
  }

  close(restoreFocus = true): void {
    if (!this.openState()) {
      return;
    }
    this.openState.set(false);
    this.triggerDirective?.updateExpanded(false);
    this.openedChange.emit(false);
    if (restoreFocus) {
      this.trigger?.focus();
    }
  }

  onPanelClick(): void {
    if (this.closeOnPanelClick) {
      this.close(true);
    }
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    }
  }

  private focusPanel(): void {
    if (!this.autoFocus) {
      return;
    }
    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
    }
    this.focusTimer = setTimeout(() => {
      const panel = this.panel?.nativeElement;
      const menuItem =
        this.role === 'menu' ? panel?.querySelector<HTMLElement>('[role="menuitem"]') : null;
      (menuItem ?? panel)?.focus();
    });
  }
}
