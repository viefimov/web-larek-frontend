export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

export class Product implements IProduct {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public image: string,
		public category: string,
		public price: number | null
	) {}
}

export interface IBasket {
	add(product: Product): void;
	remove(product: Product): void;
	getItems(): Product[];
	getTotal(): number;
}

export class Basket implements IBasket {
	private items: Product[] = [];

	add(product: Product): void {
		this.items.push(product);
	}

	remove(product: Product): void {
		this.items = this.items.filter((item) => item.id !== product.id);
	}

	getItems(): Product[] {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce(
			(total, product) => total + (product.price ?? 0),
			0
		);
	}
}

export interface IOrder {
	addItems(items: Product[]): void;
	add(data: any): void;
	send(): Promise<void>;
}

export class Order implements IOrder {
	private items: Product[] = [];

	addItems(items: Product[]): void {
		this.items.push(...items);
	}

	add(data: any): void {
		// Logic to add form data to the order
	}

	send(): Promise<void> {
		return new Promise((resolve) => {
			// Logic to send the order
			resolve();
		});
	}
}
