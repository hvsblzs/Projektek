import { useState, useEffect } from "react";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import TicketSelector from "./components/TicketSelector";
import SeatSelector from "./components/SeatSelector";
import BookingSummary from "./components/BookingSummary";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MyBookings from './components/MyBookings';
import AddMovie from './components/AddMovie';
import AddScreening from './components/AddScreening';
import EditMovie from './components/EditMovie';
import EditScreening from './components/EditScreening';

export default function App() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [ticketCounts, setTicketCounts] = useState({ adult: 0, student: 0, senior: 0 });
  const [ticketsConfirmed, setTicketsConfirmed] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movies, setMovies] = useState([]);
  const [refreshMovies, setRefreshMovies] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = new Date();

  useEffect(() => {
    setSelectedDay(weekdays[(today.getDay() + 6) % 7]);
    fetchMovies();
  }, [refreshMovies]);

  const resetBooking = () => {
    setSelectedMovie(null);
    setSelectedScreening(null);
    setTicketCounts({ adult: 0, student: 0, senior: 0 });
    setSelectedSeats([]);
    setTicketsConfirmed(false);
  };

  const enrichMovies = (movies) => {
    return movies.map(movie => ({
      ...movie,
      screenings: movie.screenings.map(screening => ({
        ...screening,
        weekday: weekdays[screening.week_day - 1],
        week_number: screening.week_number,
      }))
    }));
  };

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/movies`);
      const data = await res.json();
      const enriched = enrichMovies(data.data || data);
      setMovies(enriched);

      if (!currentWeek && enriched.length > 0) {
        const allScreenings = enriched.flatMap(movie => movie.screenings);
        const uniqueWeeks = [...new Set(allScreenings.map(s => s.week_number))].sort((a, b) => a - b);
        if (uniqueWeeks.length > 0) setCurrentWeek(uniqueWeeks[0]);
      }
    } catch (err) {
      console.error("Hiba a filmek betöltésekor:", err);
    }
  };

  return (
    <Router>
      <Navbar resetBooking={resetBooking} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings movies={movies} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies/create"
          element={
            <ProtectedRoute>
              <AddMovie setRefreshMovies={setRefreshMovies} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/screenings/create"
          element={
            <ProtectedRoute>
              <AddScreening setRefreshMovies={setRefreshMovies} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies/:id/edit"
          element={
            <ProtectedRoute>
              <EditMovie setRefreshMovies={setRefreshMovies} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/screenings/:id/edit"
          element={
            <ProtectedRoute>
              <EditScreening
                resetBooking={resetBooking}
                setRefreshMovies={(v) => setRefreshMovies(v)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <div className="p-4 max-w-screen-lg mx-auto">
              <h1 className="text-3xl font-bold mb-4">Mozijegy Foglaló</h1>

              {!selectedMovie && (
                <MovieList
                  movies={movies}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  onSelectMovie={setSelectedMovie}
                  setMovies={setMovies}
                  fetchMovies={fetchMovies}
                  currentWeek={currentWeek}
                  onChangeWeek={(newWeek) => {
                    if (newWeek >= 1 && newWeek <= 51) {
                      setCurrentWeek(newWeek);
                    }
                  }}
                />
              )}

              {selectedMovie && !selectedScreening && (
                <MovieDetails
                  movie={selectedMovie}
                  selectedDay={selectedDay}
                  onSelectScreening={setSelectedScreening}
                  onBack={resetBooking}
                  resetBooking={resetBooking}
                  setRefreshMovies={(v) => setRefreshMovies(v)}
                  currentWeek={currentWeek}
                />
              )}

              {selectedMovie && selectedScreening && !ticketsConfirmed && (
                <TicketSelector
                  ticketCounts={ticketCounts}
                  setTicketCounts={setTicketCounts}
                  onContinue={() => setTicketsConfirmed(true)}
                />
              )}

              {selectedMovie && selectedScreening && ticketsConfirmed && (
                <SeatSelector
                  screening={selectedScreening}
                  ticketCounts={ticketCounts}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                />
              )}

              {selectedSeats.length > 0 && (
                <BookingSummary
                  movie={selectedMovie}
                  day={selectedDay}
                  screening={selectedScreening}
                  ticketCounts={ticketCounts}
                  selectedSeats={selectedSeats}
                  onConfirm={(updatedMovies) => {
                    setMovies(updatedMovies);
                    setRefreshMovies(prev => !prev);
                    resetBooking();
                  }}
                />
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
