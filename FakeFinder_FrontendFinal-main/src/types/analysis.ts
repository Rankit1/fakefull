import React, { useState } from 'react';
import { Shield, Heart, Target, FlipVerticalIcon as Vote, RefreshCw, Copy, CheckCircle, AlertTriangle, XCircle, TrendingUp, Activity, Zap, BarChart3 } from 'lucide-react';
import { AnalysisResult } from '../types/analysis';

interface ResultsSectionProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, isLoading }) => {
  const [selectedTone, setSelectedTone] = useState<keyof AnalysisResult['rewrites']>('neutral');
  const [copiedTone, setCopiedTone] = useState<string | null>(null);

  const getAuthLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 glow-text';
      case 'moderate':
        return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 glow-text';
      case 'low':
        return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getAuthLevelIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <CheckCircle className="w-5 h-5" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5" />;
      case 'low':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getEmotionIcon = (emotion: string) => {
    const emotions: Record<string, JSX.Element> = {
      joy: <Heart className="w-5 h-5 text-yellow-500" />,
      anger: <Zap className="w-5 h-5 text-red-500" />,
      sorrow: <Activity className="w-5 h-5 text-blue-500" />,
      fear: <AlertTriangle className="w-5 h-5 text-purple-500" />,
      surprise: <TrendingUp className="w-5 h-5 text-green-500" />
    };
    return emotions[emotion] || <Heart className="w-5 h-5 text-gray-500" />;
  };

  const getPoliticalToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      'extreme-left': 'bg-blue-700 text-white',
      'moderately-left': 'bg-blue-500 text-white',
      'neutral': 'bg-gray-500 text-white',
      'moderately-right': 'bg-red-500 text-white',
      'extreme-right': 'bg-red-700 text-white'
    };
    return colors[tone] || 'bg-gray-500 text-white';
  };

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      'extreme-left': 'Extreme Left',
      'moderately-left': 'Moderately Left',
      'neutral': 'Neutral',
      'moderately-right': 'Moderately Right',
      'extreme-right': 'Extreme Right'
    };
    return labels[tone] || tone;
  };

  const getToneProgress = (tone: string) => {
    const positions: Record<string, number> = {
      'extreme-left': 20,
      'moderately-left': 40,
      'neutral': 50,
      'moderately-right': 60,
      'extreme-right': 80
    };
    return positions[tone] || 50;
  };

  const copyToClipboard = async (text: string, tone: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTone(tone);
      setTimeout(() => setCopiedTone(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analysis Results
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive verification and bias analysis
        </p>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Authentication Level */}
        <div className={`p-6 rounded-xl border-2 ${getAuthLevelColor(result.authenticationLevel.level)}`}>
          <div className="flex items-center space-x-3 mb-4">
            {getAuthLevelIcon(result.authenticationLevel.level)}
            <h4 className="text-lg font-semibold">Authentication Level</h4>
          </div>
          <div className="text-3xl font-bold mb-2 capitalize">
            {result.authenticationLevel.level}
          </div>
          <p className="text-sm opacity-80 mb-3">
            {result.authenticationLevel.score} source{result.authenticationLevel.score !== 1 ? 's' : ''} matched
          </p>
          <div className="space-y-2">
            {result.authenticationLevel.sources.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{source}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion Analysis */}
        <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            {getEmotionIcon(result.emotionLevel.primary)}
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Emotion Analysis</h4>
          </div>
          <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white capitalize">
            {result.emotionLevel.primary}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {Math.round(result.emotionLevel.confidence * 100)}% confidence
          </p>
          <div className="space-y-2">
            {result.emotionLevel.isClickbait && (
              <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Potential Clickbait</span>
              </div>
            )}
            {result.emotionLevel.isRagebait && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Potential Ragebait</span>
              </div>
            )}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Confidence Score</h4>
          </div>
          <div className="text-3xl font-bold mb-2 text-blue-800 dark:text-blue-200">
            {Math.round(result.confidenceScore * 100)}%
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-3">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${result.confidenceScore * 100}%` }}
            />
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Overall analysis reliability
          </p>
        </div>
      </div>

      {/* Political Tone Analysis */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Vote className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Political Tone</h4>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getToneLabel(result.politicalTone.position)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(result.politicalTone.confidence * 100)}% confidence
            </span>
          </div>
          <div className="relative w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div className="absolute inset-0 flex">
              <div className="w-1/5 bg-blue-700 rounded-l-full" />
              <div className="w-1/5 bg-blue-500" />
              <div className="w-1/5 bg-gray-400" />
              <div className="w-1/5 bg-red-500" />
              <div className="w-1/5 bg-red-700 rounded-r-full" />
            </div>
            <div 
              className="absolute top-0 w-2 h-3 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1"
              style={{ left: `${getToneProgress(result.politicalTone.position)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Extreme Left</span>
            <span>Moderate Left</span>
            <span>Neutral</span>
            <span>Moderate Right</span>
            <span>Extreme Right</span>
          </div>
        </div>
      </div>

      {/* Headline Rewrites */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              Headline Rewrites
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose a political perspective for headline generation
          </p>
        </div>

        {/* Tone Selector */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {Object.keys(result.rewrites).map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone as keyof AnalysisResult['rewrites'])}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTone === tone
                    ? getPoliticalToneColor(tone)
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {getToneLabel(tone)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Rewrite */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 relative">
            <p className="text-gray-900 dark:text-white text-lg leading-relaxed mb-4">
              {result.rewrites[selectedTone]}
            </p>
            <button
              onClick={() => copyToClipboard(result.rewrites[selectedTone], selectedTone)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {copiedTone === selectedTone ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {copiedTone === selectedTone && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Copied to clipboard!</span>
            </p>
          )}
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Summary</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.authenticationLevel.score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(result.confidenceScore * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(result.emotionLevel.confidence * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Emotion</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(result.politicalTone.confidence * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bias</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;