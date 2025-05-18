// components/ListPage.jsx
import { Briefcase, Heart, Coffee, Megaphone, Ghost } from 'lucide-react';

import { themes } from './CreatePage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ListPage() {
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

    const [pages, setPages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
                const endpoint = `${baseURL}/api/pages`;
                const res = await axios.get(
                    endpoint,
                    {
                        headers:
                            { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                setPages(res.data.map(p => ({
                    id: p.id,
                    name: p.creatorName,
                    reason: p.reasonOfLeaving,
                    theme: p.themeName,
                    date: p.createdAt,
                    excerpt: p.creatorMessage
                })));
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || err.message || 'Erreur lors du chargement');
            }
        };
        fetchPages();
    }, []);


    const getReasonText = (reason) => {
        switch (reason) {
            case 'job': return "Démission";
            case 'relationship': return "Rupture";
            case 'project': return "Fin de projet";
            case 'group': return "Départ de groupe";
            case 'other': return "Autre";
            default: return "";
        }
    };

    const getReasonIcon = (reason) => {
        switch (reason) {
            case 'job': return <Briefcase size={16} />;
            case 'relationship': return <Heart size={16} />;
            case 'project': return <Coffee size={16} />;
            case 'group': return <Megaphone size={16} />;
            default: return <Ghost size={16} />;
        }
    };
    const navigate = useNavigate();


    return (
        <div className="flex-1 bg-gray-100">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Dernières pages de départ</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map(page => (
                        <div key={page.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className={`p-1 ${(themes[page.theme] || { bg: 'bg-gray-300', text: 'text-gray-800' }).bg}`}></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-bold">{page.name}</h2>
                                    <span className="text-sm text-gray-500">{page.date}</span>
                                </div>

                                <div className="flex items-center gap-1 mb-4">
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${(themes[page.theme] || { bg: 'bg-gray-300', text: 'text-gray-800' }).bg} ${(themes[page.theme] || { bg: 'bg-gray-300', text: 'text-gray-800' }).text}`}>
                                        {getReasonIcon(page.reason)}
                                        {getReasonText(page.reason)}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-3">{page.excerpt}</p>

                                <button
                                    onClick={() => navigate(`/page/${page.id}`)}
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Voir la page
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}