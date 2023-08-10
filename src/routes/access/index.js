'use strict';

const auth = require('@/auth');
const { AccessController } = require('@/controllers');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();
const { authMiddleware } = auth;

router.post('/signup', tryCatch(AccessController.signUp));

router.use(tryCatch(authMiddleware.authentication));

module.exports = router;
