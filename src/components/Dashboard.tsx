
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GitBranch, Code, Trophy, Calendar } from 'lucide-react';

const Dashboard = () => {
  const githubData = [
    { name: 'Jan', commits: 45 },
    { name: 'Feb', commits: 52 },
    { name: 'Mar', commits: 38 },
    { name: 'Apr', commits: 61 },
    { name: 'May', commits: 55 },
    { name: 'Jun', commits: 67 },
  ];

  const leetcodeData = [
    { name: 'Easy', solved: 45, total: 100 },
    { name: 'Medium', solved: 23, total: 80 },
    { name: 'Hard', solved: 8, total: 40 },
  ];

  return (
    <div className="bg-white py-20" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Progress Dashboard</h2>
          <p className="text-xl text-slate-600">
            Track your coding journey across GitHub and LeetCode
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">GitHub Repos</p>
                <p className="text-3xl font-bold text-slate-900">24</p>
              </div>
              <GitBranch size={24} className="text-emerald-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Commits</p>
                <p className="text-3xl font-bold text-slate-900">1,247</p>
              </div>
              <Code size={24} className="text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">LeetCode Solved</p>
                <p className="text-3xl font-bold text-slate-900">76</p>
              </div>
              <Trophy size={24} className="text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Current Streak</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
              <Calendar size={24} className="text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">GitHub Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={githubData}>
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
              <BarChart data={leetcodeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solved" fill="#8b5cf6" />
                <Bar dataKey="total" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Solved', item: '"Two Sum" on LeetCode', time: '2 hours ago', type: 'leetcode' },
              { action: 'Pushed to', item: 'skillsync-frontend repository', time: '4 hours ago', type: 'github' },
              { action: 'Completed', item: '"Valid Parentheses" (Easy)', time: '1 day ago', type: 'leetcode' },
              { action: 'Created', item: 'new repository: react-dashboard', time: '2 days ago', type: 'github' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'leetcode' ? 'bg-purple-500' : 'bg-emerald-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.action} <span className="text-slate-600">{activity.item}</span>
                  </p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
