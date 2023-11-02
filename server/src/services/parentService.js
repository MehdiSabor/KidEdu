const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createParent = async (data) => {
    return await prisma.parent.create({ data });
};

exports.getParent = async (id) => {
    return await prisma.parent.findUnique({ where: { id: parseInt(id) } });
};
// ... other functions for Parent
