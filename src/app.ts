import express from "express";
import routes from "./routes";
import cors from "cors";
import passport from "passport";
import "./config/passport";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://porfolio-frontend-cw8s.vercel.app" //Live site
  
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// API routes
app.use("/api", routes);

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;
