import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed!");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.error(error);
    exitHandler();
  });
  process.on("unhandledRejection", (error) => {
    console.error(error);
    exitHandler();
  });
}

main();
