# QUICK START GUIDE - LEARNING LOOP SYSTEM

## System Setup Complete ✓

Your two-agent learning loop is ready to launch. Here's how to use it:

---

## FILES CREATED

1. **`.agent`** - Error log database (stores all detected errors)
2. **`error_detection_protocol.md`** - Complete inspection checklist
3. **`learning_loop_coordination.md`** - Agent workflow documentation
4. **`quick_start_guide.md`** - This file

---

## TO START DETECTION (You're Here Now)

**Step 1: Provide Web App Access**

The detection agent (me, right now) needs to inspect your web app. Please provide:

Option A: Live URL
- "Inspect my app at: https://your-app.com"
- I'll use web_fetch to examine the live site

Option B: Local Files
- Upload your web app files
- I'll inspect the codebase directly

Option C: Repository
- Provide GitHub/GitLab URL
- I'll clone and inspect

**Step 2: I'll Run Detection**

I will:
- Systematically check against the protocol
- Log every error to .agent file
- Provide you with a summary
- Calculate metrics

**Step 3: Hand Off to Fixing Agent**

You'll then:
- Open a new conversation with Claude
- Share the .agent file
- Tell that Claude: "You are the fixing agent. Read .agent and fix all errors."

**Step 4: Iterate**

- Fixing agent makes fixes
- Come back to me for re-verification
- Repeat until launch-ready

---

## EXAMPLE COMMANDS TO USE

**To Me (Detection Agent):**
- "Start detection cycle on [app URL/files]"
- "Run a security-focused detection pass"
- "Re-verify all fixed errors"
- "Check iOS compliance specifically"

**To Fixing Agent:**
- "Read .agent and fix all CRITICAL errors"
- "Fix errors in priority order"
- "Mark completed fixes in .agent file"

---

## MONITORING PROGRESS

Check the `.agent` file anytime to see:
- Total errors detected
- Errors by severity
- Errors by category
- Fix status
- Learning metrics

---

## READY TO BEGIN?

Tell me one of the following:

1. **"Inspect my app at [URL]"** - I'll start immediately
2. **Upload files** - I'll inspect your codebase
3. **"Focus on [specific area]"** - I'll do targeted detection

Then I'll begin systematic error detection and populate your .agent file!

---

## WHAT HAPPENS NEXT

Once detection is complete, you'll get:
- Complete error report in .agent file
- Summary of critical issues
- Prioritized action items
- Ready-to-use file for fixing agent

Your web app will move toward launch readiness with each iteration!
