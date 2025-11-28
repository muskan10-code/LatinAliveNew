import { useState } from 'react';

export default function ComicViewer({ comic }) {
    const [currentPanel, setCurrentPanel] = useState(0);
    const [generatedImages, setGeneratedImages] = useState({});
    const [loading, setLoading] = useState({});

    const generateImage = async (panelId, prompt) => {
        setLoading(prev => ({ ...prev, [panelId]: true }));

        try {
            const response = await fetch("http://localhost:8000/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    panel_id: panelId,
                    prompt: prompt
                })
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error("Backend failed to generate image");
            }

            // Save base64 image
            setGeneratedImages(prev => ({
                ...prev,
                [panelId]: data.image_base64
            }));
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setLoading(prev => ({ ...prev, [panelId]: false }));
        }
    };

    const panel = comic.panels[currentPanel];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
                {comic.title}
            </h1>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                {/* Comic Image */}
                <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100
                    rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                >
                    <img
                        src={panel.image}
                        alt={`Comic panel ${currentPanel + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                    />

                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                        Panel {currentPanel + 1} of {comic.panels.length}
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-center text-gray-600 italic">
                        {panel.translation}
                    </p>
                </div>

            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentPanel(Math.max(0, currentPanel - 1))}
                    disabled={currentPanel === 0}
                    className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                >
                    ← Previous
                </button>
                <button
                    onClick={() => setCurrentPanel(Math.min(comic.panels.length - 1, currentPanel + 1))}
                    disabled={currentPanel === comic.panels.length - 1}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}