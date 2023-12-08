// import
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

// express 함수 호출 및 객체 생성
const app = express();

// port
const port = process.env.SERVER_PORT;

// import router
import authRouter from "./routes/auth.router.js";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";

// global variables
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// router middleware
app.use("/api/auth", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/products", productsRouter);

// 서버 구동
app.listen(port, () => {
	console.log("서버 구동을 시작합니다.");
});
