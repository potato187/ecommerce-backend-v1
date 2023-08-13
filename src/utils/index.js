'use strict';
const _ = require('lodash');
const crypto = require('node:crypto');
const { type } = require('node:os');

const typeOf = (value) => {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const generateToken = (length = 64, format = 'hex') => {
	return crypto.randomBytes(length).toString(format);
};

const getSelectData = (select = []) => {
	return Object.fromEntries(select.map((key) => [key, 1]));
};

const getUnSelectData = (select = []) => {
	return Object.fromEntries(select.map((key) => [key, 0]));
};

const removeFalsyProperties = (falsyArr = ['undefined', 'null']) => {
	return function fn(object) {
		return Object.entries(object).reduce((obj, [key, value]) => {
			const type = typeOf(value);
			if (type !== 'object' && !falsyArr.includes(type)) {
				obj[key] = value;
			}

			if (type === 'object') {
				obj[key] = fn(value);
			}

			return obj;
		}, {});
	};
};

const flattenObject = (nestedObject = null, prefix = '') => {
	if (nestedObject === null) {
		return {};
	}

	return Object.keys(nestedObject).reduce((object, key) => {
		const value = nestedObject[key];
		const prefixKey = prefix ? `${prefix}.${key}` : key;

		if (typeOf(value) === 'string') {
			Object.assign(object, { [prefixKey]: value });
		} else {
			Object.assign(object, flattenObject(value, prefixKey));
		}

		return object;
	}, {});
};

module.exports = {
	getInfoData,
	generateToken,
	getSelectData,
	getUnSelectData,
	removeFalsyProperties,
	flattenObject,
};
