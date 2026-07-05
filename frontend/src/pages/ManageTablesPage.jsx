import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const ManageTablesPage = () => {
  const [tables, setTables] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    const { data } = await api.get('/tables');
    setTables(data.tables || []);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    try {
      await api.post('/tables', values);
      toast.success('Table created');
      reset();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create table');
    }
  };

  const deleteTable = async (id) => {
    try {
      await api.delete(`/tables/${id}`);
      toast.success('Table deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete table');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Create table</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Table Number</label>
            <input type="number" {...register('tableNumber', { required: true })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Capacity</label>
            <input type="number" {...register('capacity', { required: true, min: 1 })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Active</label>
            <input type="checkbox" {...register('isActive')} defaultChecked />
          </div>
          <button className="w-full rounded-full bg-primary px-4 py-3 font-medium text-white">Save table</button>
        </form>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Existing tables</h2>
        <div className="mt-4 space-y-3">
          {tables.map((table) => (
            <div key={table._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-medium">Table {table.tableNumber}</p>
                <p className="text-sm text-slate-600">Capacity {table.capacity}</p>
              </div>
              <button onClick={() => deleteTable(table._id)} className="rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTablesPage;
