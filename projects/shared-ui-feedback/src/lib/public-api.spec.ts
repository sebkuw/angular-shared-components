import {
  ConfirmationDialogComponent,
  ConfirmationDialogService,
  EmptyStateComponent,
  ErrorStateComponent,
  FormModalComponent,
  FormModalRef,
  FormModalService,
  InfoDialogComponent,
  NotificationComponent,
  NotificationService,
  provideSharedNotifications,
} from '@sebkuw/shared-ui-feedback';

describe('shared-ui-feedback public API', () => {
  it('exports dialog and notification components', () => {
    expect(InfoDialogComponent).toBeDefined();
    expect(NotificationComponent).toBeDefined();
    expect(EmptyStateComponent).toBeDefined();
    expect(ErrorStateComponent).toBeDefined();
    expect(FormModalComponent).toBeDefined();
    expect(FormModalRef).toBeDefined();
    expect(FormModalService).toBeDefined();
    expect(ConfirmationDialogComponent).toBeDefined();
    expect(ConfirmationDialogService).toBeDefined();
    expect(NotificationService).toBeDefined();
    expect(provideSharedNotifications).toBeDefined();
  });
});
