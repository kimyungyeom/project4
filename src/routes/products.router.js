// import
import express from "express";
import Sequelize from "sequelize";
import authMiddleware from "../middlewares/need-login.middleware.js";
import db from "../models/index.cjs";

// products.router.js - global variables
const router = express.Router();
const { Products, Users } = db;

// 상품 생성 API
router.post("/", authMiddleware, async (req, res) => {
	try {
		const { id: userId } = res.locals.user;
		const { productName, content } = req.body;

		// 상품명이 없는 경우
		if (!productName) {
			return res.status(400).json({
				success: false,
				errorMessage: "상품명이 필요합니다.",
			});
		}

		// 상품 설명이 없는 경우
		if (!content) {
			return res.status(400).json({
				success: false,
				errorMessage: "상품 설명이 필요합니다.",
			});
		}

		const createdProduct = await Products.create({ productName, content, userId });

		return res.status(201).json({
			success: true,
			message: "상품 생성이 완료되었습니다.",
			data: { createdProduct },
		});
	} catch (err) {
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// 상품 목록 조회 API
router.get("/", async (req, res) => {
	try {
		// QueryString을 이용한 정렬 방식
		const { sort } = req.query;
		let upperSort = sort?.toUpperCase();

		// 상품 목록 정렬 - 최신순
		if (upperSort !== "ASC" && upperSort !== "DESC") {
			upperSort = "DESC";
		}

		const products = await Products.findAll({
			attributes: ["id", "productName", "content", "status", "userId", [Sequelize.col("user.name"), "name"], "createdAt", "updatedAt"],
			order: [["createdAt", upperSort]],
			include: { model: Users, as: "user", attributes: [] },
		});

		return res.status(200).json({
			success: true,
			message: "상품 조회가 완료되었습니다.",
			data: products,
		});
	} catch (err) {
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// 상품 상세 조회 API
router.get("/:productId", async (req, res) => {
	try {
		const { productId } = req.params;

		const product = await Products.findOne({
			where: { id: productId },
			attributes: ["id", "productName", "content", "status", "userId", [Sequelize.col("user.name"), "name"], "createdAt", "updatedAt"],
			include: { model: Users, as: "user", attributes: [] },
		});

		// 일치하는 상품이 없는 경우
		if (!product) {
			return res.status(404).send({
				success: false,
				errorMessage: "일치하는 상품이 존재하지 않습니다.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "상품 상세 조회가 완료되었습니다.",
			data: product,
		});
	} catch (err) {
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// 상품 정보 수정 API
router.put("/:productId", authMiddleware, async (req, res) => {
	try {
		const { productId } = req.params;
		const { id: userId } = res.locals.user;
		const { productName, content, status } = req.body;

		// 수정 정보가 하나도 없는 경우
		if (!productName && !content && !status) {
			return res.status(400).send({
				success: false,
				errorMessage: "수정 정보는 최소 1가지 이상 입력해주세요.",
			});
		}

		// 지원하지 않은 상태 값 입력된 경우
		const isValidStatus = status ? status === "FOR_SALE" || status === "SOLD_OUT" : true;
		if (!isValidStatus) {
			return res.status(400).send({
				success: false,
				errorMessage: "지원하지 않는 상태 값 입니다. (status: FOR_SALE 또는 SOLD_OUT)",
			});
		}

		const product = await Products.findOne({
			where: { id: productId },
		});

		// 일치하는 상품이 없는 경우
		if (!product) {
			return res.status(404).send({
				success: false,
				errorMessage: "일치하는 상품이 존재하지 않습니다.",
			});
		}

		// 작성자 ID와 인증 정보의 사용자 ID가 다른 경우
		const isSameId = product.userId === userId;
		if (!isSameId) {
			return res.status(403).send({
				success: false,
				errorMessage: "권한이 없습니다.",
			});
		}

		// 상품 수정
		product.update({ productName, content, status }, { where: { productId } });

		return res.status(200).json({
			success: true,
			message: "상품 수정이 완료되었습니다.",
			data: product,
		});
	} catch (err) {
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// 상품 삭제 API
router.delete("/:productId", authMiddleware, async (req, res) => {
	try {
		const { productId } = req.params;
		const { id: userId } = res.locals.user;

		const product = await Products.findOne({
			where: { id: productId },
		});

		// 일치하는 상품이 없는 경우
		if (!product) {
			return res.status(404).send({
				success: false,
				errorMessage: "일치하는 상품이 존재하지 않습니다.",
			});
		}

		// 작성자 ID와 인증 정보의 사용자 ID가 다른 경우
		const isSameId = product.userId === userId;
		if (!isSameId) {
			return res.status(403).send({
				success: false,
				errorMessage: "권한이 없습니다.",
			});
		}

		// 상품 삭제
		product.destroy({ where: { productId } });

		return res.status(200).json({
			success: true,
			message: "상품 삭제가 완료되었습니다.",
			data: product,
		});
	} catch (err) {
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// export
export default router;
