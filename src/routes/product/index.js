'use strict';
const express = require('express');
const auth = require('@/auth');
const { tryCatch } = require('@/middleware');
const { ProductController } = require('@/controllers');
const { authMiddleware } = auth;

const router = express.Router();

router.get('/search/:keySearch', tryCatch(ProductController.searchProductByUser));
router.get('', tryCatch(ProductController.getAllProduct));

router.use(tryCatch(authMiddleware.authentication));

router.get('/draft/all', tryCatch(ProductController.getAllDraftsFromShop));
router.get('/publish/all', tryCatch(ProductController.getAllPublishesFromShop));

router.post('/create', tryCatch(ProductController.createProduct));

router.post('/draft/:id', tryCatch(ProductController.setDraftProductFromShop));
router.post('/publish/:id', tryCatch(ProductController.setPublishProductFromShop));

module.exports = router;
