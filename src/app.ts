import express from "express";
import corse from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import expressSession from "express-session";

import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";
import "./app/config/passport";

const app = express();

// middleware
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  corse({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://assignment-6-snowy-nine.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// routes
app.use("/api/v1", router);

// health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Parcel Delevery System api is working.",
  });
});

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFound);

export default app;
