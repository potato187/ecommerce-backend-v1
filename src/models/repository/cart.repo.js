'use strict';

const { getSelectData } = require('@/utils');
const { CartModel } = require('..');

class CartRepo {
	static async findCart(filter, select = ['_id']) {
		return await CartModel.findOne(filter).select(getSelectData(select)).lean();
	}

	static async createUserCart(userId, product) {
		const query = { card_userId: convertToObjectMongodb(userId), cart_status: 'active' };
		const updateOrInsert = {
			$addToSet: {
				cart_products: product,
			},
		};
		const options = {
			upsert: true,
			new: true,
		};
		return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
	}

	static async updateUserCart(userId, product) {
		const { productId, quantity } = product;
		const query = {
			card_userId: convertToObjectMongodb(userId),
			cart_status: 'active',
			'cart_products.productId': productId,
		};

		const updateSet = {
			$addToSet: {
				$inc: {
					'cart_products.$.quantity': quantity,
				},
			},
		};
		const options = {
			upsert: true,
			new: true,
		};
		return await CartModel.findOneAndUpdate(query, updateSet, options);
	}
}

module.exports = CartRepo;
