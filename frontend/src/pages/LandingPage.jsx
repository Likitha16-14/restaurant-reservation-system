import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-primary">Reservation management made simple</span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Reserve tables with confidence and speed.</h1>
            <p className="max-w-xl text-lg text-slate-600">Manage bookings, optimize table allocation, and keep your restaurant running smoothly from one polished dashboard.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="rounded-full bg-primary px-6 py-3 font-medium text-white">Create account</Link>
              <Link to="/login" className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700">Sign in</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-lg">
            <h2 className="text-2xl font-semibold">Today&apos;s overview</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/20 p-4">
                <p className="text-sm text-blue-100">Available tables</p>
                <p className="mt-2 text-3xl font-semibold">15</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-4">
                <p className="text-sm text-blue-100">Booked today</p>
                <p className="mt-2 text-3xl font-semibold">8</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
