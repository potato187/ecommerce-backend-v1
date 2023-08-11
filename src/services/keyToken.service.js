'use strict';

const { KeyTokenModel } = require('@/models');
const { Types } = require('mongoose');

class KeyTokenService {
	static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
		const filter = { user: new Types.ObjectId(userId) };
		const update = { publicKey, privateKey, refreshToken, refreshTokenUsed: [] };
		const option = { upsert: true, new: true };

		const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, option);

		return tokens ? tokens.publicKey : null;
	};

	static findByUserId = async (userId) => {
		return await KeyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
	};

	static removeKeyById = async (id) => {
		return await KeyTokenModel.deleteOne({ _id: id });
	};

	static findByRefreshTokenUsed = async (refreshToken) => {
		return await KeyTokenModel.findOne({ refreshTokenUsed: refreshToken });
	};

	static markRefreshTokenUsed = async (id, refreshToken, markRefreshToken) => {
		return await KeyTokenModel.updateOne(
			{ _id: new Types.ObjectId(id) },
			{
				$set: {
					refreshToken,
				},
				$addToSet: {
					refreshTokenUsed: markRefreshToken,
				},
			},
		);
	};
}

module.exports = KeyTokenService;
