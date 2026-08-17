import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonComponent] }).compileComponents();
    fixture = TestBed.createComponent(SkeletonComponent);
    fixture.detectChanges();
  });

  it('renders an accessible busy status', () => {
    const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

    expect(status.getAttribute('aria-label')).toBe('Loading content');
    expect(status.getAttribute('aria-busy')).toBe('true');
    expect(status.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders a bounded number of text lines and shortens the final one', () => {
    fixture.componentRef.setInput('lines', 3);
    fixture.componentRef.setInput('label', 'Loading order summary');
    fixture.detectChanges();

    const shapes = fixture.nativeElement.querySelectorAll('.shared-skeleton__shape');
    expect(shapes.length).toBe(3);
    expect(shapes[2].classList).toContain('shared-skeleton__shape--last-line');
    expect(fixture.nativeElement.querySelector('[role="status"]').getAttribute('aria-label')).toBe(
      'Loading order summary',
    );
  });

  it('supports a non-animated circular placeholder with configured dimensions', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.componentRef.setInput('width', '3rem');
    fixture.componentRef.setInput('animated', false);
    fixture.detectChanges();

    const shape = fixture.nativeElement.querySelector('.shared-skeleton__shape') as HTMLElement;
    expect(shape.classList).toContain('shared-skeleton__shape--circle');
    expect(shape.classList).not.toContain('shared-skeleton__shape--animated');
    expect(shape.style.inlineSize).toBe('3rem');
    expect(shape.style.blockSize).toBe('3rem');
  });
});
