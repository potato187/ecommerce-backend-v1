'use strict';
const { HEADER } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError, NotFoundRequestError } = require('@/core');
const { ApiKeyService, KeyTokenService } = require('@/services');
const { verifyToken } = require('./auth.utils');

const apiKeyValidator = async (req, res, next) => {
	const key = req.headers[HEADER.API_KEY]?.toString();
	if (!key) {
		return next(new UnauthorizedRequestError('API key missing in headers'));
	}

	const objKey = await ApiKeyService.getById(key);

	if (!objKey) {
		return next(new UnauthorizedRequestError('API key missing in headers'));
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
	if (!clientId) {
		return next(new UnauthorizedRequestError('Invalid Request'));
	}

	const keyStore = await KeyTokenService.findByUserId(clientId);

	if (!keyStore) {
		return next(new NotFoundRequestError('Not Found keyStore'));
	}

	const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
	if (refreshToken) {
		const { userId, email } = await verifyToken(refreshToken, keyStore.privateKey);
		if (decodeRefreshToken.userId !== clientId) {
			return next(new UnauthorizedRequestError('Invalid Request'));
		}

		req.user = { userId, email };
		req.refreshToken = refreshToken;
		req.keyStore = keyStore;
		return next();
	}

	const accessToken = req.headers[HEADER.AUTHORIZATION];
	const { userId, email } = await verifyToken(accessToken, keyStore.publicKey);
	if (userId !== clientId) {
		return next(new UnauthorizedRequestError('Invalid User'));
	}
	req.user = { userId, email };
	req.keyStore = keyStore;

	return next();
};

module.exports = {
	apiKeyValidator,
	permissionValidator,
	authentication,
};
