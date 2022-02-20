const express = require('express');

const { validateToken } = require('../utils');

const { authUser, createUser, updateUser } = require('../controllers/user');

const router = express.Router();

router.put('/:id', validateToken, updateUser);

router.post('/register', createUser);

router.post('/login', authUser);

module.exports = router;
