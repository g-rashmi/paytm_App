import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Project Paytm App</h1>
      <div className="space-x-4">
        <Link to="/signup">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Sign Up
          </button>
        </Link>
        <Link to="/signin">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};
