import React, { useState, useEffect } from "react";
import api from "../axios";
import toast from "react-hot-toast";
import Logout from "../components/Logout";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/tasks", {
        withCredentials: true,
      });
      setTasks(res.data);
      toast.success("Görevler yüklendi");
    } catch (error) {
      console.error(error);
      toast.error("Görevler yüklenemedi");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const markCompleted = async (taskId) => {
    try {
      const res = await api.put(
        `/employee/tasks/${taskId}/status`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Görev tamamlandı");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Görev güncellenemedi");
    }
  };

  return (
    <div className="min-h-screen mb-20 bg-gray-950 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <Logout />
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">MY LIST</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : tasks.length === 0 ? (
          <p>No task has been assigned yet.</p>
        ) : (
          <ul className="space-y-4 max-w-6xl">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="bg-gray-800 p-6 rounded shadow flex flex-col gap-3"
              >
                <h3 className="text-xl font-semibold">
                  {task.title}
                </h3>
                <p>{task.description}</p>
                <p className="italic text-sm text-gray-400">
                  STATUS: {task.status}
                </p>
                {task.status !== "completed" && (
                  <button
                    onClick={() => markCompleted(task._id)}
                    className="self-start bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded font-semibold"
                  >
                    Sign as a Completed
                  </button>
                )}
                {task.status === "completed" && (
                  <p className="text-green-400 font-semibold">
                    Completed ✅
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default EmployeeDashboard;
