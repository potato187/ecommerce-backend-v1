'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'apiKey';
const COLLECTION_NAME = 'apiKeys';

var apiKeySchema = new Schema(
	{
		key: {
			type: String,
			require: true,
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		permissions: {
			type: [String],
			require: true,
			enum: ['0000', '1111', '2222'],
		},
	},
	{
		timestamp: true,
		collection: COLLECTION_NAME,
	},
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
