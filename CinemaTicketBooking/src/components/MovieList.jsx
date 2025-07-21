import MovieCard from "./MovieCard";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MovieList({ movies, selectedDay, onSelectDay, onSelectMovie, setMovies, fetchMovies, currentWeek, onChangeWeek }) {
  const filteredMovies = Array.isArray(movies)
    ? movies.filter(movie =>
      movie.screenings.some(screening => screening.weekday === selectedDay && screening.week_number === currentWeek)
    )
    : [];

  const handleDelete = (id) => {
    const updated = movies.filter(movie => movie.id !== id);
    setMovies(updated);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {weekdays.map(day => (
          <button
            key={day}
            className={`px-3 py-1 rounded ${selectedDay === day ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => onSelectDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onChangeWeek(currentWeek - 1)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Előző hét
        </button>
        <div className="text-lg font-semibold">Moziműsor – {currentWeek}. hét</div>
        <button
          onClick={() => onChangeWeek(currentWeek + 1)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Következő hét
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMovies.length === 0 ? (
          <p className="text-center col-span-full text-gray-600 italic">
            Nincs elérhető vetítés ezen a napon.
          </p>
        ) : (
          filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              selectedDay={selectedDay}
              onSelect={screening => onSelectMovie(movie, screening)}
              onDelete={handleDelete}
              fetchMovies={fetchMovies}
              currentWeek={currentWeek}
            />
          ))
        )}
      </div>
    </div>
  );
}
