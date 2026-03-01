import "dotenv/config.js";
import express from "express";
import cors from "cors";

import generalRoutes from "./routes/generalRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import { HOST, PORT } from "./constants.mjs";

const app = express();
const hostname = HOST;
const port = PORT;

// Middleware for sending cross-origin resource sharing HTTP header, in order for client to access API responses
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "Server is working properly" });
});

app.use("/", generalRoutes);
app.use("/user", userRoutes);

const server = app.listen(port, hostname, () => {
  console.log(`Listening on ${hostname}:${port}`);
});

export default server;
