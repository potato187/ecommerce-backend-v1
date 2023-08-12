'use strict';
const _ = require('lodash');
const crypto = require('node:crypto');

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const generateToken = (length = 64, format = 'hex') => {
	return crypto.randomBytes(length).toString(format);
};

const getSelectData = (select = []) => {
	return Object.fromEntries(select.map((key) => [key, 1]));
};

module.exports = {
	getInfoData,
	generateToken,
	getSelectData,
};
