import DialogueEditor from "./DialogueEditor";
import GlossaryView from "./GlossaryView";
import PortfolioSubmit from "./PortfolioSubmit";
import { useState } from "react";

export default function Week4Project() {
    const [project, setProject] = useState({
        group_name: "",
        title: "",
        panels: [
            { panel_id: 1, latin_text: "", image_prompt: "" }
        ]
    });

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-4">Week 4 Final Comic Project</h2>

            <input
                placeholder="Group Name"
                className="border p-2 w-full mb-2"
                onChange={e => setProject({ ...project, group_name: e.target.value })}
            />

            <input
                placeholder="Comic Title"
                className="border p-2 w-full mb-4"
                onChange={e => setProject({ ...project, title: e.target.value })}
            />

            <DialogueEditor project={project} setProject={setProject} />
            <GlossaryView project={project} />
            <PortfolioSubmit project={project} />
        </div>
    );
}
