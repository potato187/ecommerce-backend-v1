'use strict';

const express = require('express');
const { authMiddleware } = require('@/auth');
const { apiKeyValidator, permissionValidator } = authMiddleware;

const router = express.Router();

router.use(apiKeyValidator);
router.use(permissionValidator('0000'));
router.use('/shop', require('./access'));
router.use('/product', require('./product'));
router.use('/discount', require('./discount'));

module.exports = router;
