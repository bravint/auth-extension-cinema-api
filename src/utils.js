const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const idToInteger = (params) => {
    let { id } = params;

    return parseInt(id, 10);
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
    checkToken,
    idToInteger,
    prisma,
    saltRounds,
    secret,
    validateToken,
};
