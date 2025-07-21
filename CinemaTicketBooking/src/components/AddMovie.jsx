import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AddMovie({ setRefreshMovies }) {
    const token = useSelector(state => state.auth.token);
    const [form, setForm] = useState({
        title: '',
        description: '',
        image_path: '',
        duration: '',
        genre: '',
        release_year: '',
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Hiba a film hozzáadásakor');
            } else {

                if (typeof setRefreshMovies === 'function') {
                    setRefreshMovies(prev => !prev);
                }
                navigate("/");
            }

            setMessage('Film sikeresen hozzáadva!');
            setForm({
                title: '',
                description: '',
                image_path: '',
                duration: '',
                genre: '',
                release_year: '',
            });

        } catch (err) {
            setError('Hiba történt: ' + err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Új film hozzáadása</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input name="title" placeholder="Cím" value={form.title} onChange={handleChange} className="border p-2 rounded" required />
                <textarea name="description" placeholder="Leírás" value={form.description} onChange={handleChange} className="border p-2 rounded" required />
                <input name="image_path" placeholder="Kép URL" value={form.image_path} onChange={handleChange} className="border p-2 rounded" required />
                <input name="duration" placeholder="Hossz (perc)" value={form.duration} onChange={handleChange} type="number" className="border p-2 rounded" required />
                <input name="genre" placeholder="Műfaj" value={form.genre} onChange={handleChange} className="border p-2 rounded" required />
                <input name="release_year" placeholder="Megjelenés éve" value={form.release_year} onChange={handleChange} type="number" className="border p-2 rounded" required />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Mentés</button>
                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}
