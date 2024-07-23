import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import AdminSidebar from "../components/admin/Sidebar_Admin";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(email, password);
    if (success) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />
      <div className="flex-grow flex flex-col justify-center">
        <form
          className="signup max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
          onSubmit={handleSubmit}
        >
          <h3 className="text-2xl font-semibold mb-4 text-center">Sign Up</h3>

          <label className="block text-gray-700 mb-2">Email address:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <label className="block text-gray-700 mb-2">Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            disabled={isLoading}
            className={`w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            Register Employee
          </button>

          {error && (
            <div className="error mt-4 p-2 bg-red-100 text-red-700 border border-red-700 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
