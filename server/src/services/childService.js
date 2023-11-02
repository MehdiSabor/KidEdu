const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.createChild = async (name) => {
  return await prisma.child.create({
    data: { name },
  });
};

exports.getChildById = async (id) => {
  return await prisma.child.findUnique({
    where: { id },
  });
};

exports.updateChildName = async (id, newName) => {
  return await prisma.child.update({
    where: { id },
    data: { name: newName },
  });
};

exports.deleteChild = async (id) => {
  return await prisma.child.delete({
    where: { id },
  });
};
