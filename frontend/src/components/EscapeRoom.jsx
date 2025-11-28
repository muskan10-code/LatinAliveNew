import { useState } from "react";

export default function EscapeRoom() {
    const [step, setStep] = useState(1);
    const [clue, setClue] = useState(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);

    const getClue = async () => {
        const r = await fetch("/api/week2/escape-clue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step: 1 }) });
        const j = await r.json();
        if (j.ok) {
            setClue(j.clue);
            setStep(1);
        }
    };

    const submitAnswer = async () => {
        const r = await fetch("/api/week2/escape-clue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step: 2, answer }) });
        const j = await r.json();
        setResult(j);
        if (j.ok && j.correct) setStep(3);
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-2">Grammar Escape Room</h3>
            {step === 1 && <>
                <button onClick={getClue} className="button mb-2">Get your scrambled clue</button>
                {clue && <div className="p-2 bg-gray-100 rounded">Scrambled: <strong>{clue}</strong></div>}
            </>}
            {step === 1 && clue && <>
                <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full border p-2 my-2" />
                <button className="button" onClick={submitAnswer}>Submit reconstruction</button>
            </>}
            {result && <div className="mt-3"><pre>{JSON.stringify(result, null, 2)}</pre></div>}
            {step === 3 && <div className="mt-3 p-2 bg-green-50">You escaped! Show the code to your teacher.</div>}
        </div>
    );
}