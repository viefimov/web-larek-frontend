import { ViewComponent } from './general/viewComponent';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
}

export class Success extends ViewComponent<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: { onClick: () => void }) {
		super(container);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.rootElement
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.rootElement
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: string) {
		this.updateTextContent(this._total, `Списано ${total} синапсов`);
	}
}
