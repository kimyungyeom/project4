// import
import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repository.js";

// auth.router.js - global variables
const router = express.Router();

// Instance
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// 회원가입 API
router.post("/signup", authController.signUp);

// 로그인 API
router.post("/login", authController.logIn);

// export
export default router;
