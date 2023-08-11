'use strict';
const express = require('express');
const auth = require('@/auth');
const { tryCatch } = require('@/middleware');
const { ProductController } = require('@/controllers');
const { authMiddleware } = auth;

const router = express.Router();

router.use(tryCatch(authMiddleware.authentication));
router.post('/create', tryCatch(ProductController.createProduct));

module.exports = router;
