// components/ViewPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { themes } from './CreatePage';
import { Heart } from 'lucide-react';

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

export default function ViewPage() {
  const { id } = useParams();
  const pageId = parseInt(id);
  const page = examplePages.find(p => p.id === pageId);
  const currentTheme = themes[page?.theme];

  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votes") || "{}");
    setVotes(storedVotes[pageId] || 0);

    const storedFlags = JSON.parse(localStorage.getItem("votedFlags") || "{}");
    setHasVoted(!!storedFlags[pageId]);
  }, [pageId]);

  const toggleVote = () => {
    if (cooldown) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 1500);

    const storedVotes = JSON.parse(localStorage.getItem("votes") || "{}");
    const storedFlags = JSON.parse(localStorage.getItem("votedFlags") || "{}");

    let newVotes = { ...storedVotes };
    let newFlags = { ...storedFlags };

    if (hasVoted) {
      newVotes[pageId] = Math.max((newVotes[pageId] || 1) - 1, 0);
      delete newFlags[pageId];
      setHasVoted(false);
    } else {
      newVotes[pageId] = (newVotes[pageId] || 0) + 1;
      newFlags[pageId] = true;
      setHasVoted(true);
    }

    localStorage.setItem("votes", JSON.stringify(newVotes));
    localStorage.setItem("votedFlags", JSON.stringify(newFlags));
    setVotes(newVotes[pageId]);
  };

  if (!page) return <div className="p-4 text-center">Page non trouvée </div>;

  return (
    <div className={`min-h-screen py-10 px-4 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="max-w-2xl mx-auto bg-white text-black p-6 rounded-md shadow-lg relative">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{page.name}</h1>
          <button
            onClick={toggleVote}
            title={hasVoted ? 'Annuler le vote' : 'Voter'}
            disabled={cooldown}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${hasVoted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} ${cooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
              fill={hasVoted ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <p className="italic text-sm text-gray-500 mb-4">{page.date}</p>
        <p className="mb-4 whitespace-pre-line">{page.excerpt}</p>

        <div className="mt-4 text-sm text-gray-700 text-right">
          Nombre de votes : <strong>{votes}</strong>
        </div>

        <Link to="/list" className="inline-block mt-6 text-blue-500 underline">
          ← Retour à la liste
        </Link>
      </div>
    </div>
  );
}
