'use strict';
const mongoose = require('mongoose');
const { mongodConfig } = require('@/configs');
const { mongoHelpers } = require('@/helpers');

const {
	db: { host, port, name },
} = mongodConfig;
const connectURI = `mongodb://${host}:${port}/${name}`;

class Database {
	constructor() {
		this.connect();
	}

	connect(type = 'mongodb') {
		if (process.env.NODE_ENV === 'dev') {
			mongoose.set('debug', true);
			mongoose.set('debug', { color: true });
		}

		mongoose
			.connect(connectURI, { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 50 })
			.then((_) => {
				console.log('eCommerce Connected MongoDB Success.');
				/* 	mongoHelpers.checkOverLoad(); */
			})
			.catch((err) => {
				console.error('Error connecting to MongoDB:', err);
			});
	}

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
