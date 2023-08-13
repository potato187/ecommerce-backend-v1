'use strict';
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const DOCUMENT_NAME = 'Shop';
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

shopSchema.pre('save', function (next) {
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

module.exports = model(DOCUMENT_NAME, shopSchema);
