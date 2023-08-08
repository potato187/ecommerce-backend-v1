'use strict';
const _ = require('lodash');
const crypto = require('node:crypto');

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const generateToken = (length = 64, format = 'hex') => {
	return crypto.randomBytes(length).toString(format);
};

module.exports = {
	getInfoData,
	generateToken,
};
