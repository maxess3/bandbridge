import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Routes files
import routes from "./routes/index";
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
