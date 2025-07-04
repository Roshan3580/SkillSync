
import React from 'react';
import { Upload, BarChart3, TrendingUp, User } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                Skill<span className="text-emerald-400">Sync</span>
              </h1>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <BarChart3 size={16} />
                Dashboard
              </a>
              <a href="#resume" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <Upload size={16} />
                Resume Analyzer
              </a>
              <a href="#career" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <TrendingUp size={16} />
                Career Paths
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <button className="text-slate-300 hover:text-white p-2 rounded-md transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
