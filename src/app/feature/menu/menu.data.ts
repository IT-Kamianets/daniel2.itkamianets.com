import categoriesTranslations from '../../../data/categories.translations.json';
import itemsTranslations from '../../../data/items.translations.json';
import menuData from '../../../data/menu.json';
import type { LanguageCode } from '../language/language.type';

export type LocalizedValue = Partial<Record<LanguageCode | 'uk', string | null>>;

interface RawMenuFile {
	categories: RawMenuCategory[];
}

interface RawMenuCategory {
	name: LocalizedValue;
	subcategories?: RawMenuSubcategory[];
	products?: RawProduct[];
}

interface RawMenuSubcategory {
	name: LocalizedValue;
	products: RawProduct[];
}

interface RawProduct {
	slug: string;
	title: LocalizedValue;
	price: number | null;
	description: LocalizedValue;
	image?: string;
}

export interface RawMenuItem {
	slug: string;
	title: LocalizedValue;
	price: number | null;
	description: LocalizedValue;
	labels: LocalizedValue[];
	image: string;
	fullDescription: LocalizedValue;
	suggested: string[];
	cookTimeMinutes: number | null;
	caloriesKcal: number | null;
	portion: string | null;
	allergens: string[];
}

export interface RawMenuSection {
	name: LocalizedValue;
	description: LocalizedValue;
	items: RawMenuItem[];
	slug: string;
	section: string;
}

export interface MenuItem {
	id: string;
	slug: string;
	title: string;
	price: number | null;
	description: string | null;
	labels: string[];
	image: string;
	imageAlt: string;
	soldOut: boolean;
}

export interface MenuSection {
	id: string;
	name: string;
	description: string | null;
	items: MenuItem[];
}

export interface MenuGroup {
	id: string;
	name: string;
	sections: MenuSection[];
}

const _menu = menuData as RawMenuFile;
const _categories = Array.isArray(_menu?.categories) ? _menu.categories : [];

const _menuSections = _categories.flatMap((category) => {
	const groupId = createId(_translateValue(category.name, 'ua') ?? _translateValue(category.name, 'en') ?? 'menu');
	const categoryLookupSlug = createId(_translateValue(category.name, 'en') ?? groupId);
	
	const categoryName = _enrichLocalizedValue(category.name, categoryLookupSlug, categoriesTranslations);

	if (Array.isArray(category.products) && category.products.length > 0) {
		const sectionId = `${groupId}-main`;
		const items = _mapProductsToRawItems(category.products);
		
		return [{
			slug: sectionId,
			section: groupId,
			name: categoryName,
			description: { ua: null, en: null },
			items,
		} as RawMenuSection];
	}

	const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];

	return subcategories.map((subcategory) => {
		const subcategoryLookupSlug = createId(
			_translateValue(subcategory.name, 'en') ??
				_translateValue(subcategory.name, 'ua') ??
				'section',
		);
		const sectionSlug = createId(
			_translateValue(subcategory.name, 'ua') ?? _translateValue(subcategory.name, 'en') ?? 'section',
		);
		const sectionId = `${groupId}-${sectionSlug}`;
		const products = Array.isArray(subcategory.products) ? subcategory.products : [];
		const items = _mapProductsToRawItems(products);
		
		const subcategoryName = _enrichLocalizedValue(
			subcategory.name,
			subcategoryLookupSlug,
			categoriesTranslations,
		);

		return {
			slug: sectionId,
			section: groupId,
			name: subcategoryName,
			description: { ua: null, en: null },
			items,
		} as RawMenuSection;
	});
});

function _mapProductsToRawItems(products: RawProduct[]): RawMenuItem[] {
	return products.map((product) => {
		const externalTranslation = _findTranslation(itemsTranslations, product.slug, product.title, 'title');
		const title = _enrichLocalizedValue(product.title, product.slug, itemsTranslations, 'title');
		const desc = _enrichLocalizedValue(
			product.description,
			product.slug,
			itemsTranslations,
			'description',
			product.title,
		);
		
		const uaDescription = cleanText(desc['uk'] ?? desc['ua'] ?? null);
		const enDescription = cleanText(desc['en'] ?? uaDescription);

		return {
			slug: product.slug,
			title,
			price: product.price,
			description: desc,
			labels: externalTranslation?.data?.labels ?? [],
			image: _normalizeImage(product.image),
			fullDescription: externalTranslation?.data?.fullDescription ?? desc,
			suggested: [],
			cookTimeMinutes: null,
			caloriesKcal: null,
			portion: null,
			allergens: [],
		} as RawMenuItem;
	});
}

const _groupDefinitions = _categories.map((category) => {
	const groupId = createId(_translateValue(category.name, 'ua') ?? _translateValue(category.name, 'en') ?? 'menu');
	return {
		id: groupId,
		names: _enrichLocalizedValue(category.name, groupId, categoriesTranslations),
	};
});

function _enrichLocalizedValue(
	original: LocalizedValue,
	slug: string,
	translations: any[],
	field: string = 'name',
	lookupValue?: LocalizedValue,
): LocalizedValue {
	const translation = _findTranslation(translations, slug, lookupValue ?? original, field);
	const enriched = { ...original };
	
	if (translation?.data?.[field]) {
		const translatedData = translation.data[field];
		for (const [lang, val] of Object.entries(translatedData)) {
			if (val) {
				enriched[lang as LanguageCode] = val as string;
			}
		}
	}
	
	return enriched;
}

function _findTranslation(
	translations: any[],
	slug: string,
	lookupValue?: LocalizedValue,
	field: string = 'name',
) {
	const normalizedTarget = _normalizeTranslationSlug(slug);
	const expectedValue = _normalizeText(
		_translateValue(lookupValue, 'en') ??
			_translateValue(lookupValue, 'ua') ??
			lookupValue?.uk ??
			'',
	);

	const slugMatch = translations.find((entry) => {
		const entrySlug = typeof entry?.slug === 'string' ? entry.slug : '';

		if (!entrySlug) {
			return false;
		}

		if (entrySlug === slug) {
			return true;
		}

		return _normalizeTranslationSlug(entrySlug) === normalizedTarget;
	});

	if (slugMatch) {
		return slugMatch;
	}

	if (!expectedValue) {
		return undefined;
	}

	return translations.find((entry) => {
		const candidateValue = _normalizeText(entry?.data?.[field]?.en ?? '');
		return candidateValue !== '' && candidateValue === expectedValue;
	});
}

function _normalizeTranslationSlug(value: string) {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-');
}

function _normalizeText(value: string) {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

export const rawMenuSections = _menuSections;
export const dishSlugs = _menuSections.flatMap((section) => section.items.map((item) => item.slug));

export const menuSections = buildMenuSections('ua');

export const menuGroups = buildMenuGroups('ua');

export const navigationSection = menuSections[0];

export function buildMenuSections(language: LanguageCode) {
	return _menuSections.map((section) => _toMenuSection(section, language));
}

export function buildMenuGroups(language: LanguageCode) {
	return _groupDefinitions.map((group) => ({
		id: group.id,
		name: _resolveGroupName(group.names, language),
		sections: _menuSections
			.filter((section) => section.section === group.id)
			.map((section) => _toMenuSection(section, language)),
	}));
}

export function findRawMenuItemBySlug(slug: string) {
	for (const section of _menuSections) {
		const item = section.items.find((entry) => entry.slug === slug);

		if (item) {
			return { section, item };
		}
	}

	return null;
}

function _toMenuSection(section: RawMenuSection, language: LanguageCode): MenuSection {
	return {
		id: section.slug,
		name: _translateValue(section.name, language) ?? section.slug,
		description: cleanText(_translateValue(section.description, language)),
		items: section.items.map((item) => ({
			id: `${section.slug}-${item.slug}`,
			slug: item.slug,
			title: _translateValue(item.title, language) ?? item.slug,
			price: item.price,
			description: cleanText(_translateValue(item.description, language)),
			labels: item.labels
				.map((label) => cleanText(_translateValue(label, language)))
				.filter((label): label is string => Boolean(label)),
			image: item.image,
			imageAlt: _translateValue(item.title, language) ?? item.slug,
			soldOut: false,
		})),
	};
}

function _resolveGroupName(names: LocalizedValue, language: LanguageCode) {
	return _translateValue(names, language) ?? '';
}

function _translateValue(value: LocalizedValue | null | undefined, language: LanguageCode) {
	if (!value) {
		return null;
	}

	const requestedValue = value[language];
	if (typeof requestedValue === 'string' && requestedValue.trim() !== '') {
		return requestedValue;
	}

	if (language === 'ua') {
		const ukValue = value['uk'];
		if (typeof ukValue === 'string' && ukValue.trim() !== '') {
			return ukValue;
		}
	}

	const enValue = value['en'];
	if (typeof enValue === 'string' && enValue.trim() !== '') {
		return enValue;
	}

	const uaValue = value['ua'];
	if (typeof uaValue === 'string' && uaValue.trim() !== '') {
		return uaValue;
	}

	const ukValueAlt = value['uk'];
	if (typeof ukValueAlt === 'string' && ukValueAlt.trim() !== '') {
		return ukValueAlt;
	}

	return Object.values(value).find((entry): entry is string => typeof entry === 'string' && entry.trim() !== '') ?? null;
}

function _normalizeImage(image: string | undefined) {
	if (!image) {
		return '/images/logo/logo.png';
	}

	if (image.startsWith('http://') || image.startsWith('https://')) {
		return image;
	}

	if (image.startsWith('/images/')) {
		return image;
	}

	if (image.startsWith('images/')) {
		return `/${image}`;
	}
	
	if (image.includes('cdn-media.choiceqr.com')) {
		return image.startsWith('//') ? `https:${image}` : image;
	}

	// Default to product folder if only filename or relative path
	return `/images/product/${image.split('/').pop()}`;
}

export function translateMenuValue(
	value: LocalizedValue | null | undefined,
	language: LanguageCode,
) {
	return _translateValue(value, language);
}

export function cleanText(value: string | null | undefined) {
	if (!value) {
		return null;
	}

	return value
		.replace(/показати$/i, '')
		.replace(/\s+/g, ' ')
		.replace(/\s([,.!?:;])/g, '$1')
		.trim();
}

export function createId(value: string) {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zа-яіїєґ0-9]+/gi, '-')
		.replace(/^-+|-+$/g, '');
}
