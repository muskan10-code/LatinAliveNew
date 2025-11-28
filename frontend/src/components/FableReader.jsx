import React from "react";

export default function FableReader({ fable }) {
    if (!fable) return <div className="p-6 bg-white rounded">No fable selected.</div>;

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-2">{fable.title}</h2>
            <p className="text-sm text-gray-500 mb-4">Author: {fable.author}</p>

            <div className="mb-4">
                <h3 className="font-semibold">Latin</h3>
                <p className="italic text-lg">{fable.latin}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold">Translation</h3>
                <p>{fable.translation}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold">Vocabulary</h3>
                <div className="flex gap-2 flex-wrap">
                    {fable.vocabulary.map((w) => (
                        <span key={w} className="px-3 py-1 bg-amber-100 rounded text-amber-900">{w}</span>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold">Moral</h3>
                <p>{fable.moral}</p>
            </div>
        </div>
    );
}