import { Api } from './general/api';

import {
	IProduct,
	IOrder,
	ISuccess,
	ApiListResponse,
	IWebApi,
} from '../../types/index';

export class WebApi extends Api implements IWebApi {
	readonly cdnUrl: string;

	constructor(cdnUrl: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdnUrl = cdnUrl;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((res: ApiListResponse<IProduct>) =>
			res.items.map((item) => ({ ...item, image: this.cdnUrl + item.image }))
		);
	}
	postOrder(order: IOrder): Promise<ISuccess> {
		return this.post('/order', order).then((data: ISuccess) => data);
	}
}
