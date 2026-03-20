export default function DialogueEditor({ project, setProject }) {

    const updateText = (i, value) => {
        const panels = [...project.panels];
        panels[i].latin_text = value;
        setProject({ ...project, panels });
    };

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Comic Dialogue</h3>
            {project.panels.map((p, i) => (
                <textarea
                    key={i}
                    className="border w-full p-2 mb-2"
                    placeholder="Write Latin dialogue..."
                    onChange={e => updateText(i, e.target.value)}
                />
            ))}
        </div>
    );
}
