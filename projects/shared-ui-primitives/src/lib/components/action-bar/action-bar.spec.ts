import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionBarComponent } from './action-bar';

@Component({
  standalone: true,
  imports: [ActionBarComponent],
  template: `
    <shared-action-bar ariaLabel="Editor actions" alignment="space-between">
      <button sharedActionBarStart type="button">Back</button>
      <button type="button">Save</button>
    </shared-action-bar>
  `,
})
class ActionBarHostComponent {}

describe('ActionBarComponent', () => {
  let fixture: ComponentFixture<ActionBarHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ActionBarHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(ActionBarHostComponent);
    fixture.detectChanges();
  });

  it('groups projected actions and preserves start/end slots', () => {
    const bar = fixture.nativeElement.querySelector('[role="group"]') as HTMLElement;
    const start = fixture.nativeElement.querySelector('.shared-action-bar__start') as HTMLElement;
    const end = fixture.nativeElement.querySelector('.shared-action-bar__end') as HTMLElement;

    expect(bar.getAttribute('aria-label')).toBe('Editor actions');
    expect(start.textContent).toContain('Back');
    expect(end.textContent).toContain('Save');
    expect(bar.classList).toContain('shared-action-bar--space-between');
  });
});
