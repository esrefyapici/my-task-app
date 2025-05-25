import express from "express";

import { employeeRegisterController } from "../controllers/employeeControllers.js";
import { employeeLoginController } from "../controllers/employeeControllers.js";
import { employeeLogoutController } from "../controllers/employeeControllers.js";
import { employeeTasksController } from "../controllers/employeeControllers.js";
import { markTaskCompletedController } from "../controllers/employeeControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.post("/register", employeeRegisterController);
router.post("/login", employeeLoginController);
router.post("/logout", authenticate, employeeLogoutController);

router.get(
  "/tasks",
  authenticate,
  authorizeRole("Employee"),
  employeeTasksController
);
router.put(
  "/tasks/:id/status",
  authenticate,
  authorizeRole("Employee"),
  markTaskCompletedController
);

export default router;
