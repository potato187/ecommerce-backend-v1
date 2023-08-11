'use strict';
const { ShopModel } = require('@/models');

class ShopService {
	static findByEmail = async ({ email, select = { email: 1, password: 1, name: 1, roles: 1 } }) => {
		const foundShop = await ShopModel.findOne({ email }, select).lean();
		return foundShop;
	};
}

module.exports = ShopService;
