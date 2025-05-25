import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="bg-gradient-to-b from-black via-[#043419] to-[#01220f] min-h-screen">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
