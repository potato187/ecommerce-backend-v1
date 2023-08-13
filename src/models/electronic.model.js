'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Electronic';
const COLLECTION_NAME = 'Electronic';

const electronicSchema = new Schema(
	{
		product_shop: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
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
	{ timestamps: true, collection: COLLECTION_NAME },
);

module.exports = model(DOCUMENT_NAME, electronicSchema);
