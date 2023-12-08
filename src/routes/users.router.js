// import
import express from "express";
import authMiddleware from "../middlewares/need-login.middleware.js";

// users.router.js - global variables
const router = express.Router();

// 내 정보 조회 API
router.get("/me", authMiddleware, (req, res) => {
	const { id, email, name, createdAt, updatedAt } = res.locals.user;

	// 비밀번호를 제외한 내 정보를 반환
	return res.status(200).json({
		success: true,
		message: "내 정보 조회가 완료되었습니다.",
		user: { id, email, name, createdAt, updatedAt },
	});
});

// export
export default router;
