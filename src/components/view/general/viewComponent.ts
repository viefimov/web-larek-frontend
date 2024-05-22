export abstract class ViewComponent<T> {
	protected constructor(protected readonly rootElement: HTMLElement) {}

	toggleCssClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	protected updateTextContent(element: HTMLElement, content: unknown) {
		if (element) {
			element.textContent = String(content);
		}
	}


	setElementDisabled(element: HTMLElement, isDisabled: boolean) {
		if (element) {
			if (isDisabled) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	protected showElement(element: HTMLElement) {
		element.style.display = '';
	}

	protected hideElement(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected updateImageSource(
		element: HTMLImageElement,
		src: string,
		altText?: string
	) {
		if (element) {
			element.src = src;
			if (altText) {
				element.alt = altText;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this as object, data);
		}
		return this.rootElement;
	}
}
