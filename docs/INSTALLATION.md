# 📦 Installation Guide - Schneider Electric AI Code Reviewer

Complete step-by-step installation instructions for all platforms.

---

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Detailed Installation](#detailed-installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Platform-Specific Notes](#platform-specific-notes)

---

## 💻 System Requirements

### Minimum Requirements
- **Operating System:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js:** 18.x or higher
- **Python:** 3.11 or higher
- **VSCode:** 1.85 or higher
- **RAM:** 4 GB minimum (8 GB recommended)
- **Disk Space:** 500 MB for installation + reports
- **Internet:** Required for AI API calls

### Required Software
- **Git:** For cloning repository and version control
- **npm:** Comes with Node.js
- **pip:** Comes with Python

### API Keys (Choose One)
- **OpenAI API Key:** Get from https://platform.openai.com/api-keys
- **Google Gemini API Key:** Get from https://makersuite.google.com/app/apikey

---

## ⚡ Quick Installation

**Total Time:** ~15 minutes

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/Schneider-AI-Code-Reviewer.git
cd Schneider-AI-Code-Reviewer
```

### 2. Backend Setup (5 minutes)
```bash
cd server
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys (use notepad, nano, or vim)

python app.py
```

### 3. Extension Setup (5 minutes)
```bash
# In new terminal
cd extension
npm install
npm run compile

# Open in VSCode
code .

# Press F5 to launch Extension Development Host
```

### 4. Test
- Open a Python file in the new VSCode window
- Press `Ctrl+Shift+S` to analyze
- Verify issues are detected

**Done! 🎉**

---

## 📖 Detailed Installation

### Backend Setup

#### Step 1: Install Python (if not installed)

**Windows:**
1. Download Python 3.11+ from https://www.python.org/downloads/
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Click "Install Now"
5. Verify: `python --version`

**macOS:**
```bash
# Using Homebrew
brew install python@3.11

# Verify
python3 --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip

# Verify
python3 --version
```

#### Step 2: Clone Repository
```bash
git clone https://github.com/yourusername/Schneider-AI-Code-Reviewer.git
cd Schneider-AI-Code-Reviewer
```

#### Step 3: Create Virtual Environment
```bash
cd server

# Create virtual environment
python -m venv venv

# Or on some systems:
python3 -m venv venv
```

#### Step 4: Activate Virtual Environment

**Windows (PowerShell):**
```powershell
venv\Scripts\activate
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Verify activation:** Your prompt should show `(venv)` prefix.

#### Step 5: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-3.1.2 openai-1.55.0 ...
```

**If you get errors:**
- Ensure virtual environment is activated
- Try: `pip install --upgrade pip setuptools wheel`
- On Linux, you may need: `sudo apt install python3-dev`

#### Step 6: Configure Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env file
# Windows:
notepad .env
# Linux/Mac:
nano .env
```

**Required Configuration:**
```env
# Choose one provider
LLM_PROVIDER=gemini  # or 'openai'

# Add your API key (get from provider website)
GEMINI_API_KEY=AIza...your_key_here
# OR
OPENAI_API_KEY=sk-proj-...your_key_here
```

#### Step 7: Start Backend Server
```bash
python app.py
```

**Expected output:**
```
✅ Gemini initialized: gemini-2.0-flash
✅ Loaded 436 Schneider rules
✅ Loaded 17 C language-specific rules
✅ Loaded 18 CPP language-specific rules
... (more rule loading messages)
 * Running on http://127.0.0.1:5000
```

**Leave this terminal running!**

---

### Frontend Setup

#### Step 1: Install Node.js (if not installed)

**Windows:**
1. Download from https://nodejs.org/ (LTS version)
2. Run installer
3. Accept defaults
4. Verify: `node --version` and `npm --version`

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

#### Step 2: Navigate to Extension Directory
```bash
# Open new terminal (keep backend running in first terminal)
cd Schneider-AI-Code-Reviewer/extension
```

#### Step 3: Install npm Dependencies
```bash
npm install
```

**Expected output:**
```
added 150 packages in 30s
```

**If you get errors:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then retry
- Ensure Node.js version is 18.x or higher

#### Step 4: Compile TypeScript
```bash
npm run compile
```

**Expected output:**
```
> schneider-ai-code-reviewer@8.0.0 compile
> tsc -p ./
```

No output = successful compilation!

**If you get TypeScript errors:**
- Ensure all dependencies installed: `npm install`
- Check TypeScript version: `npm list typescript`
- Try: `npm install --save-dev typescript@5.3.3`

#### Step 5: Launch Extension in Development Mode

**Method 1: From Command Line**
```bash
# Open VSCode in extension directory
code .

# Then press F5 inside VSCode
```

**Method 2: From VSCode**
1. Open `Schneider-AI-Code-Reviewer/extension` folder in VSCode
2. Press `F5` (or Run → Start Debugging)
3. A new "Extension Development Host" VSCode window opens
4. This window has the extension loaded!

#### Step 6: Verify Extension Loaded
In the Extension Development Host window:
1. Look for "Schneider AI" icon in sidebar
2. Press `Ctrl+Shift+P` and type "Schneider"
3. You should see Schneider AI commands

---

## ⚙️ Configuration

### Backend Configuration (.env)

**Location:** `server/.env`

**Required Settings:**
```env
# AI Provider (choose one)
LLM_PROVIDER=gemini  # or 'openai'

# API Keys (add at least one)
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# Server Settings
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
FLASK_DEBUG=True  # Set to False in production
```

**Optional Settings:**
```env
# Logging
LOG_LEVEL=INFO

# File Storage
REPORTS_DIR=reports
MAX_FILE_SIZE=10

# Security
SECRET_KEY=generate_random_secret_here
CORS_ORIGINS=*  # Restrict in production
```

### Extension Configuration (VSCode)

**Access:** VSCode Settings → Search "Schneider AI"

**Available Settings:**
- `schneiderAI.serverUrl`: Backend URL (default: `http://localhost:5000`)
- `schneiderAI.autoAnalyzeOnSave`: Analyze on file save (default: `false`)
- `schneiderAI.maxFileSize`: Max lines to analyze (default: `1000`)
- `schneiderAI.showInlineErrors`: Show inline diagnostics (default: `true`)
- `schneiderAI.enableNotifications`: Show notifications (default: `true`)
- `schneiderAI.scoreThreshold`: Minimum acceptable score (default: `70`)

**Example settings.json:**
```json
{
  "schneiderAI.serverUrl": "http://localhost:5000",
  "schneiderAI.autoAnalyzeOnSave": false,
  "schneiderAI.showInlineErrors": true,
  "schneiderAI.scoreThreshold": 80
}
```

---

## ✅ Verification

### 1. Verify Backend
```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
{
  "status": "healthy",
  "version": "8.0.0",
  "llm_provider": "gemini",
  "rules_loaded": 558
}
```

**Or in browser:**
- Navigate to http://localhost:5000/health
- Should see JSON response

### 2. Verify Extension

**In Extension Development Host window:**

1. **Create test file:**
   - Create `test.py` with this code:
   ```python
   def calculateEnergy(v, c):
       p = v * c
       return p
   ```

2. **Analyze code:**
   - Press `Ctrl+Shift+S`
   - Or click "Analyze Code" in Schneider AI sidebar

3. **Expected result:**
   - Issues detected (missing docstrings, type hints, naming violations)
   - Score around 30-40/100
   - Fix suggestions shown

4. **Test Auto-Fix:**
   - Click "Auto-Fix Code" button
   - Code should transform to proper Python with docstrings, type hints
   - Re-analyze should show 90-100/100

### 3. Verify All Components

**Run this checklist:**
- [ ] Backend starts without errors
- [ ] Extension loads in VSCode
- [ ] Analyze detects issues
- [ ] Auto-fix transforms code
- [ ] PDF report generates (click "Generate Report")
- [ ] Chat assistant responds (ask a question)
- [ ] History tracks analyses

---

## 🔧 Troubleshooting

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution:**
```bash
# Ensure virtual environment is activated
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### Issue: "❌ No API key found in .env"
**Solution:**
1. Verify `.env` file exists in `server/` directory
2. Check file contains `GEMINI_API_KEY=...` or `OPENAI_API_KEY=...`
3. Ensure no spaces around `=`
4. Restart backend after editing `.env`

#### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Option 1: Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill

# Option 2: Use different port
# Edit .env:
FLASK_PORT=5001
# Update extension settings:
"schneiderAI.serverUrl": "http://localhost:5001"
```

#### Issue: "Connection refused" or "Cannot connect to backend"
**Check:**
1. Backend is running: `curl http://localhost:5000/health`
2. No firewall blocking port 5000
3. Correct URL in extension settings
4. Backend shows "Running on http://127.0.0.1:5000"

### Extension Issues

#### Issue: Extension doesn't appear in VSCode
**Solution:**
1. Ensure you pressed F5 in the `extension` directory
2. Check "Extension Development Host" window opened (not main window)
3. Look for "Schneider AI" in Activity Bar (left sidebar)
4. Try reloading: Press `Ctrl+R` in Extension Development Host

#### Issue: "Command not found" when pressing Ctrl+Shift+S
**Solution:**
1. Verify extension compiled: `npm run compile`
2. Check for TypeScript errors in output
3. Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
4. Check keyboard shortcuts: File → Preferences → Keyboard Shortcuts → Search "Schneider"

#### Issue: Analysis fails with "Network Error"
**Solution:**
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check extension setting: `schneiderAI.serverUrl`
3. Look for errors in VSCode Output panel:
   - View → Output → Select "Schneider AI" from dropdown
4. Check backend logs in terminal

### API Issues

#### Issue: "Invalid API key" or "Authentication failed"
**Solution:**
1. Verify API key is correct (copy-paste from provider)
2. Check for extra spaces in `.env` file
3. Ensure key hasn't expired
4. For OpenAI: Check billing is set up
5. For Gemini: Verify API is enabled in Google Cloud Console

#### Issue: "Rate limit exceeded"
**Solution:**
1. Wait a few minutes and retry
2. Check your API usage on provider dashboard
3. Consider upgrading API plan
4. Switch to different provider (edit `.env` → change `LLM_PROVIDER`)

---

## 🖥️ Platform-Specific Notes

### Windows

**PowerShell Execution Policy:**
If you get "cannot be loaded because running scripts is disabled":
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Path Issues:**
- Use `\` in paths, not `/`
- Or use `/` with quotes: `cd "C:/Users/..."`

**Line Endings:**
- Git may convert line endings
- Configure: `git config core.autocrlf true`

### macOS

**Xcode Command Line Tools:**
Required for some npm packages:
```bash
xcode-select --install
```

**Permission Issues:**
If npm install fails with EACCES:
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

**Python Version:**
macOS may have Python 2.7 as `python`. Use `python3` explicitly:
```bash
python3 --version
python3 -m venv venv
```

### Linux

**Python Development Headers:**
```bash
sudo apt install python3-dev python3-venv
```

**Node.js via Package Manager:**
```bash
# Ubuntu/Debian - use NodeSource for latest
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Permissions:**
Don't use `sudo` with npm or pip inside virtual environment.

---

## 📦 Alternative: Package Extension

To install extension permanently (not just development mode):

```bash
cd extension

# Install vsce (VSCode packaging tool)
npm install -g @vscode/vsce

# Package extension
npm run package

# This creates: schneider-ai-code-reviewer-8.0.0.vsix

# Install in VSCode
code --install-extension schneider-ai-code-reviewer-8.0.0.vsix
```

Then you can use the extension in any VSCode window (not just Extension Development Host).

---

## 🎓 Next Steps

After successful installation:

1. **Read Documentation:**
   - [README.md](../README.md) - Overview and features
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
   - [RULES_SUMMARY.md](RULES_SUMMARY.md) - All 558 rules explained

2. **Try Demo Files:**
   - Use test files in `tests/` directory
   - Try analyzing `test_buggy.py`, `test_buggy.c`, etc.

3. **Configure for Your Workflow:**
   - Adjust VSCode settings
   - Set up auto-analyze on save (optional)
   - Configure Git integration

4. **Explore Features:**
   - Try PDF report generation
   - Use chat assistant
   - View analysis history

---

## 🆘 Still Having Issues?

1. **Check Backend Logs:**
   - Look at terminal where `python app.py` is running
   - Look for error messages

2. **Check Extension Logs:**
   - VSCode → View → Output → Select "Schneider AI"
   - Look for network errors or API failures

3. **Verify File Structure:**
   ```bash
   # Should see these directories:
   ls -la
   # extension/
   # server/
   # tests/
   # docs/
   ```

4. **Create GitHub Issue:**
   - Go to repository Issues tab
   - Provide: OS, Node version, Python version, error messages
   - Include relevant logs

5. **Contact Support:**
   - Email: schneider-ai-support@example.com
   - Include installation.log if available

---

## ✅ Installation Complete!

Congratulations! You've successfully installed Schneider Electric AI Code Reviewer.

**Quick Test:**
1. Open a Python file with some code
2. Press `Ctrl+Shift+S`
3. See issues detected
4. Click Auto-Fix
5. Enjoy improved code quality!

**Happy Coding! 🚀**

---

*Last Updated: February 19, 2026*  
*For latest installation instructions, see: https://github.com/yourusername/Schneider-AI-Code-Reviewer*
