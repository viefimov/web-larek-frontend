# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/model - папка с скриптом для работы с данными
- src/components/view - папка с скриптом для отображения
- src/components/present - папка с eventEmitter

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения на основе принципа MVP

Model-View-Presenter (MVP) - это шаблон проектирования, который разделяет логику приложения на три взаимосвязанных слоя: Model, View и Presenter.

**Model**: Отвечает за управление данными. Этот слой включает в себя бизнес-логику приложения и взаимодействие с API или базой данных.
**View**: Отвечает за отображение данных и взаимодействие с пользователем. Этот слой включает в себя все, что связано с интерфейсом пользователя.
**Presenter**: Связывает Model и View. Этот слой содержит логику, которая преобразует данные из модели для отображения их в представлении.

## Классы и их роли:

## Model (Слой данных)

### Api: Управляет взаимодействием с API.

Конструктор:

constructor(baseUrl: string, options: RequestInit = {})

Параметры:

baseUrl: string - базовый URL для API запросов.

options: RequestInit - параметры для запросов.

Методы:

get(uri: string): Выполняет GET запрос.

post(uri: string, data: object, method: ApiPostMethods = 'POST'): Выполняет POST запрос.

handleResponse(response: Response): Promise<object>: Обрабатывает ответ от API.

### WebApi: Расширяет функциональность Api для работы с конкретным API.

Конструктор:

constructor(cdnUrl: string, baseUrl: string, options?: RequestInit)

Параметры:

cdnUrl: string - URL для CDN.

baseUrl: string - базовый URL для API запросов.

options?: RequestInit - параметры для запросов.

Методы:

getProducts(): Promise<IProduct[]>: Получает список продуктов.

postOrder(order: IOrder): Promise<ISuccess>: Отправляет заказ.

### BaseModel: Базовый класс для моделей данных.

Конструктор:

constructor(data: Partial<T>, protected events: IEvents)

Параметры:

data: Partial<T> - начальные данные модели.

events: IEvents - интерфейс для работы с событиями.

Методы:

emitChanges(event: string, payload?: object): Генерирует событие изменений.

### Product: Модель продукта.

Наследуется от BaseModel<IProduct>

Поля:

id: string

category: string

title: string

description: string

price: number

image?: string

selected: boolean

### AppState: Управляет состоянием приложения.

Наследуется от BaseModel<IAppState>

Поля:

catalog: IProduct[]

cart: IProduct[]

preview: string | null

order: IOrder

formError: FormError

Методы:

setCatalog(items: IProduct[]): Устанавливает каталог продуктов.

setPreview(item: IProduct): Устанавливает предварительный просмотр продукта.

getProducts(): IProduct[]: Возвращает продукты в корзине.

addCart(item: IProduct): Добавляет продукт в корзину.

removeCart(item: IProduct): Удаляет продукт из корзины.

getTotal(): Возвращает общую сумму заказа.

setItems(): Устанавливает товары в заказе.

clearCart(): Очищает корзину.

updateCart(): Обновляет корзину.

setPaymentMethod(method: string): Устанавливает метод оплаты.

setOrderDeliveryField(value: string): Устанавливает адрес доставки.

setOrderEmail(value: string): Устанавливает email для заказа.

setOrderPhone(value: string): Устанавливает телефон для заказа.

validateDelivery(): Валидирует форму доставки.

validateContact(): Валидирует контактную форму.

clearOrder(): Очищает заказ.

## View (Слой отображения)

### ViewComponent: Базовый класс для всех компонентов отображения.

Конструктор:

protected constructor(protected readonly rootElement: HTMLElement)

Параметры:

rootElement: HTMLElement - корневой элемент HTML для компонента.

Методы:

toggleCssClass(element: HTMLElement, className: string, force?: boolean): Переключает CSS класс.

updateTextContent(element: HTMLElement, content: unknown): Обновляет текстовое содержимое элемента.

setElementDisabled(element: HTMLElement, isDisabled: boolean): Устанавливает атрибут disabled для элемента.

showElement(element: HTMLElement): Отображает элемент.

hideElement(element: HTMLElement): Скрывает элемент.

updateImageSource(element: HTMLImageElement, src: string, altText?: string): Обновляет источник изображения.

render(data?: Partial<T>): HTMLElement: Отрисовывает компонент.

### ViewForm: Класс для работы с формами.

Наследуется от ViewComponent<IForm>

Конструктор:

constructor(protected container: HTMLFormElement, protected events: IEvents)

Параметры:

container: HTMLFormElement - контейнер формы.

events: IEvents - интерфейс для работы с событиями.

Методы:

onInputChange(field: keyof T, value: string): Обрабатывает изменение ввода.

render(state: Partial<T> & IForm): Отрисовывает форму.

### ViewModal: Класс для работы с модальными окнами.

Наследуется от ViewComponent<IModalData>

Конструктор:

constructor(container: HTMLElement, protected events: IEvents)

Параметры:

container: HTMLElement - контейнер модального окна.

events: IEvents - интерфейс для работы с событиями.

Методы:

set content(value: HTMLElement): Устанавливает содержимое модального окна.

open(): Открывает модальное окно.

close(): Закрывает модальное окно.

render(data: IModalData): HTMLElement: Отрисовывает модальное окно.

### Card: Класс для отображения карточки товара.

Наследуется от ViewComponent<IProduct>

Конструктор:

constructor(container: HTMLElement, actions?: ICardActions)

Параметры:

container: HTMLElement - контейнер карточки товара.

actions?: ICardActions - действия для карточки товара.

Методы:

set index(value: string): Устанавливает индекс карточки.

set id(value: string): Устанавливает идентификатор карточки.

get id(): string: Возвращает идентификатор карточки.

set title(value: string): Устанавливает заголовок карточки.

get title(): string: Возвращает заголовок карточки.

set image(value: string): Устанавливает изображение карточки.

set category(value: string): Устанавливает категорию карточки.

set price(value: number): Устанавливает цену карточки.

set buttonTitle(value: boolean): Устанавливает текст кнопки.

set description(value: string): Устанавливает описание карточки.

### Cart: Класс для управления корзиной.

Наследуется от ViewComponent<ICartView>

Конструктор:

constructor(container: HTMLElement, protected events: EventEmitter)

Параметры:

container: HTMLElement - контейнер корзины.

events: EventEmitter - интерфейс для работы с событиями.

Методы:

set items(items: HTMLElement[]): Устанавливает товары в корзине.

set total(total: number): Устанавливает общую сумму корзины.

get total(): number: Возвращает общую сумму корзины.

### Delivery: Класс для работы с формой заказа.

Наследуется от Form<IDelivery>

Конструктор:

constructor(container: HTMLFormElement, events: IEvents)

Параметры:

container: HTMLFormElement - контейнер формы заказа.

events: IEvents - интерфейс для работы с событиями.

Методы:

setToggleClassPayment(name: string): Устанавливает активный класс для кнопок оплаты.

set address(value: string): Устанавливает адрес доставки.

### Contacts: Класс для работы с контактной формой.

Наследуется от Form<IContacts>

Конструктор:

constructor(container: HTMLFormElement, events: IEvents)

Параметры:

container: HTMLFormElement - контейнер контактной формы.

events: IEvents - интерфейс для работы с событиями.

Методы:

set email(value: string): Устанавливает email.

set phone(value: string): Устанавливает телефон.

### Page: Класс для работы с основными страницами приложения.

Наследуется от ViewComponent<IPage>

Конструктор:

constructor(container: HTMLElement, protected events: IEvents)

Параметры:

container: HTMLElement - контейнер страницы.

events: IEvents - интерфейс для работы с событиями.

Методы:

set catalog(items: HTMLElement[]): Устанавливает каталог товаров.

set counter(value: number): Устанавливает счетчик товаров в корзине.

set locked(value: boolean): Устанавливает состояние блокировки страницы.

### Success: Класс для работы с окном успешного заказа.

Наследуется от ViewComponent<ISuccess>

Конструктор:

constructor(container: HTMLElement, actions: { onClick: () => void })

Параметры:

container: HTMLElement - контейнер окна успешного заказа.

actions: { onClick: () => void } - действия для окна успешного заказа.

Методы:

set total(total: string): Устанавливает общую сумму заказа.

## Presenter (Слой логики)

### EventEmitter: Класс для управления событиями.

Методы:

on<T extends object>(eventName: EventName, callback: (data: T) => void): Устанавливает обработчик на событие.

off(eventName: EventName, callback: Subscriber): Снимает обработчик с события.

emit<T extends object>(eventName: string, data?: T): Инициирует событие с данными.

onAll(callback: (event: EmitterEvent) => void): Слушает все события.

offAll(): Сбрасывает все обработчики.

trigger<T extends object>(eventName: string, context?: Partial<T>): Делает коллбек триггером, генерирующим событие при вызове.

## Взаимодействие между классами

Пример события: клик по карточке товара

**View**: Пользователь кликает по карточке товара (класс Card).

Метод onClick вызывает events.emit('card:select', item).

**Presenter**: EventEmitter обрабатывает событие card:select и вызывает appState.setPreview(item).

**Model**: AppState обновляет данные и вызывает events.emit('preview:change', item).

**Presenter**: EventEmitter обрабатывает событие preview:change и вызывает метод modal.render.

**View**: ViewModal отображает данные карточки товара в модальном окне.

### События и их описание

_card:select_: Событие выбора карточки товара.

Описание: Генерируется при клике на карточку товара. Обработчик вызывает метод модели для установки выбранного товара.

_preview:change_: Событие изменения предварительного просмотра.

Описание: Генерируется при изменении предварительного просмотра товара. Обработчик вызывает метод отображения для отображения модального окна с информацией о товаре.

_cart:open_: Событие открытия корзины.

Описание: Генерируется при клике на иконку корзины. Обработчик вызывает метод отображения для отображения корзины.

_cart:changed_: Событие изменения корзины.

Описание: Генерируется при изменении содержимого корзины. Обработчик вызывает метод отображения для обновления данных корзины.

_order:open_: Событие открытия формы заказа.

Описание: Генерируется при клике на кнопку оформления заказа. Обработчик вызывает метод отображения для отображения формы заказа.

_order.payment:change_: Событие изменения метода оплаты.

Описание: Генерируется при выборе метода оплаты в форме заказа. Обработчик вызывает метод модели для обновления метода оплаты.

_order.address:change_: Событие изменения адреса доставки.

Описание: Генерируется при вводе адреса доставки в форме заказа. Обработчик вызывает метод модели для обновления адреса доставки.

_deliveryFormError:change_: Событие изменения ошибок формы доставки.

Описание: Генерируется при изменении ошибок в форме доставки. Обработчик вызывает метод отображения для обновления ошибок формы.

_order:submit_: Событие отправки заказа.

Описание: Генерируется при отправке формы заказа. Обработчик вызывает метод API для отправки данных заказа на сервер.

_contacts.email:change_: Событие изменения email.

Описание: Генерируется при вводе email в форме контактов. Обработчик вызывает метод модели для обновления email.

_contacts.phone:change_: Событие изменения телефона.

Описание: Генерируется при вводе телефона в форме контактов. Обработчик вызывает метод модели для обновления телефона.

_contactsFormError:change_: Событие изменения ошибок формы контактов.

Описание: Генерируется при изменении ошибок в форме контактов. Обработчик вызывает метод отображения для обновления ошибок формы.

_contacts:submit_: Событие отправки формы контактов.

Описание: Генерируется при отправке формы контактов. Обработчик вызывает метод API для отправки данных контактов на сервер.

_modal:open_: Событие открытия модального окна.

Описание: Генерируется при открытии модального окна. Обработчик вызывает метод отображения для блокировки страницы.

_modal:close_: Событие закрытия модального окна.

Описание: Генерируется при закрытии модального окна. Обработчик вызывает метод отображения для разблокировки страницы.
