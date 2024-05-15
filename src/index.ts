import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';

// Определение интерфейса продукта
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

// Определение интерфейса списка продуктов
interface IProductList {
	total: number;
	items: IProduct[];
}

class Product implements IProduct {
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number | null;
	id: string;
	constructor(product: IProduct) {
		this.description = product.description;
		this.image = product.image;
		this.title = product.title;
		this.category = product.category;
		this.price = product.price;
		this.id = product.id;
	}
	get product() {
		return {
			description: this.description,
			image: this.image,
			title: this.title,
			category: this.category,
			price: this.price,
			id: this.id,
		};
	}
}

// Создание экземпляра API
const api = new Api(API_URL);

// По загрузке страницы
window.onload = () => {
	// Получение списка продуктов с сервера
	api
		.get('/product/')
		.then((data: IProductList) => {
			// По получении списка продуктов
			data.items.forEach((product: IProduct) => {
				// Клонирование содержимого карточки продукта
				const item = new Product(product);
				const tovar = item.product;
				const card = document.querySelector(
					'#card-catalog'
				) as HTMLTemplateElement;
				const cardContent = card.content.cloneNode(true) as DocumentFragment;

				// Установка данных продукта в карточку

				const cardCategory = cardContent.querySelector('.card__category');
				const cardDescription = cardContent.querySelector('.card__description');
				const cardImage = cardContent.querySelector(
					'.card__image'
				) as HTMLImageElement;
				const cardTitle = cardContent.querySelector('.card__title');
				const cardPrice = cardContent.querySelector('.card__price');

				if (cardCategory) {
					cardCategory.textContent = tovar.category;

					// Удаляем все классы, которые могли быть установлены ранее
					cardCategory.classList.remove(
						'_soft',
						'_hard',
						'_other',
						'_additional',
						'_button'
					);

					// Добавляем класс в соответствии с категорией продукта
					switch (product.category) {
						case 'софт-скил':
							cardCategory.classList.add('card__category_soft');
							break;
						case 'хард-скил':
							cardCategory.classList.add('card__category_hard');
							break;
						case 'другое':
							cardCategory.classList.add('card__category_other');
							break;
						case 'дополнительное':
							cardCategory.classList.add('card__category_additional');
							break;
						case 'кнопка':
							cardCategory.classList.add('card__category_button');
							break;
						default:
							break;
					}
				}
				if (cardDescription) cardDescription.textContent = tovar.description;
				if (cardImage) cardImage.src = `${CDN_URL}${tovar.image}`;
				if (cardTitle) cardTitle.textContent = tovar.title;
				if (cardPrice)
					cardPrice.textContent =
						tovar.price !== null
							? tovar.price.toString() + ' синапсов'
							: 'Цена не указана';

				// Добавление карточки продукта в галерею
				const gallery = document.querySelector('.gallery');
				if (gallery) gallery.appendChild(cardContent);
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
