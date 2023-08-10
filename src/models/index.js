module.exports = {
	shopModel: require('./shop.model'),
	keyTokenModel: require('./keyToken.model'),
	apiKeyModel: require('./apiKey.model'),
	...require('./product.model'),
};
