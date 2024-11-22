import "dotenv/config";
import express from "express";

const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes files
import routes from "./routes/index.js";
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
