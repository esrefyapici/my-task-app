import React, { useState, useEffect } from "react";
import Logout from "../components/Logout";
import api from "../axios";
import toast from "react-hot-toast";

function EmployerDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [detail, setDetail] = useState([]);
  const fetchEmployees = async () => {
    try {
      const res = await api.get(
        "/employer/employees",
        { withCredentials: true }
      );
      setEmployees(res.data.employees || res.data);
      toast.success("MY EMPLOYEES are loaded");
    } catch (error) {
      console.error(error);
      toast.error("MY EMPLOYEES could not be loaded");
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  const detailEmployee = async (employeeId) => {
    try {
      const res = await api.get(
        `/employer/employees/${employeeId}`,
        { withCredentials: true }
      );
      if (res.data.tasks && Array.isArray(res.data.tasks)) {
        setDetail(res.data.tasks);
        toast.success("Employee details uploaded");
      } else {
        setDetail([]);
        toast("Employee details not found");
      }
      setSelectedEmployeeId(employeeId);
    } catch (error) {
      console.error(error);
      toast.error("Employee detail could not be loaded");
      setDetail([]);
    }
  };
  const deleteTask = async (taskId) => {
    try {
      const res = await api.delete(
        `/employer/tasks/${taskId}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      if (selectedEmployeeId) detailEmployee(selectedEmployeeId);
    } catch (error) {
      console.error(error);
      toast.error("Task could not be deleted");
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignedTo) {
      toast.error("Please select an employee to assign a task.");
      return;
    }
    try {
      const res = await api.post(
        "/employer/tasks",
        formData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setFormData({ title: "", description: "", assignedTo: "" });
      if (formData.assignedTo) detailEmployee(formData.assignedTo);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen mb-20 bg-gray-950 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Logout />
      </div>
      <div className="flex gap-30">
        <div>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Employees</h2>
            {employees.length === 0 ? (
              <p>Employees is not found</p>
            ) : (
              <ul className="space-y-2 max-w-md">
                {employees.map((emp) => (
                  <li
                    key={emp._id}
                    className="bg-gray-800 p-3 rounded shadow flex justify-between cursor-pointer hover:bg-gray-700"
                    onClick={() => detailEmployee(emp._id)}
                  >
                    <span>{emp.email}</span>
                    <span className="italic text-sm">{emp.companyCode}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Assign Task</h2>
            <form
              onSubmit={handleSubmit}
              className="max-w-md bg-gray-800 p-6 rounded shadow space-y-4"
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full resize-none p-3 rounded bg-gray-700 border border-gray-600"
                rows={4}
                required
              />
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600"
                required
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-600 p-3 rounded font-bold"
              >
                ASSIGN
              </button>
            </form>
          </section>
        </div>
        <div
          className="min-w-xl bg-gray-800 p-6 rounded shadow overflow-y-auto"
          style={{ maxHeight: "500px" }}
        >
          <h2 className="text-2xl font-semibold mb-4">Employee Details</h2>
          {detail.length === 0 ? (
            <p>Click on an employee to see details...</p>
          ) : (
            <ul className="space-y-3">
              {detail.map((task) => (
                <li
                  key={task._id}
                  className="bg-gray-700 flex justify-between p-4 rounded"
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold">
                      {task.title || "Başlık yok"}
                    </h3>
                    <p>{task.description || "Açıklama yok"}</p>
                  </div>
                  <div className="items-end">
                    <p className="italic text-sm text-gray-400">
                      Status: {task.status || "Bilinmiyor"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
