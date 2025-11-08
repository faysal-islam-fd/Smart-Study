import React, { useState } from 'react';
import axios from 'axios';
import { FiDownload, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportToText, exportToPDF } from '../utils/exportUtils';
import API_BASE_URL from '../utils/api';
import './ContentView.css';

const QuizView = ({ documentId, content, onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate/quiz/${documentId}`);
      onContentGenerated(response.data.quiz);
      toast.success('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: answerIndex
      });
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    content.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    toast.info(`You scored ${correctCount} out of ${content.length}!`);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const handleExportText = () => {
    const text = content.map((q, i) => 
      `Question ${i + 1}: ${q.question}\n${q.options.map((opt, j) => `${j + 1}. ${opt}`).join('\n')}\nCorrect Answer: ${q.options[q.correctAnswer]}\nExplanation: ${q.explanation}\n\n`
    ).join('');
    exportToText(text, 'quiz.txt');
    toast.success('Exported as text file!');
  };

  const handleExportPDF = () => {
    const text = content.map((q, i) => 
      `Question ${i + 1}: ${q.question}\n${q.options.map((opt, j) => `${j + 1}. ${opt}`).join('\n')}\nCorrect Answer: ${q.options[q.correctAnswer]}\nExplanation: ${q.explanation}\n\n`
    ).join('');
    exportToPDF('Quiz', text, 'quiz.pdf');
    toast.success('Exported as PDF!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating your quiz with AI...</p>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="empty-state">
        <p>No quiz generated yet.</p>
        <button className="generate-btn" onClick={generateQuiz}>
          Generate Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="content-view">
      <div className="content-header">
        <h2>📊 Quiz ({content.length} Questions)</h2>
        <div className="action-buttons">
          {showResults && (
            <button className="action-btn reset-btn" onClick={handleReset}>
              <FiRefreshCw size={18} />
              <span>Retry</span>
            </button>
          )}
          <button className="action-btn" onClick={handleExportText}>
            <FiDownload size={18} />
            <span>TXT</span>
          </button>
          <button className="action-btn" onClick={handleExportPDF}>
            <FiDownload size={18} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {showResults && (
        <div className="quiz-results">
          <h3>Your Score: {score} / {content.length}</h3>
          <div className="score-percentage">
            {Math.round((score / content.length) * 100)}%
          </div>
        </div>
      )}

      <div className="quiz-container">
        {content.map((question, qIndex) => (
          <div key={qIndex} className="quiz-question">
            <div className="question-header">
              <span className="question-number">Question {qIndex + 1}</span>
              {showResults && selectedAnswers[qIndex] === question.correctAnswer && (
                <FiCheckCircle className="correct-icon" size={24} />
              )}
              {showResults && selectedAnswers[qIndex] !== question.correctAnswer && (
                <FiXCircle className="incorrect-icon" size={24} />
              )}
            </div>
            <h4>{question.question}</h4>
            <div className="options-list">
              {question.options.map((option, oIndex) => {
                const isSelected = selectedAnswers[qIndex] === oIndex;
                const isCorrect = question.correctAnswer === oIndex;
                const showCorrect = showResults && isCorrect;
                const showIncorrect = showResults && isSelected && !isCorrect;

                return (
                  <div
                    key={oIndex}
                    className={`option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                  >
                    <div className="option-marker">
                      {String.fromCharCode(65 + oIndex)}
                    </div>
                    <span>{option}</span>
                  </div>
                );
              })}
            </div>
            {showResults && question.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!showResults && Object.keys(selectedAnswers).length === content.length && (
        <button className="submit-quiz-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}
    </div>
  );
};

export default QuizView;


