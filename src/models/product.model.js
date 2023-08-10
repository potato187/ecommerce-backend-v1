'use strict';

const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema(
	{
		product_name: {
			type: String,
			require: true,
		},
		product_thumb: {
			type: String,
			require: true,
		},
		product_description: {
			type: String,
		},
		product_price: {
			type: Number,
			require: true,
		},
		product_quantity: {
			type: Number,
			require: true,
		},
		product_type: {
			type: String,
			require: true,
			enum: ['Electronic', 'Clothing'],
		},
		product_shop: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		product_attributes: {
			type: Schema.Types.Mixed,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

const clothingSchema = new Schema(
	{
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
	{ timestamps: true, collection: 'Clothings' },
);

const electronicSchema = new Schema(
	{
		manufacturer: {
			type: String,
			require: true,
		},
		model: {
			type: String,
		},
		color: {
			type: String,
		},
	},
	{ timestamps: true, collection: 'Electronics' },
);

module.exports = {
	productModel: model(DOCUMENT_NAME, productSchema),
	clothingModel: model('Clothing', clothingSchema),
	electronicModel: model('Electronic', electronicSchema),
};