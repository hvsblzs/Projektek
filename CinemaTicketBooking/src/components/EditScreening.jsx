import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditScreening({ setRefreshMovies, resetBooking }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [screening, setScreening] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScreening = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/screenings/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                console.log("Szerver válasz:", data);
                if (res.ok) {
                    setScreening(data.data);
                } else {
                    setError("Nem sikerült betölteni a vetítést.");
                }
            } catch {
                setError("Hiba a vetítés betöltése közben.");
            }
        };

        fetchScreening();
    }, [id, token]);

    const handleChange = (e) => {
        setScreening({ ...screening, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            movie_id: screening.movie_id,
            room_id: screening.room?.id || screening.room_id,
            date: screening.date,
            start_time: screening.start_time,
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/screenings/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
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
                const data = await res.json();
                setError("Hiba a frissítés során: " + (data.message || ""));
            }
        } catch {
            setError("Hiba történt a mentés közben.");
        }
    };

    if (!screening) return <p>Betöltés...</p>;

    return (
        <div className="max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Vetítés szerkesztése</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Kezdés időpontja</label>
                    <input
                        type="time"
                        name="start_time"
                        value={screening.start_time || ""}
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
