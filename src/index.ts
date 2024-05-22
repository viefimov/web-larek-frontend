import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { WebApi } from './components/model/WebApi';
import { EventEmitter } from './components/present/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/view/viewPage';
import { Card } from './components/view/viewCard';
import { AppState, Product } from './components/model/appData';
import { Cart, CartItem } from './components/view/viewCart';
import { ViewModal } from './components/view/general/viewModal';
import { IProduct, IDelivery, IContacts, CatalogChangeEvent } from './types';
import { Contacts, Delivery } from './components/view/viewOrder';
import { Success } from './components/view/viewSuccess';

const api = new WebApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new AppState({}, events);

const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cart: ensureElement<HTMLTemplateElement>('#basket'),
	cardCart: ensureElement<HTMLTemplateElement>('#card-basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
};

const page = new Page(document.body, events);
const modal = new ViewModal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);
const cart = new Cart(cloneTemplate(templates.cart), events);
const orderForm = new Delivery(cloneTemplate(templates.order), events);
const contacts = new Contacts(cloneTemplate(templates.contacts), events);
const success = new Success(cloneTemplate(templates.success), {
	onClick: () => modal.close(),
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		return new Card(cloneTemplate(templates.cardCatalog), {
			onClick: () => events.emit('card:select', item),
		}).render({
			category: item.category,
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('card:select', (item: Product) => {
	appState.setPreview(item);
	const card = new Card(cloneTemplate(templates.cardPreview), {
		onClick: () => events.emit('add:product', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			selected: item.selected,
		}),
	});

	if (item.price === null) {
		card.buttonTitle = false;
	}
	if (appState.cart.includes(item)) {
		card.buttonTitle = true;
	}
});

events.on('cart:open', () => {
	modal.render({ content: cart.render({}) });
});

events.on('cart:changed', () => {
	let total = 0;
	cart.items = appState.getProducts().map((item, index) => {
		const card = new CartItem(cloneTemplate(templates.cardCart), {
			onClick: () => appState.removeCart(item),
		});
		total += item.price;
		return card.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});
	cart.total = total;
	appState.order.total = total;
	page.counter = appState.getProducts().length;
});

events.on('add:product', (item: IProduct) => {
	appState.addCart(item);
	modal.close();
});

events.on('card:delete', (item: IProduct) => appState.removeCart(item));

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			valid: orderForm.valid,
			errors: orderForm.errors,
			address: '',
			payment: 'онлайн',
		}),
	});
});

events.on('order.payment:change', (data: { target: string }) => {
	appState.setPaymentMethod(data.target);
});

events.on('order.address:change', (data: { value: string }) => {
	appState.setOrderDeliveryField(data.value);
});

events.on('deliveryFormError:change', (errors: Partial<IDelivery>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter(Boolean)
		.join('; ');
});

events.on('order:submit', () => {
	appState.setItems();
	modal.render({
		content: contacts.render({
			valid: contacts.valid,
			errors: contacts.errors,
			email: '',
			phone: '',
		}),
	});
});

events.on('contacts.email:change', (data: { value: string }) => {
	appState.setOrderEmail(data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
	appState.setOrderPhone(data.value);
});

events.on('contactsFormError:change', (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone }).filter(Boolean).join('; ');
});

events.on('contacts:submit', () => {
	api.postOrder(appState.order).then((result) => {
		appState.clearCart();
		appState.clearOrder();
		modal.render({
			content: success.render({ total: result.total }),
		});
	});
});

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

api.getProducts().then(appState.setCatalog.bind(appState));
