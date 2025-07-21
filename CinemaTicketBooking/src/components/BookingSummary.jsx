import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PRICES = {
  adult: 2500,
  student: 2000,
  senior: 1800,
};

const TICKET_TYPE_MAP = {
  adult: "normal",
  student: "student",
  senior: "senior"
};

export default function BookingSummary({ movie, day, screening, ticketCounts, selectedSeats, onConfirm, setRefreshMovies }) {
  const total =
    ticketCounts.adult * PRICES.adult +
    ticketCounts.student * PRICES.student +
    ticketCounts.senior * PRICES.senior;

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    const body = {
      screening_id: screening.id,
      seats: selectedSeats.map(seat => ({
        row: seat.row,
        number: seat.seat
      })),
      ticket_types: Object.entries(ticketCounts)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          type: TICKET_TYPE_MAP[type],
          quantity: count
        }))
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Foglalás sikeres!");
        if (typeof setRefreshMovies === "function") {
          setRefreshMovies(prev => !prev);
        }
        onConfirm();
        navigate("/");
      } else {
        console.error("Foglalás hiba:", data);
        alert("Foglalás sikertelen: " + (data.message || "Ismeretlen hiba"));
      }
    } catch (err) {
      console.error("Foglalás közbeni hiba:", err);
      alert("Szerverhiba a foglalás közben.");
    }
  };


  return (
    <div className="bg-white p-4 rounded shadow-md max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Foglalás összesítő</h2>

      <div className="mb-2">
        <strong>Film:</strong> {movie.title}
      </div>
      <div className="mb-2">
        <strong>Nap:</strong> {day} | <strong>Időpont:</strong> {screening.start_time}
      </div>

      <div className="mb-2">
        <strong>Jegyek:</strong>
        <ul className="list-disc list-inside">
          {Object.entries(ticketCounts).map(([type, count]) =>
            count > 0 ? (
              <li key={type}>
                {type} × {count} db – {count * PRICES[type]} Ft
              </li>
            ) : null
          )}
        </ul>
      </div>

      <div className="mb-2">
        <strong>Helyek:</strong> {selectedSeats.map(s => `(${s.row}. sor - ${s.seat}. szék)`).join(", ")}
      </div>

      <div className="font-semibold text-lg mt-4">Végösszeg: {total} Ft</div>

      {message && <div className="mt-2 text-sm text-blue-600">{message}</div>}

      <button
        disabled={loading}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleConfirm}
      >
        {loading ? "Feldolgozás..." : "Foglalás véglegesítése"}
      </button>
    </div>
  );
}
