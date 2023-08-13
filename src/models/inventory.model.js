'use strict';
const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Inventories';
const DOCUMENT_NAME = 'Inventory';

const inventorySchema = new Schema(
	{
		inven_productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
		inven_shopId: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		inven_stock: {
			type: Number,
			require: true,
		},
		inven_location: {
			type: String,
			default: 'unKnow',
		},
		inven_reservation: {
			type: Array,
			require: true,
			default: [],
		},
	},
	{ timestamps: true, collection: COLLECTION_NAME },
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
