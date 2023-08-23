'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Cart';

const cartSchema = new Schema(
	{
		card_userId: {
			type: Number,
			required: true,
		},
		card_products: {
			type: Array,
			default: [],
			/* [
        {
          product_id,
          product_name,
          product_price
          product_quantity
        }
      ]  */
		},
		cart_status: {
			type: String,
			enum: ['active', 'completed', 'failed', 'pending'],
			default: 'active',
			required: true,
		},
		card_count_products: {
			type: Number,
			default: 0,
		},
	},
	{
		timeseries: {
			createdAt: 'createdOn',
			updatedAt: 'modifiedOn',
		},
	},
);
module.exports = model(DOCUMENT_NAME, cartSchema);
