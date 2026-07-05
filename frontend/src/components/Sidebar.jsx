import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return (
      <aside className="w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Admin</h2>
        <div className="space-y-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/reservations" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
            Manage Reservations
          </NavLink>
          <NavLink to="/admin/tables" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
            Manage Tables
          </NavLink>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Customer</h2>
      <div className="space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
          Dashboard
        </NavLink>
        <NavLink to="/book" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
          Book Reservation
        </NavLink>
        <NavLink to="/my-reservations" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
          My Reservations
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
