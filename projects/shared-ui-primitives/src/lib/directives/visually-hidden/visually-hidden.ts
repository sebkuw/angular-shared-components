import { Directive } from '@angular/core';

@Directive({
  selector: '[sharedVisuallyHidden]',
  standalone: true,
  host: {
    '[style.position]': "'absolute'",
    '[style.inline-size]': "'1px'",
    '[style.block-size]': "'1px'",
    '[style.padding]': "'0'",
    '[style.margin]': "'-1px'",
    '[style.overflow]': "'hidden'",
    '[style.clip-path]': "'inset(50%)'",
    '[style.white-space]': "'nowrap'",
    '[style.border]': "'0'",
  },
})
export class VisuallyHiddenDirective {}
