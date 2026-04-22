import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@wawjs/ngx-translate';
import { LanguageService } from '../../feature/language/language.service';
import { LanguageCode } from '../../feature/language/language.type';

type LocalizedText = Record<LanguageCode, string>;

interface VacancyCard {
	id: string;
	schedule: string;
	title: LocalizedText;
	description: LocalizedText;
}

const VACANCIES: VacancyCard[] = [
	{
		id: 'cook-hot-shop',
		schedule: '2/2 · 10:00-22:00',
		title: {
			ua: 'Кухар гарячого цеху',
			en: 'Hot Line Cook',
			de: 'Koch fur Warme Kuche',
			fr: 'Cuisinier Poste Chaud',
			pl: 'Kucharz Cieplej Kuchni',
		},
		description: {
			ua: 'Досвід від 1 року, акуратність, командна робота. Офіційне оформлення.',
			en: '1+ year experience, attention to detail, teamwork. Official employment.',
			de: 'Erfahrung ab 1 Jahr, Sorgfalt und Teamarbeit. Offizielle Anstellung.',
			fr: 'Experience d un an minimum, rigueur et travail en equipe. Emploi officiel.',
			pl: 'Doswiadczenie od 1 roku, dokladnosc i praca zespolowa. Umowa oficjalna.',
		},
	},
	{
		id: 'waiter',
		schedule: '3/3 · 09:00-22:00',
		title: {
			ua: 'Офіціант / Офіціантка',
			en: 'Waiter / Waitress',
			de: 'Kellner / Kellnerin',
			fr: 'Serveur / Serveuse',
			pl: 'Kelner / Kelnerka',
		},
		description: {
			ua: 'Комунікабельність, ввічливість, бажання навчатись. Ставка + чайові.',
			en: 'Communication skills, politeness, willingness to learn. Base rate + tips.',
			de: 'Kommunikationsstarke, Freundlichkeit, Lernbereitschaft. Fix + Trinkgeld.',
			fr: 'Bon relationnel, politesse et envie d apprendre. Salaire fixe + pourboires.',
			pl: 'Komunikatywnosc, uprzejmosc, chec nauki. Stawka + napiwki.',
		},
	},
	{
		id: 'barista',
		schedule: '2/2 · 08:00-20:00',
		title: {
			ua: 'Бариста',
			en: 'Barista',
			de: 'Barista',
			fr: 'Barista',
			pl: 'Barista',
		},
		description: {
			ua: 'Підготовка кавових напоїв, підтримка чистоти зони, сервіс гостей.',
			en: 'Prepare coffee drinks, keep station clean, and serve guests warmly.',
			de: 'Zubereitung von Kaffeegetranken, Pflege der Station und Gasteservice.',
			fr: 'Preparation des boissons cafe, proprete du poste, service des clients.',
			pl: 'Przygotowanie kaw, porzadek na stanowisku i obsluga gosci.',
		},
	},
];

@Component({
	imports: [TranslateDirective, TranslatePipe],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	private readonly _location = inject(Location);
	private readonly _languageService = inject(LanguageService);

	protected readonly cards = computed(() => {
		const language = this._languageService.language();

		return VACANCIES.map((vacancy) => ({
			...vacancy,
			title: vacancy.title[language] ?? vacancy.title.en,
			description: vacancy.description[language] ?? vacancy.description.en,
		}));
	});

	protected goBack() {
		this._location.back();
	}
}