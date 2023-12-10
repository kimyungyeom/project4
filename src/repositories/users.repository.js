export class UsersRepository {
	// 생성자 주입
	constructor(prisma) {
		this.prisma = prisma;
	}

	findUserById = async (id) => {
		const user = await this.prisma.users.findUnique({
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

		return user;
	};
}
