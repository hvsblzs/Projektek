import { Trash2, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, selectedDay, onSelect, fetchMovies, currentWeek }) {
  const screenings = movie.screenings.filter(s => s.weekday === selectedDay && s.week_number === currentWeek);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (!user) {
      alert("Kérjük, jelentkezz be vagy regisztrálj a foglaláshoz!");
      navigate("/login");
    } else {
      onSelect(movie);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Biztosan törölni szeretnéd a(z) "${movie.title}" filmet?`)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movie.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchMovies();
      } else {
        console.error("Sikertelen törlés");
      }
    } catch (err) {
      console.error("Hiba történt törlés közben:", err);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <img
        src={movie.image_path}
        alt={movie.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
      <p className="text-gray-600">{movie.genre} • {movie.duration} min</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {screenings.map(screening => (
          <span key={screening.id} className="bg-gray-100 px-2 py-1 text-sm rounded">
            {screening.start_time}
          </span>
        ))}
      </div>

      {screenings.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          onClick={handleDetailsClick}
        >
          Részletek
        </button>
      )}
      {user?.role === 'admin' && (
        <div className="mt-4 flex gap-2">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={handleDelete}
            title='Törlés'
          >
            <Trash2 />
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
            onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
            title="Szerkesztés"
          >
            <Pencil />
          </button>
        </div>
      )}
    </div>
  );
}
