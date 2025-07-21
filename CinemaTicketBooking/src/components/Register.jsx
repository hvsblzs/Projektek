import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [show, setShow] = useState({ password: false, confirm: false });
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(Object.values(data.errors).flat().join(' '));
                return;
            }

            dispatch(setCredentials({
                user: data.data.user,
                token: data.data.token,
            }));

            navigate('/');
        } catch {
            setError('Hálózati hiba');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Regisztráció</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Név"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded p-2"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border rounded p-2"
                />
                <div className="relative">
                    <input
                        type={show.password ? 'text' : 'password'}
                        placeholder="Jelszó"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="border rounded p-2 w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShow({ ...show, password: !show.password })}
                        className="absolute top-2.5 right-3"
                    >
                        {show.password ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={show.confirm ? 'text' : 'password'}
                        placeholder="Jelszó megerősítése"
                        value={form.password_confirmation}
                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                        className="border rounded p-2 w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShow({ ...show, confirm: !show.confirm })}
                        className="absolute top-2.5 right-3"
                    >
                        {show.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Regisztráció
                </button>
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}
