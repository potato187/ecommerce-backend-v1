'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'KeyToken';
const COLLECTION_NAME = 'keyTokens';

var keyTokenSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			require: true,
			ref: 'Shop',
		},
		privateKey: {
			type: String,
			require: true,
		},
		publicKey: {
			type: String,
			require: true,
		},
		refreshTokenUsed: {
			type: Array,
			default: [],
		},
		refreshToken: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
