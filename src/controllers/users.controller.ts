import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { parseIdValidation } from "../schemas/utils.schema.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors.js";
import { usersSchema } from "../schemas/users.schema.js";
import bcrypt from "bcrypt";
import { querySchema } from "../schemas/query.schema.js";

export const usersController = {
  // ====================  MEMBER CONTROLLER ========================

  // --------------------  Get My Account ------------------------
  async getMyAccount(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      omit: {
        password: true,
        created_at: true,
        updated_at: true,
      },
      include: { role: { select: { id: true, name: true } } },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  },

  // --------------------  Update User Password ------------------------
  async updateUserPassword(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { oldPassword, newPassword } =
      await usersSchema.changePassword.parseAsync(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new NotFoundError("User Not Found");
    }

    const isMatching = await bcrypt.compare(oldPassword, user.password);

    if (!isMatching) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const SALT = process.env.SALT_ROUNDS;
    if (!SALT) {
      throw new Error("SALT_ROUNDS is not defined in environment variables.");
    }
    const nbOfSaltRounds = parseInt(SALT);
    const encryptedPassword = await bcrypt.hash(newPassword, nbOfSaltRounds);

    await prisma.user.update({
      data: { password: encryptedPassword },
      where: { id: req.userId },
    });
    res.status(200).json({ message: "Password updated successfully" });
  },
  // --------------------  Update User Info ------------------------
  async updateUserInfo(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const { firstname, lastname, email, phone, birthday } =
      await usersSchema.updateInfo.parseAsync(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new NotFoundError("User Not Found");
    }

    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists && emailExists.id !== req.userId) {
      throw new ConflictError("Email already in use");
    }

    const updatedUser = await prisma.user.update({
      data: { firstname, lastname, email, phone, birthday },
      where: { id: req.userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        birthday: true,
      },
    });
    res.status(200).json(updatedUser);
  },

  // --------------------  Delete User ------------------------
  async deleteUser(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await prisma.userRateActivity.deleteMany({
      where: { user_id: user.id },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: `deleted_${user.id}@example.com`,
        password: "",
        is_active: false,
      },
    });

    res.status(204).send();
  },

  // ====================  ADMIN CONTROLLER ========================
  // --------------------  Get ALl Users ------------------------

  async getAllUsers(req: Request, res: Response) {
    const { page, limit, order, firstname, lastname, email, q } =
      await querySchema.userPagination.parseAsync(req.query);

    const whereFilters = [];

    if (firstname) {
      whereFilters.push({
        firstname: { contains: firstname, mode: "insensitive" as const },
      });
    }

    if (lastname) {
      whereFilters.push({
        lastname: { contains: lastname, mode: "insensitive" as const },
      });
    }

    if (email) {
      whereFilters.push({
        email: { contains: email, mode: "insensitive" as const },
      });
    }

    if (q) {
      whereFilters.push({
        OR: [
          { firstname: { contains: q, mode: "insensitive" as const } },
          { lastname: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      });
    }

    const where = whereFilters.length > 0 ? { AND: whereFilters } : {};

    const [field, direction] = order.split(":") as [
      "created_at" | "lastname",
      "asc" | "desc"
    ];

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [field]: direction },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        is_active: true,
        phone: true,
        birthday: true,
        last_login: true,
        role: { select: { id: true, name: true } },
      },
    });

    res.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        order,
        q: q || null,
      },
    });
  },

  // --------------------  Get One User ------------------------
  async getOneUser(req: Request, res: Response) {
    const id = parseIdValidation.parse(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        is_active: true,
        phone: true,
        birthday: true,
        last_login: true,
        role: { select: { id: true, name: true } },
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  },

  // --------------------  Update Role User ------------------------
  async updateRoleUser(req: Request, res: Response) {
    const id = parseIdValidation.parse(req.params.id);
    const { role } = req.body;

    if (role !== "admin" && role !== "member") {
      throw new ConflictError("Role must be either 'admin' or 'member'");
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: { connect: { name: role } },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: { select: { id: true, name: true } },
      },
    });
    res.status(200).json(updatedUser);
  },

  // --------------------  Delete User Account ------------------------
  async deleteUserAccount(req: Request, res: Response) {
    const id = parseIdValidation.parse(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    await prisma.userRateActivity.deleteMany({
      where: { user_id: user.id },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: `deleted_${user.id}@example.com`,
        password: "",
        is_active: false,
      },
    });

    res.status(204).send();
  },
};
