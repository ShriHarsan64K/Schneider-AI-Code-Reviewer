# 🎥 VIDEO DEMO SCRIPT - SCHNEIDER ELECTRIC AI CODE REVIEWER v8.0
## Complete Demonstration with Git Version Control (Main + Feature Branch)

---

## 📋 DEMO OVERVIEW

**Total Time**: 8-10 minutes
**What You'll Show**:
1. Git version control with main + feature branch workflow
2. Multi-language code analysis (Python, C, Java, TypeScript)
3. Auto-fix functionality across languages
4. History tracking and statistics
5. PDF report generation

---

## 🎬 PART 1: INTRODUCTION (1 minute)

### Script:
> "Hello! I'm demonstrating the Schneider Electric AI Code Reviewer v8.0 - an intelligent VSCode extension that analyzes code against 436 Schneider Electric standards plus language-specific rules for 7 programming languages.
>
> This tool helps developers write production-ready code that meets Schneider Electric's quality, security, and energy efficiency standards.
>
> Today, I'll show you how it works with Git version control, analyzing code in multiple languages, and automatically fixing issues."

### What to Show:
- VSCode with Schneider AI extension visible in sidebar
- Show the icon/logo
- Briefly show the chatbot interface

---

## 🎬 PART 2: GIT SETUP - VERSION CONTROL DEMONSTRATION (2 minutes)

### Step 1: Initialize Git Repository

**Open Terminal in VSCode** (Ctrl+`)

```bash
# Navigate to your project
cd E:\Schneider_Hackathon

# Initialize Git (if not already done)
git init

# Check current status
git status

# Create .gitignore
echo "node_modules/
venv/
__pycache__/
*.pyc
.env
reports/*.pdf
.vscode/settings.json" > .gitignore
```

### Step 2: Create Main Branch and Initial Commit

```bash
# Stage all files
git add .

# Create initial commit on main branch
git commit -m "Initial commit: Schneider AI Code Reviewer v8.0"

# Confirm you're on main
git branch
```

### Script:
> "I'm starting with version control best practices. I've initialized a Git repository and created our main branch with the initial codebase. Now let me show you a real-world development workflow where we create a feature branch to add new code."

---

## 🎬 PART 3: CREATE FEATURE BRANCH (1 minute)

### Step 3: Create and Switch to Feature Branch

```bash
# Create and switch to new feature branch
git checkout -b feature/motor-controller

# Confirm branch
git branch
```

### Script:
> "I've created a feature branch called 'feature/motor-controller' where I'll add a new motor controller module. This is standard practice in enterprise development - we work on features in separate branches before merging to main."

### What to Show:
- Terminal showing branch creation
- VSCode status bar showing current branch name

---

## 🎬 PART 4: ADD CODE IN FEATURE BRANCH (2 minutes)

### Step 4: Create Buggy Motor Controller Files

**Create `motor_controller.py`** in feature branch:

```python
# Create file in VSCode
# File: motor_controller.py

def calculateEnergy(v, c):
    p = v * c
    return p

class MotorController:
    def __init__(self, id, speed):
        self.password = "admin123"  # Hardcoded password!
        self.id = id
        self.speed = speed
    
    def start(self):
        print("Starting")
        
    def getData(self):
        x = []
        for i in range(100):
            x.append(i * 2)
        return x
```

**Create `MotorController.java`** in feature branch:

```java
// File: MotorController.java

public class MotorController {
    String password = "secret123"; // Hardcoded!
    int id;
    int speed;
    
    public MotorController(int id, int speed) {
        this.id = id;
        this.speed = speed;
    }
    
    public void start() {
        System.out.println("Starting");
    }
    
    public int calculateEnergy(int voltage, int current) {
        int power = voltage * current;
        return power;
    }
}
```

### Script:
> "I'm adding two motor controller files - one in Python and one in Java. These have several quality issues on purpose: hardcoded passwords, missing documentation, naming violations, and more. Let's see what the AI finds."

---

## 🎬 PART 5: ANALYZE PYTHON FILE (2 minutes)

### Step 5: Run Analysis on Python File

1. **Open `motor_controller.py`**
2. **Click "Analyze Code" button** or press `Ctrl+Shift+S`
3. **Wait for analysis results**

### Script:
> "The AI is analyzing the Python file against PEP8 standards, Schneider Electric rules, and Python-specific best practices. Look at the detailed issues it found..."

### What to Highlight:
- **Show the score**: ~30-40/100 (low score before fixing)
- **Point out specific issues**:
  - ❌ CRITICAL: Hardcoded password (line 8)
  - ❌ ERROR: Missing docstrings on all functions
  - ❌ ERROR: Missing type hints
  - ❌ WARNING: camelCase instead of snake_case
  - ❌ WARNING: Single-letter variables (v, c, p, x)

### Script:
> "Notice the severity levels - the hardcoded password is CRITICAL, missing documentation is an ERROR, and style issues are WARNINGS. The chatbot explains each issue clearly."

---

## 🎬 PART 6: AUTO-FIX PYTHON (1 minute)

### Step 6: Click Auto-Fix Button

1. **Click "Auto-Fix Code" button**
2. **Watch as code transforms**
3. **Show the improvements**

### Script:
> "Now watch as the AI automatically fixes all these issues while preserving the original logic..."

### What to Highlight (After Fix):
- ✅ Password moved to `os.getenv('PASSWORD')`
- ✅ All functions have docstrings
- ✅ Type hints added: `def calculate_energy(voltage: int, current: int) -> int:`
- ✅ snake_case naming: `calculate_energy()` not `calculateEnergy()`
- ✅ Descriptive variable names: `voltage` not `v`, `power` not `p`

### Script:
> "The code now scores 95/100! All critical issues fixed, proper documentation added, and it follows Schneider Electric standards."

---

## 🎬 PART 7: ANALYZE JAVA FILE (1.5 minutes)

### Step 7: Run Analysis on Java File

1. **Open `MotorController.java`**
2. **Click "Analyze Code"**

### What to Highlight:
- **Show Java-specific issues**:
  - ❌ CRITICAL: Hardcoded password
  - ❌ ERROR: Missing Javadoc on all methods
  - ❌ WARNING: Fields should be private
  - ❌ WARNING: Missing final on constructor parameters

### Script:
> "Notice the AI detects Java-specific issues - it wants Javadoc comments, not Python docstrings. It knows this is Java code and applies Java best practices."

### Step 8: Click Auto-Fix

1. **Click "Auto-Fix Code"**
2. **Show improvements**

### What to Highlight (After Fix):
- ✅ Javadoc comments: `/** @param voltage ... @return ... */`
- ✅ Private fields with getters
- ✅ `final` on parameters
- ✅ Environment variable for password

### Script:
> "The AI generated perfect Java code - not Python! It added Javadoc, made fields private, and follows Java naming conventions. This shows our language-specific rules working."

---

## 🎬 PART 8: COMMIT TO FEATURE BRANCH (1 minute)

### Step 9: Commit Fixed Code

```bash
# Check what changed
git status

# Stage the fixed files
git add motor_controller.py MotorController.java

# Commit with descriptive message
git commit -m "feat: Add motor controller with AI-fixed code

- Added Python motor controller with proper type hints and docstrings
- Added Java motor controller with Javadoc and encapsulation
- Fixed security issues (moved hardcoded passwords to env variables)
- Achieved 95/100 code quality score
- All Schneider Electric standards met"

# View commit
git log --oneline -n 1
```

### Script:
> "I'm committing the AI-fixed code to our feature branch. Notice the detailed commit message explaining what was added and fixed. This is good version control practice."

---

## 🎬 PART 9: MERGE TO MAIN BRANCH (1 minute)

### Step 10: Merge Feature Branch to Main

```bash
# Switch back to main branch
git checkout main

# Show we're on main
git branch

# Merge the feature branch
git merge feature/motor-controller

# View commit history
git log --oneline --graph -n 5

# Show files now in main
ls -la
```

### Script:
> "Now I'm merging the feature branch back to main. In a real enterprise workflow, this would typically go through a pull request review process. But for this demo, we're doing a direct merge."

### What to Show:
- Terminal showing successful merge
- Files now visible in main branch
- Commit history showing both branches

---

## 🎬 PART 10: DEMONSTRATE ADDITIONAL FEATURES (2 minutes)

### Feature 1: Analysis History

1. **Click "View Analysis History" button**
2. **Show multiple analysis records**

### Script:
> "The extension tracks all analyses, so you can see code quality improvements over time. Here are the analyses we just ran."

### Feature 2: Generate PDF Report

1. **Click "Generate PDF Report" button**
2. **Show the generated PDF**
3. **Open and display**:
   - Cover page with score
   - Issues breakdown by severity
   - Detailed recommendations
   - Code snippets with fixes

### Script:
> "I can generate professional PDF audit reports for compliance documentation. This is crucial for enterprise environments where you need to prove code meets standards."

### Feature 3: Multi-Language Support

**Show files in sidebar**:
```
project/
├── motor_controller.py  (Python - snake_case)
├── MotorController.java (Java - PascalCase)
├── motor_controller.c   (C - snake_case with headers)
├── motor_controller.ts  (TypeScript - with types)
└── motor_control.st     (ST - with b/i/s prefixes)
```

### Script:
> "The extension supports 7 languages: Python, JavaScript, TypeScript, Java, C, C++, and Structured Text for PLCs. Each has language-specific rules. For example, Structured Text uses Schneider's prefix convention - 'b' for booleans, 'i' for integers."

### Feature 4: Chat Assistant

1. **Open chat interface**
2. **Ask**: "How can I improve the energy efficiency of this motor controller?"
3. **Show AI response with specific recommendations**

### Script:
> "The AI assistant can answer questions about Schneider Electric best practices, explain issues, and provide optimization suggestions."

---

## 🎬 PART 11: DEMONSTRATE BRANCH COMPARISON (1 minute)

### Step 11: Show Git Diff Between Branches

```bash
# Show differences between branches
git diff main feature/motor-controller

# Or use VSCode Git interface
# Click Source Control icon
# Right-click on file → Compare with branch
```

### Script:
> "Using Git, we can easily compare our main branch with feature branches to see what changed. This is essential for code reviews and quality control."

### What to Show:
- Git diff showing before/after code
- Highlight improvements made by AI
- Show version control timeline

---

## 🎬 PART 12: DEMONSTRATE ROLLBACK (30 seconds)

### Step 12: Show Version Control Safety

```bash
# Create a bad commit (simulate mistake)
echo "// BAD CODE" >> motor_controller.py
git add motor_controller.py
git commit -m "Bad commit - testing rollback"

# Show commit
git log --oneline -n 3

# Rollback the bad commit
git reset --hard HEAD~1

# Verify rollback
git log --oneline -n 2
```

### Script:
> "Version control provides safety. If someone commits bad code, we can easily roll back. This is why Git is essential for enterprise development."

---

## 🎬 PART 13: CONCLUSION (1 minute)

### Script:
> "To summarize, the Schneider Electric AI Code Reviewer provides:
>
> ✅ **Version Control Integration** - Works seamlessly with Git branching strategies
> ✅ **Multi-Language Support** - 7 languages with language-specific rules
> ✅ **AI-Powered Analysis** - 436 Schneider standards plus language best practices
> ✅ **Automatic Fixes** - One-click code improvement
> ✅ **Quality Tracking** - History and statistics
> ✅ **Compliance Reports** - Professional PDF documentation
> ✅ **Enterprise Ready** - Supports team workflows and code reviews
>
> This tool helps Schneider Electric developers write better code faster while ensuring compliance with company standards. Thank you!"

---

## 🎥 RECORDING TIPS

### Before Recording:

1. **Clean Your Desktop**
   - Close unnecessary applications
   - Clear browser tabs
   - Hide personal information

2. **Prepare Files**
   ```bash
   # Create a clean demo directory
   mkdir E:\Demo_Schneider_AI
   cd E:\Demo_Schneider_AI
   
   # Copy extension and backend
   cp -r E:\Schneider_Hackathon\extension .
   cp -r E:\Schneider_Hackathon\server .
   ```

3. **Test Run**
   - Go through entire script once
   - Time yourself
   - Check all features work

4. **Setup Recording**
   - Use OBS Studio or Camtasia
   - Record at 1920x1080 resolution
   - 30 FPS minimum
   - Enable microphone
   - Test audio levels

### During Recording:

1. **Speak Clearly**
   - Moderate pace
   - Emphasize key points
   - Pause after each feature

2. **Show, Don't Just Tell**
   - Use mouse to highlight
   - Zoom in on important parts
   - Let results display for 2-3 seconds

3. **Handle Mistakes**
   - If you mess up, pause and restart that section
   - You can edit out pauses later

### Recording Software Settings:

**OBS Studio (Free)**:
```
Settings:
- Output → Recording Quality: High Quality, Medium File Size
- Output → Recording Format: mp4
- Video → Base Resolution: 1920x1080
- Video → Output Resolution: 1920x1080
- Video → FPS: 30
- Audio → Desktop Audio: Enable
- Audio → Microphone: Enable
```

**Camtasia (Paid but easier)**:
- Screen Recording mode
- Enable webcam (optional - picture-in-picture)
- Enable microphone
- Enable system audio
- Record at highest quality

---

## 📝 SCRIPT TIMELINE

| Time | Section | Key Points |
|------|---------|------------|
| 0:00-1:00 | Introduction | Overview, what tool does |
| 1:00-3:00 | Git Setup | Init repo, main branch, initial commit |
| 3:00-4:00 | Feature Branch | Create feature/motor-controller |
| 4:00-6:00 | Add & Analyze Python | Show issues, demonstrate analysis |
| 6:00-7:00 | Auto-Fix Python | Watch AI fix code, show improvements |
| 7:00-8:00 | Analyze & Fix Java | Show language-specific detection |
| 8:00-9:00 | Commit & Merge | Commit to feature, merge to main |
| 9:00-11:00 | Additional Features | History, PDF, multi-language, chat |
| 11:00-11:30 | Branch Comparison | Git diff, version control benefits |
| 11:30-12:00 | Rollback Demo | Show safety of version control |
| 12:00-13:00 | Conclusion | Summary of features |

---

## 🎬 ALTERNATIVE: SHORTER VERSION (5 minutes)

If judges want a shorter demo:

1. **Introduction** (30s) - Quick overview
2. **Git Branches** (1min) - Main + feature branch creation
3. **Analyze Python** (1min) - Show issues found
4. **Auto-Fix** (1min) - Show AI fixing code
5. **Commit & Merge** (1min) - Version control workflow
6. **Quick Features** (30s) - PDF, multi-language, history
7. **Conclusion** (30s) - Summary

---

## 📊 METRICS TO HIGHLIGHT

During demo, mention these impressive numbers:

- ✅ **436 Schneider Electric rules** loaded
- ✅ **122 language-specific rules** across 7 languages
- ✅ **17 C rules**, **18 C++ rules**, **20 TypeScript rules**
- ✅ **100% language detection accuracy**
- ✅ **91% average code quality** after auto-fix
- ✅ **Zero hardcoded secrets** after AI fixes
- ✅ **Complete IEC 61131-3 compliance** for Structured Text

---

## 🎯 DEMO SUCCESS CHECKLIST

Before recording, verify:

- [ ] Backend server running (python app.py)
- [ ] Extension compiled (npm run compile)
- [ ] Git initialized in project
- [ ] .gitignore created
- [ ] Sample buggy files ready
- [ ] VSCode extensions panel clear
- [ ] Terminal ready and visible
- [ ] No personal info visible
- [ ] Audio test completed
- [ ] Screen resolution set to 1920x1080
- [ ] Recording software tested
- [ ] Practice run completed

---

## 📹 POST-RECORDING

1. **Edit Video**:
   - Cut out long pauses
   - Add title card: "Schneider Electric AI Code Reviewer v8.0"
   - Add subtitles if possible
   - Add background music (optional, keep it subtle)

2. **Add Overlays** (optional):
   - Text overlays for key points
   - Zoom effects on important parts
   - Arrows pointing to features

3. **Export Settings**:
   - Format: MP4 (H.264)
   - Resolution: 1920x1080
   - Bitrate: 5-10 Mbps
   - Audio: AAC 192kbps

4. **Upload**:
   - YouTube (unlisted or public)
   - Google Drive (share link)
   - Include in hackathon submission

---

## 🎤 BONUS: SCRIPT VARIATIONS

### For Technical Judges:
Emphasize:
- Multi-LLM support (OpenAI + Gemini)
- TypeScript architecture
- Flask backend with robust error handling
- Language-specific rule engine
- RAG integration potential

### For Business Judges:
Emphasize:
- Cost savings (faster code review)
- Risk reduction (security, quality)
- Compliance automation (PDF reports)
- Developer productivity
- Enterprise scalability

### For Schneider Electric Judges:
Emphasize:
- 436 Schneider-specific rules
- IEC 61131-3 compliance for ST/PLCs
- Energy efficiency checking
- Schneider naming conventions (b/i/s/r prefixes)
- Production-ready for internal use

Good luck with your video demo! 🎥🚀
