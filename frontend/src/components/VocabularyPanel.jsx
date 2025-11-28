import { useState } from 'react';

export default function VocabularyPanel({ vocabulary }) {
    const [selectedWord, setSelectedWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState({});

    const toggleTranslation = (index) => {
        setShowTranslation(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
                📚 Week 1 Vocabulary
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
                {vocabulary.map((word, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                        onClick={() => setSelectedWord(index)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-serif text-blue-900">
                                {word.latin}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${word.type === 'noun' ? 'bg-green-100 text-green-800' :
                                word.type === 'verb' ? 'bg-purple-100 text-purple-800' :
                                    'bg-orange-100 text-orange-800'
                                }`}>
                                {word.type}
                            </span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTranslation(index);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm mb-2"
                        >
                            {showTranslation[index] ? '🙈 Hide' : '👁️ Show'} Translation
                        </button>

                        {showTranslation[index] && (
                            <p className="text-gray-700 mb-2">
                                <strong>English:</strong> {word.english}
                            </p>
                        )}

                        {word.gender && (
                            <p className="text-sm text-gray-600">
                                <strong>Gender:</strong> {word.gender}
                            </p>
                        )}

                        {word.tense && (
                            <p className="text-sm text-gray-600">
                                <strong>Tense:</strong> {word.tense}
                            </p>
                        )}

                        <p className="text-sm text-gray-500 italic mt-2">
                            <strong>Example:</strong> {word.example}
                        </p>
                    </div>
                ))}
            </div>

            {selectedWord !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedWord(null)}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-serif text-blue-900 mb-4">
                            {vocabulary[selectedWord].latin}
                        </h3>
                        <p className="text-lg mb-2">
                            <strong>English:</strong> {vocabulary[selectedWord].english}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Type:</strong> {vocabulary[selectedWord].type}
                        </p>
                        {vocabulary[selectedWord].gender && (
                            <p className="text-gray-700 mb-2">
                                <strong>Gender:</strong> {vocabulary[selectedWord].gender}
                            </p>
                        )}
                        {vocabulary[selectedWord].tense && (
                            <p className="text-gray-700 mb-2">
                                <strong>Tense:</strong> {vocabulary[selectedWord].tense}
                            </p>
                        )}
                        <p className="text-gray-600 italic mt-4">
                            {vocabulary[selectedWord].example}
                        </p>
                        <button
                            onClick={() => setSelectedWord(null)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}