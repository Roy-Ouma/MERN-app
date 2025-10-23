import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dbConnection from "./dbConfig.js";
import router from "./routes/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

app.use(helmet());
app.use(cors()); // DEV: allow all origins. Replace with strict config in production.
// app.options('*', cors()); // removed — cors() handles preflights
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// mount API routes under /api
app.use("/api", router);

app.get("/", (req, res) => res.send("Server running"));

// error middleware must be registered after routes
app.use(errorMiddleware);

dbConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err.message || err);
    process.exit(1);
  });



