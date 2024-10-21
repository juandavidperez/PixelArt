import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideHttpClient(),
    provideZoneChangeDetection(),
    provideHttpClient(withFetch())
  ]
};
