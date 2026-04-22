import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@wawjs/ngx-translate';
import { LanguageService } from '../../feature/language/language.service';
import { LanguageCode } from '../../feature/language/language.type';

type LocalizedText = Record<LanguageCode, string>;

interface SaleCard {
	id: string;
	label: string;
	title: LocalizedText;
	description: LocalizedText;
}

const SALES: SaleCard[] = [
	{
		id: 'lunch-combo',
		label: '-20%',
		title: {
			ua: 'Обідній комбо в будні',
			en: 'Weekday Lunch Combo',
			de: 'Mittags-Kombi unter der Woche',
			fr: 'Combo Dejeuner en Semaine',
			pl: 'Lunch Combo w Tygodniu',
		},
		description: {
			ua: 'Щодня з 12:00 до 15:00: паста або піца + напій зі знижкою 20%.',
			en: 'Every day from 12:00 to 15:00: pasta or pizza + drink with 20% off.',
			de: 'Taglich von 12:00 bis 15:00: Pasta oder Pizza + Getrank mit 20% Rabatt.',
			fr: 'Tous les jours de 12h00 a 15h00: pasta ou pizza + boisson a -20%.',
			pl: 'Codziennie 12:00-15:00: pasta lub pizza + napoj z rabatem 20%.',
		},
	},
	{
		id: 'family-friday',
		label: '2+1',
		title: {
			ua: 'Сімейна п’ятниця',
			en: 'Family Friday',
			de: 'Familien-Freitag',
			fr: 'Vendredi en Famille',
			pl: 'Rodzinny Piatek',
		},
		description: {
			ua: 'Кожна третя піца 30 см у подарунок при замовленні трьох.',
			en: 'Every third 30 cm pizza is free when you order three.',
			de: 'Jede dritte 30-cm-Pizza ist gratis bei Bestellung von drei.',
			fr: 'Chaque troisieme pizza 30 cm est offerte pour trois commandees.',
			pl: 'Kazda trzecia pizza 30 cm gratis przy zamowieniu trzech.',
		},
	},
	{
		id: 'coffee-dessert',
		label: '1+1',
		title: {
			ua: 'Кава + десерт дня',
			en: 'Coffee + Dessert of the Day',
			de: 'Kaffee + Dessert des Tages',
			fr: 'Cafe + Dessert du Jour',
			pl: 'Kawa + Deser Dnia',
		},
		description: {
			ua: 'З 10:00 до 13:00 другий десерт дня за пів ціни.',
			en: 'From 10:00 to 13:00, get the second dessert of the day at half price.',
			de: 'Von 10:00 bis 13:00 gibt es das zweite Tagesdessert zum halben Preis.',
			fr: 'De 10h00 a 13h00, le deuxieme dessert du jour est a moitie prix.',
			pl: 'Od 10:00 do 13:00 drugi deser dnia za pol ceny.',
		},
	},
];

@Component({
	imports: [TranslateDirective, TranslatePipe],
	templateUrl: './sales.component.html',
	styleUrl: './sales.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent {
	private readonly _location = inject(Location);
	private readonly _languageService = inject(LanguageService);

	protected readonly cards = computed(() => {
		const language = this._languageService.language();

		return SALES.map((sale) => ({
			...sale,
			title: sale.title[language] ?? sale.title.en,
			description: sale.description[language] ?? sale.description.en,
		}));
	});

	protected goBack() {
		this._location.back();
	}
}