// App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreatePage from './components/CreatePage';
import ListPage from './components/ListPage';
import ViewPage from './components/ViewPage'; // à créer

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/page/:id" element={<ViewPage />} />
      </Routes>
    </div>
  );
}

