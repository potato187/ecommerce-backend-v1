'use strict';

const { CreatedResponse, SuccessResponse } = require('@/core');
const { AccessService } = require('@/services');

class AccessController {
	signUp = async (req, res, next) => {
		new CreatedResponse({
			message: 'Registered Ok!',
			metadata: await AccessService.signUp(req.body),
		}).send(res);
	};

	login = async (req, res, next) => {
		new SuccessResponse({
			metadata: await AccessService.login(req.body),
		}).send(res);
	};

	logout = async (req, res, next) => {
		new SuccessResponse({
			metadata: await AccessService.logout(req.keyStore),
		}).send(res);
	};

	handleRefreshToken = async (req, res, next) => {
		new SuccessResponse({
			metadata: await AccessService.handleRefreshToken(req),
		}).send(res);
	};
}

module.exports = new AccessController();
