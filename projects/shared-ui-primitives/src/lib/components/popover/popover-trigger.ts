import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { PopoverTriggerController } from './popover.models';

@Directive({
  selector: '[sharedPopoverTrigger]',
  standalone: true,
})
export class PopoverTriggerDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private controller?: PopoverTriggerController;

  connect(controller: PopoverTriggerController): void {
    this.controller = controller;
    const trigger = this.element.nativeElement;
    trigger.setAttribute('aria-controls', controller.panelId);
    trigger.setAttribute('aria-haspopup', controller.role);
    this.updateExpanded(controller.isOpen());
  }

  updateExpanded(expanded: boolean): void {
    this.element.nativeElement.setAttribute('aria-expanded', String(expanded));
  }

  @HostListener('click') onClick(): void {
    this.controller?.toggle(this.element.nativeElement);
  }

  @HostListener('keydown.escape', ['$event']) onEscape(event: Event): void {
    if (this.controller?.isOpen()) {
      event.preventDefault();
      event.stopPropagation();
      this.controller.close(true);
    }
  }
}
