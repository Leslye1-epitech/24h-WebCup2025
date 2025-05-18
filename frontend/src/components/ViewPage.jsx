import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { themes } from './CreatePage';

export default function ViewPage() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
        const res = await axios.get(`${baseURL}/api/pages/${id}`);
        setPage(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message || 'Erreur lors du chargement');
      }
    };
    fetchPage();
  }, [id]);

  const toggleLike = async () => {
    if (cooldown || !page) return;
    setCooldown(true);
    setTimeout(() => setCooldown(false), 1500);
    try {
      const baseURL = process.env.REACT_APP_BASE_BACKEND_URL;
      const endpoint = hasLiked ? `${baseURL}/api/pages/${id}/unlike` : `${baseURL}/api/pages/${id}/like`;
      const res = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPage(res.data);
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de l\'action');
    }
  };

  const renderMusicEmbed = (url) => {
    try {
      if (!url) return null;

      // YouTube
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1].split('&')[0];
        return (
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-60 rounded-md"
          />
        );
      }

      // Vimeo
      if (url.includes('vimeo.com/')) {
        const id = url.split('/').pop();
        return (
          <iframe
            src={`https://player.vimeo.com/video/${id}`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-60 rounded-md"
          />
        );
      }

      // Spotify
      if (url.includes('open.spotify.com/track/')) {
        const id = url.split('/track/')[1].split('?')[0];
        return (
          <iframe
            src={`https://open.spotify.com/embed/track/${id}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-md"
          />
        );
      }

      // Deezer
      if (url.includes('deezer.com/track/')) {
        const id = url.split('/track/')[1].split('?')[0];
        return (
          <iframe
            title="Deezer Player"
            scrolling="no"
            frameBorder="0"
            allowTransparency="true"
            src={`https://widget.deezer.com/widget/dark/track/${id}`}
            width="100%"
            height="80"
            className="rounded-md"
          />
        );
      }

      // SoundCloud
      if (url.includes('soundcloud.com/')) {
        return (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`}
            className="rounded-md"
          />
        );
      }

      // Autre lien
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          🎵 Écouter la musique
        </a>
      );
    } catch (err) {
      return <p className="text-sm text-red-500">Lien musical invalide</p>;
    }
  };

  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
  if (!page) return <div className="text-center py-4">Chargement...</div>;

  const themeObj = themes[page.themeName] || { bg: 'bg-gray-300', text: 'text-gray-800' };

  return (
    <div className={`min-h-screen py-10 px-4 ${themeObj.bg} ${themeObj.text}`}>
      <div className="max-w-2xl mx-auto bg-white text-black p-6 rounded-md shadow-lg relative">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{page.creatorName}</h1>
          <button onClick={toggleLike} disabled={cooldown} title={hasLiked ? 'Annuler le like' : 'Aimer'}>
            <Heart
              className={`w-6 h-6 transition-colors ${hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} ${cooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
              fill={hasLiked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <p className="italic text-sm text-gray-500 mb-4">{new Date(page.createdAt).toLocaleString()}</p>
        <p className="mb-4 whitespace-pre-line">{page.creatorMessage}</p>

        {(page.images.length || page.gifs.length || page.videos.length) > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {page.images.map((url, i) => (
              <img key={"img" + i} src={url} alt="image" className="w-full h-auto rounded" />
            ))}
            {page.videos.map((url, i) => (
              <video key={"vid" + i} controls className="w-full h-auto rounded">
                <source src={url} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            ))}
            {page.gifs.map((url, i) => (
              <img key={"gif" + i} src={url} alt="gif" className="w-full h-auto rounded" />
            ))}
          </div>
        )}

        {/* Lecture musicale */}
        {page.videos && typeof page.videos === 'string' && page.videos.length > 5 && (
          <div className="mt-6">{renderMusicEmbed(page.videos)}</div>
        )}

        <div className="mt-4 text-sm text-gray-700 text-right">
          Nombre de likes : <strong>{page.likedBy.length}</strong>
        </div>

        <Link to="/list" className="inline-block mt-6 text-blue-500 underline">
          ← Retour à la liste
        </Link>
      </div>
    </div>
  );
}