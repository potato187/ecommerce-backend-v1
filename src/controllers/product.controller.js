'use strict';

const { SuccessResponse } = require('@/core');
const { ProductService } = require('@/services');

class ProductController {
	createProduct = async (req, res, next) => {
		const { product_type: type, ...payload } = req.body;
		new SuccessResponse({
			message: 'Create new Product success!',
			metadata: await ProductService.createProduct(type, { ...payload, product_shop: req.user.userId }),
		}).send(res);
	};
}

module.exports = new ProductController();
