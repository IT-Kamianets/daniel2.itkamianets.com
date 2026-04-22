import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './navigation.component.html',
	styleUrl: './navigation.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
	protected readonly navItems = [
		{ label: 'Sales', badge: '01', icon: 'sell', route: '/sales' },
		{ label: 'Reviews', badge: '02', icon: 'rate_review', route: '/reviews' },
		{ label: 'Events', badge: '03', icon: 'event', route: '/events' },
		{ label: 'Jobs', badge: '04', icon: 'work', route: '/jobs' },
	];
}
