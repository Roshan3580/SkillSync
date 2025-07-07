import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GitBranch, Code, Trophy, Calendar } from 'lucide-react';

// Helper to format time difference
function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

interface DashboardProps {
  onGithubData?: (data: any) => void;
  onLeetcodeData?: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onGithubData, onLeetcodeData }) => {
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [githubData, setGithubData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leetcodeInput, setLeetcodeInput] = useState('');
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [leetcodeData, setLeetcodeData] = useState<any | null>(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [leetcodeError, setLeetcodeError] = useState<string | null>(null);

  const fetchGithubData = async (user: string) => {
    setLoading(true);
    setError(null);
    setGithubData(null);
    try {
      const res = await fetch(`/api/github/${user}/summary`);
      if (!res.ok) throw new Error('User not found or API error');
      const data = await res.json();
      setGithubData(data);
      setUsername(user);
      if (onGithubData) onGithubData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchGithubData(inputValue.trim());
    }
  };

  const fetchLeetcodeData = async (user: string) => {
    setLeetcodeLoading(true);
    setLeetcodeError(null);
    setLeetcodeData(null);
    try {
      const res = await fetch(`/api/leetcode/${user}/summary`);
      if (!res.ok) throw new Error('User not found or API error');
      const data = await res.json();
      setLeetcodeData(data);
      setLeetcodeUser(user);
      if (onLeetcodeData) onLeetcodeData(data);
    } catch (err: any) {
      setLeetcodeError(err.message || 'Failed to fetch LeetCode data');
    } finally {
      setLeetcodeLoading(false);
    }
  };

  const handleLeetcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leetcodeInput.trim()) {
      fetchLeetcodeData(leetcodeInput.trim());
    }
  };

  return (
    <div className="bg-white py-20" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Progress Dashboard</h2>
          <p className="text-xl text-slate-600">
            Track your coding journey across GitHub
          </p>
        </div>

        {/* GitHub and LeetCode Username Inputs Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="border border-slate-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md text-lg disabled:opacity-50"
              disabled={loading || !inputValue.trim()}
            >
              {loading ? 'Loading...' : 'Fetch Stats'}
            </button>
          </form>
          <form onSubmit={handleLeetcodeSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Enter LeetCode username"
              value={leetcodeInput}
              onChange={e => setLeetcodeInput(e.target.value)}
              className="border border-slate-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={leetcodeLoading}
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md text-lg disabled:opacity-50"
              disabled={leetcodeLoading || !leetcodeInput.trim()}
            >
              {leetcodeLoading ? 'Loading...' : 'Fetch Stats'}
            </button>
          </form>
        </div>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {leetcodeError && <div className="text-red-600 text-center mb-4">{leetcodeError}</div>}

        {/* Only show stats and charts after data is loaded */}
        {githubData && !loading && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="p-6 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">GitHub Repos</p>
                    <p className="text-3xl font-bold text-slate-900">{githubData.public_repos}</p>
                  </div>
                  <GitBranch size={24} className="text-emerald-600" />
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Commits</p>
                    <p className="text-3xl font-bold text-slate-900">{githubData.total_commits}</p>
                    <p className="text-xs text-slate-500 mt-1">(Top 5 repositories)</p>
                  </div>
                  <Code size={24} className="text-blue-600" />
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Top Languages</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {githubData.top_languages && githubData.top_languages.length > 0 ? (
                        githubData.top_languages.map((lang: string) => (
                          <span key={lang} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{lang}</span>
                        ))
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Recent Repos</p>
                    <div className="flex flex-col gap-1 mt-2">
                      {githubData.recent_repos && githubData.recent_repos.length > 0 ? (
                        githubData.recent_repos.map((repo: any) => (
                          <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:underline text-sm">
                            {repo.name}
                          </a>
                        ))
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* LeetCode Stat Cards */}
            {leetcodeData && !leetcodeLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">LeetCode Solved</p>
                      <p className="text-3xl font-bold text-slate-900">{leetcodeData.total_solved}</p>
                    </div>
                    <Trophy size={24} className="text-purple-600" />
                  </div>
                </Card>
                <Card className="p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Current Streak</p>
                      <p className="text-3xl font-bold text-slate-900">{leetcodeData.current_streak}</p>
                    </div>
                    <Calendar size={24} className="text-orange-600" />
                  </div>
                </Card>
              </div>
            )}

            {/* GitHub and LeetCode Charts Side by Side */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">GitHub Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={githubData.commits_per_month || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="commits" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">LeetCode Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leetcodeData && !leetcodeLoading ? [
                    { name: 'Easy', solved: leetcodeData.easy_solved },
                    { name: 'Medium', solved: leetcodeData.medium_solved },
                    { name: 'Hard', solved: leetcodeData.hard_solved },
                  ] : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="solved" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        {/* Recent Activity */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GitHub Activity */}
            <div>
              <h4 className="text-lg font-semibold mb-4">GitHub</h4>
              <div className="space-y-4">
                {githubData && githubData.recent_repos && githubData.recent_repos.length > 0 ? (
                  githubData.recent_repos.map((repo: any, index: number) => (
                    <div key={repo.name} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Updated repo <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">{repo.name}</a>
                        </p>
                        {repo.updated_at && (
                          <p className="text-sm text-slate-500">{timeAgo(repo.updated_at)}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No recent GitHub activity found.</p>
                )}
              </div>
            </div>
            {/* LeetCode Activity */}
            <div>
              <h4 className="text-lg font-semibold mb-4">LeetCode</h4>
              <div className="space-y-4">
                {leetcodeData && leetcodeData.recent_problems && leetcodeData.recent_problems.length > 0 ? (
                  leetcodeData.recent_problems.map((problem: any, index: number) => (
                    <div key={problem.title} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Solved <span className="text-slate-600">{problem.title}</span>
                        </p>
                        {problem.solved_at && (
                          <p className="text-sm text-slate-500">{timeAgo(problem.solved_at)}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No recent LeetCode activity found.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
