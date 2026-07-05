import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/reservations/my');
        setReservations(data.reservations || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="rounded-2xl bg-white p-8 text-slate-600 shadow-sm">Loading your reservations...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-2xl font-semibold text-slate-900">{user?.name}</h1>
          </div>
          <Link to="/book" className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white">Quick book</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Upcoming reservations</h2>
          {reservations.filter((r) => r.status === 'Booked').length ? (
            <ul className="mt-4 space-y-3">
              {reservations.filter((r) => r.status === 'Booked').slice(0, 3).map((reservation) => (
                <li key={reservation._id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-medium">Table {reservation.table?.tableNumber}</p>
                  <p className="text-sm text-slate-600">{reservation.reservationDate} · {reservation.startTime} - {reservation.endTime}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No upcoming reservations.</p>
          )}
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Reservation history</h2>
          {reservations.length ? (
            <ul className="mt-4 space-y-3">
              {reservations.slice(0, 4).map((reservation) => (
                <li key={reservation._id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{reservation.reservationDate}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{reservation.status}</span>
                  </div>
                  <p className="text-sm text-slate-600">Table {reservation.table?.tableNumber} · {reservation.guests} guests</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No reservations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
