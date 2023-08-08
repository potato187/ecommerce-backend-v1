'use strict';

const { ReasonPhrases, StatusCodes } = require('@/httpStatusCode');

class ErrorResponse extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

class ForbiddenRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
		super(message, status);
	}
}

class BadRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
		super(message, status);
	}
}

class ConflictRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
		super(message, status);
	}
}

module.exports = {
	ErrorResponse,
	ConflictRequestError,
	BadRequestError,
	ForbiddenRequestError,
};
