"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Recycle, Star, Upload, TrendingUp, Award, ChevronRight, Zap, Globe, Users, Camera, Brain, ArrowRight, Menu, X, CheckCircle, BarChart3, Target, Shield } from 'lucide-react';
import Image from 'next/image';
import AuthButton from './components/AuthButton';
import { WasteSubmission, WasteAnalysis, User } from './types';

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
              <AuthButton />
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
              <div className="pt-4">
                <AuthButton />
              </div>
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
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto sm:mx-0"
              >
                Start Making Impact
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                View Leaderboard
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

// Main App Component
export default function EcoWasteApp() {
  const { data: session, status } = useSession();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setShowApp(true);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  // Redirect authenticated users to the app
  if (typeof window !== 'undefined') {
    window.location.href = '/app';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to app...</p>
      </div>
    </div>
  );
}