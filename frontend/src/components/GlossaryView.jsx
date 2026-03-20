import { useState } from "react";

export default function GlossaryView({ project }) {
    const [glossary, setGlossary] = useState([]);

    const buildGlossary = async () => {
        const res = await fetch("http://localhost:8000/api/week4/build-glossary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });
        const data = await res.json();
        setGlossary(data.glossary);
    };

    return (
        <div>
            <button onClick={buildGlossary} className="bg-blue-600 text-white px-4 py-2 rounded">
                Build Glossary
            </button>

            <ul className="mt-3">
                {glossary.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
        </div>
    );
}
