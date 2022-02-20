const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const hashPassword = (password) => await bcrypt.hashSync(password, saltRounds);

const checkPassword = async (textPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(textPassword, hashedPassword);
    } catch (error) {
        console.log(`error in password check`, error);
        return error;
    }
};

const createToken = (payload) => jwt.sign(payload, secret);

const idToInteger = (params) => {
    let { id } = params;

    return parseInt(id, 10);
};

const checkRole = (req, res, next) => {
    const token = req.headers.authorization;

    const decodedPayload = jwt.decode(token);

    if (decodedPayload.role === 'USER')
        return res.status(403).json('Unauthorised');

    next();
};

const saltRounds = 10;

const secret = process.env.SECRET;

const checkToken = (token) => jwt.verify(token, secret);

const validateToken = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        checkToken(token);
        next();
    } catch {
        return res.status(401).json('User authentication failed');
    }
};

module.exports = {
    checkPassword,
    checkToken,
    checkRole,
    createToken,
    idToInteger,
    hashPassword,
    prisma,
    saltRounds,
    secret,
    validateToken,
};
