'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
	{
		discount_shopId: {
			type: Schema.ObjectId,
			ref: 'Shop',
		},
		discount_name: {
			type: String,
			require: true,
		},
		discount_description: {
			type: String,
			require: true,
		},

		discount_type: {
			type: String,
			enum: ['fix_amount', 'percentage'],
			default: 'fix_amount',
		},
		discount_value: {
			type: Number,
			require: true,
		},
		discount_code: {
			type: String,
			require: true,
		},
		discount_startDate: {
			type: Date,
			require: true,
		},
		discount_endDate: {
			type: Date,
			require: true,
		},
		// Maximum number of times the discount can be used.
		discount_max_uses: {
			type: Number,
			require: true,
		},
		// Count of how many times the discount has been used.
		discount_uses_count: {
			type: Number,
			require: true,
		},
		// Array of users who have used the discount
		discount_users_used: {
			type: Array,
			default: [],
		},
		// Maximum usage limit per user.
		discount_max_per_user: {
			type: Number,
			require: true,
		},
		// Minimum order amount for the discount to be applicable
		discount_min_order: {
			type: Number,
			require: true,
		},
		discount_max_amount_per_order: {
			type: Number,
			require: true,
		},
		// Flag indicate whether the discount is currently active
		discount_is_active: {
			type: Boolean,
			default: false,
		},
		// Target audience for the discount
		discount_appliesTo: {
			type: String,
			enum: ['all', 'specific'],
			require: true,
		},
		// Array of product id to which the discount is applicable
		discount_productIds: {
			type: [Schema.ObjectId],
			ref: 'Product',
			default: [],
		},
	},
	{ timestamps: true, collection: COLLECTION_NAME },
);

module.exports = model(DOCUMENT_NAME, discountSchema);
