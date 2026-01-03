# Hotfix: Initialization Order Error

**Date:** 2026-01-02
**Issue:** `ReferenceError: Cannot access 'Ui' before initialization` (Runtime Error)
**Status:** ✅ RESOLVED

---

## Problem

After the previous circular dependency fix, the app still crashed on Netlify with:
```
ReferenceError: Cannot access 'Ui' before initialization
```
The error trace pointed to `index-*.js`, indicating an issue within the main application bundle.

---

## Root Cause

**Temporal Dead Zone (TDZ) violation in `src/App.jsx`.**

The variable `visibleItemsForScanning` (minified as `Ui` in the production build) was being accessed in the dependency array of a `useEffect` hook **before** it was initialized.

1. **Usage (Line ~370):**
   ```javascript
   useEffect(() => { ... }, [..., visibleItemsForScanning.length]);
   ```
   The dependency array is evaluated during the render phase.

2. **Definition (Line ~950):**
   ```javascript
   const visibleItemsForScanning = itemsToShow.filter(...);
   ```
   The variable was defined at the bottom of the component.

In JavaScript, accessing a `const` or `let` variable before its declaration line throws a `ReferenceError`.

---

## Solution

Moved the calculation logic for `itemsToShow` and `visibleItemsForScanning` to the **top of the component**, immediately after state declarations and hooks, but **before** any `useEffect` that references them.

### Code Change in `src/App.jsx`:

**Moved Block:**
- `currentPageItems` calculation
- `itemsToShow` calculation (filtering, sorting, core overlay)
- `visibleItemsForScanning` calculation

**New Location:**
- After `const sensors = ...` (Line ~342)
- Before `useEffect` hooks.

---

## Verification

1. **Build:** `npm run build` passed successfully.
2. **Logic:** `itemsToShow` is now initialized before any hook or function (like `handleDragEnd` or `useEffect`) tries to access it.
3. **Safety:** Dependencies for the moved block (`rootItems`, `currentPhase`, etc.) are all available at the top of the component.

---

## Prevention

Ensure that variables used in `useEffect` dependency arrays are defined **before** the `useEffect` hook in the component body.
