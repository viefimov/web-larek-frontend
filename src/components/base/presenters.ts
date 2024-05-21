import { Product, Basket, Order } from './models';
import { ProductListView, BasketView, FormView, FinalView } from './views';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export interface IProductPresenter {
	productListView: ProductListView;
	basket: Basket;
	handleProductClick(event: Event): void;
	getProductIdFromEvent(event: Event): string;
	findProductById(id: string): Product | undefined;
	openModal(product: Product): void;
}

export class ProductPresenter implements IProductPresenter {
	constructor(public productListView: ProductListView, public basket: Basket) {
		this.productListView.render();
		this.productListView.element.addEventListener(
			'click',
			this.handleProductClick.bind(this)
		);
	}

	handleProductClick(event: Event): void {
		const productId = this.getProductIdFromEvent(event);
		const product = this.findProductById(productId);
		if (product) {
			this.openModal(product);
		}
	}

	getProductIdFromEvent(event: Event): string {
		const target = event.target as HTMLElement;
		const card = target.closest('.gallery__item') as HTMLElement;
		if (card && card.dataset.id) {
			return card.dataset.id;
		}
		return '';
	}

	findProductById(id: string): Product | undefined {
		return this.productListView.products.find((product) => product.id === id);
	}

	openModal(product: Product): void {
		const modal = document.getElementById('modal-product')!;
		const content = modal.querySelector('.modal__content')!;
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		content.innerHTML = '';
		const card = cloneTemplate<HTMLDivElement>(template);
		card.querySelector('.card__title')!.textContent = product.title;
		card.querySelector('.card__category')!.textContent = product.category;
		card.querySelector('.card__image')!.setAttribute('src', product.image);
		card.querySelector('.card__text')!.textContent = product.description;
		card.querySelector('.card__price')!.textContent = `${
			product.price ?? 0
		} синапсов`;
		card.querySelector('.card__button')!.addEventListener('click', () => {
			this.basket.add(product);
			document.getElementById('basket-counter')!.textContent = this.basket
				.getItems()
				.length.toString();
			modal.classList.remove('modal_active');
		});
		content.appendChild(card);
		modal.classList.add('modal_active');
	}
}

export interface IBasketPresenter {
	basketView: BasketView;
	order: Order;
	handleSend(event: Event): void;
}

export class BasketPresenter implements IBasketPresenter {
	constructor(public basketView: BasketView, public order: Order) {
		this.basketView.render();
		this.basketView.element
			.querySelector('.basket__button')!
			.addEventListener('click', this.handleSend.bind(this));
	}

	handleSend(event: Event): void {
		this.order.addItems(this.basketView.basket.getItems());
		const checkoutModal = document.getElementById('modal-checkout')!;
		const formView1 = new FormView(checkoutModal, (data: any) => {
			this.order.add(data);
			const paymentModal = document.getElementById('modal-payment')!;
			const formView2 = new FormView(paymentModal, (data: any) => {
				this.order.add(data);
				this.order.send().then(() => {
					const successModal = document.getElementById('modal-success')!;
					const finalView = new FinalView(
						successModal,
						this.basketView.basket.getTotal()
					);
					finalView.render();
					successModal.classList.add('modal_active');
				});
			});
			formView2.render();
			paymentModal.classList.add('modal_active');
		});
		formView1.render();
		checkoutModal.classList.add('modal_active');
	}
}

export interface IOrderPresenter {
	formView1: FormView;
	formView2: FormView;
	finalView: FinalView;
	order: Order;
	handleForm1Submit(event: Event): void;
	handleForm2Submit(event: Event): void;
	getFormData(formElement: HTMLElement): any;
}

export class OrderPresenter implements IOrderPresenter {
	constructor(
		public formView1: FormView,
		public formView2: FormView,
		public finalView: FinalView,
		public order: Order
	) {
		this.formView1.render();
		this.formView1.element.addEventListener(
			'submit',
			this.handleForm1Submit.bind(this)
		);
	}

	handleForm1Submit(event: Event): void {
		event.preventDefault();
		const data = this.getFormData(this.formView1.element);
		this.order.add(data);
		this.formView2.render();
		this.formView2.element.addEventListener(
			'submit',
			this.handleForm2Submit.bind(this)
		);
	}

	handleForm2Submit(event: Event): void {
		event.preventDefault();
		const data = this.getFormData(this.formView2.element);
		this.order.add(data);
		this.order.send().then(() => {
			this.finalView.render();
		});
	}

	getFormData(formElement: HTMLElement): any {
		const formData = new FormData(formElement as HTMLFormElement);
		return Object.fromEntries(formData.entries());
	}
}
