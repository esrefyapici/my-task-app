import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Employee from "../models/Employee.js";
import Task from "../models/Task.js";

export const employeeRegisterController = async (req, res) => {
  try {
    const { email, password, companyCode } = req.body;
    if (!email || !password || !companyCode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({
      email,
      password: hashedPassword,
      companyCode,
    });
    await newEmployee.save();
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const employeeLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        userId: employee._id,
        role: "Employee",
        companyCode: employee.companyCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const employeeLogoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed" });
  }
};
export const employeeTasksController = async (req, res) => {
  try {
    const { userId, companyCode } = req.user;
    const tasks = await Task.find({ assignedTo: userId, companyCode });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
export const markTaskCompletedController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, companyCode } = req.user;
    const task = await Task.findOneAndUpdate(
      { _id: id, assignedTo: userId, companyCode },
      { status: "completed", completedAt: new Date() },
      { new: true }
    );
    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task status" });
  }
};
