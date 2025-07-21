import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export default function MovieDetails({ movie, selectedDay, onSelectScreening, onBack, setRefreshMovies, resetBooking, currentWeek }) {

  const screenings = movie.screenings.filter(s => s.weekday === selectedDay && s.week_number === currentWeek);

  const isFull = (screening) => {
    const totalSeats = screening.room.rows * screening.room.seatsPerRow;
    return screening.bookings.length >= totalSeats;
  };

  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();

  const handleDeleteScreening = async (screeningId) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a vetítést?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/screenings/${screeningId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        if (typeof setRefreshMovies === "function") {
          setRefreshMovies(prev => !prev);
        }
        if (typeof resetBooking === "function") {
          resetBooking();
        }
        navigate("/");
      } else {
        alert("Nem sikerült törölni a vetítést.");
      }
    } catch (err) {
      console.error(err);
      alert("Hiba történt a törlés során.");
    }
  };

  return (
    <div className="bg-white rounded p-4 shadow-md">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">Vissza</button>
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={movie.image_path.startsWith('https') ? movie.image_path : `./src/assets/images/${movie.image_path}`}
          alt={movie.title}
          className="w-full md:w-60 h-auto object-cover rounded"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
          <p className="text-gray-700 mb-2">{movie.description}</p>
          <p className="text-gray-600">{movie.genre} - {movie.duration} min</p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Elérhető vetítések ({selectedDay}):</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {screenings.map(screening => (
                <div
                  key={screening.id}
                  className="flex justify-between items-center gap-2 p-3 border border-gray-200 rounded bg-gray-50 shadow-sm"
                >
                  <button
                    className={`px-3 py-1 rounded text-sm ${isFull(screening)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      }`}
                    onClick={() => !isFull(screening) && onSelectScreening(screening)}
                    disabled={isFull(screening)}
                  >
                    {screening.start_time}
                  </button>

                  {user?.role === "admin" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/screenings/${screening.id}/edit`)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
                        title="Vetítés szerkesztése"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteScreening(screening.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                        title="Vetítés törlése"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}