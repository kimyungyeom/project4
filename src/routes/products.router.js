// import
import express from "express";
import authMiddleware from "../middlewares/need-login.middleware.js";
import { prisma } from "../utils/prisma/index.js";
import { ProductsController } from "../controllers/products.controller.js";
import { ProductsService } from "../services/products.service.js";
import { ProductsRepository } from "../repositories/products.repository.js";

// products.router.js - global variables
const router = express.Router();

// Instance
const productsRepository = new ProductsRepository(prisma);
const productsService = new ProductsService(productsRepository);
const productsController = new ProductsController(productsService);

// 상품 생성 API
router.post("/", authMiddleware, productsController.createProduct);

// 상품 목록 조회 API
router.get("/", productsController.getProducts);

// 상품 상세 조회 API
router.get("/:productId", productsController.getProductById);

// 상품 정보 수정 API
router.put("/:productId", authMiddleware, productsController.updateProduct);

// 상품 삭제 API
router.delete("/:productId", authMiddleware, productsController.deleteProduct);

// export
export default router;
