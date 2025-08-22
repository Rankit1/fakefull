import React, { useState } from 'react';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import { AnalysisResult } from '../types/analysis';

interface User {
  email: string;
  id: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async (inputData: any, inputType: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result
      const mockResult: AnalysisResult = {
        authenticationLevel: {
          score: inputData.wantAuthentication ? Math.floor(Math.random() * 6) : 0,
          level: 'moderate', // Will be calculated based on score
          sources: inputData.wantAuthentication ? ['Reuters', 'AP News', 'BBC News'].slice(0, Math.floor(Math.random() * 3) + 1) : []
        },
        emotionLevel: {
          primary: ['joy', 'anger', 'sorrow', 'fear', 'surprise'][Math.floor(Math.random() * 5)] as any,
          confidence: Math.random(),
          isClickbait: Math.random() > 0.7,
          isRagebait: Math.random() > 0.8
        },
        confidenceScore: Math.random(),
        politicalTone: {
          position: ['extreme-left', 'moderately-left', 'neutral', 'moderately-right', 'extreme-right'][Math.floor(Math.random() * 5)] as any,
          confidence: Math.random()
        },
        rewrites: {
          left: 'Progressive perspective on this breaking news development that challenges traditional power structures and advocates for systemic change.',
          center: 'Balanced reporting on this important news story presents multiple viewpoints and factual analysis without partisan interpretation.',
          right: 'Conservative analysis of this latest development emphasizes traditional values, fiscal responsibility, and constitutional principles.'
        },
        originalText: inputData.text || inputData.url || 'Uploaded image content',
        inputType,
        timestamp: new Date().toISOString()
      };

      // Calculate authentication level based on sources
      if (mockResult.authenticationLevel.score <= 1) {
        mockResult.authenticationLevel.level = 'low';
      } else if (mockResult.authenticationLevel.score <= 4) {
        mockResult.authenticationLevel.level = 'moderate';
      } else {
        mockResult.authenticationLevel.level = 'high';
      }

      setAnalysisResult(mockResult);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            News Verification Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Analyze news content for authenticity, bias, and emotional manipulation
          </p>
        </div>

        {/* Input Section */}
        <InputSection onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />

        {/* Results Section */}
        {(analysisResult || isAnalyzing) && (
          <ResultsSection result={analysisResult} isLoading={isAnalyzing} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;