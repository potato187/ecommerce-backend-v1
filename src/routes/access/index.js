'use strict';

const auth = require('@/auth');
const { AccessController } = require('@/controllers');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();
const { authMiddleware } = auth;

router.post('/signup', tryCatch(AccessController.signUp));
router.post('/login', tryCatch(AccessController.login));

router.use(tryCatch(authMiddleware.authentication));

router.post('/logout', tryCatch(AccessController.logout));

module.exports = router;
