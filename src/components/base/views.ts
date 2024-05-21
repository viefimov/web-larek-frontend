import { Product, Basket } from './models';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
export abstract class Component {
	constructor(public element: HTMLElement) {}
	abstract render(): void;
}

export interface IProductListView extends Component {
	products: Product[];
	onProductClick: (product: Product) => void;
}

export class ProductListView extends Component implements IProductListView {
	constructor(
		element: HTMLElement,
		public products: Product[],
		public onProductClick: (product: Product) => void
	) {
		super(element);
	}

	render(): void {
		const template = document.getElementById(
			'card-catalog'
		) as HTMLTemplateElement;
		const gallery = this.element;
		gallery.innerHTML = '';
		this.products.forEach((product) => {
			const card = cloneTemplate<HTMLButtonElement>(template);
			card.dataset.id = product.id;
			card.querySelector('.card__title')!.textContent = product.title;
			card.querySelector('.card__category')!.textContent = product.category;
            
			card
				.querySelector('.card__image')!
				.setAttribute('src', CDN_URL + product.image);
			card.querySelector('.card__price')!.textContent = `${
				product.price ?? 0
			} синапсов`;
			card.addEventListener('click', () => this.onProductClick(product));
			gallery.appendChild(card);
		});
	}
}

export interface IBasketView extends Component {
	basket: Basket;
	onSend: () => void;
}

export class BasketView extends Component implements IBasketView {
	constructor(
		element: HTMLElement,
		public basket: Basket,
		public onSend: () => void
	) {
		super(element);
	}

	render(): void {
		const template = document.getElementById(
			'card-basket'
		) as HTMLTemplateElement;
		const basketList = this.element.querySelector('.basket__list')!;
		basketList.innerHTML = '';
		this.basket.getItems().forEach((product, index) => {
			const item = cloneTemplate<HTMLLIElement>(template);
			item.querySelector('.basket__item-index')!.textContent = (
				index + 1
			).toString();
			item.querySelector('.card__title')!.textContent = product.title;
			item.querySelector('.card__price')!.textContent = `${
				product.price ?? 0
			} синапсов`;
			item
				.querySelector('.basket__item-delete')!
				.addEventListener('click', () => {
					this.basket.remove(product);
					this.render();
				});
			basketList.appendChild(item);
		});
		this.element.querySelector(
			'.basket__price'
		)!.textContent = `${this.basket.getTotal()} синапсов`;
		this.element
			.querySelector('.basket__button')!
			.addEventListener('click', this.onSend);
	}
}

export interface IFormView extends Component {
	onSubmit: (data: any) => void;
}

export class FormView extends Component implements IFormView {
	constructor(element: HTMLElement, public onSubmit: (data: any) => void) {
		super(element);
	}

	render(): void {
		const form = this.element.querySelector('form')!;
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const data = new FormData(form);
			this.onSubmit(Object.fromEntries(data.entries()));
		});
	}
}

export interface IFinalView extends Component {
	total: number;
}

export class FinalView extends Component implements IFinalView {
	constructor(element: HTMLElement, public total: number) {
		super(element);
	}

	render(): void {
		this.element.querySelector(
			'.order-success__description'
		)!.textContent = `Списано ${this.total} синапсов`;
		this.element
			.querySelector('.order-success__close')!
			.addEventListener('click', () => {
				window.location.reload();
			});
	}
}
