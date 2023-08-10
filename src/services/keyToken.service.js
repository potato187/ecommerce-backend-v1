'use strict';

const { keyTokenModel } = require('@/models');
const { Types } = require('mongoose');

class KeyTokenService {
	static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
		const filter = { user: userId };
		const update = { publicKey, privateKey, refreshToken, refreshTokenUsed: [] };
		const option = { upsert: true, new: true };

		const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option);

		return tokens ? tokens.publicKey : null;
	};

	static findByUserId = async (userId) => {
		const keyStore = await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
		return keyStore;
	};
}

module.exports = KeyTokenService;
