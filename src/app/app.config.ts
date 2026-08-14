import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core'
import { withFormlyMaterial } from '@ngx-formly/material';

import { RepeatTypeComponent } from './repeat-section.type';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFormlyCore([
      ...withFormlyMaterial(),
      {
        types: [{ name: 'repeat', component: RepeatTypeComponent }],
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
  ]
};
