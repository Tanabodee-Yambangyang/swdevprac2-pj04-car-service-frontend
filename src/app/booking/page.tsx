export default function BookingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Booking Page</h1>
      <p className="text-lg text-gray-700">
        This is the booking page. Only authenticated users can access this page.
      </p>
    </div>
  );
}