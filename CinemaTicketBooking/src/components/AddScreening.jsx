import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AddScreening({ setRefreshMovies }) {
    const token = useSelector(state => state.auth.token);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({
        movie_id: '',
        room_id: '1',
        date: '',
        start_time: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieRes = await fetch(`${import.meta.env.VITE_API_URL}/movies`);
                const roomRes = await fetch(`${import.meta.env.VITE_API_URL}/rooms`);
                const moviesData = await movieRes.json();
                const roomsData = await roomRes.json();

                setMovies(moviesData.data || moviesData);
                setRooms(roomsData.data || roomsData);
            } catch (err) {
                console.error('Hiba az adatok lekérésekor:', err);
            }
        };
        fetchData();
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/screenings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Hiba a vetítés mentésekor');
            else {

                if (typeof setRefreshMovies === 'function') {
                    setRefreshMovies(prev => !prev);
                }
                navigate("/");
            }
            setMessage('Vetítés sikeresen hozzáadva!');
            setForm({ movie_id: '', room_id: '1', date: '', start_time: '' });
        } catch (err) {
            setError('Hiba történt: ' + err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Vetítés hozzáadása</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                    name="movie_id"
                    value={form.movie_id}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                >
                    <option value="">Válassz filmet</option>
                    {movies.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                </select>
                <select
                    name="room_id"
                    value={form.room_id}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                >
                    <option value="">Válassz termet</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.rows} sor, {room.seats_per_row} szék/sor
                        </option>
                    ))}
                </select>

                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    name="start_time"
                    type="time"
                    value={form.start_time}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Mentés
                </button>
                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}
