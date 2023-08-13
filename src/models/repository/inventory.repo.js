'uses strict';
const { Types } = require('mongoose');
const InventoryModel = require('../inventory.model');

const insertInventory = async ({ productId, shopId, stock = 0, location = 'unKnow' }) => {
	return await InventoryModel.create({
		inven_productId: new Types.ObjectId(productId),
		inven_shopId: new Types.ObjectId(shopId),
		inven_stock: stock,
		inven_location: location,
	});
};

module.exports = {
	insertInventory,
};
