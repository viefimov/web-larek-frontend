import { ViewComponent } from './viewComponent';
import { IEvents } from '../../present/events';
import { ensureElement } from '../../../utils/utils';

interface IModalData {
	content: HTMLElement;
}

export class ViewModal extends ViewComponent<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.rootElement.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.rootElement.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.rootElement.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.rootElement;
	}
}
