// Определение интерфейса продукта

import { IProduct } from '../components/base/models';

//loadApi -> Products -> IProcutListView(Products.items).render() -> onclick(openModal(Product)) -> onAdd(Basket.addd(Product)) -> onRemove(Basket.remove(Product))
//click(Basket) -> Cart.get() -> BasketView.render(cart.items, cart.total) ->
//onSend(Order.addItems(Basket))form_1.render()) -> form_1.onSend(Order.add(form_1.data)) -> then(form_2.render()) -> form_2.onSend(Order.add(form_2.data)) -> onPay(Order.send().then(final.render(cart.total)))

//Api.get(...).then((res:IProduct)=> {
//	const product = new Product(res);
//   const products = new Products(product);
//    const productsView = new ProductsView(products);
//    productsView.render();
//
//})
