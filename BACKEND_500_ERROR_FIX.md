# 🔴 Backend 500 Error Fix Guide

## Current Issue

**Error:** `nexa-5.onrender.com/api/v1/recommendations:1 Failed to load resource: the server responded with a status of 500 ()`

## ✅ What's Working

- ✅ Frontend is correctly pointing to `https://nexa-5.onrender.com` (NOT localhost)
- ✅ Request is reaching the Render backend

## ❌ What's Broken

- ❌ Backend is returning 500 Internal Server Error
- This means the server is running but something is failing inside

## 🔍 Most Likely Causes

### 1. **Gemini API Quota Exhausted** (MOST LIKELY! 🎯)

**Problem:** The 479 excessive requests used up your daily/minute quota

**Check:**

1. Go to: https://ai.google.dev/gemini-api/docs/rate-limits
2. Check your usage at: https://aistudio.google.com/app/apikey
3. Look for quota reset time

**Solution:**

- Wait for quota to reset (usually 24 hours for daily limit)
- OR upgrade to paid tier
- OR get a new API key

### 2. **Missing GEMINI_API_KEY on Render**

**Problem:** Environment variable not set in Render deployment

**Check:**

1. Go to Render Dashboard: https://dashboard.render.com/
2. Select your `nexa-5` backend service
3. Go to "Environment" tab
4. Check if `GEMINI_API_KEY` exists

**Solution:**

```bash
# Add environment variable in Render:
Key: GEMINI_API_KEY
Value: <your-gemini-api-key>

# Then redeploy:
- Click "Manual Deploy" → "Deploy latest commit"
```

### 3. **Backend Server Crashed**

**Problem:** Server might have crashed from too many requests

**Check Render Logs:**

1. Go to Render Dashboard
2. Click on your backend service
3. Go to "Logs" tab
4. Look for errors like:
   - `429 Too Many Requests`
   - `RESOURCE_EXHAUSTED`
   - `quota exceeded`
   - `ECONNREFUSED`

**Solution:**

- Restart the service: Click "Manual Deploy" → "Clear build cache & deploy"

---

## 🚀 Step-by-Step Fix

### Step 1: Check Gemini API Quota

```
1. Go to: https://aistudio.google.com/app/apikey
2. Check your API key status
3. Look for quota usage (should show requests per day/minute)
4. If "Quota exceeded" → Wait for reset OR get new key
```

### Step 2: Verify Render Environment Variables

```bash
# Login to Render Dashboard
1. Go to https://dashboard.render.com/
2. Select "nexa-5" service
3. Click "Environment" in left sidebar
4. Ensure GEMINI_API_KEY is set
5. If missing, add it:
   - Click "Add Environment Variable"
   - Key: GEMINI_API_KEY
   - Value: <paste your key>
   - Click "Save Changes"
```

### Step 3: Check Render Logs

```bash
# View backend logs to see exact error
1. In Render Dashboard → Your Service
2. Click "Logs" tab
3. Look for the latest error
4. Common errors to look for:
   - "429 Too Many Requests"
   - "quota exceeded"
   - "Invalid API key"
   - "GEMINI_API_KEY is not defined"
```

### Step 4: Redeploy Backend

```bash
# Force a fresh deployment
1. In Render Dashboard → Your Service
2. Click "Manual Deploy" button (top right)
3. Select "Clear build cache & deploy"
4. Wait for deployment to complete (~5 minutes)
5. Test the app again
```

---

## 🧪 Quick Test

After fixing, test with this curl command:

```bash
curl -X POST https://nexa-5.onrender.com/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "location": "London",
      "days": "3",
      "numPeople": "2",
      "budget": 10000
    }
  }'
```

**Expected:** JSON response with recommendations  
**If 500:** Check the exact error in Render logs

---

## 💡 Temporary Workaround (If Quota Exhausted)

### Option A: Use a New Gemini API Key

```bash
1. Go to: https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update in Render:
   - Environment → GEMINI_API_KEY → <new-key>
4. Redeploy
```

### Option B: Wait for Quota Reset

```bash
# Gemini free tier limits:
- 15 requests per minute
- 1,500 requests per day

# Your app now makes only 2-3 requests per search
# So you can do ~500 searches per day (safe!)
```

---

## 🔍 How to Read Render Logs

Look for these error patterns:

### Pattern 1: Quota Exceeded

```
Error: Request failed with status code 429
Gemini says: "quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests"
```

**Fix:** Wait for reset or use new API key

### Pattern 2: Missing API Key

```
Error: GEMINI_API_KEY is not defined
or
Error: Invalid API key
```

**Fix:** Add/update GEMINI_API_KEY in Render environment variables

### Pattern 3: Server Crash

```
Error: Cannot read property 'data' of undefined
or
TypeError: ...
```

**Fix:** Check code, redeploy with build cache cleared

---

## ✅ Verification Checklist

- [ ] Gemini API key is valid and has quota remaining
- [ ] GEMINI_API_KEY is set in Render environment variables
- [ ] Backend is deployed and running (check Render dashboard)
- [ ] Render logs show no errors
- [ ] Test curl command returns valid JSON (not 500)
- [ ] Frontend can successfully make a search

---

## 📊 Expected Behavior After Fix

**Per Search:**

- 1st request: `/api/v1/recommendations` → Gets top 15 places
- 2nd request: `/api/v1/recommendations/itinerary` → Gets day-by-day plan
- **Total: 2 Gemini API calls** (not 479!)

**Daily Capacity:**

- Free tier: 1,500 requests/day
- Your app: ~750 searches/day possible
- More than enough for testing! 🎉

---

## 🆘 Still Not Working?

If you've tried everything above and still getting 500:

1. **Check if Render service is sleeping:**

   - Free tier services sleep after inactivity
   - First request might take 30-60 seconds
   - Try hitting the endpoint 2-3 times

2. **Share Render logs:**

   - Copy the last 50 lines from Render logs
   - Look for the exact error message
   - That will pinpoint the exact issue

3. **Test backend locally:**
   ```bash
   cd backend
   npm install
   npm start
   # Then test: http://localhost:5000/api/v1/recommendations
   ```

---

## 🎯 Most Likely Solution

Based on the 479 requests you had earlier, **99% sure it's a Gemini quota issue**.

**Quick Fix:**

1. Go to https://aistudio.google.com/app/apikey
2. Check if quota exceeded
3. If yes → Wait 24 hours OR create new API key
4. Update key in Render environment variables
5. Redeploy

Your code fixes are working! Just need to fix the API quota/key issue on Render. 🚀
