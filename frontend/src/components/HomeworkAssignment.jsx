import { useState } from 'react';

export default function HomeworkAssignment({ comic }) {
    const [labels, setLabels] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleLabelChange = (panelId, value) => {
        setLabels(prev => ({
            ...prev,
            [panelId]: value
        }));
    };

    const submitHomework = async () => {
        setSubmitted(true);

        const homeworkText = comic.panels.map(panel =>
            `Panel ${panel.id}: ${labels[panel.id] || '(not completed)'}`
        ).join('\n');

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: `Review this Latin homework where students labeled comic panels with Latin descriptions. Provide encouraging, constructive feedback for a beginner.

Comic story: ${comic.title}
Student's labels:
${homeworkText}

Original panel texts for reference:
${comic.panels.map(p => `Panel ${p.id}: ${p.latinText}`).join('\n')}

Provide:
1. What they did well
2. Gentle corrections if needed
3. Encouragement to continue learning
4. A score out of 100`
                        }
                    ],
                })
            });

            const data = await response.json();
            setFeedback(data.content[0].text);
        } catch (error) {
            console.error("Error getting feedback:", error);
            setFeedback("Great effort! Keep practicing your Latin descriptions.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
                ✏️ Homework: Label the Story Panels
            </h2>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700">
                    <strong>Assignment:</strong> Write a Latin description for each panel of the comic story.
                    Use the vocabulary you've learned this week!
                </p>
            </div>

            <div className="space-y-6 mb-6">
                {comic.panels.map(panel => (
                    <div key={panel.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center text-2xl font-bold text-amber-800">
                                {panel.id}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-2 italic">
                                    Scene: {panel.translation}...
                                </p>
                                <textarea
                                    value={labels[panel.id] || ''}
                                    onChange={(e) => handleLabelChange(panel.id, e.target.value)}
                                    placeholder="Write your Latin description here..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="3"
                                    disabled={submitted}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!submitted ? (
                <button
                    onClick={submitHomework}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold"
                >
                    Submit Homework for Review
                </button>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4 text-green-900 flex items-center gap-2">
                        <span>✅</span> Teacher's Feedback
                    </h3>
                    {feedback ? (
                        <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700">{feedback}</div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">Getting feedback from your teacher...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}