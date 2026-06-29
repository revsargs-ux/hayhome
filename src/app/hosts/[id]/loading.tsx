export default function HostDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gallery skeleton */}
          <div className="lg:col-span-2 h-80 bg-gray-200 rounded-2xl animate-pulse" />
          {/* Booking card skeleton */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
