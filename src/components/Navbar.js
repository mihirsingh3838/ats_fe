import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container max-w-[1400px] mx-auto p-4 flex flex-col md:flex-row items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold mb-2 md:mb-0 flex items-center">
          <img
            src="./bluetown_logo.svg"
            alt="BlueTown Logo"
            className="h-12 w-12 mr-2 ml-4"
          />
          <h1>BlueTown</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          {user && (
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4">
              <span className="text-white mb-2 md:mb-0">{user.email}</span>
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="text-white">
                  {/* Admin Dashboard */}
                </Link>
              )}
              <button
                onClick={handleClick}
                className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition duration-300"
              >
                Log out
              </button>
            </div>
          )}
          {!user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition duration-300"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
