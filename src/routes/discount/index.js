'use strict';
const { authMiddleware } = require('@/auth');
const { DiscountController } = require('@/controllers');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();

router.post('/amount', tryCatch(DiscountController.getDiscountAmount));
router.get('/list-products-code', tryCatch(DiscountController.getAllDiscountCodeWidthProducts));

router.use(tryCatch(authMiddleware.authentication));

router.get('', tryCatch(DiscountController.getAllDiscountCodeWidthShop));
router.post('', tryCatch(DiscountController.CreateDiscountCode));

module.exports = router;
