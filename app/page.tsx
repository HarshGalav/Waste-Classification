'use client';

import { useState, useEffect } from 'react';
import { Recycle, Star, Upload, TrendingUp, Award } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import WasteCard from './components/WasteCard';
import StatsCard from './components/StatsCard';
import { WasteSubmission, WasteAnalysis } from './types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'submit' | 'verify' | 'dashboard'>('submit');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [userPoints, setUserPoints] = useState(1250);

  // Mock data for demonstration
  useEffect(() => {
    const mockSubmissions: WasteSubmission[] = [
      {
        id: '1',
        userId: 'user1',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmlsZT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QbGFzdGljIEJvdHRsZXM8L3RleHQ+PC9zdmc+',
        wasteType: 'plastic',
        quantity: 'medium',
        estimatedPoints: 8,
        status: 'verified',
        submittedAt: new Date(Date.now() - 86400000),
        verifiedAt: new Date(Date.now() - 43200000),
      },
      {
        id: '2',
        userId: 'user1',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmlsZT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QYXBlciBCYWdzPC90ZXh0Pjwvc3ZnPg==',
        wasteType: 'paper',
        quantity: 'large',
        estimatedPoints: 6,
        status: 'pending',
        submittedAt: new Date(Date.now() - 3600000),
      },
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
    setAnalysis(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage || !imagePreview) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imagePreview }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Fallback mock analysis for demo
      setAnalysis({
        wasteType: 'plastic',
        quantity: 'medium',
        confidence: 85,
        estimatedPoints: 6,
        description: 'Plastic containers and bottles'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const submitWaste = async () => {
    if (!analysis || !selectedImage) return;

    const newSubmission: WasteSubmission = {
      id: Date.now().toString(),
      userId: 'user1',
      imageUrl: imagePreview,
      wasteType: analysis.wasteType,
      quantity: analysis.quantity,
      estimatedPoints: analysis.estimatedPoints,
      status: 'pending',
      submittedAt: new Date(),
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setSelectedImage(null);
    setImagePreview('');
    setAnalysis(null);
    
    // Switch to dashboard to see the submission
    setActiveTab('dashboard');
  };

  const verifySubmission = (id: string) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === id
          ? { ...sub, status: 'verified' as const, verifiedAt: new Date() }
          : sub
      )
    );
    setUserPoints(prev => {
      const submission = submissions.find(s => s.id === id);
      return prev + (submission?.estimatedPoints || 0);
    });
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const verifiedSubmissions = submissions.filter(s => s.status === 'verified');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg">
                <Recycle size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-dark-text">EcoWaste AI</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full">
                <Star className="text-yellow-400" size={16} />
                <span className="text-dark-text font-semibold">{userPoints.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-8">
          {[
            { id: 'submit', label: 'Submit Waste', icon: Upload },
            { id: 'verify', label: 'Verify Waste', icon: Award },
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'submit' | 'verify' | 'dashboard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-dark-card text-dark-muted hover:text-dark-text hover:bg-dark-border'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-dark-text mb-6">Submit Waste for Analysis</h2>
              
              <ImageUpload
                onImageSelect={handleImageSelect}
                preview={imagePreview}
                label="Upload Waste Image"
              />

              {imagePreview && !analysis && (
                <div className="mt-6">
                  <button
                    onClick={analyzeImage}
                    disabled={analyzing}
                    className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? 'Analyzing with AI...' : 'Analyze Waste'}
                  </button>
                </div>
              )}

              {analysis && (
                <div className="mt-6 p-6 bg-dark-card rounded-xl border border-dark-border">
                  <h3 className="text-lg font-semibold text-dark-text mb-4">Analysis Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-muted">Waste Type:</span>
                      <span className="text-dark-text font-medium capitalize">{analysis.wasteType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-muted">Quantity:</span>
                      <span className="text-dark-text font-medium capitalize">{analysis.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-muted">Confidence:</span>
                      <span className="text-dark-text font-medium">{analysis.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-muted">Estimated Points:</span>
                      <span className="text-green-400 font-bold">{analysis.estimatedPoints} points</span>
                    </div>
                    <p className="text-dark-muted text-sm mt-2">{analysis.description}</p>
                  </div>

                  <button
                    onClick={submitWaste}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Submit for Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-dark-text mb-6">Verify Waste Submissions</h2>
            
            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <Award size={48} className="text-dark-muted mx-auto mb-4" />
                <p className="text-dark-muted">No pending submissions to verify</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingSubmissions.map(submission => (
                  <WasteCard
                    key={submission.id}
                    submission={submission}
                    onVerify={verifySubmission}
                    showVerifyButton
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Points"
                value={userPoints.toLocaleString()}
                icon={<Star className="text-yellow-400" size={24} />}
                trend="+12% this week"
              />
              <StatsCard
                title="Submissions"
                value={submissions.length}
                icon={<Upload className="text-blue-400" size={24} />}
              />
              <StatsCard
                title="Verified"
                value={verifiedSubmissions.length}
                icon={<Award className="text-green-400" size={24} />}
              />
              <StatsCard
                title="Impact Score"
                value="A+"
                icon={<TrendingUp className="text-purple-400" size={24} />}
                trend="Environmental impact"
              />
            </div>

            {/* Recent Submissions */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-dark-text mb-6">Recent Submissions</h3>
              
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <Upload size={48} className="text-dark-muted mx-auto mb-4" />
                  <p className="text-dark-muted">No submissions yet</p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Submit Your First Waste
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {submissions.slice(0, 5).map(submission => (
                    <WasteCard key={submission.id} submission={submission} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}