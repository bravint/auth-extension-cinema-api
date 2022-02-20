const express = require('express');

const { validateToken } = require('../utils');

const {
    authCustomer,
    createCustomer,
    updateCustomer,
} = require('../controllers/customer');

const router = express.Router();

router.put('/:id', validateToken, updateCustomer);

router.post('/register', createCustomer);

router.post('/login', authCustomer);

module.exports = router;
