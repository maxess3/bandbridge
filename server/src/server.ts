import "dotenv/config";
import "express-async-errors"; // Doit être importé avant express pour wrapper automatiquement les routes
import { env } from "./config/env.config";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

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

// Routes files
app.use(routes);

// Gérer les routes non trouvées (404)
app.use(notFoundHandler);

// Middleware d'erreurs global (doit être en dernier)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
