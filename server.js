// import { Sequelize } from "sequelize";

import  express from "express";
import cors from "./config/cors.js";

const app = express();
app.use(express.json());
app.use(cors)
const PORT = 3000;

// ====== List Cryptos Route =========

import { ListCyrptoRoutes } from "./routes/ListcryptoRoute.js";
app.use("/list-crypto", ListCyrptoRoutes);
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
  });