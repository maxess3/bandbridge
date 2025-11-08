import "dotenv/config";
import "express-async-errors"; // Must be imported before express to automatically wrap routes
import { env } from "./config/env.config";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

/**
 * Express application entry point.
 * Configures middleware, routes, and error handling.
 */
const port = env.PORT;
const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Route files
app.use(routes);

// Handle routes not found (404)
app.use(notFoundHandler);

// Global error middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
