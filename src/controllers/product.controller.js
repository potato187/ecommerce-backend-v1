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

	getAllDraftsFromShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list of draft products successful!',
			metadata: await ProductService.findAllDraftsFromShop({ product_shop: req.user.userId }),
		}).send(res);
	};

	getAllPublishesFromShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list of published products successful!',
			metadata: await ProductService.findAllPublishesFromShop({ product_shop: req.user.userId }),
		}).send(res);
	};

	getAllProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list of products successful!',
			metadata: await ProductService.findAllProduct(req.query),
		}).send(res);
	};

	getProductById = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get detail product successful!',
			metadata: await ProductService.getProductById({ productId: req.params.id }),
		}).send(res);
	};

	setDraftProductFromShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Set product as draft successful!',
			metadata: await ProductService.setDraftProductFromShop({
				product_shop: req.user.userId,
				productId: req.params.id,
			}),
		}).send(res);
	};

	setPublishProductFromShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Set product as published successful!',
			metadata: await ProductService.setPublishProductFromShop({
				product_shop: req.user.userId,
				productId: req.params.id,
			}),
		}).send(res);
	};

	searchProductByUser = async (req, res, next) => {
		new SuccessResponse({
			message: 'Search product successful!',
			metadata: await ProductService.searchProductByUser(req.params),
		}).send(res);
	};

	updateProductById = async (req, res, next) => {
		const { product_type, ...payload } = req.body;
		const productId = req.params.id;
		new SuccessResponse({
			message: 'Update product successful!',
			metadata: await ProductService.updateProductById({ type: product_type, productId, payload }),
		}).send(res);
	};
}

module.exports = new ProductController();
