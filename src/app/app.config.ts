import {
	APP_INITIALIZER,
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTranslate } from '@wawjs/ngx-translate';
import { routes } from './app.routes';
import { BootstrapService } from './feature/bootstrap/bootstrap.service';
import { LANGUAGES } from './feature/language/language.const';
import { LanguageService } from './feature/language/language.service';

const initializeBootstrapData = (bootstrapService: BootstrapService) => () =>
	bootstrapService.initialize();

const initializeLanguage = (languageService: LanguageService) => () =>
	languageService.init();

const availableLanguages = LANGUAGES.map(({ code, label }) => ({
	code,
	name: label,
	nativeName: label,
}));

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes),
		provideHttpClient(withFetch()),
		provideClientHydration(withEventReplay()),
		provideTranslate({
			defaultLanguage: 'ua',
			languages: availableLanguages,
			folder: '/i18n/',
		}),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeBootstrapData,
			deps: [BootstrapService],
			multi: true,
		},
		{
			provide: APP_INITIALIZER,
			useFactory: initializeLanguage,
			deps: [LanguageService],
			multi: true,
		},
	],
};
