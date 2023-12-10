export class ProductsController {
	// 생성자 주입
	constructor(productsService) {
		this.productsService = productsService;
	}

	// 상품 생성
	createProduct = async (req, res, next) => {
		try {
			const { id: userId, name } = res.locals.user;
			const { productName, content } = req.body;

			// 서비스 계층에 구현된 createProduct 로직을 실행
			const createdProduct = await this.productsService.createProduct(userId, productName, content, name);

			return res.status(201).json({
				success: true,
				message: "상품 생성이 완료되었습니다.",
				createdProduct,
			});
		} catch (err) {
			next(err);
		}
	};

	// 상품 목록 조회
	getProducts = async (req, res, next) => {
		try {
			// 서비스 계층에 구현된 findAllProducts 로직을 실행
			const products = await this.productsService.findAllProducts();

			return res.status(200).json({
				success: true,
				message: "상품 조회가 완료되었습니다.",
				data: products,
			});
		} catch (err) {
			next(err);
		}
	};

	// 상품 상세 조회
	getProductById = async (req, res, next) => {
		try {
			const { productId } = req.params;

			// 서비스 계층에 구현된 findProductById 로직을 실행
			const product = await this.productsService.findProductById(productId);

			return res.status(200).json({
				success: true,
				message: "상품 상세 조회가 완료되었습니다.",
				data: product,
			});
		} catch (err) {
			next(err);
		}
	};

	// 상품 수정
	updateProduct = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const { id: userId } = res.locals.user;
			const { productName, content, status } = req.body;

			// 서비스 계층에 구현된 updateProduct 로직을 실행
			const updatedProduct = await this.productsService.updateProduct(productId, userId, productName, content, status);

			return res.status(200).json({
				success: true,
				message: "상품 수정이 완료되었습니다.",
				data: updatedProduct,
			});
		} catch (err) {
			next(err);
		}
	};

	// 상품 삭제
	deleteProduct = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const { id: userId } = res.locals.user;

			// 서비스 계층에 구현된 deleteProduct 로직을 실행
			const deletedProduct = await this.productsService.deleteProduct(productId, userId);

			return res.status(200).json({
				success: true,
				message: "상품 삭제가 완료되었습니다.",
				data: deletedProduct,
			});
		} catch (err) {
			next(err);
		}
	};
}
