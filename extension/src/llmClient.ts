/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  LLM CLIENT - PRODUCTION v8.0                                               ║
 * ║  ✅ NEW ENDPOINTS - Statistics, rules, enhanced analysis                    ║
 * ║  ✅ BETTER ERRORS - Detailed error messages and retry logic                 ║
 * ║  ✅ TYPE SAFETY - Full TypeScript interfaces                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import * as vscode from 'vscode';
import axios, { AxiosError } from 'axios';

// Interfaces
interface AnalysisResult {
    success: boolean;
    issues: Issue[];
    score: number;
    grade: string;
    file_type: string;
    rules_checked: number;
    statistics?: IssueStatistics;
}

interface Issue {
    rule: string;
    message: string;
    line: number;
    severity: 'critical' | 'error' | 'warning' | 'info';
    fix?: string;
    category?: string;
}

interface IssueStatistics {
    critical: number;
    errors: number;
    warnings: number;
    info: number;
}

interface HealthCheck {
    status: string;
    version?: string;
    llm_provider: string;
    model: string;
    rules_loaded: number;
    rules_by_category?: { [key: string]: number };
    rag_enabled: boolean;
    features?: string[];
}

interface ReportResult {
    success: boolean;
    filename: string;
    path: string;
    download_url: string;
}

interface SystemStatistics {
    total_rules: number;
    rule_categories: { [key: string]: number };
    llm_provider: string;
    model: string;
    version: string;
    features: string[];
}

export class LLMClient {
    private serverUrl: string;
    private timeout: number = 60000; // 60 seconds
    private retryAttempts: number = 2;

    constructor() {
        const config = vscode.workspace.getConfiguration('schneiderAI');
        this.serverUrl = config.get<string>('serverUrl') || 'http://localhost:5000';
        
        console.log(`✅ LLM Client initialized: ${this.serverUrl}`);
    }

    /**
     * Analyze code with Schneider Electric AI engine
     */
    async analyzeCode(code: string, fileName: string): Promise<AnalysisResult> {
        try {
            const response = await this.makeRequest<AnalysisResult>(
                '/analyze',
                'POST',
                {
                    code: code,
                    filename: fileName
                },
                this.timeout
            );

            if (response.success) {
                return {
                    success: true,
                    issues: response.issues || [],
                    score: response.score || 0,
                    grade: response.grade || 'N/A',
                    file_type: response.file_type || 'unknown',
                    rules_checked: response.rules_checked || 0,
                    statistics: response.statistics
                };
            } else {
                throw new Error('Analysis failed: Invalid response from server');
            }
        } catch (error) {
            throw this.handleError(error, 'Code analysis');
        }
    }

    /**
     * Chat with AI assistant
     */
    async chat(message: string, context: string = ''): Promise<string> {
        try {
            const response = await this.makeRequest<{ success: boolean; reply: string }>(
                '/chat',
                'POST',
                {
                    message: message,
                    context: context
                },
                30000
            );

            if (response.success) {
                return response.reply || 'No response from AI';
            } else {
                return 'I apologize, but I encountered an error. Please try again.';
            }
        } catch (error) {
            return this.handleChatError(error);
        }
    }

    /**
     * Fix code with AI
     */
    async fixCode(code: string, error: string, issues: Issue[] = [], filename: string = 'unknown.py'): Promise<string> {
        try {
            const response = await this.makeRequest<{ success: boolean; fixed_code: string }>(
                '/fix',
                'POST',
                {
                    code: code,
                    error: error,
                    issues: issues,
                    filename: filename
                },
                this.timeout
            );

            if (response.success && response.fixed_code) {
                return response.fixed_code;
            } else {
                throw new Error('Code fixing failed: No fixed code returned');
            }
        } catch (error) {
            console.error('Fix error:', error);
            
            // Return original code on error
            vscode.window.showWarningMessage(
                '⚠️ Code fixing failed. Returning original code.'
            );
            return code;
        }
    }

    /**
     * Generate professional PDF report
     */
    async generateReport(
        code: string, 
        issues: Issue[], 
        score: number, 
        filename: string,
        grade: string = 'N/A'
    ): Promise<ReportResult> {
        try {
            const response = await this.makeRequest<ReportResult>(
                '/generate_report',
                'POST',
                {
                    code: code,
                    issues: issues,
                    score: score,
                    filename: filename,
                    grade: grade
                },
                30000
            );

            if (response.success) {
                return {
                    success: true,
                    filename: response.filename,
                    path: response.path,
                    download_url: response.download_url
                };
            } else {
                throw new Error('Report generation failed');
            }
        } catch (error) {
            throw this.handleError(error, 'Report generation');
        }
    }

    /**
     * Health check - verify backend connectivity
     */
    async checkHealth(): Promise<HealthCheck> {
        try {
            const response = await this.makeRequest<HealthCheck>(
                '/health',
                'GET',
                null,
                5000
            );

            return {
                status: response.status || 'unknown',
                version: response.version,
                llm_provider: response.llm_provider || 'unknown',
                model: response.model || 'unknown',
                rules_loaded: response.rules_loaded || 0,
                rules_by_category: response.rules_by_category,
                rag_enabled: response.rag_enabled || false,
                features: response.features
            };
        } catch (error) {
            throw new Error('Backend server is not responding. Please ensure it is running on ' + this.serverUrl);
        }
    }

    /**
     * Get system statistics
     */
    async getStatistics(): Promise<SystemStatistics> {
        try {
            const response = await this.makeRequest<{ success: boolean; statistics: SystemStatistics }>(
                '/statistics',
                'GET',
                null,
                5000
            );

            if (response.success && response.statistics) {
                return response.statistics;
            } else {
                throw new Error('Failed to fetch statistics');
            }
        } catch (error) {
            throw this.handleError(error, 'Statistics fetch');
        }
    }

    /**
     * Get Schneider rules by category
     */
    async getRules(category: string = 'all'): Promise<any[]> {
        try {
            const response = await this.makeRequest<{ success: boolean; rules: any[]; total: number }>(
                `/rules?category=${category}`,
                'GET',
                null,
                10000
            );

            if (response.success) {
                return response.rules || [];
            } else {
                throw new Error('Failed to fetch rules');
            }
        } catch (error) {
            throw this.handleError(error, 'Rules fetch');
        }
    }

    /**
     * Update server URL dynamically
     */
    updateServerUrl(newUrl: string) {
        this.serverUrl = newUrl;
        console.log(`✅ Server URL updated to: ${this.serverUrl}`);
    }

    /**
     * Test connection to backend
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.checkHealth();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get current configuration
     */
    getConfig(): { serverUrl: string; timeout: number; retryAttempts: number } {
        return {
            serverUrl: this.serverUrl,
            timeout: this.timeout,
            retryAttempts: this.retryAttempts
        };
    }

    /**
     * Make HTTP request with retry logic
     */
    private async makeRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST',
        data: any = null,
        timeout: number = this.timeout
    ): Promise<T> {
        let lastError: any;
        
        for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
            try {
                const config: any = {
                    method: method,
                    url: `${this.serverUrl}${endpoint}`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    timeout: timeout,
                    validateStatus: (status: number) => status < 500
                };

                if (data && method === 'POST') {
                    config.data = data;
                }

                const response = await axios(config);

                if (response.status >= 400) {
                    throw new Error(`HTTP ${response.status}: ${response.data?.error || 'Unknown error'}`);
                }

                return response.data as T;

            } catch (error) {
                lastError = error;
                
                // Don't retry on certain errors
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    if (status && (status === 400 || status === 401 || status === 403 || status === 404)) {
                        break; // Don't retry client errors
                    }
                }
                
                if (attempt < this.retryAttempts) {
                    console.log(`Retry attempt ${attempt + 1}/${this.retryAttempts}...`);
                    await this.delay(1000 * (attempt + 1)); // Exponential backoff
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Delay helper for retry logic
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Handle errors with detailed messaging
     */
    private handleError(error: any, operation: string): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            
            if (axiosError.response) {
                // Server responded with error
                const status = axiosError.response.status;
                const data = axiosError.response.data as any;
                
                let message = `${operation} failed (HTTP ${status})`;
                
                if (data?.error) {
                    message += `: ${data.error}`;
                }
                
                // Special handling for specific error codes
                if (status === 401 || status === 403) {
                    message = 'Authentication error. Please check backend API keys in .env file.';
                } else if (status === 500) {
                    message = 'Server error. Check backend logs for details.';
                } else if (status === 503) {
                    message = 'Service unavailable. Backend AI service may be down.';
                }
                
                throw new Error(message);
            } else if (axiosError.request) {
                // Request made but no response
                throw new Error(
                    `Cannot connect to backend server at ${this.serverUrl}. ` +
                    'Please ensure the Python backend is running. ' +
                    'Start it with: python app.py'
                );
            } else {
                // Request setup error
                throw new Error(`${operation} failed: ${axiosError.message}`);
            }
        } else if (error instanceof Error) {
            throw new Error(`${operation} failed: ${error.message}`);
        } else {
            throw new Error(`${operation} failed: Unknown error`);
        }
    }

    /**
     * Handle chat-specific errors gracefully
     */
    private handleChatError(error: any): string {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            
            if (axiosError.response?.status === 500) {
                return 'I encountered an internal error. The backend AI service may be experiencing issues. Please try again in a moment.';
            } else if (!axiosError.response) {
                return 'I cannot reach the backend server. Please ensure it is running and try again.';
            }
        }
        
        return 'I apologize, but I encountered an unexpected error. Please check the backend logs and try again.';
    }
}