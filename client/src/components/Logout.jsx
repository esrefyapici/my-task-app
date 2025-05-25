import { useNavigate } from "react-router-dom";
import api from "../axios";
import toast from "react-hot-toast";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(
        "/employer/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Could not log out");
    }
  };

  return (
    <div className="-mt-45">
      <button
        onClick={handleLogout}
        className="text-sm text-white font-bold px-4 py-2 rounded hover:bg-emerald-900"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
