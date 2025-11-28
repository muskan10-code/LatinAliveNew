import { useState } from 'react';

export default function MorphoAnalyzer() {
    const [sentence, setSentence] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeSentence = async () => {
        setError(null);
        if (!sentence.trim()) {
            setError("Please enter a sentence.");
            return;
        }
        setLoading(true);
        setAnalysis(null);

        try {
            const resp = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sentence })
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || "Server error");
            }

            const data = await resp.json();
            if (data.ok) {
                setAnalysis(data.raw || data.raw_text || data.raw_text);
            } else {
                setError("Analysis failed");
            }
        } catch (err) {
            console.error("Analyze error:", err);
            setError("Failed to analyze sentence — using local fallback.");
            setAnalysis([{
                word: sentence,
                lemma: sentence.toLowerCase(),
                part_of_speech: "unknown",
                meaning: "Unknown (offline fallback)",
                analysis: { note: "fallback" }
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analyzer-box">
            <h2 className="text-2xl font-bold mb-3">Morpho-syntactic Analyzer</h2>
            <textarea
                rows={3}
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="analyzer-input"
                placeholder="Type a Latin sentence (e.g., Puella agrum videt.)"
            />

            <div className="flex gap-3">
                <button className="button" onClick={analyzeSentence} disabled={loading}>
                    {loading ? "Analyzing…" : "Analyze Sentence"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 text-red-700">
                    {error}
                </div>
            )}

            {analysis && (
                <div className="mt-4 bg-white rounded-md p-4 border">
                    <h3 className="text-xl font-bold mb-2 text-blue-900">Analysis:</h3>
                    <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(analysis, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}