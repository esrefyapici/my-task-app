import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 h-20 pl-10 text-2xl font-extrabold text-[#5fe766] flex items-center">
      <Link to="/" className="cursor-pointer">
        TASK-APP
      </Link>
    </nav>
  );
};

export default Navbar;
