import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar({ resetBooking }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleHomeClick = () => {
    if (typeof resetBooking === "function") {
      resetBooking();
    }
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <button onClick={handleHomeClick} className="text-xl font-bold cursor-pointer">tIKera</button>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Moziműsor</Link>
        {user && (
          <Link to="/bookings">Foglalásaim</Link>
        )}
        {user?.email === 'admin@example.com' && (
          <>
            <Link to="/admin/movies/create">Film hozzáadása</Link>
            <Link to="/admin/screenings/create">Vetítés hozzáadása</Link>
          </>
        )}
        {user ? (
          <>
            <span className="font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Kijelentkezés
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Bejelentkezés</Link>
            <Link to="/register" className="hover:underline">Regisztráció</Link>
          </>
        )}
      </div>
    </nav>
  );
}
