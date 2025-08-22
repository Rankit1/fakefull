import { useState, useCallback } from 'react';
import { AnalysisResult } from '../types/analysis';
import { apiClient, FullAnalysisResponse } from '../lib/api';

interface UseAnalysisReturn {
  analyze: (data: any, type: string) => Promise<void>;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  clearResult: () => void;
  clearError: () => void;
}

export const useAnalysis = (): UseAnalysisReturn => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (data: any, type: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: { success: boolean; data?: FullAnalysisResponse; error?: string };

      switch (type) {
        case 'text':
          response = await apiClient.analyzeText({
            headline: data.headline,
            paragraph: data.paragraph,
            wantAuthentication: data.wantAuthentication,
          });
          break;
        case 'url':
          response = await apiClient.analyzeUrl({
            url: data.url,
            wantAuthentication: data.wantAuthentication,
          });
          break;
        case 'image':
          response = await apiClient.analyzeImage({
            file: data.file,
            wantAuthentication: data.wantAuthentication,
          });
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      if (response.success && response.data) {
        // Transform backend response to frontend format
        const backendData = response.data;
        const transformedResult: AnalysisResult = {
          authenticationLevel: {
            score: data.wantAuthentication ? backendData.authenticity.matched_sources.length : 0,
            level: backendData.authenticity.authenticity_level,
            sources: data.wantAuthentication ? backendData.authenticity.matched_sources : []
          },
          emotionLevel: {
            primary: backendData.emotion.emotion,
            confidence: backendData.emotion.score,
            isClickbait: backendData.emotion.clickbait,
            isRagebait: backendData.emotion.clickbait_type === 'ragebait',
          },
          confidenceScore: Math.min(
            (backendData.emotion.score + 
             (data.wantAuthentication ? backendData.authenticity.matched_sources.length / 5 : 0.5) + 
             (backendData.political.extremity_score / 100)) / 3,
            1
          ),
          politicalTone: {
            position: backendData.political.detected_tone,
            confidence: backendData.political.extremity_score / 100,
          },
          rewrites: {
            left: backendData.political.rewritten_headlines.left || 'Left-leaning perspective on this news story...',
            center: backendData.political.rewritten_headlines.center || 'Neutral analysis of this news development...',
            right: backendData.political.rewritten_headlines.right || 'Right-leaning viewpoint on this news item...'
          },
          originalText: data.text || data.headline || data.url || 'Uploaded content',
          inputType: type,
          timestamp: new Date().toISOString(),
          topic: backendData.topic,
          keywords: backendData.keywords,
        };
        
        setResult(transformedResult);
      } else {
        setError(response.error || 'Analysis failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyze,
    result,
    isLoading,
    error,
    clearResult,
    clearError,
  };
};