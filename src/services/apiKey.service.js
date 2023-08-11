'use strict';
const { ApiKeyModel } = require('@/models');

class ApiKeyService {
	static getById = async (key) => {
		const objKey = await ApiKeyModel.findOne({ key, status: true }).lean();
		return objKey;
	};
}

module.exports = ApiKeyService;
