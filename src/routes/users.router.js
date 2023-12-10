// import
import express from "express";
import authMiddleware from "../middlewares/need-login.middleware.js";
import { prisma } from "../utils/prisma/index.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";

// users.router.js - global variables
const router = express.Router();

// Instance
const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

// 내 정보 조회 API
router.get("/me", authMiddleware, usersController.getMyInfo);

// export
export default router;
