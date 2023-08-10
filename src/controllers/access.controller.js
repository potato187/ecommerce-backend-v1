'use strict';

const { CreatedResponse } = require('@/core');
const { AccessService } = require('@/services');

class AccessController {
	signUp = async (req, res, next) => {
		new CreatedResponse({
			message: 'Registered Ok!',
			metadata: await AccessService.signUp(req.body),
		}).send(res);
	};
}

module.exports = new AccessController();
