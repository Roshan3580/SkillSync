import React from 'react';
import { ArrowRight, Code, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  // Helper for smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = `#${id}`;
    }
  };
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sync Your Developer
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 block">
              Career Journey
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Analyze your resume, discover personalized career paths, and track your coding progress 
            across GitHub and LeetCode—all in one powerful dashboard.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
              onClick={() => scrollToSection('resume')}
            >
              <div className="bg-emerald-600/20 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resume Analysis</h3>
              <p className="text-slate-400">
                Upload your resume and get instant skill extraction and analysis powered by advanced NLP
              </p>
            </div>
            <div
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => scrollToSection('career')}
            >
              <div className="bg-blue-600/20 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Career Paths</h3>
              <p className="text-slate-400">
                Get personalized career recommendations based on your skills and experience
              </p>
            </div>
            <div
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer"
              onClick={() => scrollToSection('dashboard')}
            >
              <div className="bg-purple-600/20 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-slate-400">
                Monitor your GitHub contributions and LeetCode performance in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
