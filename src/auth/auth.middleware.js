'use strict';
const { HEADER } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError, NotFoundRequestError } = require('@/core');
const { ApiKeyService, KeyTokenService } = require('@/services');
const JWT = require('jsonwebtoken');

const apiKeyValidator = async (req, res, next) => {
	const key = req.headers[HEADER.API_KEY]?.toString();
	if (!key) {
		next(new UnauthorizedRequestError('API key missing in headers'));
	}

	const objKey = await ApiKeyService.getById(key);

	if (!objKey) {
		next(new UnauthorizedRequestError('API key missing in headers'));
	}

	req.objKey = objKey;
	return next();
};

const permissionValidator = (permission) => {
	return (req, res, next) => {
		const { objKey } = req;
		if (!objKey.permissions || !objKey.permissions.length || !objKey.permissions.includes(permission)) {
			return next(new ForbiddenRequestError('Permission denied.'));
		}
		return next();
	};
};

const authentication = async (req, res, next) => {
	const clientId = req.headers[HEADER.CLIENT_ID];
	const accessToken = req.headers[HEADER.AUTHORIZATION];

	if (!clientId || !accessToken) {
		next(new UnauthorizedRequestError('Invalid Request'));
	}

	const keyStore = await KeyTokenService.findByUserId(clientId);

	if (!keyStore) {
		next(new NotFoundRequestError('Not Found keyStore'));
	}

	try {
		const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
		if (decodeUser.userId !== clientId) {
			return next(new UnauthorizedRequestError('Invalid User'));
		}

		req.keyStore = keyStore;
	} catch (error) {
		next(error);
	}
	return next();
};

module.exports = {
	apiKeyValidator,
	permissionValidator,
	authentication,
};
