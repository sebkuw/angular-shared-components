import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AccessRule } from './access-control.models';
import { PermissionService } from './permission-context.service';

@Directive({
  selector: '[sharedCanAccess]',
  standalone: true,
})
export class CanAccessDirective {
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);
  private readonly rule = signal<AccessRule | null | undefined>(undefined);
  private readonly elseTemplate = signal<TemplateRef<unknown> | null>(null);

  @Input({ required: true })
  set sharedCanAccess(value: AccessRule | null | undefined) {
    this.rule.set(value);
  }

  @Input()
  set sharedCanAccessElse(value: TemplateRef<unknown> | null) {
    this.elseTemplate.set(value);
  }

  constructor() {
    effect(() => {
      const allowed = this.permissionService.canAccess(this.rule());
      const fallback = this.elseTemplate();

      this.container.clear();

      if (allowed) {
        this.container.createEmbeddedView(this.template);
      } else if (fallback) {
        this.container.createEmbeddedView(fallback);
      }
    });
  }
}
