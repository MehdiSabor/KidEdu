const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createParent = async (data) => {
    return await prisma.parent.create({ data });
};

exports.getRoomsForParent = async (id) => {
    return await prisma.parent.findUnique({
        where: { id: parseInt(id, 10) }, // Assuming 'id' is the field name in the Parent model
        include: { rooms: {include: {child:true}} } // This includes all rooms related to the parent
    });
};






// ... other functions for Parent
