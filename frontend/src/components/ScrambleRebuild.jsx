import { useState } from "react";

export default function ScrambleRebuild() {
    const [passage, setPassage] = useState("Marcus in foro ambulat. Salutat amicum.");
    const [scrambledResult, setScrambledResult] = useState(null);
    const [reconstructed, setReconstructed] = useState("");
    const [score, setScore] = useState(null);

    const scramble = async () => {
        const r = await fetch("/api/week2/scramble", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passage }) });
        const j = await r.json();
        setScrambledResult(j);
    };

    const submitRebuild = async () => {
        const r = await fetch("/api/week2/rebuild/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ original_passage: passage, reconstructed: reconstructed }) });
        const j = await r.json();
        if (j.ok) setScore(j);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Team Rebuild Challenge</h3>
            <textarea value={passage} onChange={(e) => setPassage(e.target.value)} className="w-full border p-2 mb-2" rows={3} />
            <div className="flex gap-2 mb-2">
                <button className="button" onClick={scramble}>Generate Scramble</button>
            </div>

            {scrambledResult && scrambledResult.items.map(it => (
                <div key={it.index} className="mb-2 p-2 border rounded">
                    <div className="text-sm text-gray-600">Scrambled #{it.index + 1}:</div>
                    <div className="font-mono">{it.scrambled}</div>
                </div>
            ))}

            <textarea placeholder="Reconstruct passage here..." value={reconstructed} onChange={(e) => setReconstructed(e.target.value)} className="w-full border p-2 mb-2" rows={4} />
            <div className="flex gap-2">
                <button className="button" onClick={submitRebuild}>Submit Reconstruction</button>
            </div>

            {score && <div className="mt-4 bg-gray-50 p-3 rounded">
                <h4 className="font-semibold">Score: {score.overall_score}%</h4>
                <pre className="text-sm">{JSON.stringify(score.details, null, 2)}</pre>
            </div>}
        </div>
    );
}
