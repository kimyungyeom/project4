// import
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models/index.cjs";

// auth.router.js - global variables
const { Users } = db;
const router = express.Router();

// 회원가입 API
router.post("/signup", async (req, res) => {
	try {
		const { email, name, password, confirmPassword } = req.body;

		// 입력란 중 빈 곳이 있는 경우
		if (!email || !name || !password || !confirmPassword) {
			return res.status(400).send({
				success: false,
				errorMessage: "입력란 중 비어있는 곳이 있습니다.",
			});
		}

		// 비밀번호 조건을 만족하지 않는 경우
		// 1. 비밀번호 최소 6자리 이상 2. 비밀번호와 확인비밀번호가 서로 일치
		if (password.length < 6 || password !== confirmPassword) {
			return res.status(401).send({
				success: false,
				errorMessage: "비밀번호 최소 6자 이상이어야 하며, 비밀번호가 서로 일치해야 합니다.",
			});
		}

		// 이메일 형식이 아닌 경우
		const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
		const isValidEmail = emailRegex.test(email);
		if (!isValidEmail) {
			return res.status(400).send({
				success: false,
				errorMessage: "올바른 이메일 형식이 아닙니다.",
			});
		}

		// 중복 된 이메일인 경우
		const existsUsers = await Users.findOne({ where: { email } });
		if (existsUsers) {
			return res.status(409).send({
				success: false,
				errorMessage: "해당 이메일 이미 사용중입니다.",
			});
		}

		// 비밀번호 hash화 시키기
		const hashedPassword = await bcrypt.hash(password, 10);

		// 이메일, 닉네임, 해시화한 비밀번호를 저장하고 회원가입 성공 시, 비밀번호를 제외 한 사용자 정보 반환.
		await Users.create({ email, name, password: hashedPassword });
		res.status(201).json({
			success: true,
			message: "회원가입 되신 것을 축하드립니다!",
			data: { email, name },
		});
	} catch (err) {
		console.error(err);

		// 예상치 못한 에러 발생한 경우
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// 로그인 API
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// 입력란 중 빈 곳이 있는 경우
		if (!email || !password) {
			return res.status(400).send({
				success: false,
				errorMessage: "입력란 중 비어있는 곳이 있습니다.",
			});
		}

		// 해당 이메일을 가진 유저가 없는 경우
		const user = await Users.findOne({ where: { email } });
		if (!user) {
			return res.status(404).send({
				success: false,
				errorMessage: "해당 이메일을 가진 유저가 존재하지 않습니다.",
			});
		}

		// 비밀번호가 일치하지 않는 경우
		const isMatchPassword = await bcrypt.compare(password, user.password);
		if (!isMatchPassword) {
			return res.status(401).send({
				success: false,
				errorMessage: "인증에 실패하였습니다.",
			});
		}

		// 로그인 성공 시 JWT AccessToken을 생성
		const accessToken = jwt.sign(
			// userId를 담고 있는 Payload
			{ userId: user.id },
			process.env.JWT_SECRET_KEY,
			// Token 유효기한 12시간 설정
			{ expiresIn: process.env.JWT_TOKEN_EXPIRES_IN },
		);

		// 생성한 Token 반환
		return res.status(200).json({
			success: true,
			message: "로그인 되었습니다.",
			data: { token: `Bearer ${accessToken}` },
		});
	} catch (err) {
		console.error(err);

		// 예상치 못한 에러 발생한 경우
		return res.status(500).send({
			success: false,
			errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
		});
	}
});

// export
export default router;
