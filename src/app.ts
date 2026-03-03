import express from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth.route";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "Ok" });
});

app.use("/api/auth", AuthRouter);

export default app;
