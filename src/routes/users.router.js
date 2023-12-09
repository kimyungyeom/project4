// import
import express from "express";
import authMiddleware from "../middlewares/need-login.middleware.js";
import { prisma } from "../utils/prisma/index.js";

// users.router.js - global variables
const router = express.Router();

// 내 정보 조회 API
router.get("/me", authMiddleware, async (req, res) => {
	const { id } = res.locals.user;

	const user = await prisma.users.findFirst({
		where: { id: +id },
		// 특정 컬럼 조회
		select: {
			id: true,
			email: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return res.status(200).json({
		success: true,
		message: "내 정보 조회가 완료되었습니다.",
		user,
	});
});

// export
export default router;
