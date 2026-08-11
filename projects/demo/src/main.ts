import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { PermissionService, providePermissionContext } from '@sebkuw/shared-ui-core';
import { MENU_DATA_TOKEN } from '@sebkuw/shared-ui-layout';
import { DemoComponent, demoMenu, permissionContext } from './app.component';

bootstrapApplication(DemoComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([]),
    provideAnimationsAsync(),
    providePermissionContext(permissionContext),
    PermissionService,
    { provide: MENU_DATA_TOKEN, useValue: demoMenu },
  ],
}).catch((error: unknown) => console.error(error));
