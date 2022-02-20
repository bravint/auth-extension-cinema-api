const { prisma } = require('../utils');

const createTicket = async (req, res) => {
    const { userId, screeningId } = req.body;

    const response = await prisma.ticket.create({
        data: {
            userId,
            screeningId,
        },
        include: {
            user: true,
            screening: {
                include: {
                    movie: true,
                    screen: true,
                },
            },
        },
    });

    return res.status(201).json(response);
};

module.exports = { createTicket };
