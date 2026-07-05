const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-slate-900">404</h1>
        <p className="mt-3 text-slate-600">The page you are looking for doesn’t exist.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
