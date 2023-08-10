'use strict';

const { keyTokenModel } = require('@/models');
const { Types } = require('mongoose');

class KeyTokenService {
	static createKeyToken = async ({ userId, publicKey, privateKey }) => {
		const tokens = await keyTokenModel.create({
			userId,
			publicKey,
			privateKey,
		});

		return tokens ? tokens.publicKey : null;
	};

	static findByUserId = async (userId) => {
		const keyStore = await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
		return keyStore;
	};
}

module.exports = KeyTokenService;
