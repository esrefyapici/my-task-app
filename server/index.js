import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectdb from "./config/connect.js";
import employerRoutes from "./routes/employerRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();
const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use("/api/employer", employerRoutes);
app.use("/api/employee", employeeRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT;
connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to DB", error);
  });
