'use strict';

const { shopModel } = require('@/models');
const bcrypt = require('bcrypt');
const { ROLE_SHOP } = require('@/constant');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('@/auth/auth.utils');
const { getInfoData, generateToken } = require('@/utils');
const { UnauthorizedRequestError, ConflictRequestError, InterServerRequestError, BadRequestError } = require('@/core');
const ShopService = require('./shop.service');

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
			roles: [ROLE_SHOP.SHOP],
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

	static login = async ({ email, password, refreshToken = null }) => {
		const foundShop = await ShopService.findByEmail({ email });

		if (!foundShop) {
			throw new BadRequestError('Shop not registered!');
		}

		const { password: hashPassword, _id: userId } = foundShop;

		const match = bcrypt.compare(password, hashPassword);
		if (!match) {
			throw new UnauthorizedRequestError();
		}

		const [privateKey, publicKey] = [generateToken(), generateToken()];
		const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

		await KeyTokenService.createKeyToken({ userId, publicKey, privateKey, refreshToken: tokens.refreshToken });

		return {
			shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
			tokens,
		};
	};
}

module.exports = AccessService;
