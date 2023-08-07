'use strict';

const { shopModel } = require('@/models');
const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const { RoleShop } = require('@/constant');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('@/auth/auth.utils');
const { getInfoData } = require('@/utils');

const SALT_ROUNDS = 10;

class AccessService {
	static signUp = async ({ name, email, password }) => {
		const holderShop = await shopModel.findOne({ email }).lean();

		if (holderShop) {
			throw createHttpError.Conflict('Shop already registered!');
		}

		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
		const newShop = await shopModel.create({
			name,
			email,
			password: passwordHash,
			roles: [RoleShop.SHOP],
		});

		if (newShop) {
			const publicKey = crypto.randomBytes(64).toString('hex');
			const privateKey = crypto.randomBytes(64).toString('hex');

			const keyStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey });

			if (!keyStore) {
				return {
					code: -1,
					message: 'KeyStore error',
				};
			}

			const tokens = await createTokenPair({ userId: newShop._id }, publicKey, privateKey);
			return {
				code: 201,
				metadata: {
					shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
					tokens,
				},
			};
		}

		return {
			code: 200,
			metadata: null,
		};
	};
}

module.exports = AccessService;
