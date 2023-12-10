export class AuthController {
	// 생성자 주입
	constructor(authService) {
		this.authService = authService;
	}

	// 회원가입
	signUp = async (req, res, next) => {
		try {
			const { email, name, password, confirmPassword } = req.body;

			// 입력란 중 빈 곳이 있는 경우
			if (!email || !name || !password || !confirmPassword) {
				throw new Error("EmptyValue");
			}

			// 비밀번호 조건을 만족하지 않는 경우
			if (password.length < 6 || password !== confirmPassword) {
				throw new Error("PasswordConditionNotSatisfy");
			}

			// 서비스 계층에 구현된 signUp 로직을 실행
			const user = await this.authService.signUp(email, password, name);

			res.status(201).json({
				success: true,
				message: "회원가입 되신 것을 축하드립니다!",
				data: { email: user.email, name: user.name },
			});
		} catch (err) {
			next(err);
		}
	};

	// 로그인
	logIn = async (req, res, next) => {
		try {
			const { email, password } = req.body;

			// 입력란 중 빈 곳이 있는 경우
			if (!email || !password) {
				throw new Error("EmptyValue");
			}

			// 서비스 계층에 구현된 logIn 로직을 실행
			const logInUser = await this.authService.logIn(email, password);
			const accessToken = logInUser.accessToken;
			return res.status(200).json({
				success: true,
				message: "로그인 되었습니다.",
				data: { token: `Bearer ${accessToken}` },
			});
		} catch (err) {
			next(err);
		}
	};
}
