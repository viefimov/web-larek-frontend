import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api, ApiListResponse } from './components/base/api';
import { Product, Basket, Order, IProduct } from './components/base/models';
import {
	ProductListView,
	BasketView,
	FormView,
	FinalView,
} from './components/base/views';
import {
	ProductPresenter,
	BasketPresenter,
} from './components/base/presenters';
import { cloneTemplate, ensureElement } from './utils/utils';

document.addEventListener('DOMContentLoaded', () => {
	const api = new Api(API_URL); // Replace with actual API endpoint
	const basket = new Basket();
	const order = new Order();

	// Load products from API and initialize ProductPresenter
	api.get('/product/').then((response: ApiListResponse<IProduct>) => {
		const products = response.items.map(
			(item) =>
				new Product(
					item.id,
					item.title,
					item.description,
					item.image,
					item.category,
					item.price
				)
		);
		const galleryElement = document.getElementById('gallery')!;
		const productListView = new ProductListView(
			galleryElement,
			products,
			(product: Product) => {
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
					basket.add(product);
					document.getElementById('basket-counter')!.textContent = basket
						.getItems()
						.length.toString();
					modal.classList.remove('modal_active');
				});
				content.appendChild(card);
				modal.classList.add('modal_active');
			}
		);
		const productPresenter = new ProductPresenter(productListView, basket);
	});

	// Initialize BasketPresenter
	const basketElement = document.getElementById('modal-cart')!;
	const basketView = new BasketView(basketElement, basket, () => {
		const checkoutModal = document.getElementById('modal-checkout')!;
		const formView1 = new FormView(checkoutModal, (data: any) => {
			order.add(data);
			const paymentModal = document.getElementById('modal-payment')!;
			const formView2 = new FormView(paymentModal, (data: any) => {
				order.add(data);
				order.send().then(() => {
					const successModal = document.getElementById('modal-success')!;
					const finalView = new FinalView(successModal, basket.getTotal());
					finalView.render();
					successModal.classList.add('modal_active');
				});
			});
			formView2.render();
			paymentModal.classList.add('modal_active');
		});
		formView1.render();
		checkoutModal.classList.add('modal_active');
	});
	const basketPresenter = new BasketPresenter(basketView, order);

	// Event listener for the basket button
	document.getElementById('basket-button')!.addEventListener('click', () => {
		const modal = document.getElementById('modal-cart')!;
		basketView.render();
		modal.classList.add('modal_active');
	});

	// Event listeners for closing modals
	document.querySelectorAll('.modal__close').forEach((button) => {
		button.addEventListener('click', () => {
			button.closest('.modal')!.classList.remove('modal_active');
		});
	});
});
