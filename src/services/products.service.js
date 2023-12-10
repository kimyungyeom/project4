export class ProductsService {
	// 생성자 주입
	constructor(productsRepository) {
		this.productsRepository = productsRepository;
	}

	createProduct = async (userId, productName, content, name) => {
		const createdProduct = await this.productsRepository.createProduct(userId, productName, content, name);

		return createdProduct;
	};

	findAllProducts = async () => {
		const products = await this.productsRepository.findAllProducts();

		return products;
	};

	findProductById = async (productId) => {
		const product = await this.productsRepository.findProductById(productId);

		// 일치하는 상품이 없는 경우
		if (!product) {
			throw new Error("NotFindProduct");
		}

		return product;
	};

	updateProduct = async (productId, userId, productName, content, status) => {
		// 수정 정보가 하나도 없는 경우
		if (!productName && !content && !status) {
			throw new Error("NotCorrectInfo");
		}

		// 지원하지 않은 상태 값 입력된 경우
		const isValidStatus = status ? status === "FOR_SALE" || status === "SOLD_OUT" : true;
		if (!isValidStatus) {
			throw new Error("UnSupportValue");
		}

		const product = await this.productsRepository.findProductById(productId);
		// 일치하는 상품이 없는 경우
		if (!product) {
			throw new Error("NotFindProduct");
		}

		const isSameId = product.userId === userId;
		// 작성자 ID와 인증 정보의 사용자 ID가 다른 경우
		if (!isSameId) {
			throw new Error("NotSameId");
		}

		const updatedProduct = await this.productsRepository.updateProduct(productId, productName, content, status);

		return updatedProduct;
	};

	deleteProduct = async (productId, userId) => {
		const product = await this.productsRepository.findProductById(productId);
		// 일치하는 상품이 없는 경우
		if (!product) {
			throw new Error("NotFindProduct");
		}

		const isSameId = product.userId === userId;
		// 작성자 ID와 인증 정보의 사용자 ID가 다른 경우
		if (!isSameId) {
			throw new Error("NotSameId");
		}

		const deletedProduct = await this.productsRepository.deleteProduct(productId);

		return deletedProduct;
	};
}
