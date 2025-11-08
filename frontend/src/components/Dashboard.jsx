import React, { useState } from 'react';
import Header from './Header';
import FileUpload from './FileUpload';
import ContentTabs from './ContentTabs';
import './Dashboard.css';

const Dashboard = () => {
  const [documentId, setDocumentId] = useState(null);
  const [fileName, setFileName] = useState('');
  const [generatedContent, setGeneratedContent] = useState({
    summary: null,
    flashcards: null,
    quiz: null,
    mindMap: null
  });

  const handleUploadSuccess = (docId, name) => {
    setDocumentId(docId);
    setFileName(name);
    setGeneratedContent({
      summary: null,
      flashcards: null,
      quiz: null,
      mindMap: null
    });
  };

  const handleContentGenerated = (type, content) => {
    setGeneratedContent(prev => ({
      ...prev,
      [type]: content
    }));
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-content">
          {!documentId ? (
            <div className="upload-section fade-in">
              <div className="welcome-text">
                <h1>Transform Your Study Materials with AI</h1>
                <p>Upload your lecture notes, PDFs, or handwritten documents and let AI generate comprehensive study materials for you.</p>
              </div>

              {/* Statistics Section */}
              <div className="stats-section">
                <div className="stat-card">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Documents Processed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Study Materials Created</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Time Saved</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">4.9/5</div>
                  <div className="stat-label">User Rating</div>
                </div>
              </div>

              <FileUpload onUploadSuccess={handleUploadSuccess} />

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">📝</div>
                  <h3>Smart Summaries</h3>
                  <p>Get concise, well-structured summaries of your study materials</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎴</div>
                  <h3>Flashcards</h3>
                  <p>AI-generated Q&A pairs for quick and effective revision</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Interactive Quizzes</h3>
                  <p>Test your knowledge with AI-created multiple-choice questions</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🧠</div>
                  <h3>Mind Maps</h3>
                  <p>Visualize concepts with hierarchical mind maps</p>
                </div>
              </div>

              {/* How It Works Section */}
              <div className="how-it-works">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h4>Upload Your Document</h4>
                    <p>Simply drag & drop or select your PDF, DOCX, or TXT file. Our AI accepts files up to 10MB.</p>
                  </div>
                  <div className="step-arrow">→</div>
                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h4>AI Processing</h4>
                    <p>Our advanced AI analyzes your content, extracts key concepts, and structures the information.</p>
                  </div>
                  <div className="step-arrow">→</div>
                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h4>Get Study Materials</h4>
                    <p>Receive comprehensive summaries, flashcards, quizzes, and mind maps ready for your study session.</p>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="benefits-section">
                <h2 className="section-title">Why Choose AI Study Genius?</h2>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <div className="benefit-icon">⚡</div>
                    <h4>Lightning Fast</h4>
                    <p>Generate study materials in seconds, not hours</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🎯</div>
                    <h4>Personalized</h4>
                    <p>AI adapts to your content and learning style</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">📱</div>
                    <h4>Accessible Anywhere</h4>
                    <p>Study materials available on any device, anytime</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">💾</div>
                    <h4>Export & Save</h4>
                    <p>Download as PDF or TXT for offline studying</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🌐</div>
                    <h4>Multiple Formats</h4>
                    <p>Supports PDF, DOCX, and TXT documents</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🔒</div>
                    <h4>Secure & Private</h4>
                    <p>Your documents are processed securely and privately</p>
                  </div>
                </div>
              </div>

              {/* Use Cases Section */}
              <div className="use-cases-section">
                <h2 className="section-title">Perfect For</h2>
                <div className="use-cases-grid">
                  <div className="use-case-card">
                    <h4>👨‍🎓 Students</h4>
                    <p>Transform lecture slides and notes into comprehensive study guides</p>
                  </div>
                  <div className="use-case-card">
                    <h4>👩‍🏫 Teachers</h4>
                    <p>Create quizzes and study materials for your students quickly</p>
                  </div>
                  <div className="use-case-card">
                    <h4>📚 Researchers</h4>
                    <p>Summarize research papers and extract key insights</p>
                  </div>
                  <div className="use-case-card">
                    <h4>💼 Professionals</h4>
                    <p>Convert training materials into digestible learning content</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-section fade-in">
              <div className="document-info">
                <h2>📄 {fileName}</h2>
                <button 
                  className="new-document-btn"
                  onClick={() => {
                    setDocumentId(null);
                    setFileName('');
                  }}
                >
                  Upload New Document
                </button>
              </div>
              <ContentTabs
                documentId={documentId}
                generatedContent={generatedContent}
                onContentGenerated={handleContentGenerated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


