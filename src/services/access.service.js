'use strict';

const { shopModel } = require('@/models');
const bcrypt = require('bcrypt');
const { RoleShop } = require('@/constant');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('@/auth/auth.utils');
const { getInfoData, generateToken } = require('@/utils');
const { ConflictRequestError, InterServerRequestError } = require('@/core');

const SALT_ROUNDS = 10;

class AccessService {
	static signUp = async ({ name, email, password }) => {
		const holderShop = await shopModel.findOne({ email }).lean();

		if (holderShop) {
			throw new ConflictRequestError(`Error:: The shop has been registered. `);
		}

		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
		const newShop = await shopModel.create({
			name,
			email,
			password: passwordHash,
			roles: [RoleShop.SHOP],
		});

		if (!newShop) {
			return {
				code: 200,
				metadata: null,
			};
		}

		const publicKey = generateToken();
		const privateKey = generateToken();

		const keyStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey });

		if (!keyStore) {
			throw new InterServerRequestError();
		}

		const tokens = await createTokenPair({ userId: newShop._id }, publicKey, privateKey);

		return {
			code: 201,
			metadata: {
				shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
				tokens,
			},
		};
	};
}

module.exports = AccessService;
