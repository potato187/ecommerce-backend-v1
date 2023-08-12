'use strict';
const { ProductModel } = require('@/models');
const { Types } = require('mongoose');

const queryProduct = async ({ query, limit, skip }) => {
	return await ProductModel.find(query)
		.populate('product_shop', 'name email -_id')
		.sort({ updateAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
		.exec();
};

const findAllDraftProducts = async ({ query, skip = 0, limit = 50 }) => {
	return await queryProduct({ query, skip, limit });
};

const findAllPublishedProducts = async ({ query, skip = 0, limit = 50 }) => {
	return await queryProduct({ query, skip, limit });
};

const setProductIsPublished = async ({ product_shop, product_id }) => {
	const foundProduct = await ProductModel.findOne({
		_id: new Types.ObjectId(product_id),
		product_shop: new Types.ObjectId(product_shop),
	});
	if (!foundProduct) return null;

	foundProduct.isDraft = false;
	foundProduct.isPublished = true;

	const { modifiedCount } = await foundProduct.updateOne(foundProduct);

	return modifiedCount;
};

const setProductIsDraft = async ({ product_shop, product_id }) => {
	const foundProduct = await ProductModel.findOne({
		_id: new Types.ObjectId(product_id),
		product_shop: new Types.ObjectId(product_shop),
	});
	if (!foundProduct) return null;

	foundProduct.isDraft = false;
	foundProduct.isPublished = true;

	const { modifiedCount } = await foundProduct.updateOne(foundProduct);

	return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
	const regexSearch = new RegExp(keySearch);
	return await ProductModel.find(
		{
			isPublished: true,
			$text: { $search: regexSearch },
		},
		{
			score: { $meta: 'textScore' },
		},
	)
		.sort()
		.lean();
};

module.exports = {
	findAllDraftProducts,
	findAllPublishedProducts,
	setProductIsPublished,
	setProductIsDraft,
	searchProductByUser,
};
