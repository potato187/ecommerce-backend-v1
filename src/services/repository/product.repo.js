'use strict';

const { ProductModel } = require('@/models');

const findAllDraftsFromShop = async ({ query, skip = 0, limit = 50 }) => {
	return await ProductModel.find(query)
		.populate('product_shop', 'name email -_id')
		.sort({ updateAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
		.exec();
};

module.exports = {
	findAllDraftsFromShop,
};
