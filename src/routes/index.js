'use strict';

const express = require('express');

const router = express.Router();

router.use('/shop', require('./access'));

module.exports = router;
