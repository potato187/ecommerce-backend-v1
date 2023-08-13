'use strict';
const { ProductModel } = require('@/models');
const { getSelectData, getUnSelectData } = require('@/utils');
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

const findAllDraftProducts = async ({ query, skip, limit }) => {
	return await queryProduct({ query, skip, limit });
};

const findAllPublishedProducts = async ({ query, skip, limit }) => {
	return await queryProduct({ query, skip, limit });
};

const findAllProduct = async ({ filter, sort, select, limit, page = 1 }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	return await ProductModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const setProductIsPublished = async ({ product_shop, productId }) => {
	const foundProduct = await ProductModel.findOne({
		_id: new Types.ObjectId(productId),
		product_shop: new Types.ObjectId(product_shop),
	});
	if (!foundProduct) return null;

	foundProduct.isDraft = false;
	foundProduct.isPublished = true;

	const { modifiedCount } = await foundProduct.updateOne(foundProduct);

	return modifiedCount;
};

const setProductIsDraft = async ({ product_shop, productId }) => {
	const foundProduct = await ProductModel.findOne({
		_id: new Types.ObjectId(productId),
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

const getProductById = async ({ productId, unSelect }) => {
	return await ProductModel.findById(new Types.ObjectId(productId)).select(getUnSelectData(unSelect)).lean();
};

const updateProductById = async ({ productId, updateBody, model, isNew = true }) => {
	return await model.findByIdAndUpdate(new Types.ObjectId(productId), updateBody, { new: isNew });
};

module.exports = {
	findAllDraftProducts,
	findAllPublishedProducts,
	findAllProduct,
	setProductIsPublished,
	setProductIsDraft,
	searchProductByUser,
	getProductById,
	updateProductById,
};
