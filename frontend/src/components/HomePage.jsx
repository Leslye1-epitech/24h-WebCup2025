// components/HomePage.jsx
import { PenTool } from 'lucide-react';

export default function HomePage({ setPage }) {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-red-500">The</span>End<span className="text-red-500">.</span>page
          </h1>
          <p className="text-2xl mb-8 text-gray-300">
            Parce que si c'est la fin, autant la rendre inoubliable... Et cliquable.
          </p>
          <div className="space-y-6">
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
            onClick={() => setPage('create')}
            className="mt-12 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-bold flex items-center gap-2 mx-auto"
          >
            <PenTool size={20} />
            Créer ma page de départ
          </button>
        </div>
      </div>
    </div>
  );
}