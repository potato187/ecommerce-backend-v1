'use strict';

const mongoose = require('mongoose');

const connectURI = 'mongodb://127.0.0.1:27017/e-commerce-v1';

mongoose
	.connect(connectURI)
	.then((_) => {
		console.log('eCommerce Connected Mongodb Success.');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = mongoose;
