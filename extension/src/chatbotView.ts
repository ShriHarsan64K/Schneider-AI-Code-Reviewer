/**
 * CHATBOT VIEW - ZERO ERRORS VERSION
 * Fixed all TypeScript compilation issues
 */

import * as vscode from 'vscode';
import { LLMClient } from './llmClient';

export class ChatbotViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'schneider-ai-assistant';
    private _view?: vscode.WebviewView;
    private llmClient: LLMClient;
    private currentAnalysisResult: any = null;
    private currentCode: string = '';
    private currentFileName: string = '';

    constructor(
        private readonly _extensionUri: vscode.Uri,
        llmClient: LLMClient
    ) {
        this.llmClient = llmClient;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'chat':
                    await this.handleChatMessage(data.message);
                    break;
                case 'fixCode':
                    await this.handleFixCode();
                    break;
                case 'downloadFixed':
                    await this.handleDownloadFixed();
                    break;
                case 'openDashboard':
                    vscode.commands.executeCommand('schneider.openDashboard');
                    break;
            }
        });
    }

    public async showAnalysisResults(result: any, code: string, fileName: string) {
        this.currentAnalysisResult = result;
        this.currentCode = code;
        this.currentFileName = fileName;

        if (this._view) {
            const score = result.score || 0;
            const issueCount = result.issues?.length || 0;
            
            this._view.webview.postMessage({
                type: 'analysisComplete',
                result: result,
                score: score,
                issueCount: issueCount,
                fileName: fileName
            });

            this._view.show?.(true);
        }
    }

    private async handleChatMessage(message: string) {
        try {
            this._view?.webview.postMessage({
                type: 'thinking',
                message: 'AI is thinking...'
            });

            // Build context with issues
            let context = '';
            if (this.currentAnalysisResult) {
                const issues = this.currentAnalysisResult.issues || [];
                const score = this.currentAnalysisResult.score || 0;
                
                context = `File: ${this.currentFileName}
Score: ${score}/100
Issues Found: ${issues.length}

Top Issues:
${issues.slice(0, 5).map((i: any, idx: number) => 
    `${idx + 1}. [${i.severity}] ${i.message} (Line ${i.line})`
).join('\n')}

Current Code:
\`\`\`python
${this.currentCode}
\`\`\`

Instructions: Give SPECIFIC fixes with CODE EXAMPLES. Show exactly what to change.`;
            }

            const reply = await this.llmClient.chat(message, context);

            this._view?.webview.postMessage({
                type: 'chatReply',
                message: reply
            });
        } catch (error: any) {
            this._view?.webview.postMessage({
                type: 'error',
                message: `Chat error: ${error.message}`
            });
        }
    }

    private async handleFixCode() {
        if (!this.currentAnalysisResult || !this.currentCode) {
            vscode.window.showWarningMessage('No analysis results to fix');
            return;
        }

        try {
            this._view?.webview.postMessage({
                type: 'fixing',
                message: 'AI is fixing your code...'
            });

            const firstIssue = this.currentAnalysisResult.issues?.[0];
            const errorDesc = firstIssue 
                ? `${firstIssue.rule}: ${firstIssue.message}`
                : 'Multiple issues detected';

            const fixedCode = await this.llmClient.fixCode(
                this.currentCode, 
                errorDesc, 
                this.currentAnalysisResult.issues || [],
                this.currentFileName
            );

            this.currentCode = fixedCode;

            this._view?.webview.postMessage({
                type: 'codeFixed',
                fixedCode: fixedCode
            });

            vscode.window.showInformationMessage('✅ Code fixed! Re-analyzing to update score...');

            // Re-analyze fixed code to update score automatically
            try {
                const newResult = await this.llmClient.analyzeCode(fixedCode, this.currentFileName);
                this.currentAnalysisResult = newResult;
                if (this._view) {
                    this._view.webview.postMessage({
                        type: 'analysisComplete',
                        result: newResult,
                        score: newResult.score,
                        issueCount: newResult.issues?.length || 0,
                        fileName: this.currentFileName
                    });
                }
                vscode.window.showInformationMessage(`✅ Score updated: ${newResult.score}/100 (${newResult.grade})`);
            } catch (_reErr) {
                // Silent fail - fix still applied
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Fix failed: ${error.message}`);
            
            this._view?.webview.postMessage({
                type: 'error',
                message: `Fix error: ${error.message}`
            });
        }
    }

    private async handleDownloadFixed() {
        if (!this.currentCode) {
            vscode.window.showWarningMessage('No fixed code available');
            return;
        }

        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                const document = await vscode.workspace.openTextDocument({
                    content: this.currentCode,
                    language: this.currentFileName.endsWith('.py') ? 'python' : 'text'
                });
                await vscode.window.showTextDocument(document);
            } else {
                const edit = new vscode.WorkspaceEdit();
                const fullRange = new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(editor.document.getText().length)
                );
                edit.replace(editor.document.uri, fullRange, this.currentCode);
                await vscode.workspace.applyEdit(edit);
            }

            vscode.window.showInformationMessage('✅ Fixed code applied!');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Download failed: ${error.message}`);
        }
    }

    private _getHtmlForWebview(_webview: vscode.Webview) {
        // Using backticks for template string - all JS code is inside HTML
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schneider AI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1e1e1e; color: #cccccc; padding: 16px; }
        .header { background: linear-gradient(135deg, #3DCD58 0%, #009933 100%); padding: 20px; border-radius: 8px; margin-bottom: 16px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); }
        .header h1 { color: white; font-size: 18px; margin-bottom: 8px; }
        .header-button { background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; margin-top: 8px; }
        .score-card { background: #252526; border: 2px solid #3DCD58; border-radius: 8px; padding: 16px; margin-bottom: 16px; display: none; }
        .score-card.show { display: block; }
        .score-number { font-size: 48px; font-weight: bold; margin: 8px 0; }
        .download-button { background: #3DCD58; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; margin-top: 12px; }
        .chat-container { background: #252526; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .chat-messages { max-height: 300px; overflow-y: auto; margin-bottom: 12px; }
        .message { margin-bottom: 12px; padding: 10px; border-radius: 6px; }
        .message.user { background: #0e639c; color: white; margin-left: 20px; }
        .message.assistant { background: #2d2d30; border-left: 3px solid #3DCD58; }
        .message.system { background: #3a3d41; font-style: italic; text-align: center; color: #999; }
        .chat-input { flex: 1; background: #3c3c3c; border: 1px solid #555; color: #cccccc; padding: 10px; border-radius: 4px; }
        .send-button { background: #3DCD58; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .chat-input-container { display: flex; gap: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚡ Schneider Electric</h1>
        <button class="header-button" onclick="openDashboard()">🚀 OPEN RULE ENGINE</button>
    </div>
    <div class="score-card" id="scoreCard">
        <div style="text-align: center;">
            <div id="fileName" style="font-size: 14px; color: #999;">test.py</div>
            <div style="font-size: 14px; color: #999;">Compliance Score</div>
            <div class="score-number" id="scoreNumber">0</div>
            <div style="font-size: 24px; color: #999;">/100</div>
            <div id="scoreRating" style="font-size: 16px; font-weight: 600;">Needs Improvement</div>
        </div>
        <button class="download-button" onclick="fixCode()" style="background: #FF8C00; margin-top: 8px;">🔧 Auto-Fix Code</button>
        <button class="download-button" onclick="downloadFixed()">📥 Download Fixed Code</button>
    </div>
    <div class="chat-container">
        <div class="chat-messages" id="chatMessages">
            <div class="message system">Ask me anything about your code! 🤖</div>
        </div>
        <div class="chat-input-container">
            <input type="text" class="chat-input" id="chatInput" placeholder="Ask me anything..." onkeypress="handleKeyPress(event)" />
            <button class="send-button" id="sendButton" onclick="sendMessage()">Send</button>
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'analysisComplete':
                    showAnalysisResults(message);
                    break;
                case 'chatReply':
                    addMessage(message.message, 'assistant');
                    enableInput();
                    break;
                case 'thinking':
                    addMessage(message.message, 'system');
                    disableInput();
                    break;
                case 'codeFixed':
                    addMessage('Code has been fixed successfully!', 'system');
                    enableInput();
                    break;
                case 'fixing':
                    addMessage(message.message, 'system');
                    disableInput();
                    break;
                case 'error':
                    addMessage('Error: ' + message.message, 'system');
                    enableInput();
                    break;
            }
        });
        function showAnalysisResults(data) {
            const scoreCard = document.getElementById('scoreCard');
            const scoreNumber = document.getElementById('scoreNumber');
            const scoreRating = document.getElementById('scoreRating');
            const fileName = document.getElementById('fileName');
            scoreCard.classList.add('show');
            scoreNumber.textContent = data.score;
            fileName.textContent = data.fileName;
            if (data.score >= 80) {
                scoreNumber.style.color = '#00A651';
                scoreRating.textContent = 'Excellent';
                scoreRating.style.color = '#00A651';
            } else if (data.score >= 50) {
                scoreNumber.style.color = '#FF8C00';
                scoreRating.textContent = 'Needs Improvement';
                scoreRating.style.color = '#FF8C00';
            } else {
                scoreNumber.style.color = '#DC143C';
                scoreRating.textContent = 'Poor';
                scoreRating.style.color = '#DC143C';
            }
            let summary = '';
            if (data.score >= 80) {
                summary = '✅ Excellent work! Your code scored ' + data.score + '/100. Code meets Schneider standards!';
            } else if (data.score >= 50) {
                summary = '⚠️ Your code scored ' + data.score + '/100. Some issues found. Click Auto-Fix to resolve them!';
            } else {
                summary = '❌ Your code scored ' + data.score + '/100. Multiple violations found. Click Auto-Fix Code to fix all issues!';
            }
            addMessage(summary, 'assistant');
        }
        function addMessage(text, type) {
            const messagesDiv = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + type;
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            if (!message) return;
            addMessage(message, 'user');
            input.value = '';
            vscode.postMessage({ type: 'chat', message: message });
        }
        function handleKeyPress(event) {
            if (event.key === 'Enter') { sendMessage(); }
        }
        function downloadFixed() {
            vscode.postMessage({ type: 'downloadFixed' });
        }
        function fixCode() {
            vscode.postMessage({ type: 'fixCode' });
            addMessage('🔧 AI is fixing your code...', 'system');
            disableInput();
        }
        function openDashboard() {
            vscode.postMessage({ type: 'openDashboard' });
        }
        function disableInput() {
            document.getElementById('chatInput').disabled = true;
            document.getElementById('sendButton').disabled = true;
        }
        function enableInput() {
            document.getElementById('chatInput').disabled = false;
            document.getElementById('sendButton').disabled = false;
        }
    </script>
</body>
</html>`;
    }
}