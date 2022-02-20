const { idToInteger, prisma, secret, saltRounds } = require('../utils');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const HashPassword = (password) => bcrypt.hashSync(password, saltRounds);

const checkPassword = async (textPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(textPassword, hashedPassword);
    } catch (error) {
        console.log(`error in password check`, error);
        return error;
    }
};

const createToken = (payload) => jwt.sign(payload, secret);

const authCustomer = async (req, res) => {
    let { username, password } = req.body;

    let token = req.headers.authorization;

    const foundUser = await prisma.customer.findUnique({
        where: {
            username,
        },
    });

    const passwordCheck = await checkPassword(password, foundUser.password);

    if (!passwordCheck) return res.status(401).json('User authentication failed');

    res.status(200).json(createToken({ id: foundUser.id }));
};

const createCustomer = async (req, res) => {
    let { username, password, phone, email } = req.body;

    password = HashPassword(password);

    const user = {
        username,
        password,
    };

    let createdCustomer = await prisma.customer.create({
        data: {
            ...user,
            contact: {
                create: {
                    phone,
                    email,
                },
            },
        },
    });

    if (createdCustomer)
        return res
            .status(200)
            .json(`User ${createdCustomer.username} created successfully`);
};

const updateCustomer = async (req, res) => {
    const id = idToInteger(req.params);

    const { name, contact } = req.body;
    const phone = contact.phone;
    const email = contact.email;

    const updatedCustomer = await prisma.customer.update({
        where: {
            id: id,
        },
        data: {
            name,
            contact: {
                update: {
                    phone,
                    email,
                },
            },
        },
        include: {
            contact: true,
        },
    });

    res.json({ data: updatedCustomer });
};

module.exports = {
    authCustomer,
    createCustomer,
    updateCustomer,
};
