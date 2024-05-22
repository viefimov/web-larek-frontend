import { ViewComponent } from './general/viewComponent';
import { EventEmitter } from '../present/events';
import { ensureElement, createElement } from '../../utils/utils';
import { ICardActions, ICartView, ICartItem } from '../../types';
import { Card } from './viewCard';


export class Cart extends ViewComponent<ICartView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.rootElement);
		this._total = this.rootElement.querySelector('.basket__price');
		this._button = this.rootElement.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setElementDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setElementDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.updateTextContent(this._total, `${total.toString()}` + ' синапсов');
	}

	get total(): number {
		return this.total;
	}
}



export class CartItem extends ViewComponent<ICartItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	selected: Card[];

	constructor(container: HTMLElement, action?: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			}
		}
	}

	set index(value: number) {
		this.updateTextContent(this._index, value);
	}

	set title(value: string) {
		this.updateTextContent(this._title, value);
	}

	set price(value: number) {
		this.updateTextContent(this._price, value + 'синапсов');
	}
}
