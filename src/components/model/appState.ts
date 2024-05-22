import { BaseModel } from './general/model';
import { IProduct, IAppState, IOrder, FormError, TPayment } from '../../types';
import { emailRegex, phoneRegex } from '../../utils/utils';

export class Product extends BaseModel<IProduct> implements IProduct {
	id: string;
	category: string;
	title: string;
	description: string;
	price: number;
	image?: string;
	selected: boolean;
}

export class AppState extends BaseModel<IAppState> {
	catalog: IProduct[];
	cart: IProduct[] = [];
	preview: string | null;
	order: IOrder = {
		payment: 'онлайн',
		items: [],
		total: 0,
		email: '',
		phone: '',
		address: '',
	};
	formError: FormError = {};

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getProducts(): IProduct[] {
		return this.catalog.filter((item) => this.cart.includes(item));
	}
	addCart(item: IProduct) {
		if (!this.cart.includes(item)) {
			this.cart.push(item);
			this.updateCart();
		}
	}

	removeCart(item: IProduct) {
		if (!this.cart.includes(item)) return;
		const index = this.cart.findIndex((i) => i === item);
		this.cart.splice(index, 1);
		this.emitChanges('cart:open', { catalog: this.catalog });
		this.emitChanges('cart:changed', { catalog: this.catalog });
	}

	getTotal() {
		return this.order.items.reduce(
			(total, item) => total + this.catalog.find((it) => it.id === item).price,
			0
		);
	}

	setItems() {
		this.order.items = this.cart.map((item) => item.id);
	}

	clearCart() {
		this.cart = [];
		this.updateCart();
	}

	updateCart() {
		this.emitChanges('cart:changed', this.cart);
		console.log(this.cart);
	}

	setPaymentMethod(method: string) {
		this.order.payment = method as TPayment;
		this.validateDelivery();
	}

	setOrderDeliveryField(value: string) {
		this.order.address = value;
		this.validateDelivery();
	}

	setOrderEmail(value: string) {
		this.order.email = value;
		this.validateContact();
	}

	setOrderPhone(value: string) {
		this.order.phone = value;
		this.validateContact();
	}

	validateDelivery() {
		const errors: typeof this.formError = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formError = errors;
		this.events.emit('deliveryFormError:change', this.formError);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formError = {};
		if (!this.order.email || !this.order.email.match(emailRegex)) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone || !this.order.phone.match(phoneRegex)) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formError = errors;
		this.events.emit('contactsFormError:change', this.formError);
		return Object.keys(errors).length === 0;
	}

	clearOrder(): void {
		this.order = {
			payment: 'онлайн',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}
}
