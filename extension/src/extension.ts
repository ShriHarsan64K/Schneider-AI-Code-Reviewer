/**
 * SCHNEIDER ELECTRIC AI CODE REVIEWER - PRODUCTION v8.0
 * - ENHANCED FEATURES: History tracking, statistics, better UX
 * - MULTI-LANGUAGE: Python, ST, JS, TS, C, C++, Java support
 * - PERSISTENT DATA: Analysis history saved
 */

import * as vscode from 'vscode';
import { LLMClient } from './llmClient';
import { ChatbotViewProvider } from './chatbotView';

// Interfaces for type safety
interface AnalysisResult {
    issues: any[];
    score: number;
    grade: string;
    file_type: string;
    rules_checked: number;
    statistics?: {
        critical: number;
        errors: number;
        warnings: number;
        info: number;
    };
}

interface AnalysisHistory {
    timestamp: string;
    fileName: string;
    filePath: string;
    score: number;
    grade: string;
    issueCount: number;
    fileType: string;
}

// Supported file types with language mapping
const SUPPORTED_LANGUAGES: { [key: string]: string[] } = {
    'python': ['py', 'pyw'],
    'structured-text': ['st', 'iec'],
    'javascript': ['js', 'jsx'],
    'typescript': ['ts', 'tsx'],
    'c': ['c', 'h'],
    'cpp': ['cpp', 'hpp', 'cc', 'cxx', 'hh'],
    'java': ['java'],
    'json': ['json'],
    'xml': ['xml'],
    'markdown': ['md']
};

// Global state
let llmClient: LLMClient;
let chatbotProvider: ChatbotViewProvider;
let lastAnalysisResult: AnalysisResult | null = null;
let diagnosticCollection: vscode.DiagnosticCollection;
let statusBarItem: vscode.StatusBarItem;
let analysisHistory: AnalysisHistory[] = [];

/**
 * Extension Activation
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Schneider Electric AI Code Reviewer v8.0 - Production Edition activated');

    // Initialize diagnostic collection
    diagnosticCollection = vscode.languages.createDiagnosticCollection('schneider-ai');
    context.subscriptions.push(diagnosticCollection);

    // Initialize status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(check) Schneider AI";
    statusBarItem.tooltip = "Schneider Electric AI Code Reviewer";
    statusBarItem.command = 'schneider.startAnalysis';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Load analysis history from storage
    loadAnalysisHistory(context);

    // Initialize LLM Client
    llmClient = new LLMClient();
    
    // Perform health check on activation
    checkBackendHealth().then(healthy => {
        if (healthy) {
            statusBarItem.text = "$(check) Schneider AI Ready";
            statusBarItem.backgroundColor = undefined;
        } else {
            statusBarItem.text = "$(warning) Schneider AI Offline";
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
    });
    
    // Initialize Chatbot View Provider
    chatbotProvider = new ChatbotViewProvider(context.extensionUri, llmClient);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'schneider-ai-assistant',
            chatbotProvider
        )
    );

    // Register Commands
    const commands = [
        vscode.commands.registerCommand('schneider.startAnalysis', () => startAnalysis(context)),
        vscode.commands.registerCommand('schneider.generateReport', generateReport),
        vscode.commands.registerCommand('schneider.openDashboard', openDashboard),
        vscode.commands.registerCommand('schneider.clearApiKey', showBackendInfo),
        vscode.commands.registerCommand('schneider.checkHealth', () => checkBackendHealth()),
        vscode.commands.registerCommand('schneider.viewHistory', () => showAnalysisHistory(context)),
        vscode.commands.registerCommand('schneider.clearHistory', () => clearAnalysisHistory(context)),
        vscode.commands.registerCommand('schneider.exportAnalysis', exportCurrentAnalysis),
        vscode.commands.registerCommand('schneider.showStatistics', showStatistics)
    ];

    context.subscriptions.push(...commands);

    // Auto-analyze on save (if enabled)
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document) => {
            const config = vscode.workspace.getConfiguration('schneiderAI');
            const autoAnalyze = config.get<boolean>('autoAnalyzeOnSave', false);
            const maxLines = config.get<number>('maxFileSize', 1000);
            
            if (autoAnalyze && document.lineCount <= maxLines) {
                const fileExt = document.fileName.split('.').pop()?.toLowerCase();
                if (fileExt && isSupportedFileType(fileExt)) {
                    startAnalysis(context);
                }
            }
        })
    );

    // Update status bar on file change
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                const fileExt = editor.document.fileName.split('.').pop()?.toLowerCase();
                if (fileExt && isSupportedFileType(fileExt)) {
                    statusBarItem.text = "$(check) Schneider AI Ready";
                } else {
                    statusBarItem.text = "$(info) Schneider AI (Unsupported file)";
                }
            }
        })
    );

    console.log('✅ Schneider AI: All systems operational');
    
    // Show welcome message
    showWelcomeMessage(context);
}

/**
 * Check if file type is supported
 */
function isSupportedFileType(ext: string): boolean {
    for (const types of Object.values(SUPPORTED_LANGUAGES)) {
        if (types.includes(ext)) {
            return true;
        }
    }
    return false;
}

/**
 * Get language name from extension
 * Used internally for file type validation
 */
function getLanguageName(ext: string): string {
    for (const [lang, exts] of Object.entries(SUPPORTED_LANGUAGES)) {
        if (exts.includes(ext)) {
            return lang;
        }
    }
    return 'unknown';
}

// Export for testing purposes
export { getLanguageName };

/**
 * Show welcome message on first activation
 */
function showWelcomeMessage(context: vscode.ExtensionContext) {
    const hasShownWelcome = context.globalState.get<boolean>('schneider.hasShownWelcome', false);
    
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            '⚡ Schneider Electric AI Code Reviewer v8.0 activated! Press Ctrl+Shift+S to analyze code.',
            'Get Started',
            'View Features',
            'Don\'t Show Again'
        ).then(selection => {
            if (selection === 'Get Started') {
                vscode.commands.executeCommand('workbench.view.extension.schneider-ai-view');
            } else if (selection === 'View Features') {
                showStatistics();
            } else if (selection === 'Don\'t Show Again') {
                context.globalState.update('schneider.hasShownWelcome', true);
            }
        });
    }
}

/**
 * Check Backend Health
 */
async function checkBackendHealth(): Promise<boolean> {
    try {
        const health = await llmClient.checkHealth();
        
        if (health.status === 'healthy') {
            console.log(`✅ Backend connected: ${health.llm_provider} (${health.model})`);
            console.log(`✅ Rules loaded: ${health.rules_loaded}`);
            return true;
        } else {
            vscode.window.showWarningMessage(
                '⚠️ Backend server health check failed. Please ensure the server is running.',
                'Retry',
                'Settings'
            ).then(selection => {
                if (selection === 'Retry') {
                    checkBackendHealth();
                } else if (selection === 'Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'schneiderAI.serverUrl');
                }
            });
            return false;
        }
    } catch (error: any) {
        console.error('Backend health check failed:', error);
        vscode.window.showErrorMessage(
            '❌ Cannot connect to backend server. Please start the Python backend on http://localhost:5000',
            'Start Guide',
            'Open Settings'
        ).then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'schneiderAI.serverUrl');
            } else if (selection === 'Start Guide') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/schneider-electric/ai-code-reviewer#setup'));
            }
        });
        return false;
    }
}

/**
 * Start Code Analysis - Main Feature
 */
async function startAnalysis(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage('❌ No active editor found. Please open a file first.');
        return;
    }

    const document = editor.document;
    const code = document.getText();
    const fileName = document.fileName.split(/[\\/]/).pop() || 'unknown';
    const filePath = document.fileName;

    // Validate file type
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (!fileExtension || !isSupportedFileType(fileExtension)) {
        const supportedList = Object.values(SUPPORTED_LANGUAGES).flat().join(', ');
        vscode.window.showWarningMessage(
            `⚠️ Schneider AI supports: ${supportedList}`,
            'Learn More'
        ).then(selection => {
            if (selection === 'Learn More') {
                vscode.env.openExternal(vscode.Uri.parse('https://schneider-electric.com/code-review'));
            }
        });
        return;
    }

    // Validate file size
    const config = vscode.workspace.getConfiguration('schneiderAI');
    const maxLines = config.get<number>('maxFileSize', 1000);
    
    if (document.lineCount > maxLines) {
        const proceed = await vscode.window.showWarningMessage(
            `⚠️ File has ${document.lineCount} lines (max: ${maxLines}). Analysis may take longer.`,
            'Analyze Anyway',
            'Cancel'
        );
        
        if (proceed !== 'Analyze Anyway') {
            return;
        }
    }

    // Update status bar
    statusBarItem.text = "$(sync~spin) Analyzing...";

    // Show progress with detailed steps
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'Schneider AI Analysis',
            cancellable: false
        },
        async (progress) => {
            try {
                progress.report({ increment: 0, message: '🔍 Initializing analysis...' });
                
                // Clear previous diagnostics
                diagnosticCollection.clear();
                
                progress.report({ increment: 15, message: '📡 Connecting to AI engine...' });
                
                const startTime = Date.now();
                
                // Call backend
                const result: AnalysisResult = await llmClient.analyzeCode(code, fileName);
                
                const analysisTime = ((Date.now() - startTime) / 1000).toFixed(2);
                
                progress.report({ increment: 40, message: '🧠 Processing results...' });
                
                // Store result
                lastAnalysisResult = result;
                
                // Show diagnostics in editor
                const showInline = config.get<boolean>('showInlineErrors', true);
                if (showInline) {
                    showDiagnostics(document, result.issues || []);
                }
                
                progress.report({ increment: 25, message: '📊 Generating insights...' });
                
                // Save to history
                const historyEntry: AnalysisHistory = {
                    timestamp: new Date().toISOString(),
                    fileName: fileName,
                    filePath: filePath,
                    score: result.score || 0,
                    grade: result.grade || 'N/A',
                    issueCount: result.issues?.length || 0,
                    fileType: result.file_type || fileExtension
                };
                
                analysisHistory.unshift(historyEntry);
                if (analysisHistory.length > 50) {
                    analysisHistory = analysisHistory.slice(0, 50); // Keep last 50
                }
                
                await context.globalState.update('schneider.analysisHistory', analysisHistory);
                
                progress.report({ increment: 15, message: '🤖 Opening AI Assistant...' });
                
                // Show chatbot with results
                await chatbotProvider.showAnalysisResults(result, code, fileName);
                
                progress.report({ increment: 5, message: '✅ Complete!' });
                
                // Update status bar
                const score = result.score || 0;
                if (score >= 90) {
                    statusBarItem.text = `$(check) Score: ${score}/100 (${result.grade})`;
                    statusBarItem.backgroundColor = undefined;
                } else if (score >= 70) {
                    statusBarItem.text = `$(warning) Score: ${score}/100 (${result.grade})`;
                    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                } else {
                    statusBarItem.text = `$(error) Score: ${score}/100 (${result.grade})`;
                    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                }
                
                // Show summary notification
                const issueCount = result.issues?.length || 0;
                
                let message = `✅ Analysis Complete (${analysisTime}s): ${issueCount} issue${issueCount !== 1 ? 's' : ''} | Score: ${score}/100 (${result.grade})`;
                
                const actions = issueCount > 0 ? ['View Issues', 'Generate Report'] : ['Generate Report', 'View History'];
                
                vscode.window.showInformationMessage(message, ...actions).then(selection => {
                    if (selection === 'View Issues') {
                        vscode.commands.executeCommand('workbench.view.extension.schneider-ai-view');
                    } else if (selection === 'Generate Report') {
                        generateReport();
                    } else if (selection === 'View History') {
                        showAnalysisHistory(context);
                    }
                });
                
                console.log(`✅ Analysis complete: ${fileName} - ${score}/100 (${result.grade}) - ${issueCount} issues`);
                
            } catch (error: any) {
                statusBarItem.text = "$(error) Analysis Failed";
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                
                vscode.window.showErrorMessage(
                    `❌ Analysis failed: ${error.message}`,
                    'Retry',
                    'Check Backend'
                ).then(selection => {
                    if (selection === 'Retry') {
                        startAnalysis(context);
                    } else if (selection === 'Check Backend') {
                        checkBackendHealth();
                    }
                });
                console.error('Analysis error:', error);
            }
        }
    );
}

/**
 * Generate PDF Report
 */
async function generateReport() {
    if (!lastAnalysisResult) {
        vscode.window.showWarningMessage('❌ No analysis results available. Please analyze a file first.');
        return;
    }

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'Generating PDF Report',
            cancellable: false
        },
        async (progress) => {
            try {
                const editor = vscode.window.activeTextEditor;
                const fileName = editor?.document.fileName.split(/[\\/]/).pop() || 'code_analysis';
                const code = editor?.document.getText() || '';
                
                progress.report({ increment: 30, message: '📄 Creating professional report...' });
                
                // Null-safe access to lastAnalysisResult
                const issues = lastAnalysisResult?.issues || [];
                const score = lastAnalysisResult?.score || 0;
                const grade = lastAnalysisResult?.grade || 'N/A';
                
                const reportResult = await llmClient.generateReport(
                    code,
                    issues,
                    score,
                    fileName,
                    grade
                );
                
                progress.report({ increment: 70, message: '✅ Report generated!' });
                
                const config = vscode.workspace.getConfiguration('schneiderAI');
                const serverUrl = config.get<string>('serverUrl') || 'http://localhost:5000';
                const reportUrl = `${serverUrl}/download_report/${reportResult.filename}`;
                
                const action = await vscode.window.showInformationMessage(
                    `✅ PDF Report Generated: ${reportResult.filename}`,
                    '🌐 Open in Browser',
                    '📁 Show in Folder',
                    '📋 Copy Link'
                );
                
                if (action === '🌐 Open in Browser') {
                    vscode.env.openExternal(vscode.Uri.parse(reportUrl));
                } else if (action === '📁 Show in Folder') {
                    try {
                        vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(reportResult.path));
                    } catch {
                        vscode.window.showInformationMessage(`Report saved to: ${reportResult.path}`);
                    }
                } else if (action === '📋 Copy Link') {
                    vscode.env.clipboard.writeText(reportUrl);
                    vscode.window.showInformationMessage('✅ Report link copied to clipboard!');
                }
                
            } catch (error: any) {
                vscode.window.showErrorMessage(
                    `❌ Report generation failed: ${error.message}`,
                    'Check Backend'
                ).then(selection => {
                    if (selection === 'Check Backend') {
                        checkBackendHealth();
                    }
                });
                console.error('Report error:', error);
            }
        }
    );
}

/**
 * Open Rule Engine Dashboard
 */
async function openDashboard() {
    try {
        const config = vscode.workspace.getConfiguration('schneiderAI');
        const streamlitUrl = config.get<string>('streamlitUrl') || 'https://k7bjmvlbxtd8ieetznyoyy.streamlit.app/';
        
        const action = await vscode.window.showInformationMessage(
            '🚀 Open Schneider Rule Engine Dashboard',
            '🌐 Open in Browser',
            '💻 Open in VS Code',
            '⚙️ Configure'
        );
        
        if (action === '🌐 Open in Browser') {
            vscode.env.openExternal(vscode.Uri.parse(streamlitUrl));
        } else if (action === '💻 Open in VS Code') {
            vscode.commands.executeCommand('simpleBrowser.show', streamlitUrl);
        } else if (action === '⚙️ Configure') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'schneiderAI.streamlitUrl');
        }
        
    } catch (error: any) {
        vscode.window.showErrorMessage(
            `❌ Failed to open dashboard: ${error.message}`,
            'Check URL'
        ).then(selection => {
            if (selection === 'Check URL') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'schneiderAI.streamlitUrl');
            }
        });
    }
}

/**
 * Show Backend Info
 */
async function showBackendInfo() {
    try {
        const health = await llmClient.checkHealth();
        
        const message = `
🏆 Schneider Electric AI Code Reviewer v8.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Backend Status: ${health.status}
🤖 AI Provider: ${health.llm_provider}
🧠 Model: ${health.model}
📋 Rules Loaded: ${health.rules_loaded}
🔍 RAG Engine: ${health.rag_enabled ? 'Active' : 'Inactive'}

💡 API keys are managed by the backend server (.env file).
No client-side configuration needed!
        `;
        
        vscode.window.showInformationMessage(
            message,
            'Open Settings',
            'View Documentation',
            'Check Updates'
        ).then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'schneiderAI');
            } else if (selection === 'View Documentation') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/schneider-electric/ai-code-reviewer'));
            } else if (selection === 'Check Updates') {
                vscode.commands.executeCommand('workbench.extensions.action.checkForUpdates');
            }
        });
        
    } catch (error) {
        vscode.window.showErrorMessage(
            '❌ Cannot connect to backend. Please ensure the Python server is running.',
            'Start Guide',
            'Settings'
        ).then(selection => {
            if (selection === 'Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'schneiderAI.serverUrl');
            } else if (selection === 'Start Guide') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/schneider-electric/ai-code-reviewer#quick-start'));
            }
        });
    }
}

/**
 * Show Analysis History
 */
async function showAnalysisHistory(context: vscode.ExtensionContext) {
    if (analysisHistory.length === 0) {
        vscode.window.showInformationMessage('📊 No analysis history available yet. Analyze a file to start!');
        return;
    }
    
    const items = analysisHistory.map((entry, index) => ({
        label: `$(file-code) ${entry.fileName}`,
        description: `Score: ${entry.score}/100 (${entry.grade}) | Issues: ${entry.issueCount}`,
        detail: `${new Date(entry.timestamp).toLocaleString()} | ${entry.filePath}`,
        entry: entry,
        index: index
    }));
    
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select an analysis to view',
        title: '📊 Analysis History'
    });
    
    if (selected) {
        vscode.window.showInformationMessage(
            `Analysis from ${new Date(selected.entry.timestamp).toLocaleString()}`,
            'Open File',
            'Clear History'
        ).then(action => {
            if (action === 'Open File') {
                vscode.workspace.openTextDocument(selected.entry.filePath).then(doc => {
                    vscode.window.showTextDocument(doc);
                });
            } else if (action === 'Clear History') {
                clearAnalysisHistory(context);
            }
        });
    }
}

/**
 * Clear Analysis History
 */
async function clearAnalysisHistory(context: vscode.ExtensionContext) {
    const confirm = await vscode.window.showWarningMessage(
        '⚠️ Clear all analysis history?',
        { modal: true },
        'Clear',
        'Cancel'
    );
    
    if (confirm === 'Clear') {
        analysisHistory = [];
        await context.globalState.update('schneider.analysisHistory', []);
        vscode.window.showInformationMessage('✅ Analysis history cleared');
    }
}

/**
 * Load Analysis History from storage
 */
function loadAnalysisHistory(context: vscode.ExtensionContext) {
    const stored = context.globalState.get<AnalysisHistory[]>('schneider.analysisHistory', []);
    analysisHistory = stored;
    console.log(`✅ Loaded ${analysisHistory.length} history entries`);
}

/**
 * Export Current Analysis as JSON
 */
async function exportCurrentAnalysis() {
    if (!lastAnalysisResult) {
        vscode.window.showWarningMessage('❌ No analysis results to export');
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    const fileName = editor?.document.fileName.split(/[\\/]/).pop() || 'analysis';
    
    const exportData = {
        file: fileName,
        timestamp: new Date().toISOString(),
        score: lastAnalysisResult.score,
        grade: lastAnalysisResult.grade,
        issues: lastAnalysisResult.issues,
        statistics: lastAnalysisResult.statistics,
        rules_checked: lastAnalysisResult.rules_checked
    };
    
    const exportJson = JSON.stringify(exportData, null, 2);
    
    const doc = await vscode.workspace.openTextDocument({
        content: exportJson,
        language: 'json'
    });
    
    await vscode.window.showTextDocument(doc);
    vscode.window.showInformationMessage('✅ Analysis exported as JSON');
}

/**
 * Show Statistics
 */
async function showStatistics() {
    try {
        const stats = await llmClient.getStatistics();
        
        const message = `
📊 SCHNEIDER AI STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Total Rules: ${stats.total_rules}
📁 Naming Rules: ${stats.rule_categories.naming}
🏗️  Structure Rules: ${stats.rule_categories.structure}
🔒 Security Rules: ${stats.rule_categories.security}
⚡ Energy Rules: ${stats.rule_categories.energy}

🤖 AI: ${stats.llm_provider.toUpperCase()} (${stats.model})
📜 Version: ${stats.version}
        `;
        
        vscode.window.showInformationMessage(message, 'View Dashboard', 'Close').then(action => {
            if (action === 'View Dashboard') {
                openDashboard();
            }
        });
        
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch statistics: ${error.message}`);
    }
}

/**
 * Show Diagnostics in Editor
 */
function showDiagnostics(document: vscode.TextDocument, issues: any[]) {
    const diagnostics: vscode.Diagnostic[] = [];
    
    for (const issue of issues) {
        const line = Math.max(0, (issue.line || 1) - 1);
        const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);
        
        // Determine severity
        let severity: vscode.DiagnosticSeverity;
        if (issue.severity === 'critical' || issue.severity === 'error') {
            severity = vscode.DiagnosticSeverity.Error;
        } else if (issue.severity === 'warning') {
            severity = vscode.DiagnosticSeverity.Warning;
        } else {
            severity = vscode.DiagnosticSeverity.Information;
        }
        
        // Create diagnostic
        const diagnostic = new vscode.Diagnostic(
            range,
            issue.message || 'Code quality issue detected',
            severity
        );
        
        diagnostic.source = 'Schneider AI';
        diagnostic.code = issue.rule || 'UNKNOWN';
        
        // Add suggested fix if available
        if (issue.fix) {
            diagnostic.relatedInformation = [
                new vscode.DiagnosticRelatedInformation(
                    new vscode.Location(document.uri, range),
                    `Suggested fix: ${issue.fix}`
                )
            ];
        }
        
        // Add tags
        if (issue.severity === 'critical') {
            diagnostic.tags = [vscode.DiagnosticTag.Deprecated]; // Visual indicator for critical
        }
        
        diagnostics.push(diagnostic);
    }
    
    diagnosticCollection.set(document.uri, diagnostics);
    
    console.log(`✅ Displayed ${diagnostics.length} diagnostics in editor`);
}

/**
 * Deactivate Extension
 */
export function deactivate() {
    console.log('👋 Schneider Electric AI Code Reviewer deactivated');
    
    // Clean up
    if (diagnosticCollection) {
        diagnosticCollection.clear();
        diagnosticCollection.dispose();
    }
    
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}