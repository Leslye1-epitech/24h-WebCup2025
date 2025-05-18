import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import axios from 'axios';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
    const endpoint = isRegister ? `${baseURL}/api/register` : `${baseURL}/api/login`;
    const payload = { username: formData.username, password: formData.password };

    try {
      const res = await axios.post(endpoint, payload);
      if (!isRegister) {
        localStorage.setItem('token', res.data.token);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erreur');
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 bg-opacity-70 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isRegister ? 'Créer un compte' : 'Se connecter'}
        </h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nom d'utilisateur</label>
            <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
              <User size={20} className="ml-3 text-gray-400" />
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                className="flex-1 bg-transparent px-3 py-2 focus:outline-none"
                placeholder="Votre pseudo"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Mot de passe</label>
            <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
              <Lock size={20} className="ml-3 text-gray-400" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="flex-1 bg-transparent px-3 py-2 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-red-600 hover:bg-red-700 rounded-lg py-3 font-bold text-lg"
          >
            {isRegister ? 'S\'enregistrer' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          {isRegister ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-red-500 font-semibold hover:underline"
          >
            {isRegister ? 'Se connecter' : 'S\'enregistrer'}
          </button>
        </p>
      </div>
    </div>
  );
}
