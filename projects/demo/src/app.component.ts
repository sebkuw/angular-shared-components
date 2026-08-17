import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PermissionContext } from '@sebkuw/shared-ui-core';
import {
  ConfirmationDialogService,
  EmptyStateComponent,
  InfoDialogComponent,
  NotificationService,
} from '@sebkuw/shared-ui-feedback';
import {
  DetailsConfig,
  DynamicDetailsComponent,
  DynamicFormComponent,
  DynamicFormConfig,
} from '@sebkuw/shared-ui-forms';
import {
  MenuItem,
  PageHeaderComponent,
  SideMenu,
  SkipLinkComponent,
} from '@sebkuw/shared-ui-layout';
import {
  BaseRow,
  Column,
  DynamicTableComponent,
  FilterOperation,
  TableDataRequestEvent,
  TableFilter,
} from '@sebkuw/shared-ui-list';
import {
  ActionBarComponent,
  ActionLinkComponent,
  ButtonComponent,
  FieldLabelComponent,
  IconComponent,
  IconButtonComponent,
  IconLinkComponent,
  InlineAlertComponent,
  LoadingComponent,
  VisuallyHiddenDirective,
} from '@sebkuw/shared-ui-primitives';
import { take } from 'rxjs';

interface DemoRow extends BaseRow {
  name: string;
  category: string;
  amount: number;
  createdAt: string;
  status: boolean;
  adminNote: string;
}

export const permissionContext = signal<PermissionContext>({
  status: 'ready',
  authenticated: true,
  permissions: ['orders.read'],
  claims: { tenant: 'acme' },
});

export const demoMenu: MenuItem[] = [
  { id: 'overview', title: 'Overview', icon: 'home', level: 0, route: '/' },
  {
    id: 'admin',
    title: 'Administration',
    icon: 'admin_panel_settings',
    level: 0,
    access: { all: ['admin.read'] },
    children: [],
  },
];

const DEMO_ROWS: DemoRow[] = [
  {
    Id: 1,
    name: 'First order',
    category: 'hardware',
    amount: 1250,
    createdAt: '2026-01-15',
    status: true,
    adminNote: 'Priority customer',
  },
  {
    Id: 2,
    name: 'Second order',
    category: 'software',
    amount: 320,
    createdAt: '2026-02-03',
    status: false,
    adminNote: 'Waiting for approval',
  },
  {
    Id: 3,
    name: 'Office equipment',
    category: 'office',
    amount: 780,
    createdAt: '2026-03-22',
    status: true,
    adminNote: 'Deliver before noon',
  },
  {
    Id: 4,
    name: 'Developer licences',
    category: 'software',
    amount: 2400,
    createdAt: '2026-04-09',
    status: true,
    adminNote: 'Annual renewal',
  },
  {
    Id: 5,
    name: 'Meeting room set',
    category: 'office',
    amount: 460,
    createdAt: '2026-05-18',
    status: false,
    adminNote: 'Budget review required',
  },
  {
    Id: 6,
    name: 'Network upgrade',
    category: 'hardware',
    amount: 5100,
    createdAt: '2026-06-27',
    status: true,
    adminNote: 'Maintenance window booked',
  },
];

@Component({
  selector: 'demo-root',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SideMenu,
    SkipLinkComponent,
    DynamicFormComponent,
    DynamicDetailsComponent,
    DynamicTableComponent,
    ButtonComponent,
    ActionLinkComponent,
    IconLinkComponent,
    ActionBarComponent,
    IconComponent,
    IconButtonComponent,
    FieldLabelComponent,
    LoadingComponent,
    InlineAlertComponent,
    EmptyStateComponent,
    VisuallyHiddenDirective,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  private readonly dialog = inject(MatDialog);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly notifications = inject(NotificationService);

  readonly rows = signal<DemoRow[]>([...DEMO_ROWS]);
  readonly total = signal(DEMO_ROWS.length);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly loading = signal(false);
  readonly tableError = signal<string | null>(null);
  readonly isAdmin = signal(false);
  readonly formStatus = signal('The example form has not been submitted yet.');
  readonly detailsEditing = signal(false);
  readonly detailsVisible = signal(true);
  readonly showInlineWarning = signal(true);
  readonly primitiveStatus = signal('No primitive action has been activated yet.');

  readonly columns: Column[] = [
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      sortable: true,
      filterable: true,
      width: '14rem',
      filterFieldConfig: {
        type: 'text',
        filterType: 'single',
        placeholder: 'Search order name',
        minLength: 1,
      },
    },
    {
      name: 'category',
      displayName: 'Category',
      type: 'enum',
      sortable: true,
      filterable: true,
      enumValues: { hardware: 'Hardware', software: 'Software', office: 'Office' },
      filterFieldConfig: {
        type: 'select',
        filterType: 'single',
        placeholder: 'Choose category',
        options: [
          { key: 'hardware', value: 'Hardware' },
          { key: 'software', value: 'Software' },
          { key: 'office', value: 'Office' },
        ],
      },
    },
    {
      name: 'amount',
      displayName: 'Amount',
      type: 'decimal',
      sortable: true,
      filterable: true,
      format: '1.2-2',
      filterFieldConfig: {
        type: 'number',
        filterType: 'range',
        placeholderFrom: 'Minimum amount',
        placeholderTo: 'Maximum amount',
        min: 0,
        step: 10,
      },
    },
    {
      name: 'createdAt',
      displayName: 'Created',
      type: 'date',
      sortable: true,
      filterable: true,
      filterFieldConfig: {
        type: 'date',
        filterType: 'range',
        placeholderFrom: 'Created from',
        placeholderTo: 'Created to',
      },
    },
    {
      name: 'status',
      displayName: 'Active',
      type: 'boolean',
      filterable: true,
      filterFieldConfig: {
        type: 'boolean',
        filterType: 'single',
        placeholder: 'Choose status',
      },
    },
    {
      name: 'adminNote',
      displayName: 'Admin note',
      type: 'string',
      access: { all: ['admin.read'] },
    },
  ];

  readonly formInitialData: Record<string, unknown> = {
    quantity: 2,
    deliveryDate: new Date(2026, 7, 10),
    orderType: 'standard',
    tags: ['new', 'priority'],
    receiveUpdates: true,
    lineItems: [{ product: 'Keyboard', lineQuantity: 2, unit: 'pcs' }],
  };

  readonly formConfig: DynamicFormConfig = {
    ariaLabel: 'All field types example form',
    columns: 3,
    guidance: {
      showCompletion: true,
      showErrorSummary: true,
      completionLabel: 'Required example fields completed',
      errorSummaryTitle: 'Complete the example form',
      errorSummaryDescription: 'Use these links to review fields that still need attention.',
    },
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter full name',
        hint: 'Use the name shown on the customer record.',
        autocomplete: 'name',
        validators: [Validators.required],
        errorMessages: { required: 'Name is required.' },
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'name@example.com',
        autocomplete: 'email',
        validators: [Validators.required, Validators.email],
        errorMessages: { required: 'Email is required.', email: 'Enter a valid email address.' },
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter a test password',
        autocomplete: 'new-password',
        maxLength: 64,
      },
      {
        key: 'quantity',
        label: 'Quantity',
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
        isInteger: true,
      },
      {
        key: 'deliveryDate',
        label: 'Delivery date',
        type: 'date',
        minDate: new Date(2026, 0, 1),
        maxDate: new Date(2027, 11, 31),
      },
      {
        key: 'orderType',
        label: 'Order type',
        type: 'select',
        placeholder: 'Choose order type',
        isNullable: true,
        options: [
          { key: 'standard', value: 'Standard' },
          { key: 'express', value: 'Express' },
          { key: 'subscription', value: 'Subscription' },
        ],
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'multi-select',
        placeholder: 'Choose one or more tags',
        options: [
          { key: 'new', value: 'New customer' },
          { key: 'priority', value: 'Priority' },
          { key: 'international', value: 'International' },
        ],
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Add a longer note to test wrapping',
        rows: 4,
        maxLength: 240,
        colSpan: 2,
      },
      {
        key: 'receiveUpdates',
        label: 'Receive status updates',
        type: 'checkbox',
      },
      {
        key: 'attachment',
        label: 'Attachment',
        type: 'file',
        placeholder: 'Choose PDF or image',
        acceptedFileTypes: '.pdf,image/*',
        clearLabel: 'Remove selected attachment',
        colSpan: 2,
      },
      {
        key: 'lineItemsHeading',
        label: 'Line items heading',
        type: 'spacer',
        text: 'Editable line items',
        fontWeight: 700,
        colSpan: 3,
      },
      {
        key: 'lineItems',
        label: 'Line items',
        type: 'table',
        colSpan: 3,
        minRows: 1,
        maxRows: 4,
        rowIndexLabel: 'Row',
        addRowLabel: 'Add line item',
        removeRowLabel: (index) => `Remove line item ${index + 1}`,
        columns: [
          { key: 'product', label: 'Product', type: 'text', placeholder: 'Product name' },
          { key: 'lineQuantity', label: 'Pieces', type: 'number', min: 1, step: 1 },
          {
            key: 'unit',
            label: 'Unit',
            type: 'select',
            options: [
              { key: 'pcs', value: 'Pieces' },
              { key: 'hours', value: 'Hours' },
              { key: 'licences', value: 'Licences' },
            ],
          },
        ],
      },
      {
        key: 'adminComment',
        label: 'Admin comment',
        type: 'textarea',
        placeholder: 'Visible after enabling admin permission',
        access: { all: ['admin.read'] },
        colSpan: 3,
      },
    ],
    submitButton: {
      labelCreate: 'Save example',
      position: 'left',
      ariaLabel: 'Save all field type examples',
    },
  };

  readonly details = signal<Record<string, unknown>>({
    name: 'First order',
    email: 'orders@example.com',
    status: true,
    amount: 1250,
    createdAt: new Date(2026, 0, 15),
    tags: ['New customer', 'Priority'],
    notes: 'A long detail value demonstrates wrapping and a two-column span.',
    secret: 'Restricted operational note',
  });

  readonly detailsConfig: DetailsConfig = {
    ariaLabel: 'Example order details',
    columns: 3,
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { type: 'spacer' },
      { key: 'status', label: 'Active', render: (value) => (value ? 'Yes' : 'No') },
      {
        key: 'amount',
        label: 'Amount',
        render: (value) =>
          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            Number(value),
          ),
      },
      {
        key: 'createdAt',
        label: 'Created',
        render: (value) =>
          value instanceof Date
            ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(value)
            : String(value ?? ''),
      },
      {
        key: 'tags',
        label: 'Tags',
        render: (value) => (Array.isArray(value) ? value.join(', ') : String(value ?? '')),
      },
      { key: 'notes', label: 'Notes', colSpan: 2 },
      {
        key: 'secret',
        label: 'Restricted note',
        access: { all: ['admin.read'] },
        colSpan: 3,
      },
    ],
    actions: {
      edit: { label: 'Edit order details' },
      remove: { label: 'Remove order details' },
    },
  };

  readonly detailsEditConfig: DynamicFormConfig = {
    ariaLabel: 'Edit example order details',
    columns: 2,
    fields: [
      { key: 'name', label: 'Name', type: 'text', validators: [Validators.required] },
      { key: 'email', label: 'Email', type: 'email', validators: [Validators.email] },
      { key: 'status', label: 'Active', type: 'checkbox' },
      { key: 'amount', label: 'Amount', type: 'number', min: 0, step: 10 },
      { key: 'createdAt', label: 'Created', type: 'date' },
      {
        key: 'tags',
        label: 'Tags',
        type: 'multi-select',
        options: [
          { key: 'New customer', value: 'New customer' },
          { key: 'Priority', value: 'Priority' },
          { key: 'International', value: 'International' },
        ],
      },
      { key: 'notes', label: 'Notes', type: 'textarea', rows: 3, colSpan: 2 },
    ],
    submitButton: {
      labelEdit: 'Save details',
      position: 'left',
      ariaLabel: 'Save edited order details',
    },
  };

  toggleAdmin(): void {
    const enabled = !this.isAdmin();
    this.isAdmin.set(enabled);
    permissionContext.update((context) => ({
      ...context,
      permissions: enabled ? ['orders.read', 'admin.read'] : ['orders.read'],
    }));
  }

  savePrimitiveExample(): void {
    this.primitiveStatus.set('Positive Save action activated.');
  }

  removePrimitiveExample(): void {
    this.primitiveStatus.set('Negative Remove action activated.');
  }

  refreshPrimitiveExample(): void {
    this.primitiveStatus.set('Icon-only Refresh action activated.');
  }

  reviewPrimitiveAlert(): void {
    this.primitiveStatus.set('Inline alert Review action activated.');
  }

  dismissPrimitiveAlert(): void {
    this.showInlineWarning.set(false);
    this.primitiveStatus.set('Inline warning dismissed.');
  }

  restorePrimitiveAlert(): void {
    this.showInlineWarning.set(true);
  }

  submitExampleForm(value: Record<string, unknown>): void {
    const controlCount = Object.keys(value).length;
    this.formStatus.set(`Form submitted successfully with ${controlCount} controls.`);
    this.showSnackBar('The complete example form was submitted.');
  }

  startDetailsEdit(): void {
    this.detailsEditing.set(true);
  }

  cancelDetailsEdit(): void {
    this.detailsEditing.set(false);
  }

  saveDetails(value: Record<string, unknown>): void {
    this.details.update((current) => ({ ...current, ...value }));
    this.detailsEditing.set(false);
    this.showSnackBar('Order details were updated.');
  }

  removeDetails(): void {
    this.confirmationDialog
      .confirm({
        title: 'Remove order details?',
        message: 'This removes the details from the demo. You can restore them afterwards.',
        confirmLabel: 'Remove details',
        cancelLabel: 'Keep details',
        confirmTone: 'negative',
        actionsAriaLabel: 'Remove order details confirmation actions',
      })
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.detailsVisible.set(false);
        this.detailsEditing.set(false);
        this.showSnackBar('Order details were removed from the demo.');
      });
  }

  restoreDetails(): void {
    this.detailsVisible.set(true);
  }

  showTableError(): void {
    this.tableError.set('The demo data source returned an error.');
  }

  retryTable(): void {
    this.tableError.set(null);
    this.restoreDemoRows();
    this.notifications.success('The table data was loaded again.');
  }

  restoreDemoRows(): void {
    this.rows.set([...DEMO_ROWS]);
    this.total.set(DEMO_ROWS.length);
    this.pageIndex.set(0);
  }

  onDataRequest(request: TableDataRequestEvent): void {
    this.tableError.set(null);
    let result = DEMO_ROWS.filter((row) =>
      (request.filters ?? []).every((filter) => this.matchesFilter(row, filter)),
    );

    if (request.sort?.column && request.sort.direction) {
      const direction = request.sort.direction === 'asc' ? 1 : -1;
      const column = request.sort.column;
      result = [...result].sort(
        (left, right) =>
          this.compareValues(this.readRowValue(left, column), this.readRowValue(right, column)) *
          direction,
      );
    }

    const { pageIndex, pageSize } = request.pagination;
    const start = pageIndex * pageSize;
    this.total.set(result.length);
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
    this.rows.set(result.slice(start, start + pageSize));
  }

  openInfo(): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: 'Gallery information',
        content: 'All controls in this gallery are designed for keyboard and screen-reader use.',
        confirmationBtnText: 'Close',
      },
    });
  }

  showNotification(): void {
    this.notifications.info('The notification is announced by a live region.');
  }

  private showSnackBar(message: string): void {
    this.notifications.success(message);
  }

  private matchesFilter(row: DemoRow, filter: TableFilter): boolean {
    const source = this.readRowValue(row, filter.id);
    const target = filter.value;

    switch (filter.operation) {
      case FilterOperation.Equal:
        return source === target || String(source) === String(target);
      case FilterOperation.NotEqual:
        return source !== target && String(source) !== String(target);
      case FilterOperation.Contains:
        return String(source ?? '')
          .toLocaleLowerCase()
          .includes(String(target ?? '').toLocaleLowerCase());
      case FilterOperation.StartsWith:
        return String(source ?? '')
          .toLocaleLowerCase()
          .startsWith(String(target ?? '').toLocaleLowerCase());
      case FilterOperation.EndsWith:
        return String(source ?? '')
          .toLocaleLowerCase()
          .endsWith(String(target ?? '').toLocaleLowerCase());
      case FilterOperation.In:
        return Array.isArray(target) && target.map(String).includes(String(source));
      case FilterOperation.NotIn:
        return Array.isArray(target) && !target.map(String).includes(String(source));
      case FilterOperation.GreaterThan:
        return this.compareValues(source, target) > 0;
      case FilterOperation.LessThan:
        return this.compareValues(source, target) < 0;
      case FilterOperation.GreaterThanOrEqual:
        return this.compareValues(source, target) >= 0;
      case FilterOperation.LessThanOrEqual:
        return this.compareValues(source, target) <= 0;
      default:
        return true;
    }
  }

  private readRowValue(row: DemoRow, key: string): unknown {
    return (row as unknown as Record<string, unknown>)[key];
  }

  private compareValues(left: unknown, right: unknown): number {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return Number(left) - Number(right);
    }

    const leftDate = Date.parse(String(left));
    const rightDate = Date.parse(String(right));
    if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
      return leftDate - rightDate;
    }

    return String(left ?? '').localeCompare(String(right ?? ''), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
