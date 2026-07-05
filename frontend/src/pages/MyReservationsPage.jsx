import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const { data } = await api.get('/reservations/my');
      setReservations(data.reservations || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const cancelReservation = async (id) => {
    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation cancelled');
      loadReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to cancel reservation');
    }
  };

  if (loading) return <div className="rounded-2xl bg-white p-8 text-slate-600 shadow-sm">Loading your reservations...</div>;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold text-slate-900">My reservations</h2>
      <div className="mt-6 space-y-3">
        {reservations.length ? reservations.map((reservation) => (
          <div key={reservation._id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">Table {reservation.table?.tableNumber}</p>
                <p className="text-sm text-slate-600">{reservation.reservationDate} · {reservation.startTime} - {reservation.endTime}</p>
                <p className="text-sm text-slate-600">Guests: {reservation.guests}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{reservation.status}</span>
                {reservation.status === 'Booked' && (
                  <button onClick={() => cancelReservation(reservation._id)} className="rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600">Cancel</button>
                )}
              </div>
            </div>
          </div>
        )) : <p className="text-sm text-slate-500">No reservations found.</p>}
      </div>
    </div>
  );
};

export default MyReservationsPage;
