// import
import jwt from "jsonwebtoken";
import db from "../models/index.cjs";

// need-login.middleware.js - global variables
const { Users } = db;

// 사용자 인증 미들웨어
const auth = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		// 인증 정보가 없는 경우
		if (!authorization) {
			return res.status(401).send({
				success: false,
				errorMessage: "인증 정보가 유효하지 않습니다.",
			});
		}

		// 토큰 형식이 일치하지 않는 경우
		const [tokenType, authToken] = (authorization || "").split(" ");
		if (tokenType !== "Bearer") {
			return res.status(401).send({
				success: false,
				errorMessage: "지원하지 않는 인증 방식입니다.",
			});
		}

		// 토큰이 없는 경우
		if (!authToken) {
			return res.status(401).send({
				success: false,
				errorMessage: "인증 정보가 유효하지 않습니다.",
			});
		}

		// 복호화
		const { userId } = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
		const user = await Users.findByPk(userId);

		// 일치하는 유저 ID가 없는 경우
		if (!user) {
			return res.status(404).send({
				success: false,
				errorMessage: "존재하지 않는 사용자입니다.",
			});
		}

		// 유저 정보 반환
		res.locals.user = user;

		next();
	} catch (err) {
		// 토큰 유효기간이 만료된 경우
		if (err.name === "TokenExpiredError") {
			res.status(401).send({
				success: false,
				errorMessage: "인증 정보 유효기간이 만료되었습니다.",
			});
		}
		// 검증에 실패한 경우
		else if (err.name === "JsonWebTokenError") {
			res.status(401).send({
				success: false,
				errorMessage: "인증 정보가 유효하지 않습니다.",
			});
		}
		// 예상치 못한 에러 발생한 경우
		else {
			return res.status(500).send({
				success: false,
				errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요.",
			});
		}
	}
};

// export
export default auth;
