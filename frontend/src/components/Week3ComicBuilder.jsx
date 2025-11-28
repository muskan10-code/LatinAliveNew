import { useState } from "react";

export default function Week3ComicBuilder({ exported }) {
    const [panels, setPanels] = useState(exported?.comicScript || ["", "", ""]);
    const [images, setImages] = useState([null, null, null]);

    const onImageChange = (i, ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const newImgs = [...images]; newImgs[i] = url; setImages(newImgs);
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-3">Week 3 Comic Builder</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {panels.map((text, i) => (
                    <div key={i} className="p-3 border rounded">
                        <div className="mb-2">
                            <input value={text} onChange={e => { const p = [...panels]; p[i] = e.target.value; setPanels(p); }} className="w-full border p-2 mb-2" />
                            <input type="file" accept="image/*" onChange={(e) => onImageChange(i, e)} />
                        </div>
                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                            {images[i] ? <img src={images[i]} alt={`panel ${i + 1}`} className="max-h-full" /> : <span className="text-gray-400">No image</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <button className="button" onClick={() => alert("Comic saved locally (placeholder) — implement backend save if needed")}>Save Comic</button>
            </div>
        </div>
    );
}
