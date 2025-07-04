
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Code2, Database, Brain } from 'lucide-react';

const CareerPaths = () => {
  const careerPaths = [
    {
      title: 'Full-Stack Developer',
      description: 'Build end-to-end web applications with modern frameworks',
      match: '92%',
      icon: Code2,
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      color: 'emerald',
    },
    {
      title: 'Backend Engineer',
      description: 'Design scalable server architectures and APIs',
      match: '87%',
      icon: Database,
      skills: ['Python', 'PostgreSQL', 'Docker', 'AWS'],
      color: 'blue',
    },
    {
      title: 'Machine Learning Engineer',
      description: 'Develop AI models and data-driven solutions',
      match: '73%',
      icon: Brain,
      skills: ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn'],
      color: 'purple',
    },
  ];

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

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {careerPaths.map((path, index) => {
            const IconComponent = path.icon;
            const colorClasses = {
              emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50',
              blue: 'bg-blue-600/20 text-blue-400 border-blue-500/50',
              purple: 'bg-purple-600/20 text-purple-400 border-purple-500/50',
            };

            return (
              <Card key={index} className={`bg-slate-800/50 border-slate-700 hover:border-${path.color}-500/50 transition-all p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[path.color as keyof typeof colorClasses]}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{path.title}</h3>
                    <p className="text-sm text-slate-400">
                      <span className={`text-${path.color}-400 font-medium`}>{path.match} match</span>
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-4">{path.description}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill) => (
                      <span key={skill} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button className={`w-full bg-${path.color}-600 hover:bg-${path.color}-700 transition-all`}>
                  View Learning Path
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Card className="bg-slate-800/30 border-slate-700 p-8 max-w-2xl mx-auto">
            <Sparkles size={32} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Get More Personalized Recommendations</h3>
            <p className="text-slate-300 mb-6">
              Upload your resume to unlock detailed career analysis and custom learning paths 
              tailored to your specific experience and goals.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3">
              Analyze My Resume
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;
