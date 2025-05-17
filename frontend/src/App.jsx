// App.jsx
import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreatePage from './components/CreatePage';
import ListPage from './components/ListPage';

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setPage={setPage} currentPage={page} />
      
      {page === 'home' && <HomePage setPage={setPage} />}
      {page === 'create' && <CreatePage />}
      {page === 'list' && <ListPage />}
    </div>
  );
}
