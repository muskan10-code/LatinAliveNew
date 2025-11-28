import { useState } from "react";

export default function ComicRewriter({ fable, onExport }) {
    const [rewrite, setRewrite] = useState("");
    const [comicScript, setComicScript] = useState(["", "", ""]);
    const [loading, setLoading] = useState(false);

    const simplify = async () => {
        if (!rewrite.trim()) return;
        setLoading(true);
        try {
            const resp = await fetch("/api/week3/simplify-latin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latin_text: rewrite })
            });
            const j = await resp.json();
            if (j.ok) setRewrite(j.simplified);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const generateDialogue = async (english) => {
        const resp = await fetch("/api/week3/dialogue-helper", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ english_text: english })
        });
        const j = await resp.json();
        return j.dialogue || [];
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-3">Rewrite & Comic Script</h3>

            <div className="mb-3">
                <label className="block font-medium mb-1">Rewrite the fable (Latin)</label>
                <textarea value={rewrite} onChange={e => setRewrite(e.target.value)} className="w-full border p-2" rows={4} />
                <div className="flex gap-2 mt-2">
                    <button className="button" onClick={simplify} disabled={loading}>{loading ? "Simplifying…" : "Simplify with AI"}</button>
                </div>
            </div>

            <div className="mb-3">
                <label className="block font-medium mb-1">Comic Script (one line per panel)</label>
                {comicScript.map((text, idx) => (
                    <input key={idx} value={text} onChange={e => {
                        const newS = [...comicScript]; newS[idx] = e.target.value; setComicScript(newS);
                    }} className="w-full border p-2 mb-2" placeholder={`Panel ${idx + 1} text`} />
                ))}

                <div className="flex gap-2">
                    <button className="button" onClick={() => onExport && onExport({ rewrite, comicScript })}>Export to Comic Builder</button>
                    <button className="button" onClick={async () => {
                        const lines = await generateDialogue("Hello! How are you?");
                        alert("Sample dialogue lines:\n" + lines.join("\n"));
                    }}>AI → sample dialogue</button>
                </div>
            </div>
        </div>
    );
}
