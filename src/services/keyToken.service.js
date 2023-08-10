'use strict';

const { keyTokenModel } = require('@/models');
const { Types } = require('mongoose');

class KeyTokenService {
	static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
		const filter = { user: new Types.ObjectId(userId) };
		const update = { publicKey, privateKey, refreshToken, refreshTokenUsed: [] };
		const option = { upsert: true, new: true };

		const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option);

		return tokens ? tokens.publicKey : null;
	};

	static findByUserId = async (userId) => {
		return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
	};

	static removeKeyById = async (id) => {
		return await keyTokenModel.deleteOne({ _id: id });
	};

	static findByRefreshTokenUsed = async (refreshToken) => {
		return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken });
	};

	static markRefreshTokenUsed = async (id, refreshToken, markRefreshToken) => {
		return await keyTokenModel.updateOne(
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
