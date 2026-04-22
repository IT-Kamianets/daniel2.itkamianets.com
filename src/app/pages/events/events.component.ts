import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@wawjs/ngx-translate';
import { LanguageService } from '../../feature/language/language.service';
import { LanguageCode } from '../../feature/language/language.type';

type LocalizedText = Record<LanguageCode, string>;

interface EventCard {
	id: string;
	date: string;
	time: string;
	title: LocalizedText;
	description: LocalizedText;
}

const EVENTS: EventCard[] = [
	{
		id: 'live-jazz',
		date: '24.04.2026',
		time: '19:00',
		title: {
			ua: 'Вечір живого джазу',
			en: 'Live Jazz Evening',
			de: 'Live-Jazz-Abend',
			fr: 'Soiree Jazz Live',
			pl: 'Wieczor Jazzu na Zywo',
		},
		description: {
			ua: 'Жива музика, авторські коктейлі та спеціальне вечірнє меню.',
			en: 'Live music, signature cocktails, and a special evening menu.',
			de: 'Live-Musik, Signature-Cocktails und ein besonderes Abendmenu.',
			fr: 'Musique live, cocktails signature et menu special du soir.',
			pl: 'Muzyka na zywo, autorskie koktajle i specjalne menu wieczorne.',
		},
	},
	{
		id: 'wine-dinner',
		date: '26.04.2026',
		time: '18:30',
		title: {
			ua: 'Винна вечеря від шефа',
			en: 'Chef Wine Dinner',
			de: 'Wein-Dinner vom Chef',
			fr: 'Diner Vins du Chef',
			pl: 'Kolacja Winna Szefa Kuchni',
		},
		description: {
			ua: '4 подачі страв з підібраним винним супроводом.',
			en: '4-course dinner with curated wine pairing.',
			de: '4-Gange-Dinner mit abgestimmter Weinbegleitung.',
			fr: 'Diner en 4 services avec accords mets-vins.',
			pl: '4-daniowa kolacja z dobranym pairingiem win.',
		},
	},
	{
		id: 'family-day',
		date: '28.04.2026',
		time: '13:00',
		title: {
			ua: 'Сімейний недільний обід',
			en: 'Family Sunday Lunch',
			de: 'Familien-Sonntagsmittag',
			fr: 'Dejeuner Familial du Dimanche',
			pl: 'Rodzinny Niedzielny Obiad',
		},
		description: {
			ua: 'Дитяча зона, аніматор та сет-меню для всієї родини.',
			en: 'Kids zone, animator, and a set menu for the whole family.',
			de: 'Kinderbereich, Animator und Set-Menu fur die ganze Familie.',
			fr: 'Espace enfants, animateur et menu set pour toute la famille.',
			pl: 'Strefa dzieci, animator i zestaw menu dla calej rodziny.',
		},
	},
	{
		id: 'pizza-masterclass',
		date: '30.04.2026',
		time: '17:00',
		title: {
			ua: 'Майстер-клас з піци',
			en: 'Pizza Masterclass',
			de: 'Pizza-Meisterkurs',
			fr: 'Masterclass Pizza',
			pl: 'Warsztaty Pizzy',
		},
		description: {
			ua: 'Навчання від піцайоло: тісто, соус, випікання у печі.',
			en: 'Hands-on workshop with our pizzaiolo: dough, sauce, and oven baking.',
			de: 'Workshop mit unserem Pizzaiolo: Teig, Sauce und Ofenbacken.',
			fr: 'Atelier pratique avec notre pizzaiolo: pate, sauce et cuisson au four.',
			pl: 'Praktyczne warsztaty z pizzaiolo: ciasto, sos i wypiek.',
		},
	},
	{
		id: 'dj-night',
		date: '02.05.2026',
		time: '20:00',
		title: {
			ua: 'DJ Night Friday',
			en: 'DJ Night Friday',
			de: 'DJ-Nacht Freitag',
			fr: 'Vendredi DJ Night',
			pl: 'Piatek z DJ-em',
		},
		description: {
			ua: 'Танцювальний сет, вечірні сети та спеціальні напої.',
			en: 'Dance set, evening platters, and special drinks.',
			de: 'Dance-Set, Abendplatten und spezielle Getranke.',
			fr: 'Set dansant, plateaux du soir et boissons speciales.',
			pl: 'Set taneczny, wieczorne sety i specjalne napoje.',
		},
	},
];

@Component({
	imports: [TranslateDirective, TranslatePipe],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
	private readonly _location = inject(Location);
	private readonly _languageService = inject(LanguageService);

	protected readonly cards = computed(() => {
		const language = this._languageService.language();

		return EVENTS.map((event) => ({
			...event,
			title: event.title[language] ?? event.title.en,
			description: event.description[language] ?? event.description.en,
		}));
	});

	protected goBack() {
		this._location.back();
	}
}