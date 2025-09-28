import express from "express";
import routes from "./routes";
import cors from "cors";
import passport from "passport";
import "./config/passport";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// API routes
app.use("/api", routes);

export default app;
