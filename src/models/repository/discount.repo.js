'use strict';
const { convertToObjectMongodb, getUnSelectData, getSelectData } = require('@/utils');
const { DiscountModel } = require('..');

const findDiscountByFilter = async (filter) => {
	return await DiscountModel.findOne(filter).lean();
};

const findAllDiscountCodeUnselect = async ({ filter, unSelect = [], limit = 50, page = 1, sort = 'ctime' }) => {
	const skip = (page - 1) * limit;
	const sortBy = { _id: sort === 'ctime' ? 1 : -1 };

	return await DiscountModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(getUnSelectData(unSelect)).lean();
};

const findAllDiscountCodeSelect = async ({ filter, select = [], limit = 50, page = 1, sort = 'ctime' }) => {
	const skip = (page - 1) * limit;
	const sortBy = { _id: sort === 'ctime' ? 1 : -1 };

	return await DiscountModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const checkDiscountExist = async ({ model, filter }) => {
	return model.findOne(filter).lean();
};

module.exports = {
	findDiscountByFilter,
	findAllDiscountCodeUnselect,
	findAllDiscountCodeSelect,
	checkDiscountExist,
};
