export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl mx-auto mb-8 bg-white">
          <img
            src="/logo.jpg"
            alt="HB Sallery Box"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          HB Sallery Box
        </h1>
        <p className="text-gray-600 text-lg">
          Secure Staff Management
        </p>
        <p className="text-emerald-600 mt-4">
          Loading...
        </p>
      </div>
    </div>
  );
}
