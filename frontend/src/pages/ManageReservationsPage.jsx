import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ManageReservationsPage = () => {
  const [reservations, setReservations] = useState([]);

  const load = async () => {
    const { data } = await api.get('/admin/reservations');
    setReservations(data.reservations || []);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/reservations/${id}`, { status });
      toast.success('Reservation updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const deleteReservation = async (id) => {
    try {
      await api.delete(`/admin/reservations/${id}`);
      toast.success('Reservation removed');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold text-slate-900">Manage reservations</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-3">Customer</th>
              <th className="py-3">Table</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id} className="border-b border-slate-100">
                <td className="py-3">{reservation.customer?.name}</td>
                <td className="py-3">{reservation.table?.tableNumber}</td>
                <td className="py-3">{reservation.reservationDate}</td>
                <td className="py-3">{reservation.status}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateStatus(reservation._id, 'Completed')} className="rounded-full bg-primary px-3 py-2 text-white">Complete</button>
                    <button onClick={() => updateStatus(reservation._id, 'Cancelled')} className="rounded-full border border-slate-300 px-3 py-2">Cancel</button>
                    <button onClick={() => deleteReservation(reservation._id)} className="rounded-full border border-red-200 px-3 py-2 text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReservationsPage;
