import { useEffect, useState } from "react";

export default function Week3Quiz() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    useEffect(() => { fetchQuiz(); }, []);

    const fetchQuiz = async () => {
        const r = await fetch("/api/week3/quiz");
        const j = await r.json();
        if (j.ok) setQuestions(j.questions || []);
    };

    const submit = () => {
        // basic scoring for MCQ/vocab
        let s = 0, total = 0;
        questions.forEach((q, idx) => {
            if (q.type === "mcq" || q.type === "vocab") {
                total += 1;
                if (answers[q.id] === q.answer) s += 1;
            }
        });
        setScore({ score: s, total });
    };

    if (!questions.length) return <div className="p-6 bg-white rounded">Loading quiz…</div>;

    const q = questions[current];
    return (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-3">Week 3 Quiz</h3>
            <div className="mb-3 text-lg">{q.question}</div>

            {q.type === "mcq" && q.choices && q.choices.map((c, i) => (
                <div key={i} className="mb-2">
                    <label className="inline-flex items-center gap-2">
                        <input type="radio" name={`q${q.id}`} onChange={() => setAnswers({ ...answers, [q.id]: i })} />
                        {c}
                    </label>
                </div>
            ))}

            {q.type === "vocab" && q.choices && q.choices.map((c, i) => (
                <div key={i} className="mb-2">
                    <label className="inline-flex items-center gap-2">
                        <input type="radio" name={`q${q.id}`} onChange={() => setAnswers({ ...answers, [q.id]: i })} />
                        {c}
                    </label>
                </div>
            ))}

            <div className="flex gap-2 mt-4">
                <button className="button" onClick={() => setCurrent(Math.max(0, current - 1))}>Previous</button>
                <button className="button" onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}>Next</button>
                <button className="button" onClick={submit}>Submit Quiz</button>
            </div>

            {score && <div className="mt-4">Score: {score.score}/{score.total}</div>}
        </div>
    );
}
