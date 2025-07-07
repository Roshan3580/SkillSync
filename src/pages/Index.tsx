import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ResumeUpload from '@/components/ResumeUpload';
import Dashboard from '@/components/Dashboard';
import CareerPaths from '@/components/CareerPaths';

const Index = () => {
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ResumeUpload onAnalysis={setResumeAnalysis} />
      <Dashboard onGithubData={setGithubData} onLeetcodeData={setLeetcodeData} />
      <CareerPaths resumeAnalysis={resumeAnalysis} githubData={githubData} leetcodeData={leetcodeData} />
    </div>
  );
};

export default Index;
