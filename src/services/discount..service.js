'use strict';

const { BadRequestError, NotFoundRequestError } = require('@/core');
const { DiscountModel } = require('@/models');
const {
	findDiscountByFilter,
	findAllDiscountCodeSelect,
	findAllDiscountCodeUnselect,
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

		if (foundDiscount && foundDiscount.discount_is_active) {
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

	static async getAllDiscountCodeWidthProduct({ discount_code, discount_shopId, userId, limit, page }) {
		discount_shopId = convertToObjectMongodb(discount_shopId);
		const foundDiscount = await findDiscountByFilter({ discount_code, discount_shopId });

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new NotFoundRequestError('Discount does not exists!');
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount;

		const filter = {
			idPublished: true,
		};

		if (discount_applies_to === 'all') {
			filter.product_shop = discount_shopId;
		}

		if (discount_applies_to === 'specify') {
			filter.product_shop = { $in: discount_product_ids };
		}

		return await findAllProduct({
			filter,
			limit: +limit,
			page: +page,
			sort: 'ctime',
			select: ['product_name'],
		});
	}

	static async getAllDiscountCodeWidthShop({ limit, page, discount_shopId }) {
		const discounts = await findAllDiscountCodeUnselect({
			filter: {
				discount_shopId: convertToObjectMongodb(discount_shopId),
				discount_is_active: true,
			},
			unSelect: ['__v', 'discount_shopId'],
			limit: +limit,
			page: +page,
		});
	}
}
