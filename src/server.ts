/* eslint-disable no-console */
import { Server } from "http";
import { connectDB } from "./app/config/db";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";


let server: Server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    })
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

(async () => {
  await connectRedis();
  await startServer();
})();


process.on("unhandledRejection", (error) => {
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  if (server) {
    server.close();
  }
})