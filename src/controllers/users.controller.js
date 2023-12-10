export class UsersController {
	// 생성자 주입
	constructor(usersService) {
		this.usersService = usersService;
	}

	// 내 정보 조회
	getMyInfo = async (req, res, next) => {
		try {
			const { id } = res.locals.user;

			// 서비스 계층에 구현된 getMyInfo 로직을 실행
			const user = await this.usersService.findUserById(id);

			return res.status(200).json({
				success: true,
				message: "내 정보 조회가 완료되었습니다.",
				user,
			});
		} catch (err) {
			next(err);
		}
	};
}
