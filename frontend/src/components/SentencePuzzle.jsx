import { useState } from "react";

export default function SentencePuzzle({ example = "Puella in horto ambulat." }) {
    const [scrambled, setScrambled] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const makeScramble = async () => {
        const resp = await fetch("/api/week2/scramble", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passage: example })
        });
        const json = await resp.json();
        if (json.ok) {
            setScrambled(json.items[0].scrambled);
            setInput("");
            setResult(null);
        }
    };

    const check = async () => {
        setLoading(true);
        const resp = await fetch("/api/week2/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sentence: input })
        });
        const data = await resp.json();
        setResult(data);
        setLoading(false);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Sentence Puzzle</h3>
            <p className="mb-2 text-sm text-gray-600">Scrambled: <strong>{scrambled || "—"}</strong></p>
            <div className="mb-2">
                <button className="button mr-2" onClick={makeScramble}>Scramble Example</button>
                <button className="button" onClick={() => { setScrambled(""); setInput(""); setResult(null); }}>Reset</button>
            </div>

            <textarea placeholder="Type your reconstruction here" className="w-full border p-2 mb-2" value={input} onChange={(e) => setInput(e.target.value)} />
            <div className="flex gap-2">
                <button className="button" onClick={check} disabled={loading}>{loading ? "Checking…" : "Check sentence"}</button>
            </div>

            {result && <div className="mt-4 bg-gray-50 p-3 rounded">
                <h4 className="font-semibold">Analyzer result</h4>
                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>}
        </div>
    );
}
