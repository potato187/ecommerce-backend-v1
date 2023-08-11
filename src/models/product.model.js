'use strict';

const { Schema, model } = require('mongoose');
const { default: slugify } = require('slugify');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema(
	{
		product_shop: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		product_name: {
			type: String,
			require: true,
		},
		product_slug: {
			type: String,
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
			enum: ['Electronic', 'Clothing', 'Furniture'],
		},
		product_attributes: {
			type: Schema.Types.Mixed,
			required: true,
		},
		product_ratingAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be above 1.0'],
			max: [5, 'Rating must be below 5.0'],
		},
		product_variations: {
			type: Array,
			default: [],
		},
		isDraft: {
			type: Boolean,
			default: true,
			select: false,
			index: true,
		},
		isPublished: {
			type: Boolean,
			default: false,
			select: false,
			index: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

productSchema.pre('save', function (next) {
	this.product_slug = slugify(this.product_name, { lower: true });
	next();
});

module.exports = model(DOCUMENT_NAME, productSchema);
