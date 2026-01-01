# LEARNING LOOP COORDINATION SYSTEM
# Two-Agent Architecture: Detector → Fixer

## SYSTEM OVERVIEW

This learning loop uses a separation of concerns:
- **Detection Agent (Claude 1)**: Finds and documents errors
- **Fixing Agent (Claude 2)**: Reads errors and implements fixes

## WORKFLOW

```
┌─────────────────────────────────────────────────────────┐
│                    LEARNING LOOP CYCLE                  │
└─────────────────────────────────────────────────────────┘

1. DETECTION PHASE (Agent 1)
   ├── Inspect web app using protocol
   ├── Identify errors/issues
   ├── Log to .agent file with details
   ├── Categorize and prioritize
   └── Signal completion

2. FIXING PHASE (Agent 2)
   ├── Read .agent file
   ├── Process errors by priority
   ├── Implement fixes
   ├── Mark errors as fixed in .agent
   └── Signal completion

3. VERIFICATION PHASE (Agent 1)
   ├── Re-run detection on fixed areas
   ├── Verify fixes resolved issues
   ├── Document any new issues
   └── Update learning metrics

4. ITERATION
   └── Repeat until zero critical/high errors
```

## DETECTION AGENT RESPONSIBILITIES

**DO:**
- Systematically inspect all aspects of the web app
- Document every error with complete technical details
- Assign accurate severity levels
- Provide context for each issue
- Update metrics after each cycle
- Focus on finding issues, not solving them
- Be thorough and methodical

**DON'T:**
- Fix any errors (that's the fixing agent's job)
- Skip documentation because something seems minor
- Make assumptions about what the fixing agent knows
- Provide vague error descriptions

## FIXING AGENT RESPONSIBILITIES

**DO:**
- Read the .agent file completely
- Process errors in order: CRITICAL → HIGH → MEDIUM → LOW
- Mark errors as fixed in the .agent file
- Test fixes before marking complete
- Document what was changed
- Signal when ready for re-verification

**DON'T:**
- Start fixing before reading all errors
- Skip updating the .agent file
- Fix things that weren't logged
- Assume detection agent will notice fixes without re-verification

## .AGENT FILE INTERACTION

### Detection Agent Updates:
```
[TIMESTAMP] | [CATEGORY] | [SEVERITY] | [LOCATION] | [DESCRIPTION]
Status: DETECTED
Details: [Technical details]
Impact: [User/submission impact]
Testing Context: [Environment]
```

### Fixing Agent Updates (same error):
```
[TIMESTAMP] | [CATEGORY] | [SEVERITY] | [LOCATION] | [DESCRIPTION]
Status: FIXED
Fix Implemented: [What was changed]
Fix Timestamp: [When fixed]
Ready for Re-verification: YES
```

### Re-Verification by Detection Agent:
```
[TIMESTAMP] | [CATEGORY] | [SEVERITY] | [LOCATION] | [DESCRIPTION]
Status: VERIFIED_FIXED / STILL_PRESENT / NEW_ISSUE_FOUND
Re-verification Notes: [Outcome details]
```

## LEARNING METRICS

Track improvement over iterations:
- **Cycle 1**: X errors found → Y fixed → Z verified
- **Cycle 2**: Fewer new errors = learning working
- **Target**: Zero CRITICAL/HIGH errors

## COMMUNICATION PROTOCOL

**Detection Agent signals:**
- "Detection cycle complete. [X] errors logged to .agent file."
- "Prioritize: [N] CRITICAL, [N] HIGH issues"
- "Ready for fixing agent."

**Fixing Agent signals:**
- "Processing [X] errors from .agent file"
- "Fixed [N] errors. Updated .agent file."
- "Ready for re-verification."

## EXAMPLE ITERATION

### Cycle 1: Initial Detection
- Detection Agent finds 23 errors
- 3 CRITICAL, 8 HIGH, 12 MEDIUM
- All logged to .agent

### Cycle 1: Fixing
- Fixing Agent addresses all CRITICAL errors
- Addresses HIGH errors
- Marks progress in .agent

### Cycle 1: Re-verification
- Detection Agent verifies fixes
- 2 CRITICAL still present (different approach needed)
- 7 HIGH verified fixed
- 4 new MEDIUM errors found

### Cycle 2: Iteration
- Fixing Agent tries new approach for remaining CRITICAL
- Process continues...

### Goal State
- 0 CRITICAL errors
- 0 HIGH errors
- MEDIUM/LOW addressed or documented as acceptable
- App ready for store submission

## STARTING THE LOOP

**To Begin:**
1. Detection Agent: "Starting detection cycle for [web app name]"
2. Detection Agent: Reviews app against protocol
3. Detection Agent: Logs all findings to .agent
4. Detection Agent: "Detection complete. [Summary]"
5. User: Hands off to Fixing Agent
6. Repeat until launch-ready

## SUCCESS CRITERIA

**App is launch-ready when:**
- Zero CRITICAL errors remain
- Zero HIGH errors remain
- MEDIUM errors evaluated and either fixed or accepted
- Both iOS and Android compliance verified
- Performance meets requirements
- Security audit passed
- Accessibility compliance verified
- All functionality tested and working

---

## CURRENT SESSION ROLE

**Role:** Implementation Agent (acting as Fixing Agent)
**Objective:** Implement features listed in `PRD.md` and resolve any logged errors.
**Active Tasks:**
1. Implement pending PRD features.
2. Address errors in `.agent` file (if any).
3. Ensure strict adherence to PRD specifications.
**Status:** All PRD items marked COMPLETE. Ready for full System Detection.