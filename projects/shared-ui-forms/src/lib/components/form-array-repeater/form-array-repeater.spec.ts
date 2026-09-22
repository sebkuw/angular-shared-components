import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormArrayRepeaterRowDirective } from './form-array-repeater-row.directive';
import { FormArrayRepeaterComponent } from './form-array-repeater';
import { FormRepeaterGroupComponent } from './form-repeater-group';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormArrayRepeaterComponent,
    FormArrayRepeaterRowDirective,
    FormRepeaterGroupComponent,
  ],
  template: `
    <shared-form-array-repeater
      ariaLabel="Contact people"
      idPrefix="contact-person"
      [formArray]="contacts"
      [rowFactory]="createContact"
      [minRows]="minRows"
      [maxRows]="2"
      [groupColumns]="3"
      cardTitle="Contact"
      addLabel="Add contact"
      removeLabel="Remove"
    >
      <ng-template sharedFormArrayRepeaterRow let-row let-index="index" let-controlId="controlId">
        <shared-form-repeater-group label="Identity">
          <label [for]="controlId('name')">Name {{ index + 1 }}</label>
          <input [id]="controlId('name')" [formControl]="row.controls['name']" />
        </shared-form-repeater-group>
        <shared-form-repeater-group label="Address">
          <label [for]="controlId('city')">City {{ index + 1 }}</label>
          <input [id]="controlId('city')" [formControl]="row.controls['city']" />
        </shared-form-repeater-group>
        <shared-form-repeater-group label="Preferences">
          <label [for]="controlId('notes')">Notes {{ index + 1 }}</label>
          <input [id]="controlId('notes')" [formControl]="row.controls['notes']" />
        </shared-form-repeater-group>
      </ng-template>
    </shared-form-array-repeater>
  `,
})
class FormArrayRepeaterHostComponent {
  readonly contacts = new FormArray<FormGroup>([]);
  minRows = 0;

  readonly createContact = (): FormGroup =>
    new FormGroup({
      name: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      notes: new FormControl('', { nonNullable: true }),
    });
}

describe('FormArrayRepeaterComponent', () => {
  let fixture: ComponentFixture<FormArrayRepeaterHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormArrayRepeaterHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormArrayRepeaterHostComponent);
    fixture.detectChanges();
  });

  it('supports minRows zero and adds a projected row with an accessible card header', fakeAsync(() => {
    expect(fixture.componentInstance.contacts.length).toBe(0);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'No items added.',
    );

    buttonNamed('Add contact').click();
    fixture.detectChanges();
    tick();

    const card = fixture.nativeElement.querySelector('[role="listitem"]') as HTMLElement;
    const heading = fixture.nativeElement.querySelector('h3') as HTMLHeadingElement;
    expect(fixture.componentInstance.contacts.length).toBe(1);
    expect(heading.textContent).toContain('Contact 1');
    expect(card.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
  }));

  it('creates unique, programmatically labelled control ids for every repeated row', () => {
    buttonNamed('Add contact').click();
    fixture.detectChanges();
    buttonNamed('Add contact').click();
    fixture.detectChanges();

    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>,
    );
    const ids = inputs.map((input) => input.id);
    expect(new Set(ids).size).toBe(6);
    expect(ids.every((id) => id.startsWith('contact-person-row-'))).toBeTrue();

    for (const input of inputs) {
      const label = fixture.nativeElement.querySelector(`label[for="${input.id}"]`);
      expect(label).not.toBeNull();
    }
  });

  it('renders one to three semantic bordered groups in the responsive grid', () => {
    buttonNamed('Add contact').click();
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll(
      'fieldset',
    ) as NodeListOf<HTMLFieldSetElement>;
    const grid = fixture.nativeElement.querySelector('.shared-form-array-repeater__groups');
    expect(groups.length).toBe(3);
    expect(
      Array.from(groups).map(
        (group: HTMLFieldSetElement) => group.querySelector('legend')?.textContent,
      ),
    ).toEqual(['Identity', 'Address', 'Preferences']);
    expect(grid.classList).toContain('shared-form-array-repeater__groups--3');
  });

  it('removes down to zero, emits form state and restores focus to Add', fakeAsync(() => {
    buttonNamed('Add contact').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.contacts.dirty).toBeTrue();

    buttonNamed('Remove Contact 1', true).click();
    fixture.detectChanges();
    tick();

    expect(fixture.componentInstance.contacts.length).toBe(0);
    expect(document.activeElement).toBe(buttonNamed('Add contact'));
  }));

  it('enforces minRows and maxRows without removing user controls', () => {
    fixture.componentInstance.minRows = 1;
    fixture.detectChanges();
    expect(fixture.componentInstance.contacts.length).toBe(1);
    expect(buttonNamed('Remove Contact 1', true).disabled).toBeTrue();

    buttonNamed('Add contact').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.contacts.length).toBe(2);
    expect(buttonNamed('Add contact').disabled).toBeTrue();
  });

  it('keeps add and remove operations SSR-safe without scheduling DOM focus', () => {
    const setTimeoutSpy = spyOn(window, 'setTimeout');
    const component = new FormArrayRepeaterComponent(
      new ElementRef(document.createElement('div')),
      'server-app',
      'server' as unknown as object,
    );
    component.formArray = new FormArray<FormGroup>([]);
    component.rowFactory = fixture.componentInstance.createContact;

    component.addRow();
    component.removeRow(0);

    expect(component.formArray.length).toBe(0);
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  function buttonNamed(name: string, accessibleName = false): HTMLButtonElement {
    return Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) =>
      accessibleName
        ? button.getAttribute('aria-label') === name
        : button.textContent?.trim() === name,
    )!;
  }
});
