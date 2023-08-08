'use strict';

const { AccessController } = require('@/controllers');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();

router.post('/signup', tryCatch(AccessController.signUp));

module.exports = router;
