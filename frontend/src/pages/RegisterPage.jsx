import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await register(values);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
        <p className="mt-2 text-sm text-slate-600">Register to book your next dining experience.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input {...registerField('name', { required: 'Name is required' })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input {...registerField('email', { required: 'Email is required' })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" {...registerField('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <button className="w-full rounded-full bg-primary px-4 py-3 font-medium text-white">Register</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-medium text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
