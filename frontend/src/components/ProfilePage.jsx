// components/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { themes } from './CreatePage';
import { Trash, Heart } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
    const [userPages, setUserPages] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPages = async () => {
            try {
                const token = localStorage.getItem('token');
                const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
                const res = await axios.get(`${baseURL}/api/pages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = JSON.parse(atob(token.split('.')[1])); // decode JWT
                const filtered = res.data.filter(p => p.creatorId === user.id);
                setUserPages(filtered);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || err.message || 'Erreur lors du chargement');
            }
        };
        fetchUserPages();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Supprimer cette page ? C’est irréversible.");
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
            await axios.delete(`${baseURL}/api/pages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserPages(prev => prev.filter(page => page.id !== id));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "Erreur lors de la suppression.");
        }
    };


    return (
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
            <div className="container mx-auto py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Mes pages de départ
                    </h1>
                    <p className="text-gray-300 mb-10">
                        Voici toutes les pages que vous avez créées avec amour, rage ou ironie.
                    </p>
                </div>

                {error && (
                    <div className="text-center text-red-400 mb-4">{error}</div>
                )}

                {userPages.length === 0 && !error && (
                    <div className="text-center text-gray-300">
                        Aucune page créée pour le moment.
                    </div>
                )}

                {userPages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {userPages.map(page => {
                            const theme = themes[page.themeName] || { bg: 'bg-gray-300', text: 'text-gray-800' };
                            return (
                                <div
                                    key={page.id}
                                    onClick={() => navigate(`/page/${page.id}`)}
                                    className="bg-white text-black rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 hover:scale-105 duration-200"
                                >
                                    <div className={`mb-2 p-1 rounded ${theme.bg}`} />
                                    <h3 className="font-bold text-lg mb-1">{page.creatorName}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{page.createdAt}</p>
                                    <p className="text-sm mb-2 line-clamp-3">{page.creatorMessage}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                                            <Heart className="w-4 h-4 fill-red-600" />
                                            {page.likedBy?.length || 0}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(page.id);
                                            }}
                                            title="Supprimer cette page"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
