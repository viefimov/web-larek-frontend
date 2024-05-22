import { ViewComponent } from './general/viewComponent';
import { IPage } from '../../types';
import { IEvents } from '../present/events';
import { ensureElement } from '../../utils/utils';

export class Page extends ViewComponent<IPage> {
	protected _gallery: HTMLElement;
	protected _counter: HTMLElement;
	protected _cart: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._cart = ensureElement<HTMLElement>('.header__basket');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._cart.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set counter(value: number) {
		this.updateTextContent(this._counter, String(value));
	}

	set locked(value: boolean) {
		this.toggleCssClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
