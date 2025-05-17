// components/CreatePage.jsx
import { useState } from 'react';
import { X, Heart, Briefcase, Megaphone, Ghost, Coffee } from 'lucide-react';
import EndPagePreview from './EndPagePreview';

export const themes = {
    dramatic: {
        name: "Dramatique",
        bg: "bg-black",
        text: "text-white",
        accent: "text-red-500",
        border: "border-red-800",
        icon: <Heart className="text-red-500" />
    },
    professional: {
        name: "Professionnel",
        bg: "bg-gray-100",
        text: "text-gray-800",
        accent: "text-blue-600",
        border: "border-blue-300",
        icon: <Briefcase className="text-blue-600" />
    },
    ironic: {
        name: "Ironique",
        bg: "bg-yellow-100",
        text: "text-purple-800",
        accent: "text-pink-500",
        border: "border-yellow-300",
        icon: <Megaphone className="text-pink-500" />
    },
    absurd: {
        name: "Absurde",
        bg: "bg-purple-100",
        text: "text-indigo-800",
        accent: "text-green-500",
        border: "border-purple-300",
        icon: <Ghost className="text-green-500" />
    },
    chill: {
        name: "Décontracté",
        bg: "bg-blue-50",
        text: "text-blue-900",
        accent: "text-amber-500",
        border: "border-blue-200",
        icon: <Coffee className="text-amber-500" />
    }
};

export default function CreatePage() {
    const [formData, setFormData] = useState({
        name: "",
        reason: "",
        theme: "dramatic",
        customTheme: {
            bgColor: "#000000",
            textColor: "#ffffff",
            accentColor: "#ff0000"
        },
        useCustomTheme: false,
        message: "",
        media: [],
        musicLink: ""
    });

    const [gifSearch, setGifSearch] = useState("");
    const [gifResults, setGifResults] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleCustomTheme = () => {
        setFormData({ ...formData, useCustomTheme: !formData.useCustomTheme });
    };

    const handleCustomThemeChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            customTheme: {
                ...formData.customTheme,
                [name]: value
            }
        });
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = files.map(file => {
            const type = file.type.startsWith("video") ? "video" : "image";
            return {
                type,
                url: URL.createObjectURL(file),
                alt: file.name
            };
        });

        setFormData(prev => ({
            ...prev,
            media: [...prev.media, ...newMedia]
        }));
    };

    const removeMedia = (index) => {
        const newMedia = [...formData.media];
        newMedia.splice(index, 1);
        setFormData({ ...formData, media: newMedia });
    };

    const searchGifs = async () => {
        if (!gifSearch.trim()) return;
        try {
            const apiKey = process.env.REACT_APP_GIPHY_API_KEY;
            const res = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(gifSearch)}&limit=6`
            );
            const json = await res.json();
            setGifResults(json.data);
        } catch (err) {
            console.error("Erreur recherche GIF :", err);
        }
    };

    const addGifToMedia = (gif) => {
        setFormData(prev => ({
            ...prev,
            media: [...prev.media, {
                type: "image",
                url: gif.images.original.url,
                alt: gif.title || "GIF"
            }]
        }));
        setGifResults([]);
        setGifSearch("");
    };

    const previewData = {
        ...formData,
        media: [
            ...formData.media,
            ...(formData.musicLink
                ? [{ type: "link", url: formData.musicLink, alt: "Musique choisie" }]
                : [])
        ]
    };

    const handlePublish = () => {
        console.log("Formulaire à publier :", formData);
        alert("Publication simulée ! (à implémenter)");
    };


    return (
        <div className="flex-1 bg-gray-100">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Créer ma page de départ</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulaire */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Personnalisez votre page</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Comment voulez-vous être appelé ?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Raison du départ</label>
                                <select
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Sélectionnez une raison</option>
                                    <option value="job">Démission / Fin de contrat</option>
                                    <option value="relationship">Rupture amoureuse</option>
                                    <option value="project">Fin de projet</option>
                                    <option value="group">Quitter un groupe</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    {Object.keys(themes).map(key => (
                                        <div
                                            key={key}
                                            className={`p-3 rounded-md cursor-pointer flex items-center gap-2 border-2 ${formData.theme === key && !formData.useCustomTheme
                                                ? 'border-blue-500'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                            onClick={() => setFormData({ ...formData, theme: key, useCustomTheme: false })}
                                        >
                                            {themes[key].icon}
                                            <span>{themes[key].name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center mb-3">
                                    <input
                                        type="checkbox"
                                        id="customTheme"
                                        checked={formData.useCustomTheme}
                                        onChange={toggleCustomTheme}
                                        className="mr-2"
                                    />
                                    <label htmlFor="customTheme">Personnaliser les couleurs</label>
                                </div>

                                {formData.useCustomTheme && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600">Fond</label>
                                            <input
                                                type="color"
                                                name="bgColor"
                                                value={formData.customTheme.bgColor}
                                                onChange={handleCustomThemeChange}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">Texte</label>
                                            <input
                                                type="color"
                                                name="textColor"
                                                value={formData.customTheme.textColor}
                                                onChange={handleCustomThemeChange}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">Accent</label>
                                            <input
                                                type="color"
                                                name="accentColor"
                                                value={formData.customTheme.accentColor}
                                                onChange={handleCustomThemeChange}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Votre message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md h-40"
                                    placeholder="Exprimez-vous librement..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Médias</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.media.map((item, index) => (
                                        <div key={index} className="relative">
                                            {item.type === "image" && (
                                                <img src={item.url} alt={item.alt} className="w-24 h-24 object-cover rounded-md" />
                                            )}
                                            {item.type === "video" && (
                                                <video src={item.url} className="w-24 h-24 object-cover rounded-md" muted />
                                            )}
                                            {item.type === 'link' && (
                                                <div className="text-xs text-blue-500 italic w-24 break-words">{item.url}</div>
                                            )}
                                            <button
                                                onClick={() => removeMedia(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer inline-block">
                                    Sélectionner des fichiers
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-1">Ajoutez des images, vidéos ou gifs pour rendre votre départ inoubliable</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter un GIF</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={gifSearch}
                                        onChange={(e) => setGifSearch(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                        placeholder="Ex: crying, happy, goodbye..."
                                    />
                                    <button
                                        type="button"
                                        onClick={searchGifs}
                                        className="px-3 py-2 bg-purple-600 text-white rounded-md"
                                    >
                                        Rechercher
                                    </button>
                                </div>
                                {gifResults.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {gifResults.map(gif => (
                                            <img
                                                key={gif.id}
                                                src={gif.images.fixed_height_small.url}
                                                alt={gif.title}
                                                className="cursor-pointer rounded-md hover:scale-105 transition"
                                                onClick={() => addGifToMedia(gif)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lien vers une musique (YouTube, Spotify...)</label>
                                <input
                                    type="text"
                                    name="musicLink"
                                    value={formData.musicLink}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handlePublish}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Publier
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* Aperçu */}
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                            <h2 className="text-xl font-semibold mb-2">Aperçu de votre page</h2>
                            <p className="text-sm text-gray-600">Voici à quoi ressemblera votre page de départ</p>
                        </div>
                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                            <EndPagePreview formData={previewData} themes={themes} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
