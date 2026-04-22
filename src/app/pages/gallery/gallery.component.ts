import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@wawjs/ngx-translate';

interface GalleryPhoto {
	src: string;
	alt: string;
}

@Component({
	imports: [TranslateDirective, TranslatePipe],
	templateUrl: './gallery.component.html',
	styleUrl: './gallery.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
	protected readonly photos: GalleryPhoto[] = Array.from({ length: 30 }, (_, index) => ({
		src: `/images/gallery/${index + 1}.jpg`,
		alt: `Daniel gallery photo ${index + 1}`,
	}));

	protected readonly selectedPhoto = signal<GalleryPhoto | null>(null);

	protected openPhoto(photo: GalleryPhoto) {
		this.selectedPhoto.set(photo);
	}

	protected closePhoto() {
		this.selectedPhoto.set(null);
	}
}
