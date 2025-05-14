import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WATAttemptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wat, setWat] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [student, setStudent] = useState(null);
  const [testEnded, setTestEnded] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const MAX_TAB_SWITCHES = 3;

  // Helper functions
  const toggleShowResults = () => {
    setShowResults(prev => !prev);
  };

  const getQuestionResult = (questionId) => {
    if (!wat || !wat.questions) return null;
    return wat.questions.find(q => q._id === questionId);
  };

  // const getCorrectAnswer = (questionId) => {
  //   const question = getQuestionResult(questionId);
  //   return question?.correctAnswer;
  // };

  // Initialize student data from localStorage
  useEffect(() => {
    const storedStudent = localStorage.getItem("user");
    if (storedStudent) {
      try {
        const parsed = JSON.parse(storedStudent);
        if (parsed?.id) setStudent(parsed);
      } catch (err) {
        console.error("Error parsing student data:", err);
      }
    }
  }, []);

  // Tab switching detection
  useEffect(() => {
    if (submitted || testEnded) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        setShowWarning(true);

        if (newCount >= MAX_TAB_SWITCHES) {
          setTestEnded(true);
          handleAutoSubmit();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabSwitchCount, submitted, testEnded]);

  // Fetch WAT data and set timer
  useEffect(() => {
    const fetchWat = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/wats/display/${id}`);
        const watData = res.data;
        
        const now = new Date();
        const start = new Date(watData.startTime);
        const end = new Date(watData.endTime);
        
        setWat(watData);
        setStartTime(start);
        setEndTime(end);
        setAnswers(Array(watData.questions.length).fill(null));
        
        if (now > end) {
          setTestEnded(true);
          return;
        }
        
        const initialTimeRemaining = Math.floor((end - now) / 1000);
        setTimeRemaining(initialTimeRemaining > 0 ? initialTimeRemaining : 0);
        
      } catch (err) {
        console.error('Error fetching WAT:', err);
      }
    };

    fetchWat();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (testEnded || timeRemaining <= 0) return;

    const timerId = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timerId);
          setTestEnded(true);
          handleAutoSubmit();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeRemaining, testEnded]);

  const handleAnswerChange = (selectedOption) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(updatedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < wat.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAutoSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/wats/submit', {
        watId: wat._id,
        studentId: student.id,
        answers: wat.questions.map((q, i) => ({
          questionId: q._id,
          selectedOption: answers[i]
        })),
        tabSwitches: tabSwitchCount,
        autoSubmitted: true
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        setScore(response.data.score);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Auto submission error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    }
  };
  
  const handleSubmit = async () => {
    if (!student?.id) {
      alert('Student data not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/wats/submit', {
        watId: wat._id,
        studentId: student.id,
        answers: wat.questions.map((q, i) => ({
          questionId: q._id,
          selectedOption: answers[i]
        })),
        tabSwitches: tabSwitchCount,
        autoSubmitted: false
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setScore(response.data.score);
        setSubmitted(true);
      } else {
        alert('Submission failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(err.response?.data?.error || 'Failed to submit WAT. Please try again.');
    }
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!wat) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading WAT...</p>
      </div>
    </div>
  );

  if (testEnded && !submitted) {
    handleAutoSubmit();
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Submitting your answers...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = wat.questions[currentQuestionIndex];
  const totalQuestions = wat.questions.length;
  const totalDuration = (endTime - startTime) / 1000;
  const progressPercentage = ((totalDuration - timeRemaining) / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Tab Switch Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-blue-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-red-600">Warning!</h3>
              <button 
                onClick={() => setShowWarning(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <p className="mb-4">
              You have switched tabs {tabSwitchCount} time(s). Switching tabs more than {MAX_TAB_SWITCHES} times will result in automatic submission of your test.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Questions Navigation Sidebar */}
        {!submitted && (
          <div className="lg:w-1/4 bg-white rounded-xl shadow-md overflow-hidden h-fit">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="font-bold">Questions</h2>
            </div>
            <div className="p-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-3 gap-3">
              {wat.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                    currentQuestionIndex === index
                      ? 'bg-blue-600 text-white'
                      : answers[index]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                <span className="text-sm">Current</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
                <span className="text-sm">Attempted</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300 mr-2"></div>
                <span className="text-sm">Unattempted</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:flex-1 bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header with timer and progress */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 className="text-xl font-bold mb-2 sm:mb-0">
                {wat.subject} - WAT {wat.watNumber}
              </h1>
              <div className="flex items-center space-x-4">
                {!submitted && (
                  <>
                    <div className="bg-blue-900 px-3 py-1 rounded-lg">
                      <span className="font-mono font-bold">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <div className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-sm font-medium">
                      Tab Switches: {tabSwitchCount}/{MAX_TAB_SWITCHES}
                    </div>
                  </>
                )}
                <div className="text-sm sm:text-base">
                  {!submitted && `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
                  {submitted && (
                    <span className="font-semibold">
                      Score: {score}/{totalQuestions} ({Math.round((score/totalQuestions)*100)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {!submitted && (
              <>
                {/* Time progress bar */}
                <div className="mt-3 w-full bg-blue-400 rounded-full h-2">
                  <div 
                    className="bg-yellow-300 h-2 rounded-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                {/* Test time information */}
                <div className="mt-2 text-xs sm:text-sm flex flex-wrap justify-between">
                  <div>
                    <span className="font-semibold">Started:</span> {startTime.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Ends:</span> {endTime.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Question Card */}
          <div className="p-6">
            {!submitted ? (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <p className="text-xl font-medium text-gray-900">
                    {currentQuestion.questionText}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, i) => (
                    <div 
                      key={i} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        answers[currentQuestionIndex] === option 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerChange(option)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQuestionIndex] === option 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-400'
                        }`}>
                          {answers[currentQuestionIndex] === option && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={goToPrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentQuestionIndex === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={goToNextQuestion}
                      disabled={!answers[currentQuestionIndex]}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        !answers[currentQuestionIndex]
                          ? 'bg-blue-300 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!answers[currentQuestionIndex]}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        !answers[currentQuestionIndex]
                          ? 'bg-green-300 text-white cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block bg-gradient-to-br from-green-100 to-green-200 rounded-full p-4 mb-4 shadow-md">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Submitted Successfully!</h2>
                <div className="mb-6">
                  <div className="inline-block bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
                    <span className="font-bold text-2xl">{score}</span> out of {totalQuestions} correct
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600">Percentage: </span>
                    <span className="font-bold text-blue-600">
                      {Math.round((score/totalQuestions)*100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    onClick={toggleShowResults}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    {showResults ? 'Hide Detailed Results' : 'View Detailed Results'}
                  </button>
                  <button
                    onClick={() => navigate('/student-dashboard')}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Return to Dashboard
                  </button>
                </div>
                
                {showResults && (
                  <div className="mt-8 text-left border-t pt-8">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                      Detailed Results
                    </h3>
                    <div className="space-y-8">
                      {wat.questions.map((question, index) => {
                        const questionResult = getQuestionResult(question._id);
                        const isCorrect = questionResult?.correctAnswer === answers[index];
                        const studentAnswer = answers[index];
                        const correctAnswer = questionResult?.correctAnswer;
                        
                        return (
                          <div key={index} className="border-b pb-8 last:border-0">
                            <div className="flex items-start mb-4">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                                isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {isCorrect ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-lg mb-1">
                                  Q{index + 1}. {question.questionText}
                                </p>
                                <div className="text-sm text-gray-500">
                                  {isCorrect ? (
                                    <span className="text-green-600">You answered correctly</span>
                                  ) : (
                                    <span className="text-red-600">Your answer was incorrect</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 ml-9">
                              {question.options.map((option, i) => {
                                let optionClass = "p-3 rounded border flex items-start";
                                let indicator = null;
                                
                                if (option === correctAnswer) {
                                  optionClass += " bg-green-50 border-green-200";
                                  indicator = (
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                      </svg>
                                    </div>
                                  );
                                } else if (option === studentAnswer && !isCorrect) {
                                  optionClass += " bg-red-50 border-red-200";
                                  indicator = (
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </div>
                                  );
                                } else {
                                  optionClass += " border-gray-200";
                                  indicator = (
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
                                  );
                                }
                                
                                return (
                                  <div key={i} className={optionClass}>
                                    {indicator}
                                    <span className={option === correctAnswer ? "font-medium text-green-800" : ""}>
                                      {option}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WATAttemptPage;