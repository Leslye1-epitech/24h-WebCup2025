// components/Navbar.jsx
import { PenTool, ListChecks } from 'lucide-react';

export default function Navbar({ setPage, currentPage }) {
  return (
    <div className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-bold cursor-pointer flex items-center" 
          onClick={() => setPage('home')}
        >
          <span className="text-red-500">The</span>
          <span>End</span>
          <span className="text-red-500">.</span>
          <span>page</span>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setPage('create')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentPage === 'create' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <PenTool size={18} />
            Création
          </button>
          
          <button 
            onClick={() => setPage('list')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentPage === 'list' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <ListChecks size={18} />
            Liste
          </button>
        </div>
      </div>
    </div>
  );
}