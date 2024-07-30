import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleForgotPassword = () => {
    window.location.href = '/request-password-reset';
  };

  return (
    <form className="login max-w-md mx-auto mt-10 p-6 bg-white rounded-lg" onSubmit={handleSubmit}>
      <h3 className="text-2xl font-semibold mb-4 text-center">Log In</h3>
      
      <label className="block text-gray-700 mb-2">Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      
      <label className="block text-gray-700 mb-2">Password:</label>
      <div className="relative w-full mb-4">
        <input 
          type={showPassword ? "text" : "password"} 
          onChange={(e) => setPassword(e.target.value)} 
          value={password}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} 
          className="absolute right-2 top-2 text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      
      <button 
        disabled={isLoading}
        className={`w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
      >
        Log in
      </button>
      
      <button
        type="button"
        onClick={handleForgotPassword}
        className="w-full p-2 mt-4 text-green-500 text-center underline hover:text-green-700 transition duration-300"
      >
        Forgot Password?
      </button>
      
      {error && <div className="error mt-4 p-2 bg-red-100 text-red-700 border border-red-700 rounded-md">{error}</div>}
    </form>
  );
};

export default Login;
