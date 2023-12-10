export default function (err, req, res, next) {
	switch (err.message) {
		case "EmptyValue":
			return res.status(400).send({
				success: false,
				errorMessage: "입력란 중 비어있는 곳이 있습니다.",
			});
		case "PasswordConditionNotSatisfy":
			return res.status(401).send({
				success: false,
				errorMessage: "비밀번호 최소 6자 이상이어야 하며, 비밀번호가 서로 일치해야 합니다.",
			});
		case "NotValidEmail":
			return res.status(400).send({
				success: false,
				errorMessage: "올바른 이메일 형식이 아닙니다.",
			});
		case "AlreadyUseEmail":
			return res.status(409).send({
				success: false,
				errorMessage: "해당 이메일 이미 사용중입니다.",
			});
		case "NotExistUserByEmail":
			return res.status(404).send({
				success: false,
				errorMessage: "해당 이메일을 가진 유저가 존재하지 않습니다.",
			});
		case "NotMatchPassword":
			return res.status(401).send({
				success: false,
				errorMessage: "인증에 실패하였습니다.",
			});
		default:
			console.error(err);
			res.status(500).json({ errorMessage: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해주세요." });
	}
}
