import { useState } from "react";

export default function FableAnalyzer() {
    const [text, setText] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setAnalysis(null);
        try {
            const resp = await fetch("/api/week3/analyze-fable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fable_text: text })
            });
            const j = await resp.json();
            setAnalysis(j);
        } catch (e) {
            console.error(e);
            setAnalysis({ ok: false, error: e.toString() });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-3">Fable Analyzer</h3>
            <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 mb-3" rows={6} placeholder="Paste Latin fable text here..." />
            <div className="flex gap-2 mb-3">
                <button className="button" onClick={analyze} disabled={loading}>{loading ? "Analyzing…" : "Analyze Fable"}</button>
            </div>

            {analysis && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(analysis, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
