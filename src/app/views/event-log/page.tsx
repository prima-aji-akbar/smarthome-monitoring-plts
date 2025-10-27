import TableEvent from "./sections/table-event";

export default function EventLog() {

  return (
    <div className="w-full">
      <div className="bg-[var(--body-background)] min-h-screen lg:px-8">
        <div className="w-full max-w-[100%] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="w-full flex">
            <TableEvent/>
          </div>
        </div>
      </div>
    </div>
  )
}