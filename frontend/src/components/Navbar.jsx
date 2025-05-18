import { PenTool, ListChecks, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useContext(AuthContext);

  const userLink = currentPath === '/profile' ? '/auth' : '/profile';

  const handleUserClick = () => {
    if (currentPath === '/profile') logout();
  };

  return (
    <div className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-red-500">The</span>
          <span>End</span>
          <span className="text-red-500">.</span>
          <span>page</span>
        </Link>

        <div className="flex gap-4 items-center">
          <Link
            to="/create"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPath === '/create' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <PenTool size={18} />
            Création
          </Link>

          <Link
            to="/list"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPath === '/list' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <ListChecks size={18} />
            Liste
          </Link>

          {user ? (
            <Link
              to={userLink}
              onClick={handleUserClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${currentPath === '/profile' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <User size={18} />
              {currentPath === '/profile' ? 'Déconnexion' : user.username}
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={handleUserClick}
              className={`px-4 py-2 rounded-lg font-semibold ${currentPath === '/auth' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Connexion / Inscription
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
