const app = require('@/app');
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`eCommerce is running on port:: ${PORT}.`);
});

process.on('SIGINT', () => {
	server.close(() => {
		console.log('Exit Server eCommerce.');
	});
});
