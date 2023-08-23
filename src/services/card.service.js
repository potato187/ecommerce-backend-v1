'use strict';

const { CartModel } = require('@/models');
const CartRepo = require('@/models/repository/cart.repo');
const { convertToObjectMongodb } = require('@/utils');

class CartService {
	static async addToCart({ userId, product = {} }) {
		const filter = { card_userId: convertToObjectMongodb(userId) };

		const userCart = await CartModel.findOne(filter);

		if (!userCart) {
			// create new cart and add products
			return await CartRepo.createUserCart(userId, product);
		}

		/* Cart is empty */
		if (!userCart.card_products.length) {
			userCart.card_products = [product];
			return await userCart.save();
		}

		/* Cart does not empty => update cart quantity */
		return await CartRepo.updateUserCart({ userId, product });
	}
}

module.exports = CartService;
