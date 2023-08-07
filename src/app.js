'use strict';
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// config middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

// config database
require('@/dbs').mongodInit;

// config routes

app.get('/', (req, res) => {
	return res.status(200).json({
		message: 'message from server',
	});
});

// handling errors

module.exports = app;
