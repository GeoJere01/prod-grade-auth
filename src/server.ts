import connectToDB from "./config/db";
import dotenv from "dotenv";
import http from "http";
import app from "./app";

dotenv.config({ debug: true });

async function startServer() {
  await connectToDB();

  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.log(`Server started listening on port ${process.env.PORT}`);
  });
}

startServer().catch((error) => {
  console.log("Failed to start server", error);
  process.exit(1);
});
