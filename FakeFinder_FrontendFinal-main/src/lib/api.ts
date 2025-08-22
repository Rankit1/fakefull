// API client for FakeFinder backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface ExtractTextRequest {
  headline: string;
  paragraph?: string;
}

export interface ExtractImageRequest {
  file: File;
}

export interface ExtractLinkRequest {
  url: string;
}

export interface ExtractedContent {
  headline: string;
  first_para: string | null;
}

export interface AnalyzeEmotionResponse {
  emotion: 'joy' | 'sadness' | 'anger' | 'fear' | 'love' | 'surprise';
  score: number;
  clickbait: boolean;
  clickbait_type?: 'clickbait' | 'ragebait';
}

export interface AnalyzeAuthenticityResponse {
  matched_sources: string[];
  authenticity_level: 'high' | 'moderate' | 'low';
}

export interface AnalyzePoliticalResponse {
  detected_tone: 'extreme-left' | 'moderate-left' | 'center' | 'moderate-right' | 'extreme-right';
  extremity_score: number;
  rewritten_headlines: {
    left: string;
    center: string;
    right: string;
  };
}

export interface FullAnalysisRequest {
  headline: string;
  first_para?: string;
  want_authentication: boolean;
}

export interface FullAnalysisResponse {
  emotion: AnalyzeEmotionResponse;
  authenticity: AnalyzeAuthenticityResponse;
  political: AnalyzePoliticalResponse;
  topic: string;
  keywords: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  private async makeFormRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Extract text from direct input
  async extractText(request: ExtractTextRequest) {
    return this.makeRequest<ExtractedContent>('/extract/text', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Extract text from image using OCR
  async extractImage(request: ExtractImageRequest) {
    const formData = new FormData();
    formData.append('file', request.file);
    
    return this.makeFormRequest<ExtractedContent>('/extract/image', formData);
  }

  // Extract text from URL using web scraping
  async extractLink(request: ExtractLinkRequest) {
    return this.makeRequest<ExtractedContent>('/extract/link', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Analyze emotion and clickbait potential
  async analyzeEmotion(content: ExtractedContent) {
    return this.makeRequest<AnalyzeEmotionResponse>('/analyze/emotion', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  // Analyze authenticity using NewsAPI
  async analyzeAuthenticity(content: ExtractedContent) {
    return this.makeRequest<AnalyzeAuthenticityResponse>('/analyze/authenticity', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  // Analyze political tone and get rewrites
  async analyzePolitical(content: ExtractedContent) {
    return this.makeRequest<AnalyzePoliticalResponse>('/analyze/political', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  // Full analysis pipeline
  async analyzeText(request: { headline: string; paragraph?: string; wantAuthentication: boolean }) {
    const fullRequest: FullAnalysisRequest = {
      headline: request.headline,
      first_para: request.paragraph,
      want_authentication: request.wantAuthentication,
    };

    return this.makeRequest<FullAnalysisResponse>('/analyze/full', {
      method: 'POST',
      body: JSON.stringify(fullRequest),
    });
  }

  // Analyze URL
  async analyzeUrl(request: { url: string; wantAuthentication: boolean }) {
    // First extract content from URL
    const extractResult = await this.extractLink({ url: request.url });
    
    if (!extractResult.success || !extractResult.data) {
      return extractResult;
    }

    // Then run full analysis
    const fullRequest: FullAnalysisRequest = {
      headline: extractResult.data.headline,
      first_para: extractResult.data.first_para,
      want_authentication: request.wantAuthentication,
    };

    return this.makeRequest<FullAnalysisResponse>('/analyze/full', {
      method: 'POST',
      body: JSON.stringify(fullRequest),
    });
  }

  // Analyze image
  async analyzeImage(request: { file: File; wantAuthentication: boolean }) {
    // First extract content from image
    const extractResult = await this.extractImage({ file: request.file });
    
    if (!extractResult.success || !extractResult.data) {
      return extractResult;
    }

    // Then run full analysis
    const fullRequest: FullAnalysisRequest = {
      headline: extractResult.data.headline,
      first_para: extractResult.data.first_para,
      want_authentication: request.wantAuthentication,
    };

    return this.makeRequest<FullAnalysisResponse>('/analyze/full', {
      method: 'POST',
      body: JSON.stringify(fullRequest),
    });
  }
}

export const apiClient = new ApiClient();