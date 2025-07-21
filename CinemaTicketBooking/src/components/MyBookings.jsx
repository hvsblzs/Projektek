import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyBookings({ movies }) {
    const token = useSelector((state) => state.auth.token);
    const user = useSelector(state => state.auth.user);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Hiba');

                const bookingsArray = Array.isArray(json) ? json : json.data;
                const filteredBookings = bookingsArray.filter(b => b.total_price <= 0);
                setBookings(filteredBookings);

            } catch (err) {
                console.error(err);
                setError('Nem sikerült betölteni a foglalásokat.');
            }
        };

        fetchBookings();
    }, [token]);

    const findScreeningDetails = (screeningId) => {
        for (const movie of movies) {
            for (const screening of movie.screenings) {
                if (screening.id === screeningId) {
                    return {
                        title: movie.title,
                        image: movie.image_path,
                        date: screening.date,
                        start_time: screening.start_time,
                    };
                }
            }
        }
        return {};
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Foglalásaim</h2>

            {error && <p className="text-red-600">{error}</p>}

            {bookings.length === 0 ? (
                <p>Még nincsenek foglalásaid.</p>
            ) : (
                <ul className="space-y-6">
                    {bookings.map((booking) => {
                        const { title, image, date, start_time } = findScreeningDetails(booking.screening_id) || {};
                        return (
                            <li
                                key={booking.id}
                                className="flex gap-4 border rounded-lg p-4 bg-white shadow-md"
                            >
                                <img
                                    src={image?.startsWith("https") ? image : `/src/assets/images/${image}`}
                                    alt={title}
                                    className="w-32 h-auto object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{title || 'Ismeretlen film'}</h3>
                                    <p><strong>Dátum:</strong> {date || '—'}</p>
                                    <p><strong>Időpont:</strong> {start_time || '—'}</p>
                                    <p>
                                        <strong>Helyek:</strong>{' '}
                                        {booking.seats.map(s => `Sor: ${s.row}, Szék: ${s.seat}`).join(', ')}
                                    </p>
                                    <p>
                                        <strong>Jegyek száma:</strong>{' '}
                                        {booking.ticket_types.map(t => `${t.type} × ${t.quantity}`).join(', ')}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
