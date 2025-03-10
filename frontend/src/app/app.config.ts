import es from '@angular/common/locales/es';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeng/themes';
import { ThemeService } from './shared/services/theme/theme.service';

registerLocaleData(es); 
 
// Definir los presets de color (Blanco y Negro)
export const lightTheme = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '{neutral.300}',
                    50: '{zinc.50}', 
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                primary: {
                    color: '{zinc.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{zinc.900}',
                    activeColor: '{zinc.800}'
                },
                highlight: {
                    background: '{zinc.950}',
                    focusBackground: '{zinc.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            }
        }
    }
});

export const darkTheme = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{zinc.950}',
            100: '{zinc.900}',
            200: '{zinc.800}',
            300: '{zinc.700}',
            400: '{zinc.600}',
            500: '{zinc.500}',
            600: '{zinc.400}',
            700: '{zinc.300}',
            800: '{zinc.200}',
            900: '{zinc.100}',
            950: '{zinc.50}'
        },
        colorScheme: {
            dark: {
                surface: {
                    0: '#121212', // Fondo principal (oscuro)
                    50: '{zinc.950}', // Fondo secundario
                    100: '{zinc.900}',
                    200: '{zinc.800}',
                    300: '{zinc.700}',
                    400: '{zinc.600}',
                    500: '{zinc.500}',
                    600: '{zinc.400}',
                    700: '{zinc.300}',
                    800: '{zinc.200}',
                    900: '{zinc.100}',
                    950: '{zinc.50}'
                },
                primary: {
                    color: '{zinc.50}',
                    inverseColor: '{zinc.950}',
                    hoverColor: '{zinc.100}',
                    activeColor: '{zinc.200}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});


export let currentTheme = lightTheme;

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes),
      importProvidersFrom(FormsModule),
      provideHttpClient(),
      provideZoneChangeDetection(),
      provideHttpClient(withFetch()),
      provideAnimationsAsync(),
      providePrimeNG({
        theme: {
            preset: currentTheme,
            options : {
                 darkModeSelector: '.my-app-dark'
            }
        }
      })
  ]
};