import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-white flex justify-center items-center h-162">
      <div className="p-10 px-30 h-90 space-y-40">
        <div>
          <h1 className="text-4xl">WELCOME TO TASK APP</h1>
        </div>
        <div className="flex justify-evenly">
          <Link to="/register">
            <button className="border rounded-4xl p-3 bg-emerald-800 cursor-pointer">
              REGISTER
            </button>
          </Link>
          <Link to="/login">
            <button className="border rounded-4xl p-3 bg-emerald-800 cursor-pointer">
              LOGIN
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
