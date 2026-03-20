export default function PortfolioSubmit({ project }) {

    const submit = async () => {
        await fetch("http://localhost:8000/api/week4/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });
        alert("Project submitted!");
    };

    return (
        <button onClick={submit} className="mt-6 bg-green-600 text-white px-6 py-3 rounded">
            Submit Final Comic
        </button>
    );
}
