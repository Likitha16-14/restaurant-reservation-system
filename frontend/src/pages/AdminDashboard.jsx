import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="rounded-2xl bg-white p-8 text-slate-600 shadow-sm">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total Customers', value: stats?.stats?.totalCustomers },
          { label: 'Total Reservations', value: stats?.stats?.totalReservations },
          { label: 'Today Reservations', value: stats?.stats?.todayReservations },
          { label: 'Cancelled Reservations', value: stats?.stats?.cancelledReservations },
          { label: 'Available Tables', value: stats?.stats?.availableTables },
          { label: 'Booked Tables', value: stats?.stats?.bookedTables },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold">Recent reservations</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-3">Customer</th>
                <th className="py-3">Table</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentReservations?.map((reservation) => (
                <tr key={reservation._id} className="border-b border-slate-100">
                  <td className="py-3">{reservation.customer?.name}</td>
                  <td className="py-3">{reservation.table?.tableNumber}</td>
                  <td className="py-3">{reservation.reservationDate}</td>
                  <td className="py-3">{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
