export type TPayment = 'онлайн' | 'при получении';

export interface IProduct {
	id: string;
	category: string;
	title: string;
	description: string;
	price: number | null;
	image?: string;
	selected?: boolean;
	index?: number;
}

export interface IPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export interface IContacts {
	email?: string;
	phone?: string;
}

export interface IDelivery {
	payment?: TPayment;
	address?: string;
}

export interface IOrder extends IContacts, IDelivery {
	items: string[];
	total: number;
}

export interface ISuccess {
	id: string;
	total: number;
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[] | [];
	preview: string | null;
	order: IOrder | null;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export type FormError = Partial<Record<keyof IOrder, string>>;

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IWebApi {
	getProducts: () => Promise<IProduct[]>;
	postOrder: (order: IOrder) => Promise<ISuccess>;
}
export type CatalogChangeEvent = {
	catalog: IProduct[];
};
export interface ICartView {
	items: HTMLElement[];
	selected: string[];
	total: number;
}
export interface ICartItem {
	title: string;
	price: number;
	index: number;
	description: string;
	category: string;
	id?: string;
}