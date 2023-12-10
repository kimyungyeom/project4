export class AuthRepository {
	// 생성자 주입
	constructor(prisma) {
		this.prisma = prisma;
	}

	findAllUsersByEmail = async (email) => {
		const user = await this.prisma.users.findUnique({
			where: { email },
		});

		return user;
	};

	signUp = async (email, name, hashedPassword) => {
		const newUser = await this.prisma.users.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		});

		return newUser;
	};

	findOneUserByEmail = async (email) => {
		const user = await this.prisma.users.findUnique({
			where: {
				email,
			},
		});

		return user;
	};
}
