// components/EndPagePreview.jsx
export default function EndPagePreview({ formData, themes }) {
  const currentTheme = formData.useCustomTheme
    ? {
        bg: formData.customTheme.bgColor,
        text: formData.customTheme.textColor,
        accent: formData.customTheme.accentColor
      }
    : themes[formData.theme];

  const getReasonText = () => {
    switch (formData.reason) {
      case 'job': return "a quitté son emploi";
      case 'relationship': return "a mis fin à une relation";
      case 'project': return "a quitté un projet";
      case 'group': return "a quitté un groupe";
      case 'other': return "a dit au revoir";
      default: return "a tourné une page";
    }
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:.*v=|v\/|.*\/)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractSpotifyId = (url) => {
    const regex = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div
      style={formData.useCustomTheme ? {
        backgroundColor: currentTheme.bg,
        color: currentTheme.text
      } : {}}
      className={`min-h-96 p-6 ${!formData.useCustomTheme ? currentTheme.bg : ''} ${!formData.useCustomTheme ? currentTheme.text : ''}`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {formData.name || "Anonyme"}
          </h1>
          <p
            style={formData.useCustomTheme ? { color: currentTheme.accent } : {}}
            className={`text-xl ${!formData.useCustomTheme ? currentTheme.accent : ''}`}
          >
            {getReasonText()}
          </p>
        </div>

        <div className="mb-8 text-center italic">
          {new Date().toLocaleDateString('fr-FR')}
        </div>

        <div className="mb-8 whitespace-pre-line">
          {formData.message || "Aucun message laissé..."}
        </div>

        {formData.media.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {formData.media.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                {item.type === 'image' && (
                  <img src={item.url} alt={item.alt} className="w-full h-auto" />
                )}
                {item.type === 'video' && (
                  <video controls className="w-full h-auto">
                    <source src={item.url} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                )}
                {item.type === 'link' && (
                  <>
                    {item.url.includes("youtube.com") || item.url.includes("youtu.be") ? (
                      <div className="aspect-video w-full">
                        <iframe
                          className="w-full h-full rounded"
                          src={`https://www.youtube.com/embed/${extractYouTubeId(item.url)}`}
                          title={`youtube-${index}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : item.url.includes("spotify.com") ? (
                      <iframe
                        className="w-full h-20 rounded"
                        src={`https://open.spotify.com/embed/track/${extractSpotifyId(item.url)}`}
                        title={`spotify-${index}`}
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      ></iframe>
                    ) : (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">
                        {item.alt || "Voir le lien"}
                      </a>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-4 border-t border-opacity-30" style={formData.useCustomTheme ? { borderColor: currentTheme.text } : {}}>
          <p className="text-sm opacity-70">
            Créé par <span className="font-bold">SelPoivre</span>
          </p>
        </div>
      </div>
    </div>
  );
}
