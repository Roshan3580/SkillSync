
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ResumeUpload from '@/components/ResumeUpload';
import Dashboard from '@/components/Dashboard';
import CareerPaths from '@/components/CareerPaths';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ResumeUpload />
      <Dashboard />
      <CareerPaths />
    </div>
  );
};

export default Index;
