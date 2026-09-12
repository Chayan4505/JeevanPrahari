# ⚡ Quick Start - Start Backend Server

## The Problem (What You're Seeing)
```
[vite] http proxy error: /api/weather/districts
AggregateError [ECONNREFUSED]
```

**Translation:** Frontend wants to talk to backend, but backend isn't running.

---

## The Solution (What To Do)

### 🎯 FASTEST FIX (2 minutes)

**Open PowerShell and run this:**

```powershell
# Go to backend folder
cd c:\Users\chaya\Desktop\JeevanPrahaari\JeevanPrahari\backend

# Start backend server
mvn spring-boot:run
```

**Wait for:**
```
... Started JeevanPrahariApplication in XX seconds
```

**Then:**
- Go to browser
- Refresh page (Ctrl+R or F5)
- Errors gone! ✅

---

## What's Happening

```
Your Browser (Port 5173)
         ↓
Trying to call /api/weather/districts
         ↓
Frontend proxies to http://localhost:8080
         ↓
Backend not running ❌
         ↓
Connection Refused Error
```

**After you start backend:**

```
Your Browser (Port 5173)
         ↓
Calling /api/weather/districts
         ↓
Proxies to http://localhost:8080
         ↓
Backend running ✅
         ↓
Returns data
         ↓
Page works! 🎉
```

---

## Step-by-Step Instructions

### Step 1: Open New Terminal
```
Windows: Win+R → "powershell" → Enter
Mac: Cmd+Space → "terminal" → Enter
Linux: Ctrl+Alt+T
```

### Step 2: Navigate to Backend Folder
```powershell
cd c:\Users\chaya\Desktop\JeevanPrahaari\JeevanPrahari\backend
```

### Step 3: Start Backend
```powershell
mvn spring-boot:run
```

### Step 4: Wait for Startup Message
Watch for:
```
... Started JeevanPrahariApplication in 25.123 seconds
```

(May take 20-40 seconds)

### Step 5: Refresh Browser
- Go to browser with your website
- Press `Ctrl+R` or `F5`
- Errors should be gone!

---

## Verify It's Working

### In Browser Console (F12)
**Before:**
```
❌ Error: Failed to fetch /api/weather/districts
```

**After:**
```
✅ Data loaded successfully
```

### Check page loads:
```
✅ Map displays
✅ Alerts show
✅ Districts load
✅ Data appears
```

---

## If It Still Doesn't Work

### Check 1: Is backend running?
**In new PowerShell:**
```powershell
netstat -ano | findstr :8080
```

Should show something (if empty, backend not running)

### Check 2: Any errors in backend terminal?
Look at the terminal where you ran `mvn spring-boot:run`

Common errors:
- `Port 8080 already in use` → Kill other process
- `Connection refused` → Database not running
- `Java not found` → Install Java

### Check 3: Hard refresh browser
```
Ctrl+Shift+R  (Windows)
Cmd+Shift+R   (Mac)
```

### Check 4: Clear browser cache
1. F12 (Open DevTools)
2. Right-click refresh icon
3. Select "Clear cache and reload"

---

## Common Issues & Fixes

| Issue | Error Message | Fix |
|-------|---------------|-----|
| Backend not running | ECONNREFUSED | Run `mvn spring-boot:run` |
| Port in use | `Port 8080 already in use` | Kill process on 8080 |
| Java not installed | `mvn: command not found` | Install Java & Maven |
| Database down | `Connection refused` to DB | Start PostgreSQL |
| Wrong port | Can't connect | Check vite.config.ts |

---

## Alternative: Use Docker (If installed)

```powershell
# In project root folder
docker-compose up
```

This starts everything automatically!

---

## Once Backend is Running

✅ Keep terminal open (don't close it)
✅ Terminal will show backend logs
✅ Errors in terminal = API problems
✅ Leave running while developing

---

## Summary

```
Error: ECONNREFUSED /api/*
Reason: Backend server not running
Fix: cd backend → mvn spring-boot:run
Result: Website fully functional ✅
Time: < 2 minutes ⚡
```

---

## Next Steps

After backend is running:

1. ✅ Website loads without errors
2. ✅ All data displays correctly
3. ✅ You can test all features
4. ✅ Ready for development/changes
5. ✅ Can implement multilingual support (from previous docs)

---

**NOW GO FIX IT! 🚀**

```powershell
cd c:\Users\chaya\Desktop\JeevanPrahaari\JeevanPrahari\backend
mvn spring-boot:run
```

Then refresh your browser! 

Problem solved in < 2 minutes ✅
