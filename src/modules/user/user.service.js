import prisma from "../../prisma/client.js";
import { AppError } from "../../utils/AppError.js";
import { ObjectId } from "mongodb";

// 🔹 GET ALL USERS (ADMIN)
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
};

// 🔹 GET USER BY ID (ADMIN)

export const getUserById = async (id) => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// 🔹 UPDATE USER ROLE
export const updateUserRole = async (userId, role, currentUserId) => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  if (userId === currentUserId) {
    throw new AppError("You cannot change your own role", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return updatedUser;
};

// 🔹 UPDATE USER STATUS
export const updateUserStatus = async (userId, status, currentUserId) => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  if (userId === currentUserId) {
    throw new AppError("You cannot change your own status", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return updatedUser;
};

// 🔹 UPDATE USER DETAILS (NAME)

export const updateUser = async (id, data) => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return prisma.user.update({
    where: { id },
    data,
  });
};
