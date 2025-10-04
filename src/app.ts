import express from "express";
import routes from "./routes";
import cors from "cors";
import passport from "passport";
import "./config/passport";
import { errorHandler } from "./middlewares/error.middleware";
import { fixImageUrl } from "./middlewares/fixImageUrl";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(fixImageUrl);

// API routes
app.use("/api", routes);

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;
