export default function Logout() {
  const events = [
    { id: 1, type: "Login", user: "John Doe", time: "10:30 AM" },
    { id: 2, type: "Upload", user: "Jane Smith", time: "11:15 AM" },
    { id: 3, type: "Delete", user: "Bob Wilson", time: "12:00 PM" },
    { id: 4, type: "Update", user: "Alice Brown", time: "01:45 PM" },
  ]

  return (
    <div className="w-full">
      <div className="bg-[var(--body-background)] min-h-screen">
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Event Log</h1>
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="p-3">{event.type}</td>
                <td className="p-3">{event.user}</td>
                <td className="p-3">{event.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  )
}