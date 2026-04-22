import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@wawjs/ngx-translate';
import { LanguageService } from '../../feature/language/language.service';
import { LanguageCode } from '../../feature/language/language.type';

type LocalizedText = Record<LanguageCode, string>;

interface ReviewCard {
	id: string;
	author: string;
	rating: number;
	date: string;
	text: LocalizedText;
}

const REVIEWS: ReviewCard[] = [
	{
		id: 'r1',
		author: 'Олена К.',
		rating: 5,
		date: '12.04.2026',
		text: {
			ua: 'Дуже смачна піца та швидка подача. Обслуговування уважне й привітне.',
			en: 'Very tasty pizza and fast service. The staff is attentive and friendly.',
			de: 'Sehr leckere Pizza und schnelle Bedienung. Das Team ist aufmerksam und freundlich.',
			fr: 'Pizza tres savoureuse et service rapide. L equipe est attentive et aimable.',
			pl: 'Bardzo smaczna pizza i szybka obsluga. Personel uprzejmy i uwazny.',
		},
	},
	{
		id: 'r2',
		author: 'Marek S.',
		rating: 5,
		date: '10.04.2026',
		text: {
			ua: 'Найкраща карбонара в місті. Обов’язково повернемося ще.',
			en: 'Best carbonara in town. We will definitely come back again.',
			de: 'Die beste Carbonara in der Stadt. Wir kommen auf jeden Fall wieder.',
			fr: 'La meilleure carbonara de la ville. Nous reviendrons sans faute.',
			pl: 'Najlepsza carbonara w miescie. Na pewno wrocimy.',
		},
	},
	{
		id: 'r3',
		author: 'Anna R.',
		rating: 4,
		date: '08.04.2026',
		text: {
			ua: 'Сподобались роли та десерти. Гарна атмосфера для вечірнього відпочинку.',
			en: 'Loved the rolls and desserts. Great atmosphere for an evening out.',
			de: 'Rollen und Desserts haben sehr gefallen. Tolle Atmosphare fur den Abend.',
			fr: 'J ai adore les rolls et les desserts. Excellente ambiance pour la soiree.',
			pl: 'Bardzo dobre rolki i desery. Swietna atmosfera na wieczor.',
		},
	},
	{
		id: 'r4',
		author: 'Ігор М.',
		rating: 5,
		date: '06.04.2026',
		text: {
			ua: 'Замовляли доставку: все приїхало гарячим і акуратно запакованим.',
			en: 'Ordered delivery: everything arrived hot and neatly packed.',
			de: 'Lieferung bestellt: alles kam warm und sauber verpackt an.',
			fr: 'Commande en livraison: tout est arrive chaud et bien emballe.',
			pl: 'Zamowienie z dostawa: wszystko przyjechalo cieple i dobrze zapakowane.',
		},
	},
	{
		id: 'r5',
		author: 'Julia W.',
		rating: 5,
		date: '03.04.2026',
		text: {
			ua: 'Класний вибір вин і дуже вдалий винний супровід до страв.',
			en: 'Great wine selection and excellent pairings with dishes.',
			de: 'Gute Weinauswahl und sehr passende Kombinationen zu den Gerichten.',
			fr: 'Belle selection de vins et accords parfaits avec les plats.',
			pl: 'Swietny wybor win i bardzo dobre dopasowanie do dan.',
		},
	},
	{
		id: 'r6',
		author: 'Софія Н.',
		rating: 4,
		date: '01.04.2026',
		text: {
			ua: 'Дуже приємний персонал, затишний інтер’єр та гарна музика.',
			en: 'Very friendly staff, cozy interior, and nice music.',
			de: 'Sehr freundliches Personal, gemutliches Interieur und gute Musik.',
			fr: 'Personnel tres sympathique, interieur cosy et bonne musique.',
			pl: 'Bardzo mily personel, przytulne wnetrze i dobra muzyka.',
		},
	},
	{
		id: 'r7',
		author: 'Thomas B.',
		rating: 5,
		date: '29.03.2026',
		text: {
			ua: 'Порції великі, ціни адекватні, кухня стабільно на високому рівні.',
			en: 'Large portions, fair prices, and consistently high-quality food.',
			de: 'GroBe Portionen, faire Preise und konstant hohe Kuchenqualitat.',
			fr: 'Grandes portions, prix corrects et cuisine toujours de qualite.',
			pl: 'Duze porcje, uczciwe ceny i stale wysoka jakosc kuchni.',
		},
	},
	{
		id: 'r8',
		author: 'Валерія П.',
		rating: 5,
		date: '27.03.2026',
		text: {
			ua: 'Дитячий куточок ідеальний для сімейного обіду. Дякуємо команді.',
			en: 'The kids corner is perfect for family lunch. Thanks to the team.',
			de: 'Die Kinderecke ist ideal fur ein Familienmittagessen. Danke ans Team.',
			fr: 'Le coin enfants est parfait pour un dejeuner en famille. Merci a l equipe.',
			pl: 'Kacik dla dzieci jest idealny na rodzinny obiad. Dziekujemy zespolowi.',
		},
	},
	{
		id: 'r9',
		author: 'Katarzyna L.',
		rating: 4,
		date: '24.03.2026',
		text: {
			ua: 'Сподобався сервіс і подача страв. Раджу бронювати столик заздалегідь.',
			en: 'Great service and presentation. I recommend booking a table in advance.',
			de: 'Service und Prasentation waren top. Ich empfehle eine Reservierung im Voraus.',
			fr: 'Excellent service et presentation. Je conseille de reserver a l avance.',
			pl: 'Bardzo dobra obsluga i podanie dan. Warto rezerwowac stolik wczesniej.',
		},
	},
	{
		id: 'r10',
		author: 'Роман Д.',
		rating: 5,
		date: '21.03.2026',
		text: {
			ua: 'Найкраще місце для святкувань у центрі. Все було бездоганно.',
			en: 'Best place for celebrations in the city center. Everything was excellent.',
			de: 'Der beste Ort fur Feiern im Stadtzentrum. Alles war hervorragend.',
			fr: 'Le meilleur endroit pour celebrer au centre-ville. Tout etait parfait.',
			pl: 'Najlepsze miejsce na swietowanie w centrum. Wszystko bylo perfekcyjne.',
		},
	},
];

@Component({
	imports: [TranslatePipe],
	templateUrl: './reviews.component.html',
	styleUrl: './reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent {
	private readonly _location = inject(Location);
	private readonly _languageService = inject(LanguageService);

	protected readonly cards = computed(() => {
		const language = this._languageService.language();

		return REVIEWS.map((review) => ({
			...review,
			text: review.text[language] ?? review.text.en,
			stars: '★'.repeat(review.rating),
		}));
	});

	protected goBack() {
		this._location.back();
	}
}