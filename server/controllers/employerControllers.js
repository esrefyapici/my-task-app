import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Employer from "../models/Employer.js";
import Employee from "../models/Employee.js";
import Task from "../models/Task.js";

export const employerRegisterController = async (req, res) => {
  try {
    const { email, password, companyCode } = req.body;
    if (!email || !password || !companyCode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await Employer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployer = new Employer({
      email,
      password: hashedPassword,
      companyCode,
    });
    await newEmployer.save();
    res.status(201).json({ message: "Employer registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const employerLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        userId: employer._id,
        role: "Employer",
        companyCode: employer.companyCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
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
export const employerLogoutController = async (req, res) => {
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
export const employerEmployeesListController = async (req, res) => {
  try {
    const { companyCode } = req.user;
    const employees = await Employee.find({ companyCode }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};
export const employerEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyCode } = req.user;
    const employee = await Employee.findOne({ _id: id, companyCode }).select(
      "-password"
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    const tasks = await Task.find({ assignedTo: id, companyCode });
    res.status(200).json({ employee, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee details" });
  }
};
export const createTaskController = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const { userId, companyCode } = req.user;
    const employee = await Employee.findOne({ _id: assignedTo, companyCode });
    if (!employee) {
      return res
        .status(400)
        .json({ message: "Invalid employee or mismatched company" });
    }
    const newTask = new Task({
      title,
      description,
      assignedTo,
      assignedBy: userId,
      companyCode,
    });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};
export const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const { companyCode } = req.user;
    const task = await Task.findOneAndUpdate(
      { _id: id, companyCode },
      { title, description },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task" });
  }
};
export const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyCode } = req.user;
    const deleted = await Task.findOneAndDelete({ _id: id, companyCode });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
