'use strict';

const { keyTokenModel } = require('@/models');

class KeyTokenService {
	static createKeyToken = async ({ userId, publicKey, privateKey }) => {
		const tokens = await keyTokenModel.create({
			userId,
			publicKey,
			privateKey,
		});

		return tokens ? tokens.publicKey : null;
	};
}

module.exports = KeyTokenService;
