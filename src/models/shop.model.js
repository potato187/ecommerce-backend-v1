'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'shop';
const COLLECTION_NAME = 'Shops';

const shopSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			maxLength: 150,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive',
		},
		verify: {
			type: Schema.Types.Boolean,
			default: false,
		},
		roles: {
			type: Array,
			default: [],
		},
	},
	{
		timestamp: true,
		collection: COLLECTION_NAME,
	},
);

module.exports = model(DOCUMENT_NAME, shopSchema);
