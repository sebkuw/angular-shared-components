import { PageHeaderComponent } from './page-header';

describe('PageHeaderComponent', () => {
  it('emits info payload when info content is available', () => {
    const component = new PageHeaderComponent();
    let emittedTitle: string | undefined;

    component.infoTitle = 'Orders';
    component.infoContent = 'Orders help text';
    component.confirmationBtnText = 'Close';
    component.infoClick.subscribe((value) => emittedTitle = value.title);

    component.onInfoClick();

    expect(emittedTitle).toBe('Orders');
  });

  it('does not emit info payload without info content', () => {
    const component = new PageHeaderComponent();
    let emitted = false;

    component.infoClick.subscribe(() => emitted = true);

    component.onInfoClick();

    expect(emitted).toBeFalse();
  });
});
