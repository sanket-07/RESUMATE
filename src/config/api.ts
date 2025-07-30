// API configuration for the application

// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

// API endpoints
export const API_ENDPOINTS = {
  analyze: `${API_BASE_URL}/api/analyze`,
  qa: `${API_BASE_URL}/api/qa`,
  questions: `${API_BASE_URL}/api/questions`,
  improve: `${API_BASE_URL}/api/improve`,
  improvedResume: `${API_BASE_URL}/api/improved-resume`,
  generateMessage: `${API_BASE_URL}/api/generate-message`,
  processAction: `${API_BASE_URL}/api/process-action`,
  downloadCsv: `${API_BASE_URL}/api/download-csv`,
  testExtraction: `${API_BASE_URL}/api/extract-text`,
  testSimilarity: `${API_BASE_URL}/api/test-similarity`
};