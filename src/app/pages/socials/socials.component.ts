import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@wawjs/ngx-translate';

@Component({
	imports: [NgOptimizedImage, TranslateDirective, TranslatePipe],
	templateUrl: './socials.component.html',
	styleUrl: './socials.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialsComponent {
	protected readonly phones = ['+380 50 723 2362', '+380 68 608 0028'];
	protected readonly email = 'daniel.big.family@gmail.com';

	protected readonly instagram = 'https://www.instagram.com/daniel.pizzeria.kp/';
	protected readonly facebook =
		'https://www.facebook.com/p/Даніель-Камянець-Подільський-100068689121934';
	protected readonly tiktok = 'https://www.tiktok.com/@daniel.kamianets';
}
