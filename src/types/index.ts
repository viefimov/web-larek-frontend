// Определение интерфейса продукта
import { ApiListResponse } from '../components/base/api';

type Category =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number | null;
}
interface ApiProductResponse {
	data: ApiListResponse<IProduct>;
	setList(): void;
	getProduct(id: string): IProduct;
}
// Определение интерфейса списка продуктов

type Payment = 'нал' | 'безнал';
interface IUser {
	email: string;
	phone: string;
	address: string;
	payment: Payment;
}

interface ICart {
	products: IProduct[];
	addProduct(product: IProduct): void;
	removeProduct(productId: string): void;
	getTotalPrice(): number;
}
type ViewCart = {
	products: ViewProduct[];
	totalPrice: number;
};
interface IOrder {
	user: IUser;
	products: IProduct[];
	totalPrice: number;
}
type ViewProduct = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number | null;
	inCart: boolean;
};
interface IProductCard {
	product: IProduct;
	inCart: boolean;
	render(): HTMLElement; // Метод для рендеринга карточки продукта
}

interface IProductModal {
	product: IProduct;
	open(): void; // Метод для открытия модального окна
	close(): void; // Метод для закрытия модального окна
	render(): HTMLElement; // Метод для рендеринга содержимого модального окна
}

interface ICartView {
	cart: ICart;
	render(): HTMLElement; // Метод для рендеринга содержимого корзины
}

interface IMainPage {
	products: IProduct[];
	render(): HTMLElement; // Метод для рендеринга списка продуктов на главной странице
}
