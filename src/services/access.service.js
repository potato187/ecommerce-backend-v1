'use strict';

const { ShopModel, KeyTokenModel } = require('@/models');
const bcrypt = require('bcrypt');
const { ROLE_SHOP } = require('@/constant');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('@/auth/auth.utils');
const { getInfoData, generateToken } = require('@/utils');
const {
	UnauthorizedRequestError,
	ConflictRequestError,
	InterServerRequestError,
	BadRequestError,
	ForbiddenRequestError,
} = require('@/core');
const ShopService = require('./shop.service');

const SALT_ROUNDS = 10;

class AccessService {
	static signUp = async ({ name, email, password }) => {
		const holderShop = await ShopModel.findOne({ email }).lean();

		if (holderShop) {
			throw new ConflictRequestError(`Error:: The shop has been registered. `);
		}

		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
		const newShop = await ShopModel.create({
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

	static logout = async (keyStore) => {
		return await KeyTokenService.removeKeyById(keyStore._id);
	};

	static handleRefreshToken = async ({ keyStore, user, body }) => {
		const { refreshToken } = body;

		if (keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenService.removeKeyById(keyStore._id);
			throw new ForbiddenRequestError('Something is wrong, pls login again');
		}

		if (keyStore.refreshToken !== refreshToken) {
			throw new UnauthorizedRequestError('Shop not registered!');
		}

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const tokens = await createTokenPair(user, publicKey, privateKey);

		await KeyTokenService.markRefreshTokenUsed(keyStore._id, tokens.refreshToken, refreshToken);

		return {
			user,
			tokens,
		};
	};
}

module.exports = AccessService;
