module.exports = (error, req, res, next) => {
	console.log(error);
	const statusCode = error.status || 500;
	return res.status(statusCode).json({
		status: 'error',
		code: statusCode,
		message: error.message || 'Internal Server Error.',
	});
};
