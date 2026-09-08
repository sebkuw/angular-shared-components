export type PopoverRole = 'dialog' | 'menu';
export type PopoverPlacement = 'top' | 'bottom' | 'start' | 'end';

export interface PopoverTriggerController {
  readonly panelId: string;
  readonly role: PopoverRole;
  isOpen(): boolean;
  toggle(trigger: HTMLElement): void;
  close(restoreFocus?: boolean): void;
}
