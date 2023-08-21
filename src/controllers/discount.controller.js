'use strict';
const { CreatedResponse, OkResponse } = require('@/core');
const DiscountService = require('@/services/discount..service');

class DiscountController {
	CreateDiscountCode = async (req, res, next) => {
		new CreatedResponse({
			message: 'Create discount successfully!',
			metadata: await DiscountService.createDiscountCode({
				...req.body,
				discount_shopId: req.user.userId,
			}),
		}).send(res);
	};

	getAllDiscountCodeWidthShop = async (req, res, next) => {
		new OkResponse({
			message: 'get all discount  width shop id successfully!',
			metadata: await DiscountService.getAllDiscountCodeWidthShop({
				...req.query,
				discount_shopId: req.user.userId,
			}),
		}).send(res);
	};

	getDiscountAmount = async (req, res, next) => {
		new OkResponse({
			message: 'get  discount amount successfully!',
			metadata: await DiscountService.getDiscountAmount({ ...req.body }),
		}).send(res);
	};

	getAllDiscountCodeWidthProducts = async (req, res, next) => {
		new OkResponse({
			message: 'get all discount successfully!',
			metadata: await DiscountService.getAllDiscountCodeWidthProducts({ ...req.query }),
		}).send(res);
	};
}

module.exports = new DiscountController();
