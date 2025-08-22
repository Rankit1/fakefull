import React, { useState } from 'react';
import { 
  Type, 
  Link, 
  Image, 
  Upload, 
  Search, 
  AlertCircle,
  CheckCircle,
  Globe
} from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (data: any, type: string) => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'image'>('text');
  const [headline, setHeadline] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [wantAuthentication, setWantAuthentication] = useState(true);

  const tabs = [
    { id: 'text', label: 'News Text', icon: Type, description: 'Enter headline and optional paragraph' },
    { id: 'url', label: 'News URL', icon: Link, description: 'Scrape content from URL' },
    { id: 'image', label: 'Image Upload', icon: Image, description: 'Extract text using OCR' }
  ] as const;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    const baseData = { wantAuthentication };
    
    switch (activeTab) {
      case 'text':
        if (headline.trim()) {
          onAnalyze({ ...baseData, headline, paragraph, text: headline + (paragraph ? `\n\n${paragraph}` : '') }, 'text');
        }
        break;
      case 'url':
        if (url.trim()) {
          onAnalyze({ ...baseData, url }, 'url');
        }
        break;
      case 'image':
        if (selectedFile) {
          onAnalyze({ ...baseData, file: selectedFile }, 'image');
        }
        break;
    }
  };

  const isReadyToAnalyze = () => {
    switch (activeTab) {
      case 'text':
        return headline.trim().length > 0;
      case 'url':
        return url.trim().length > 0;
      case 'image':
        return selectedFile !== null;
      default:
        return false;
    }
  };

  const getTabColor = (tabId: string) => {
    if (activeTab === tabId) {
      return 'bg-blue-600 text-white';
    }
    return 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden glow-container">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Text Input Tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                News Headline *
              </label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter the news headline you want to verify..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none glow-input"
                rows={3}
                maxLength={500}
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                {headline.length}/500
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Paragraph (Optional)
              </label>
              <div className="relative">
                <textarea
                  value={paragraph}
                  onChange={(e) => setParagraph(e.target.value)}
                  placeholder="Enter the first paragraph of the news article for more context..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none glow-input"
                  rows={4}
                  maxLength={1000}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                  {paragraph.length}/1000
                </div>
              </div>
            </div>
          </div>
        )}

        {/* URL Input Tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                News Article URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/news-article"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 glow-input"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We'll scrape the content from the provided URL and analyze it for authenticity.
              </p>
            </div>
          </div>
        )}

        {/* Image Upload Tab */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload News Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="space-y-1 text-center">
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              {selectedFile && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove file
                </button>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We'll use OCR technology to extract text from your image and analyze it.
              </p>
            </div>
          </div>
        )}

        {/* Authentication Option */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Want Authentication?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {wantAuthentication 
                  ? 'Use NewsAPI to verify against trusted sources' 
                  : 'Skip external validation (faster analysis)'
                }
              </p>
            </div>
            <button
              onClick={() => setWantAuthentication(!wantAuthentication)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                wantAuthentication ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  wantAuthentication ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={!isReadyToAnalyze() || isAnalyzing}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm transition-all duration-200 ${
              isReadyToAnalyze() && !isAnalyzing
                ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02]'
                : 'text-gray-400 bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Analyze News</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;