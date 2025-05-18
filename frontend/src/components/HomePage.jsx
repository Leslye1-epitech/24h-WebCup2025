// components/HomePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Heart } from 'lucide-react';
import { themes } from './CreatePage';
import axios from 'axios';

const examplePages = [
    {
        id: 1,
        name: "Thomas D.",
        reason: "job",
        theme: "dramatic",
        date: "15/05/2025",
        excerpt: "Après 3 ans à tout donner, j'ai décidé de prendre une autre direction..."
    },
    {
        id: 2,
        name: "Julie M.",
        reason: "relationship",
        theme: "ironic",
        date: "12/05/2025",
        excerpt: "C'était bien, c'était cool, mais toutes les bonnes choses ont une fin..."
    },
    {
        id: 3,
        name: "L'équipe Projet X",
        reason: "project",
        theme: "professional",
        date: "08/05/2025",
        excerpt: "Notre projet s'achève après 18 mois de développement intensif..."
    },
    {
        id: 4,
        name: "Alexandre B.",
        reason: "group",
        theme: "absurd",
        date: "03/05/2025",
        excerpt: "Salut le groupe ! C'était fun mais il est temps pour moi de..."
    }
];

export default function HomePage() {
    const navigate = useNavigate();
    const [topPages, setTopPages] = useState([]);
    const [famousPages, setFamousPages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedVotes = JSON.parse(localStorage.getItem('votes') || '{}');

        const sorted = [...examplePages]
            .map(page => ({
                ...page,
                votes: storedVotes[page.id] || 0
            }))
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 3);

        setTopPages(sorted);
    }, []);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
                const res = await axios.get(`${baseURL}/api/pages/top-liked/3`);
                setFamousPages(res.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || err.message || 'Erreur lors du chargement');
            }
        };
        fetchPage();
    }, [famousPages]);

    return (
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
            <div className="container mx-auto py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        <span className="text-red-500">The</span>End<span className="text-red-500">.</span>page
                    </h1>
                    <p className="text-2xl mb-8 text-gray-300">
                        Parce que si c'est la fin, autant la rendre inoubliable... Et cliquable.
                    </p>
                    <div className="space-y-6 mb-8">
                        <p className="text-xl">
                            Un collègue claque sa démission ? Un projet part en fumée ? Une fin de couple ?
                        </p>
                        <p className="text-xl font-bold">
                            Pas grave. On a la solution !
                        </p>
                        <p className="text-lg">
                            Créez votre page de départ personnalisée avec du style, de la rage, des gifs, des larmes, des sons...
                            <br />Un dernier mot avant de claquer la porte.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create')}
                        className="mt-4 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-bold flex items-center gap-2 mx-auto"
                    >
                        <PenTool size={20} />
                        Créer ma page de départ
                    </button>
                </div>
                {/* Wall of Fame */}
                {famousPages.length > 0 && (
                    <div className="mt-16 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-yellow-400">🏆 Hall of Fame</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {famousPages.map(page => (
                                <div
                                    key={page.id}
                                    onClick={() => navigate(`/page/${page.id}`)}
                                    className="bg-white text-black rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 hover:scale-105 duration-200"
                                >
                                    <div className={`mb-2 p-1 rounded ${(themes[page.themeName] || { bg: 'bg-gray-300', text: 'text-gray-800' }).bg}`} />
                                    <h3 className="font-bold text-lg mb-1">{page.creatorName}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{page.creatorMessage}</p>
                                    <p className="text-sm mb-2 line-clamp-3">{page.createdAt}</p>
                                    <div className="flex items-center gap-1 text-sm text-red-600 font-semibold">
                                        <Heart className="w-4 h-4 fill-red-600" />
                                        {page.likes}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
