export default function Dashboard() {
  return (
    <div className="flex justify-center min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="font-semibold">Total Users</h2>
            <p className="text-2xl">1,234</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="font-semibold">Active Sessions</h2>
            <p className="text-2xl">89</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h2 className="font-semibold">Total Events</h2>
            <p className="text-2xl">456</p>
          </div>
        </div>
      </div>
    </div>
  )
}