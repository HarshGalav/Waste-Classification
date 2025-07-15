'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Recycle, Star, Upload, Award, Camera, Brain, CheckCircle, BarChart3, Target, Users } from 'lucide-react';
import Image from 'next/image';
import AuthButton from '../components/AuthButton';
import { WasteSubmission, WasteAnalysis, User } from '../types';

// ImageUpload Component
const ImageUpload = ({ onImageSelect, preview, label }: {
  onImageSelect: (file: File, preview: string) => void;
  preview: string;
  label: string;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-green-400 transition-colors bg-slate-800/50">
          {preview ? (
            <Image src={preview} alt="Preview" width={500} height={500} className="max-w-full max-h-64 mx-auto rounded-lg" />
          ) : (
            <div className="space-y-4">
              <Camera size={48} className="text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-300">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// WasteCard Component
const WasteCard = ({ submission, onVerify, showVerifyButton = false }: {
  submission: WasteSubmission;
  onVerify?: (id: string) => void;
  showVerifyButton?: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex gap-4">
        <Image
          src={submission.imageUrl}
          alt="Waste submission"
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white capitalize">
                {submission.wasteType} - {submission.quantity}
              </h3>
              <p className="text-sm text-gray-400">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
              {submission.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-semibold">
              {submission.estimatedPoints} points
            </span>
            {showVerifyButton && submission.status === 'pending' && onVerify && (
              <button
                onClick={() => onVerify(submission.id)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// StatsCard Component
const StatsCard = ({ title, value, icon, trend }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
      {trend && (
        <p className="text-xs text-green-400">{trend}</p>
      )}
    </div>
  </div>
);

export default function AppPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'submit' | 'verify' | 'dashboard'>('dashboard');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
      fetchSubmissions();
    }
  }, [fetchSubmissions, session, status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions-fallback?userId=${session?.user?.id}`);
      if (response.ok) {
        const submissionsData = await response.json();
        setSubmissions(submissionsData);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

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
        body: JSON.stringify({
          image: imagePreview
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Fallback to mock data if API fails
      const wasteTypes = ['plastic', 'paper', 'metal', 'glass', 'organic'];
      const quantities = ['small', 'medium', 'large'];
      
      setAnalysis({
        wasteType: wasteTypes[Math.floor(Math.random() * wasteTypes.length)] as any,
        quantity: quantities[Math.floor(Math.random() * quantities.length)] as any,
        confidence: Math.floor(Math.random() * 20) + 80,
        estimatedPoints: Math.floor(Math.random() * 15) + 5,
        description: 'Fallback analysis - API temporarily unavailable'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const submitWaste = async () => {
    if (!analysis || !selectedImage) return;

    try {
      const response = await fetch('/api/submissions-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imagePreview,
          wasteType: analysis.wasteType,
          quantity: analysis.quantity,
          estimatedPoints: analysis.estimatedPoints,
        }),
      });

      if (response.ok) {
        const newSubmission = await response.json();
        setSubmissions(prev => [newSubmission, ...prev]);
        setSelectedImage(null);
        setImagePreview('');
        setAnalysis(null);
        setActiveTab('dashboard');
        
        // Refresh user data to update stats
        fetchUserData();
      }
    } catch (error) {
      console.error('Error submitting waste:', error);
    }
  };

  const verifySubmission = async (id: string) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: id,
          status: 'verified'
        }),
      });

      if (response.ok) {
        fetchSubmissions();
        fetchUserData();
      }
    } catch (error) {
      console.error('Error verifying submission:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to access the app</h1>
          <AuthButton />
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const verifiedSubmissions = submissions.filter(s => s.status === 'verified');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-lg">
                <Recycle size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">EcoWaste AI</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-400/30">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-white font-semibold">{currentUser.points.toLocaleString()} pts</span>
                </div>
              )}
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Leaderboard
              </button>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'submit', label: 'Submit Waste', icon: Upload },
            { id: 'verify', label: 'Verify Waste', icon: Award }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'submit' | 'verify' | 'dashboard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-slate-800/50 text-gray-300 hover:text-white hover:bg-slate-700/50 border border-slate-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-2xl p-8 border border-green-400/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl">
                  <Target size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome back, {session?.user?.name}!</h2>
                  <p className="text-gray-300">Transform waste into environmental impact with AI</p>
                </div>
              </div>
              {currentUser && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{currentUser.totalSubmissions}</div>
                    <div className="text-sm text-gray-400">Total Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{currentUser.verifiedSubmissions}</div>
                    <div className="text-sm text-gray-400">Verified Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{currentUser.points}</div>
                    <div className="text-sm text-gray-400">Points Earned</div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            {currentUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Points"
                  value={currentUser.points.toLocaleString()}
                  icon={<Star className="text-yellow-400" size={24} />}
                />
                <StatsCard
                  title="Submissions"
                  value={currentUser.totalSubmissions}
                  icon={<Upload className="text-blue-400" size={24} />}
                />
                <StatsCard
                  title="Verified"
                  value={currentUser.verifiedSubmissions}
                  icon={<CheckCircle className="text-green-400" size={24} />}
                />
                <StatsCard
                  title="Success Rate"
                  value={currentUser.totalSubmissions > 0 ? `${Math.round((currentUser.verifiedSubmissions / currentUser.totalSubmissions) * 100)}%` : '0%'}
                  icon={<Target className="text-purple-400" size={24} />}
                />
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Submissions</h3>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all text-sm"
                >
                  Submit New
                </button>
              </div>
              
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">No submissions yet</p>
                  <p className="text-gray-500 text-sm">Start by submitting your first waste image for AI analysis</p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Submit Your First Waste
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.slice(0, 5).map(submission => (
                    <WasteCard key={submission.id} submission={submission} />
                  ))}
                  
                  {submissions.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-gray-400 text-sm">
                        Showing 5 of {submissions.length} submissions
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Submit Waste for AI Analysis</h2>
              
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
                    className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Brain size={20} />
                        Analyze Waste with AI
                      </>
                    )}
                  </button>
                </div>
              )}

              {analysis && (
                <div className="mt-6 p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    AI Analysis Results
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Waste Type:</span>
                      <span className="text-white font-medium capitalize bg-slate-600 px-3 py-1 rounded-full text-sm">
                        {analysis.wasteType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quantity:</span>
                      <span className="text-white font-medium capitalize bg-slate-600 px-3 py-1 rounded-full text-sm">
                        {analysis.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">AI Confidence:</span>
                      <span className="text-green-400 font-medium">{analysis.confidence}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Estimated Points:</span>
                      <span className="text-green-400 font-bold text-lg">{analysis.estimatedPoints} pts</span>
                    </div>
                    <div className="pt-2 border-t border-slate-600">
                      <p className="text-gray-400 text-sm">{analysis.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={submitWaste}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={20} />
                    Submit for Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Verify Waste Submissions</h2>
              
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <Award size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">No submissions to verify</p>
                  <p className="text-gray-500 text-sm">Check back later for new submissions to verify</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map(submission => (
                    <WasteCard 
                      key={submission.id} 
                      submission={submission} 
                      onVerify={verifySubmission}
                      showVerifyButton={true}
                    />
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