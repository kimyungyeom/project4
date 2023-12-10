export class UsersService {
	// 생성자 주입
	constructor(usersRepository) {
		this.usersRepository = usersRepository;
	}

	findUserById = async (id) => {
		const user = await this.usersRepository.findUserById(id);

		return user;
	};
}
