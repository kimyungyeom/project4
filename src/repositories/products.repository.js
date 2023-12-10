export class ProductsRepository {
	// 생성자 주입
	constructor(prisma) {
		this.prisma = prisma;
	}

	createProduct = async (userId, productName, content, name) => {
		const createdProduct = await this.prisma.products.create({
			data: {
				userId,
				productName,
				content,
				name,
			},
		});

		return createdProduct;
	};

	findAllProducts = async () => {
		const products = await this.prisma.products.findMany({
			select: {
				id: true,
				productName: true,
				content: true,
				status: true,
				userId: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return products;
	};

	findProductById = async (productId) => {
		const product = await this.prisma.products.findUnique({
			where: { id: +productId },
			select: {
				id: true,
				productName: true,
				content: true,
				status: true,
				userId: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return product;
	};

	updateProduct = async (productId, productName, content, status) => {
		const updatedProduct = await this.prisma.products.update({
			where: { id: +productId },
			data: { productName, content, status },
		});

		return updatedProduct;
	};

	deleteProduct = async (productId) => {
		const deletedProduct = await this.prisma.products.delete({
			where: { id: +productId },
		});

		return deletedProduct;
	};
}
