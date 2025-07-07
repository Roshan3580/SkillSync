import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Code2, Database, Brain } from 'lucide-react';

interface CareerPathsProps {
  resumeAnalysis: any;
  githubData: any;
  leetcodeData: any;
}

const CareerPaths: React.FC<CareerPathsProps> = ({ resumeAnalysis, githubData, leetcodeData }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const res = await fetch('/api/career/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeAnalysis,
          github: githubData,
          leetcode: leetcodeData
        })
      });
      if (!res.ok) throw new Error('Failed to get suggestions');
      const data = await res.json();
      setSuggestions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20" id="career">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={24} className="text-emerald-400" />
            <h2 className="text-4xl font-bold">AI-Powered Career Paths</h2>
          </div>
          <p className="text-xl text-slate-300">
            Personalized recommendations based on your skills and experience
          </p>
        </div>

        <div className="text-center mb-8">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
            onClick={fetchSuggestions}
            disabled={!resumeAnalysis || loading}
          >
            {loading ? 'Generating Suggestions...' : 'Get Career Suggestions'}
          </Button>
          {!resumeAnalysis && (
            <p className="text-red-400 mt-2">Upload your resume to get career suggestions.</p>
          )}
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {suggestions
            ? suggestions.map((path, index) => {
                const color = index % 3 === 0 ? 'emerald' : index % 3 === 1 ? 'blue' : 'purple';
            const colorClasses = {
              emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50',
              blue: 'bg-blue-600/20 text-blue-400 border-blue-500/50',
              purple: 'bg-purple-600/20 text-purple-400 border-purple-500/50',
            };
            return (
                  <Card key={index} className={`bg-slate-800/50 border-slate-700 hover:border-${color}-500/50 transition-all p-6`}>
                <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
                        <Sparkles size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{path.title}</h3>
                  </div>
                </div>
                <p className="text-slate-300 mb-4">{path.description}</p>
                    <div className="mb-4">
                      <p className="text-sm text-slate-400 mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {path.required_skills && path.required_skills.map((skill: string) => (
                          <span key={skill} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-slate-400 mb-1">Companies hiring for this role:</p>
                      <div className="flex flex-wrap gap-2">
                        {path.companies && path.companies.length > 0 ? (
                          path.companies.map((company: string) => (
                            <span key={company} className="bg-blue-700 text-blue-100 px-2 py-1 rounded text-xs">{company}</span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">No companies found</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic mb-2">
                      {path.suitability && path.suitability.trim() !== ''
                        ? path.suitability
                        : 'No personalized suitability available.'}
                    </p>
              </Card>
            );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;
