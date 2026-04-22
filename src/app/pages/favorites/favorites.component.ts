import { ViewportScroller } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';
import { MenuItemComponent } from '../../components/menu-item/menu-item.component';
import { LanguageService } from '../../feature/language/language.service';
import { FavoritesService } from '../../feature/menu/favorites.service';
import { buildMenuGroups, MenuGroup, MenuSection } from '../../feature/menu/menu.data';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { RouterLink } from '@angular/router';

@Component({
	imports: [MenuItemComponent, TranslateDirective, RouterLink],
	templateUrl: './favorites.component.html',
	styleUrl: './favorites.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
	private readonly _languageService = inject(LanguageService);
	private readonly _favoritesService = inject(FavoritesService);
	private readonly _viewportScroller = inject(ViewportScroller);

	protected readonly selectedGroupId = signal('');
	protected readonly selectedSectionId = signal('');
	protected readonly groups = computed(() =>
		buildMenuGroups(this._languageService.language())
			.map((group) => ({
				...group,
				sections: group.sections
					.map((section) => ({
						...section,
						items: section.items.filter((item) => this.isFavorite(item.id)),
					}))
					.filter((section) => section.items.length > 0),
			}))
			.filter((group) => group.sections.length > 0),
	);
	protected readonly activeGroup = computed(
		() =>
			this.groups().find((group) => group.id === this.selectedGroupId()) ??
			this.groups()[0] ??
			null,
	);
	protected readonly activeSections = computed(() => this.activeGroup()?.sections ?? []);
	protected readonly hasFavorites = computed(() => this.groups().length > 0);

	private readonly _syncSelection = effect(() => {
			const groups = this.groups();
			const selectedGroupId = this.selectedGroupId();
			const selectedSectionId = this.selectedSectionId();

			if (!groups.length) {
				if (selectedGroupId) {
					this.selectedGroupId.set('');
				}

				if (selectedSectionId) {
					this.selectedSectionId.set('');
				}

				return;
			}

			const resolvedGroup =
				groups.find((group) => group.id === selectedGroupId) ?? groups[0]!;

			if (resolvedGroup.id !== selectedGroupId) {
				this.selectedGroupId.set(resolvedGroup.id);
			}

			const resolvedSection =
				resolvedGroup.sections.find((section) => section.id === selectedSectionId) ??
				resolvedGroup.sections[0];
			const resolvedSectionId = resolvedSection?.id ?? '';

			if (resolvedSectionId !== selectedSectionId) {
				this.selectedSectionId.set(resolvedSectionId);
			}
		});

	protected setGroup(groupId: string) {
		if (this.selectedGroupId() === groupId) {
			return;
		}

		this.selectedGroupId.set(groupId);
		this.selectedSectionId.set(
			this.groups().find((group) => group.id === groupId)?.sections[0]?.id ?? '',
		);
		this._viewportScroller.scrollToPosition([0, 0]);
	}

	protected setActiveSection(sectionId: string) {
		this.selectedSectionId.set(sectionId);

		setTimeout(() => {
			const element = document.getElementById(sectionId);
			if (element) {
				const yOffset = -120;
				const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
				window.scrollTo({ top: y, behavior: 'auto' });
			}
		}, 0);
	}

	protected trackByGroup(_: number, group: MenuGroup) {
		return group.id;
	}

	protected trackBySection(_: number, section: MenuSection) {
		return section.id;
	}

	protected isFavorite(itemId: string) {
		return this._favoritesService.isFavorite(itemId);
	}
}
