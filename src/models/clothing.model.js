'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Clothing';
const COLLECTION_NAME = 'Clothings';

const clothingSchema = new Schema(
	{
		product_shop: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		brand: {
			type: String,
			require: true,
		},
		size: {
			type: String,
		},
		material: {
			type: String,
		},
	},
	{ timestamps: true, collection: COLLECTION_NAME },
);

module.exports = model(DOCUMENT_NAME, clothingSchema);
