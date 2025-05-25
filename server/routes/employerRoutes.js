import express from "express";

import { employerRegisterController } from "../controllers/employerControllers.js";
import { employerLoginController } from "../controllers/employerControllers.js";
import { employerLogoutController } from "../controllers/employerControllers.js";
import { employerEmployeesListController } from "../controllers/employerControllers.js";
import { employerEmployeeController } from "../controllers/employerControllers.js";
import { createTaskController } from "../controllers/employerControllers.js";
import { updateTaskController } from "../controllers/employerControllers.js";
import { deleteTaskController } from "../controllers/employerControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.post("/register", employerRegisterController);
router.post("/login", employerLoginController);
router.post("/logout", authenticate, employerLogoutController);

router.get(
  "/employees",
  authenticate,
  authorizeRole("Employer"),
  employerEmployeesListController
);
router.get(
  "/employees/:id",
  authenticate,
  authorizeRole("Employer"),
  employerEmployeeController
);

router.post(
  "/tasks",
  authenticate,
  authorizeRole("Employer"),
  createTaskController
);
router.put(
  "/tasks/:id",
  authenticate,
  authorizeRole("Employer"),
  updateTaskController
);
router.delete(
  "/tasks/:id",
  authenticate,
  authorizeRole("Employer"),
  deleteTaskController
);

export default router;
