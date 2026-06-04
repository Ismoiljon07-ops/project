import React, { useState, useEffect } from 'react';

const Assessment = () => {
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/assessments/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setAssessment(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-white text-xl">Loading test...</div>;
  if (!assessment) return <div className="text-center mt-10 text-red-500 text-xl">No active tests found.</div>;

  const currentQuestion = assessment.questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
    
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-800">
      <h1 className="text-3xl font-bold text-center text-teal-400 mb-2">{assessment.title}</h1>
      <p className="text-gray-400 text-center mb-6">{assessment.description}</p>

      {!isFinished ? (
        <div>
          <div className="mb-4 text-sm text-teal-500 font-semibold">
            Question: {currentQuestionIndex + 1} / {assessment.questions.length}
          </div>
          <h2 className="text-xl font-medium mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left p-4 bg-gray-800 hover:bg-teal-600 hover:text-black transition-all rounded-xl border border-gray-700 font-medium"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Assessment Completed!</h2>
          <p className="text-gray-300 mb-6">Your results have been successfully calculated.</p>
          <button 
            onClick={() => { setCurrentQuestionIndex(0); setIsFinished(false); setAnswers({}); }}
            className="px-6 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-all"
          >
            Restart Test
          </button>
        </div>
      )}
    </div>
  );
};

export default Assessment;