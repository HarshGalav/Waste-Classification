'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Trophy, Medal, Award, Star, TrendingUp, Users, ArrowUp, Crown } from 'lucide-react';
import { User } from '@/app/types';

interface LeaderboardUser extends User {
  rank: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      // Fetch leaderboard
      const leaderboardResponse = await fetch('/api/leaderboard?limit=20');
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        const rankedData = leaderboardData.map((user: User, index: number) => ({
          ...user,
          rank: index + 1
        }));
        setLeaderboard(rankedData);
      }

      // Fetch current user data
      if (session?.user?.id) {
        const userResponse = await fetch(`/api/users?id=${session.user.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-slate-700 text-gray-300';
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
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to view the dashboard</h1>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const currentUserRank = leaderboard.find(user => user.id === session?.user?.id)?.rank;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" size={32} />
              <h1 className="text-2xl font-bold text-white">EcoWaste Leaderboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="text-white font-medium">{session?.user?.name}</p>
              </div>
              <button
                onClick={() => window.location.href = '/api/auth/signout'}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        {currentUser && (
          <div className="mb-8 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-2xl p-6 border border-green-400/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Your Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{currentUser.points}</div>
                    <div className="text-sm text-gray-400">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{currentUser.totalSubmissions}</div>
                    <div className="text-sm text-gray-400">Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{currentUser.verifiedSubmissions}</div>
                    <div className="text-sm text-gray-400">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">#{currentUserRank || 'N/A'}</div>
                    <div className="text-sm text-gray-400">Rank</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                {currentUserRank && currentUserRank <= 3 && (
                  <div className="text-6xl opacity-20">
                    {getRankIcon(currentUserRank)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold text-white">Top Eco Warriors</h2>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Users size={16} />
                <span>{leaderboard.length} users</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-700">
            {leaderboard.map((user) => (
              <div
                key={user.id}
                className={`p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors ${
                  user.id === session?.user?.id ? 'bg-green-400/5 border-l-4 border-green-400' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(user.rank)}`}>
                    {user.rank <= 3 ? getRankIcon(user.rank) : <span className="font-bold">#{user.rank}</span>}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      {user.id === session?.user?.id && (
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full">You</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="text-yellow-400" size={16} />
                    <span className="text-lg font-bold text-white">{user.points.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.verifiedSubmissions}/{user.totalSubmissions} verified
                  </div>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="p-8 text-center">
              <Users size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">No users on the leaderboard yet</p>
              <p className="text-gray-500 text-sm">Be the first to submit waste and earn points!</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            Back to App
          </button>
        </div>
      </div>
    </div>
  );
}