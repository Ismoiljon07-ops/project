import React, { useState, useEffect } from "react";
import Auth from "./Auth";

function App() {
  const [user, setUser] = useState(localStorage.getItem("username") || null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ IT: 0, Medicine: 0, Art: 0, Business: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch("http://127.0.0.1:8000/api/assessments/")
      .then((res) => res.json())
      .then((data) => {
        setAssessments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [user]);

  const handleAuthSuccess = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setCurrentQuestionIndex(0);
    setScores({ IT: 0, Medicine: 0, Art: 0, Business: 0 });
    setIsCompleted(false);
  };

  // If user is not authenticated, show Login/Register flow
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading && assessments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Loading tests...</p>
      </div>
    );
  }

  const defaultQuestions = [
    {
      id: 1,
      text: "What kind of tasks do you enjoy working on the most?",
      answers: [
        { id: 1, text: "Writing code or building software", category: "IT" },
        { id: 2, text: "Treating people or studying biology", category: "Medicine" },
        { id: 3, text: "Drawing, designing, or playing music", category: "Art" },
        { id: 4, text: "Managing teams or planning business", category: "Business" }
      ]
    }
  ];

  const hasDbData = assessments && assessments.length > 0;
  const title = hasDbData ? assessments[0].title : "Career Orientation Test";
  const description = hasDbData ? assessments[0].description : "Find your perfect career path based on your interests.";
  const questions = hasDbData && assessments[0].questions && assessments[0].questions.length > 0 ? assessments[0].questions : defaultQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const displayAnswers = currentQuestion?.answers || currentQuestion?.options || [];

  const handleAnswerClick = (category) => {
    let finalCategory = category || "IT";
    setScores((prev) => ({
      ...prev,
      [finalCategory]: prev[finalCategory] + 1
    }));

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const getRecommendation = () => {
    let maxScore = -1;
    let recommendedCategory = "IT";

    Object.keys(scores).forEach((cat) => {
      if (scores[cat] > maxScore) {
        maxScore = scores[cat];
        recommendedCategory = cat;
      }
    });

    const recommendations = {
      IT: { role: "Software Engineer / Data Scientist", desc: "You have a strong logical mind. You enjoy problem-solving and building digital solutions." },
      Medicine: { role: "Doctor / Healthcare Professional", desc: "You possess high empathy and a deep interest in biological sciences and helping others." },
      Art: { role: "UI/UX Designer / Creative Director", desc: "Your imagination is your biggest strength. You view the world through a visual and creative lens." },
      Business: { role: "Project Manager / Entrepreneur", desc: "You are a natural leader. You excel at organization, communication, and strategy." }
    };

    return recommendations[recommendedCategory] || recommendations["IT"];
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between">
      {/* Navbar Section */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-teal-400 tracking-wide">CareerPlatform</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300 font-medium">Welcome, <span className="text-teal-400">{user}</span></span>
          <button
            onClick={handleLogout}
            className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-750 transition cursor-pointer font-mono"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          {!isCompleted ? (
            <div>
              <h1 className="text-3xl font-bold text-center text-teal-400 mb-2">{title}</h1>
              <p className="text-gray-400 text-center text-sm mb-6">{description}</p>

              <div className="mb-4 flex justify-between items-center text-xs text-teal-500 font-mono">
                <span>Question: {currentQuestionIndex + 1} / {questions.length}</span>
              </div>

              <h2 className="text-xl font-medium mb-6 text-gray-100">{currentQuestion?.text}</h2>

              <div className="space-y-3">
                {displayAnswers.length > 0 ? (
                  displayAnswers.map((answer, index) => (
                    <button
                      key={answer.id || index}
                      onClick={() => handleAnswerClick(answer.category)}
                      className="w-full text-left bg-gray-800 hover:bg-gray-700 active:bg-gray-750 text-gray-200 p-4 rounded-xl border border-gray-750 transition duration-200 cursor-pointer text-sm"
                    >
                      {answer.text}
                    </button>
                  ))
                ) : (
                  <p className="text-red-400 text-sm">No options found for this question.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex p-3 bg-teal-500/10 text-teal-400 rounded-full mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-teal-400 mb-2">Assessment Completed!</h1>
              <p className="text-gray-400 text-sm mb-8">Based on your choices, here is your career mapping profile:</p>
              
              <div className="bg-gray-950 p-6 rounded-xl border border-gray-800 mb-6 text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-500 block mb-1">Recommended Path</span>
                <h3 className="text-2xl font-bold text-white mb-2">{recommendation.role}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{recommendation.desc}</p>
              </div>

              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setScores({ IT: 0, Medicine: 0, Art: 0, Business: 0 });
                  setIsCompleted(false);
                }}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-gray-950 font-semibold rounded-xl transition duration-200 cursor-pointer text-sm"
              >
                Retake Assessment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;