// import
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthService {
	// 생성자 주입
	constructor(authRepository) {
		this.authRepository = authRepository;
	}

	signUp = async (email, password, name) => {
		// 이메일 형식이 아닌 경우
		const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
		const isValidEmail = emailRegex.test(email);
		if (!isValidEmail) {
			throw new Error("NotValidEmail");
		}

		// 중복된 이메일인 경우
		const isExistUser = await this.authRepository.findAllUsersByEmail(email);
		if (isExistUser) {
			throw new Error("AlreadyUseEmail");
		}

		// 비밀번호 hash화 시키기
		const hashedPassword = await bcrypt.hash(password, 10);

		// 사용자 생성
		const newUser = await this.authRepository.signUp(email, name, hashedPassword);

		return {
			id: newUser.id,
			email: newUser.email,
			name: newUser.name,
			createdAt: newUser.createdAt,
			updatedAt: newUser.updatedAt,
		};
	};

	logIn = async (email, password) => {
		// 해당 이메일을 가진 유저가 없는 경우
		const user = await this.authRepository.findUserByEmail(email);
		if (!user) {
			throw new Error("NotExistUserByEmail");
		}

		// 비밀번호가 일치하지 않는 경우
		const isMatchPassword = await bcrypt.compare(password, user.password);
		if (!isMatchPassword) {
			throw new Error("NotMatchPassword");
		}

		// 로그인 성공 시 JWT AccessToken을 생성
		const accessToken = jwt.sign(
			// userId를 담고 있는 Payload
			{ userId: user.id },
			process.env.JWT_SECRET_KEY,
			// Token 유효기한 12시간 설정
			{ expiresIn: process.env.JWT_TOKEN_EXPIRES_IN },
		);
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			accessToken,
		};
	};
}
