'use strict';
const { apiKeyModel } = require('@/models');

class ApiKeyService {
	static getById = async (key) => {
		const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
		return objKey;
	};
}

module.exports = ApiKeyService;
