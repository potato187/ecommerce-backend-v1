'use strict';

const controllers = require('@/controllers');
const express = require('express');
const router = express.Router();

router.post('/signup', controllers.AccessController.signUp);

module.exports = router;
