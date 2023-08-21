'use strict';

const { BadRequestError, NotFoundRequestError } = require('@/core');
const { DiscountModel } = require('@/models');
const discountModel = require('@/models/discount.model');
const {
	findDiscountByFilter,
	findAllDiscountCodeSelect,
	findAllDiscountCodeUnselect,
	checkDiscountExist,
} = require('@/models/repository/discount.repo');
const { findAllProduct } = require('@/models/repository/product.repo');
const { convertToObjectMongodb } = require('@/utils');

/* 
  Discount Services
  1 - Generator Discount Code [Shop|Admin]
  2 - Get discount amount [User]
  3 - Get all discount codes [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code
  */

class DiscountService {
	static async createDiscountCode(payload) {
		let {
			discount_shopId,
			discount_name,
			discount_description,
			discount_type,
			discount_value,
			discount_code,
			discount_start_date,
			discount_end_date,
			discount_max_uses,
			discount_uses_count,
			discount_users_used,
			discount_max_uses_per_user,
			discount_min_order_value,
			discount_is_active,
			discount_applies_to,
			discount_product_ids,
		} = payload;

		discount_shopId = convertToObjectMongodb(discount_shopId);
		discount_start_date = new Date(discount_start_date);
		discount_end_date = new Date(discount_end_date);

		const currentDate = new Date();

		if (
			currentDate < discount_start_date ||
			currentDate > discount_end_date ||
			discount_start_date > discount_end_date
		) {
			throw new BadRequestError('Discount has has expired or invalid!');
		}

		const foundDiscount = await findDiscountByFilter({ discount_code, discount_shopId });

		if (foundDiscount) {
			throw new BadRequestError('Discount have existed!');
		}

		return await DiscountModel.create({
			discount_shopId: discount_shopId,
			discount_name,
			discount_description,
			discount_type,
			discount_value,
			discount_code,
			discount_start_date,
			discount_end_date,
			discount_max_uses,
			discount_uses_count,
			discount_users_used,
			discount_max_uses_per_user,
			discount_min_order_value: discount_min_order_value || 0,
			discount_is_active,
			discount_applies_to,
			discount_product_ids: discount_applies_to === 'all' ? [] : discount_product_ids,
		});
	}

	static async updateDiscountCode() {}

	static async getAllDiscountCodeWidthProducts({ discount_code, discount_shopId, limit = 25, page = 1 }) {
		discount_shopId = convertToObjectMongodb(discount_shopId);
		const foundDiscount = await findDiscountByFilter({ discount_code, discount_shopId });

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new NotFoundRequestError('Discount does not exists!');
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount;

		const filter = {
			isPublished: true,
		};

		if (discount_applies_to === 'all') {
			filter.product_shop = convertToObjectMongodb(discount_shopId);
		}

		if (discount_applies_to === 'specific') {
			filter._id = { $in: discount_product_ids };
		}

		const products = await findAllProduct({
			filter,
			limit: +limit,
			page: +page,
			sort: 'ctime',
			select: ['product_name'],
		});

		return products;
	}

	static async getAllDiscountCodeWidthShop({ limit = 25, page = 1, discount_shopId }) {
		const discounts = await findAllDiscountCodeUnselect({
			filter: {
				discount_shopId: convertToObjectMongodb(discount_shopId),
				discount_is_active: true,
			},
			unSelect: ['__v', 'discount_shopId'],
			limit: +limit,
			page: +page,
		});

		return discounts;
	}

	static async getDiscountAmount({ discount_code, userId, discount_shopId, products }) {
		const foundDiscount = await checkDiscountExist({
			model: DiscountModel,
			filter: {
				discount_code,
				discount_shopId: convertToObjectMongodb(discount_shopId),
			},
		});

		if (!foundDiscount) {
			throw new NotFoundRequestError('Discount does not exist.');
		}

		const {
			discount_is_active,
			discount_max_uses,
			discount_start_date,
			discount_end_date,
			discount_min_order_value,
			discount_max_uses_per_user,
			discount_users_used,
			discount_type,
			discount_value,
			discount_product_ids,
		} = foundDiscount;
		const currentDate = new Date();
		const startDate = new Date(discount_start_date);
		const endDate = new Date(discount_end_date);

		if (!discount_is_active || startDate > currentDate || currentDate > endDate) {
			throw new NotFoundRequestError('Discount is expired.');
		}

		if (!discount_max_uses) {
			throw new NotFoundRequestError('Discount is out');
		}

		let totalOrder = 0;
		/* bug:: We haven't check productId,quantity,price of product of the user's products within discount_product_ids*/
		if (discount_min_order_value > 0) {
			totalOrder = products.reduce((acc, product) => {
				return acc + product.product_price * product.product_quantity;
			}, totalOrder);
		}

		if (totalOrder < discount_min_order_value) {
			throw new NotFoundRequestError(`Discount requires a minimum order value of ${discount_min_order_value}`);
		}

		let userUsedDiscount = null;
		if (discount_max_uses_per_user > 0) {
			userUsedDiscount = discount_users_used.find((user) => user.userId === userId);
		}

		if (userUsedDiscount) {
		}

		console.log(products, discount_value);
		const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

		return {
			totalOrder,
			discount: amount,
			totalPrice: totalOrder - amount,
		};
	}

	static async deleteDiscountCode({ shopId, codeId }) {
		const deleted = await discountModel.findOneAndDelete({
			discount_code: codeId,
			discount_shopId: convertToObjectMongodb(shopId),
		});

		return deleted;
	}

	static async cancelDiscountCode({ shopId, codeId, userId }) {
		const foundDiscount = await checkDiscountExist({
			model: DiscountModel,
			filter: {
				discount_code: code,
				discount_shopId: convertToObjectMongodb(shopId),
			},
		});

		if (!foundDiscount) {
			throw new NotFoundRequestError('Discount does not exist.');
		}

		const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
			$pull: {
				discount_users_used: userId,
			},
			$inc: {
				discount_max_uses: 1,
				discount_uses_count: -1,
			},
		});

		return results;
	}
}

module.exports = DiscountService;
