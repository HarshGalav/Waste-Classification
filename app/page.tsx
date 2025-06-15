"use client";
import React, { useState, useEffect } from 'react';
import { Recycle, Star, Upload, TrendingUp, Award, ChevronRight, Zap, Globe, Users, Camera, Brain, ArrowRight, Menu, X, CheckCircle, BarChart3, Target, Shield } from 'lucide-react';
import Image from 'next/image';


// Types
interface WasteSubmission {
  id: string;
  userId: string;
  imageUrl: string;
  wasteType: 'plastic' | 'paper' | 'metal' | 'glass' | 'organic';
  quantity: 'small' | 'medium' | 'large';
  estimatedPoints: number;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: Date;
  verifiedAt?: Date;
}

interface WasteAnalysis {
  wasteType: 'plastic' | 'paper' | 'metal' | 'glass' | 'organic';
  quantity: 'small' | 'medium' | 'large';
  confidence: number;
  estimatedPoints: number;
  description: string;
}

// Landing Page Component
const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Brain className="text-blue-400" size={32} />,
      title: "AI-Powered Recognition",
      description: "Advanced computer vision identifies and categorizes waste with 95% accuracy"
    },
    {
      icon: <Star className="text-yellow-400" size={32} />,
      title: "Earn Rewards",
      description: "Get points for every verified submission and redeem for real-world benefits"
    },
    {
      icon: <Globe className="text-green-400" size={32} />,
      title: "Global Impact",
      description: "Join millions making a difference in environmental conservation worldwide"
    },
    {
      icon: <Shield className="text-purple-400" size={32} />,
      title: "Verified System",
      description: "Community-driven verification ensures authentic environmental impact"
    }
  ];

  const stats = [
    { value: "2M+", label: "Waste Items Processed" },
    { value: "150K+", label: "Active Users" },
    { value: "45", label: "Countries" },
    { value: "99.2%", label: "Accuracy Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-lg">
                <Recycle size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">EcoWaste AI</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#impact" className="text-gray-300 hover:text-white transition-colors">Impact</a>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-black/90 backdrop-blur-lg border-b border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#about" className="block text-gray-300 hover:text-white">About</a>
              <a href="#impact" className="block text-gray-300 hover:text-white">Impact</a>
              <button
                onClick={onGetStarted}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 mb-8">
              <Zap size={16} className="text-yellow-400" />
              AI-Powered Waste Management Revolution
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Waste Into
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> Impact</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to identify, categorize, and track waste. 
              Earn rewards while making a real difference in environmental conservation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Start Making Impact
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Cutting-Edge Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of waste management with our advanced AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-400/50 transition-all hover:transform hover:scale-105">
                <div className="mb-4 p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-400/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of eco-warriors using AI to create environmental impact
          </p>
          <button
            onClick={onGetStarted}
            className="px-12 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Get Started Now
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

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
                {submission.submittedAt.toLocaleDateString()}
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

// Main App Component
export default function AdvancedEcoWasteApp() {
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'verify' | 'dashboard'>('dashboard');
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
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvdHRsZXM8L3RleHQ+PC9zdmc+',
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
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmRib2FyZDwvdGV4dD48L3N2Zz4=',
        wasteType: 'paper',
        quantity: 'large',
        estimatedPoints: 6,
        status: 'pending',
        submittedAt: new Date(Date.now() - 3600000),
      },
      {
        id: '3',
        userId: 'user1',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhbnM8L3RleHQ+PC9zdmc+',
        wasteType: 'metal',
        quantity: 'small',
        estimatedPoints: 12,
        status: 'verified',
        submittedAt: new Date(Date.now() - 172800000),
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
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Mock analysis result
      const wasteTypes: Array<'plastic' | 'paper' | 'metal' | 'glass' | 'organic'> = ['plastic', 'paper', 'metal', 'glass', 'organic'];
      const quantities: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      setAnalysis({
        wasteType: wasteTypes[Math.floor(Math.random() * wasteTypes.length)],
        quantity: quantities[Math.floor(Math.random() * quantities.length)],
        confidence: Math.floor(Math.random() * 20) + 80,
        estimatedPoints: Math.floor(Math.random() * 15) + 5,
        description: 'AI-detected recyclable materials with high confidence'
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
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

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

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
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-400/30">
                <Star className="text-yellow-400" size={16} />
                <span className="text-white font-semibold">{userPoints.toLocaleString()} pts</span>
              </div>
              <button
                onClick={() => setShowApp(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Back to Home
              </button>
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
                  <h2 className="text-2xl font-bold text-white">Welcome to EcoWaste AI</h2>
                  <p className="text-gray-300">Transform waste into environmental impact with AI</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{submissions.length}</div>
                  <div className="text-sm text-gray-400">Total Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{verifiedSubmissions.length}</div>
                  <div className="text-sm text-gray-400">Verified Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userPoints}</div>
                  <div className="text-sm text-gray-400">Points Earned</div>
                </div>
              </div>
            </div>

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
                icon={<CheckCircle className="text-green-400" size={24} />}
              />
              <StatsCard
                title="Impact Score"
                value="A+"
                icon={<TrendingUp className="text-purple-400" size={24} />}
                trend="Environmental impact"
              />
            </div>

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
                    Submit for Community Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Community Verification</h2>
              <p className="text-gray-400">Help verify waste submissions and earn bonus points</p>
            </div>
            
            {pendingSubmissions.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center">
                <Award size={64} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Pending Verifications</h3>
                <p className="text-gray-400 mb-6">All submissions have been verified by the community</p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                >
                  Submit New Waste
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users size={16} />
                    {pendingSubmissions.length} submission{pendingSubmissions.length > 1 ? 's' : ''} awaiting verification
                  </div>
                </div>
                
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
      </div>
    </div>
  );
}