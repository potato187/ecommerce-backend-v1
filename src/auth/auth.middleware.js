'use strict';
const { HEADER } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { ApiKeyService } = require('@/services');

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

module.exports = {
	apiKeyValidator,
	permissionValidator,
};
