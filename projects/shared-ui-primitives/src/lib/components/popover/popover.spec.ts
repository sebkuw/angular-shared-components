import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PopoverComponent } from './popover';
import { PopoverTriggerDirective } from './popover-trigger';

@Component({
  standalone: true,
  imports: [PopoverComponent, PopoverTriggerDirective],
  template: `
    <shared-popover
      ariaLabel="Notification options"
      [role]="role"
      [disabled]="disabled"
      [closeOnPanelClick]="closeOnPanelClick"
      (openedChange)="changes.push($event)"
    >
      <button sharedPopoverTrigger type="button">Notifications</button>
      <button type="button">Mark all as read</button>
      <p>A deliberately long translated notification message.</p>
    </shared-popover>
  `,
})
class PopoverHostComponent {
  role: 'dialog' | 'menu' = 'dialog';
  disabled = false;
  closeOnPanelClick = false;
  changes: boolean[] = [];
}

describe('PopoverComponent', () => {
  let fixture: ComponentFixture<PopoverHostComponent>;
  let overlayContainer: OverlayContainer;
  let overlayElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PopoverHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(PopoverHostComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayElement = overlayContainer.getContainerElement();
    fixture.detectChanges();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  it('connects an accessible native trigger to the dialog panel', fakeAsync(() => {
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const panel = overlayElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.getAttribute('aria-label')).toBe('Notification options');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel).toBe(document.activeElement as HTMLElement);
    expect(fixture.componentInstance.changes).toEqual([true]);
  }));

  it('closes with Escape and restores focus to the trigger', fakeAsync(() => {
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    tick();
    const panel = overlayElement.querySelector('[role="dialog"]') as HTMLElement;

    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(overlayElement.querySelector('[role="dialog"]')).toBeNull();
    expect(trigger).toBe(document.activeElement as HTMLButtonElement);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.changes).toEqual([true, false]);
  }));

  it('does not open while disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(overlayElement.children.length).toBe(0);
    expect(fixture.componentInstance.changes).toEqual([]);
  });

  it('supports menu semantics and optional close after a panel action', fakeAsync(() => {
    fixture.componentInstance.role = 'menu';
    fixture.componentInstance.closeOnPanelClick = true;
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    tick();

    const menu = overlayElement.querySelector('[role="menu"]') as HTMLElement;
    (menu.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(overlayElement.querySelector('[role="menu"]')).toBeNull();
    expect(trigger).toBe(document.activeElement as HTMLButtonElement);
  }));
});
