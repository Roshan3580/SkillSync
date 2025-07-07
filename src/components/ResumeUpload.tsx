import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, X, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiService, ResumeAnalysis } from '@/lib/api';
import { toast } from 'sonner';

const ResumeUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setUploadedFile(pdfFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const analyzeResume = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await apiService.uploadResume(uploadedFile);
      setAnalysis(result.analysis);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="bg-slate-50 py-20" id="resume">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Resume Analyzer</h2>
          <p className="text-xl text-slate-600">
            Upload your resume to extract skills, experience, and get AI-powered insights
          </p>
        </div>

        <Card className="p-8">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragOver
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
              <p className="text-slate-600 mb-6">
                Drag and drop your PDF resume here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
                ref={inputRef}
              />
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                onClick={() => inputRef.current && inputRef.current.click()}
                type="button"
              >
                Choose File
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-emerald-600" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!isAnalyzing ? (
                <Button 
                  onClick={analyzeResume}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
                >
                  Analyze Resume
                </Button>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Analyzing your resume...</p>
                  <p className="text-slate-600">Extracting skills and experience</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-12 space-y-8">
            {/* Skills and Experience Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-600" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.length > 0 ? (
                    analysis.skills.map((skill) => (
                      <span key={skill} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No skills detected</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Experience Level
                </h3>
                <p className="text-slate-600 mb-2">
                  {analysis.job_titles.length > 0 ? analysis.job_titles[0] : 'Developer'}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analysis.experience_years > 0 ? `${analysis.experience_years}+ Years` : 'Entry Level'}
                </p>
              </Card>
            </div>

            {/* Job Titles and Education Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-purple-600" />
                  Job Titles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.job_titles.length > 0 ? (
                    analysis.job_titles.map((title) => (
                      <span key={title} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {title}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No job titles detected</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600" />
                  Education
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.education.length > 0 ? (
                    analysis.education.map((edu) => (
                      <span key={edu} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {edu}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No education detected</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8">
            <Card className="p-6 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Analysis Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
