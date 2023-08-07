const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000; // monitor every 5s

const countConnection = () => {
	const numConnection = mongoose.connections.length;
	console.log(`Number of connections:: ${numConnection}`);
};

const checkOverLoad = () => {
	setInterval(() => {
		const numConnection = mongoose.connections.length;
		const numCore = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;

		console.log(`Active connection: ${numConnection}\nMemory usage:: ${memoryUsage / 1024 ** 2} MB  `);

		const maxConnection = numCore * 5;
		if (numConnection > maxConnection) {
			console.log('Connection overload detected!');
		}
	}, _SECONDS);
};

module.exports = {
	countConnection,
	checkOverLoad,
};
