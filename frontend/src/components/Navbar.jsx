import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold text-primary">Restaurant Reserve</Link>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700">Login</Link>
              <Link to="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">Register</Link>
            </>
          ) : (
            <>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="text-sm font-medium text-slate-700">Dashboard</Link>
              <button onClick={handleLogout} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
