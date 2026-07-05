import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const BookReservationPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/tables');
      setTables(data.tables || []);
    };
    load();
  }, []);

  const onSubmit = async (values) => {
    try {
      await api.post('/reservations', values);
      toast.success('Reservation booked successfully');
      navigate('/my-reservations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create reservation');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Book a reservation</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Reservation Date</label>
            <input type="date" {...register('reservationDate', { required: 'Date is required' })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            {errors.reservationDate && <p className="mt-1 text-sm text-red-500">{errors.reservationDate.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Time Slot</label>
            <select {...register('startTime', { required: 'Time is required' })} className="w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="10:00">10:00</option>
              <option value="12:00">12:00</option>
              <option value="14:00">14:00</option>
              <option value="16:00">16:00</option>
              <option value="18:00">18:00</option>
              <option value="20:00">20:00</option>
            </select>
            {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Guests</label>
            <input type="number" min="1" {...register('guests', { required: 'Guests are required', min: 1 })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            {errors.guests && <p className="mt-1 text-sm text-red-500">{errors.guests.message}</p>}
          </div>
          <button className="w-full rounded-full bg-primary px-4 py-3 font-medium text-white">Confirm reservation</button>
        </form>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-semibold">Available tables</h3>
        <div className="mt-4 space-y-3">
          {tables.map((table) => (
            <div key={table._id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium">Table {table.tableNumber}</p>
              <p className="text-sm text-slate-600">Capacity: {table.capacity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookReservationPage;
