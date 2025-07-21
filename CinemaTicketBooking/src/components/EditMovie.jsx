import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditMovie({ setRefreshMovies }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log(token);
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setMovie(data.data);
                } else {
                    setError("Nem sikerült betölteni a film adatokat.");
                }
            } catch (err) {
                setError("Hiba történt a film betöltése közben.");
            }
        };

        fetchMovie();
    }, [id, token]);

    const handleChange = e => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(movie)
            });

            if (res.ok) {
                if (typeof setRefreshMovies === "function") {
                    setRefreshMovies(prev => !prev);
                }
                navigate("/");
            } else {
                const data = await res.json();
                setError("Hiba a frissítés során: " + (data.message || ""));
            }
        } catch (err) {
            setError("Hiba történt a mentés közben.");
        }
    };

    if (!movie) return <p>Betöltés...</p>;

    return (
        <div className="max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Film szerkesztése</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Cím</label>
                    <input
                        name="title"
                        value={movie.title || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Leírás</label>
                    <textarea
                        name="description"
                        value={movie.description || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Műfaj</label>
                    <input
                        name="genre"
                        value={movie.genre || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Év</label>
                    <input
                        type="number"
                        name="release_year"
                        value={movie.release_year || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Hossz (perc)</label>
                    <input
                        type="number"
                        name="duration"
                        value={movie.duration || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Kép URL</label>
                    <input
                        name="image_path"
                        value={movie.image_path || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Mentés
                </button>
            </form>
        </div>
    );
}
