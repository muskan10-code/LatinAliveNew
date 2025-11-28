import { useState } from 'react';
import ComicViewer from './components/ComicViewer';
import VocabularyPanel from './components/VocabularyPanel';
import MorphoAnalyzer from './components/MorphoAnalyzer';
import HomeworkAssignment from './components/HomeworkAssignment';
import SentencePuzzle from './components/SentencePuzzle';
import EscapeRoom from './components/EscapeRoom';
import ScrambleRebuild from './components/ScrambleRebuild';
import { week3Fables } from "./data/week3Fables";
import FableReader from "./components/FableReader";
import FableAnalyzer from "./components/FableAnaylzer";
import ComicRewriter from "./components/ComicRewriter";
import Week3ComicBuilder from "./components/Week3ComicBuilder";
import Week3Quiz from "./components/Week3Quiz";


// Week 1 data
import { fabulaRomana } from './data/week1Comic';
import { week1Vocabulary } from './data/week1Vocabulary';

function App() {
    const [activeWeek, setActiveWeek] = useState("week1");
    const [activeTab, setActiveTab] = useState("comic");
    const [selectedFable, setSelectedFable] = useState(week3Fables[0]);
    const [exported, setExported] = useState(null);

    // Week tabs
    const weekTabs = [
        { id: "week1", label: "Week 1" },
        { id: "week2", label: "Week 2" },
        { id: "week3", label: "Week 3" },
        { id: "week4", label: "Week 4" }
    ];

    const week1Tabs = [
        { id: "comic", label: "📖 Comic Story" },
        { id: "vocabulary", label: "📚 Vocabulary" },
        { id: "analyzer", label: "🔍 Analyzer" },
        { id: "homework", label: "✏️ Homework" }
    ];
    const week2Tabs = [
        { id: "sentencePuzzle", label: "Sentence Puzzle" },
        { id: "scrambleRebuild", label: "Scramble Rebuild" },
        { id: "escapeRoom", label: "Escape Room" },
    ];
    const week3Tabs = [
        { id: "fable", label: "Fable" },
        { id: "comicBuilder", label: "Comic Builder" },
        { id: "quiz", label: "Escape Room" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            <header className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-6 py-4 text-center">
                    <h1 className="text-3xl font-bold text-blue-900">🏛️ LatinAlive</h1>
                    <p className="text-gray-600 mt-1">Discovering Latin Through Visual Stories</p>
                </div>
            </header>

            <nav className="bg-white border-b shadow-sm sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 flex gap-2 py-3 overflow-x-auto">
                    {weekTabs.map(week => (
                        <button
                            key={week.id}
                            onClick={() => {
                                setActiveWeek(week.id);
                                setActiveTab("comic");
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${activeWeek === week.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {week.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-8">

                {activeWeek === "week1" && (
                    <>
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                            {week1Tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {activeTab === "comic" && <ComicViewer comic={fabulaRomana} />}
                        {activeTab === "vocabulary" && <VocabularyPanel vocabulary={week1Vocabulary} />}
                        {activeTab === "analyzer" && <MorphoAnalyzer />}
                        {activeTab === "homework" && <HomeworkAssignment comic={fabulaRomana} />}
                    </>
                )}

                {activeWeek === "week2" && (
                    <>
                        <div className="text-center text-gray-700 text-xl py-20">
                            {week2Tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {activeTab === "sentencePuzzle" && <SentencePuzzle example="Puella in horto ambulat." />}
                        {activeTab === "scrambleRebuild" && <ScrambleRebuild />}
                        {activeTab === "escapeRoom" && <EscapeRoom />}
                    </>
                )}

                {activeWeek === "week3" && (
                    <>
                        <div className="text-center text-gray-700 text-xl py-20">
                            <div className="w-1/3">
                                {week3Fables.map(f => (
                                    <button key={f.id} onClick={() => setSelectedFable(f)} className="block w-full text-left p-2 border mb-2">{f.title}</button>
                                ))}
                            </div>
                            <div className="w-2/3 space-y-4">
                                <FableReader fable={selectedFable} />
                                <FableAnalyzer />
                                <ComicRewriter fable={selectedFable} onExport={(data) => setExported(data)} />
                                <Week3ComicBuilder exported={exported} />
                                <Week3Quiz />
                            </div>
                        </div>
                    </>
                )}

                {activeWeek === "week4" && (
                    <div className="text-center text-gray-700 text-xl py-20">
                        Week 4 content coming soon…
                    </div>
                )}

            </main>

            <footer className="bg-white border-t text-center py-6 text-gray-600 text-sm">
                LatinAlive — Learn Latin With Comics & AI
            </footer>
        </div>
    );
}

export default App;
