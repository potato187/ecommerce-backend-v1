'use strict';
const { BadRequestError, ForbiddenRequestError } = require('@/core');
const { ProductModel, ClothingModel, ElectronicModel, FurnitureModel } = require('@/models');
const { Types } = require('mongoose');
const {
	findAllDraftProducts,
	findAllPublishedProducts,
	setProductIsPublished,
	setProductIsDraft,
	searchProductByUser,
	findAllProduct,
	getProductById,
	updateProductById,
} = require('./repository/product.repo');
const { removeFalsyProperties, flattenObject } = require('@/utils');

class ProductFactory {
	static productRegistry = {};
	static registerProductType(type, classRef) {
		ProductFactory.productRegistry[type] = classRef;
	}

	static async createProduct(type, payload) {
		const ProductClass = ProductFactory.productRegistry[type];
		if (!ProductClass) {
			throw new ForbiddenRequestError(`${type} is invalid type product!`);
		}

		return new ProductClass({ ...payload, product_type: type }).createProduct();
	}

	static async updateProductById({ type, productId, payload }) {
		const ProductClass = ProductFactory.productRegistry[type];
		if (!ProductClass) {
			throw new ForbiddenRequestError(`${type} is invalid type product!`);
		}

		return new ProductClass(payload).updateProductById(productId);
	}

	static async findAllDraftsFromShop({ product_shop, skip = 0, limit = 50 }) {
		const query = { product_shop: new Types.ObjectId(product_shop), isDraft: true };
		return await findAllDraftProducts({ query, skip, limit });
	}

	static async findAllPublishesFromShop({ product_shop, skip = 0, limit = 50 }) {
		const query = { product_shop: new Types.ObjectId(product_shop), isPublished: true };
		return await findAllPublishedProducts({ query, skip, limit });
	}

	static async findAllProduct({ filter = { isPublished: true }, sort = 'ctime', page = 1, limit = 50 }) {
		return await findAllProduct({
			filter,
			sort,
			page,
			limit,
			select: ['product_name', 'product_price', 'product_thumb'],
		});
	}

	static async setDraftProductFromShop({ product_shop, productId }) {
		return await setProductIsDraft({ product_shop, productId });
	}

	static async setPublishProductFromShop({ product_shop, productId }) {
		return await setProductIsPublished({ product_shop, productId });
	}

	static async searchProductByUser({ keySearch }) {
		return await searchProductByUser({ keySearch });
	}

	static async getProductById({ productId }) {
		return await getProductById({ productId, unSelect: ['__v', 'createdAt', 'updatedAt'] });
	}
}

class Product {
	constructor({
		product_name,
		product_thumb,
		product_description,
		product_price,
		product_quantity,
		product_shop,
		product_attributes,
		product_type,
	}) {
		this.product_type = product_type;
		this.product_name = product_name;
		this.product_thumb = product_thumb;
		this.product_description = product_description;
		this.product_price = product_price;
		this.product_quantity = product_quantity;
		this.product_shop = product_shop;
		this.product_attributes = product_attributes;
	}

	async createProduct(productId) {
		return await ProductModel.create({ _id: new Types.ObjectId(productId), ...this });
	}

	async updateProductById(productId, updateBody) {
		return await updateProductById({ productId, updateBody, model: ProductModel });
	}
}

class Clothing extends Product {
	async createProduct() {
		const newClothing = await ClothingModel.create({ ...this.product_attributes, product_shop: this.product_shop });
		if (!newClothing) {
			throw new BadRequestError('Create new attributes Clothing error!');
		}

		const newProduct = await super.createProduct(newClothing._id);
		if (!newProduct) {
			throw new BadRequestError('Create new Clothing error!');
		}

		return newProduct;
	}

	async updateProductById(productId) {
		const updateBody = removeFalsyProperties()(flattenObject(this));
		if (this.product_attributes) {
			await updateProductById({ productId, updateBody: this.product_attributes, model: ClothingModel });
		}
		return await super.updateProductById(productId, updateBody);
	}
}

class Electronic extends Product {
	async createProduct() {
		const newElectronic = await ElectronicModel.create({ ...this.product_attributes, product_shop: this.product_shop });
		if (!newElectronic) {
			throw new BadRequestError('Create new attributes Electronic error!');
		}

		const newProduct = await super.createProduct(newElectronic._id);
		if (!newProduct) {
			throw new BadRequestError('Create new Electronic error!');
		}

		return newProduct;
	}

	async updateProductById(productId) {
		const updateBody = removeFalsyProperties()(flattenObject(this));
		if (this.product_attributes) {
			await updateProductById({ productId, updateBody: this.product_attributes, model: ElectronicModel });
		}
		return await super.updateProductById(productId, updateBody);
	}
}

class Furniture extends Product {
	async createProduct() {
		const newFurniture = await FurnitureModel.create({ ...this.product_attributes, product_shop: this.product_shop });
		if (!newFurniture) {
			throw new BadRequestError('Create new attributes Electronic error!');
		}

		const newProduct = await super.createProduct(newFurniture._id);
		if (!newProduct) {
			throw new BadRequestError('Create new Electronic error!');
		}

		return newProduct;
	}

	async updateProductById(productId) {
		const updateBody = removeFalsyProperties()(flattenObject(this));
		if (this.product_attributes) {
			await updateProductById({ productId, updateBody: this.product_attributes, model: FurnitureModel });
		}
		return await super.updateProductById(productId, updateBody);
	}
}

ProductFactory.registerProductType('clothing', Clothing);
ProductFactory.registerProductType('electronic', Electronic);
ProductFactory.registerProductType('furniture', Furniture);

module.exports = ProductFactory;
