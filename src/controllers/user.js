const {
    idToInteger,
    prisma,
    hashPassword,
    createToken,
    checkPassword,
} = require('../utils');

const authUser = async (req, res) => {
    let { username, password } = req.body;

    const foundUser = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    const passwordCheck = await checkPassword(password, foundUser.password);

    if (!passwordCheck)
        return res.status(401).json('User authentication failed');

    res.status(200).json(
        createToken({ id: foundUser.id, role: foundUser.role })
    );
};

const createUser = async (req, res) => {
    let { username, password, phone, email } = req.body;

    password = hashPassword(password);

    const user = {
        username,
        password,
    };

    let createdUser = await prisma.user.create({
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

    if (createdUser)
        return res
            .status(200)
            .json(`User ${createdUser.username} created successfully`);
};

const updateUser = async (req, res) => {
    const id = idToInteger(req.params);

    const { name, contact } = req.body;
    const phone = contact.phone;
    const email = contact.email;

    const updatedUser = await prisma.user.update({
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

    res.status(201).json(updatedUser);
};

module.exports = {
    authUser,
    createUser,
    updateUser,
};
