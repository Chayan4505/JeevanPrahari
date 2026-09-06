# 🤖 AI-Generated Images Setup Guide

## Overview
This guide explains how to use Stable Diffusion API to generate realistic disaster/landslide photos for each report in JeevanPrahari.

---

## Step 1: Get Stable Diffusion API Key (FREE)

### Option A: Stability.ai (Recommended)
1. Visit: https://platform.stability.ai
2. Click "Sign Up" (free account)
3. Verify email
4. Go to API Keys section
5. Copy your API key
6. Free tier: **25 images/month**
7. Paid plans: $10/month for 100 images

### Option B: Replicate.com (Alternative)
1. Visit: https://replicate.com
2. Sign up with GitHub
3. Get API token
4. Similar pricing model

---

## Step 2: Update Environment Variables

### Edit `.env` file:
```bash
# Add this section
STABILITY_API_KEY=sk_your_api_key_here
STABILITY_API_URL=https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image
```

**Location:** `c:\Users\chaya\Desktop\sih2026\.env`

Replace `sk_your_api_key_here` with your actual API key from Step 1.

---

## Step 3: How It Works

### Image Generation Flow:
```
Report Description
        ↓
Build Detailed Prompt
        ↓
Call Stable Diffusion API
        ↓
Generate Realistic Image
        ↓
Store as Base64 or URL
        ↓
Display in Frontend
```

### Example:
**Report Description:**
```
"Significant soil movement observed on steep slope, trees tilted"
```

**Generated AI Prompt:**
```
"Realistic documentary photograph of a soil slide and slope failure 
in NH-6 near Cherrapunji. Significant soil movement observed on steep 
slope, trees tilted. The image shows the actual incident location with 
visible damage, debris, and geological impact. Professional disaster 
documentation photo, daylight, 4K quality, photorealistic, news-worthy image."
```

**Result:** Beautiful realistic landslide photo ✨

---

## Step 4: Rebuild Backend

```bash
cd c:\Users\chaya\Desktop\sih2026\backend

# Clean and rebuild
mvn clean install -DskipTests

# This will compile the new AiImageService class
```

---

## Step 5: Restart Backend

**Stop current backend:**
- Close terminal or Ctrl+C

**Restart:**
```bash
cd c:\Users\chaya\Desktop\sih2026
powershell -ExecutionPolicy Bypass -File run-backend.ps1
```

---

## Step 6: Reseed Reports with AI Images

Once backend is running:

```bash
# Call the seed endpoint to generate new reports with AI images
curl -X POST http://localhost:8080/api/admin/seed-reports
```

Or use PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/admin/seed-reports" -Method POST
```

---

## Step 7: View Generated Images

1. Open: http://localhost:5174/alerts
2. Scroll to "Crowd-Sourced Field Reports"
3. Each report now has a unique AI-generated image 🎉

---

## How Images Are Generated

### AI Prompt Components:
```java
// Landslide Type
"soil slide and slope failure"
"rockfall and boulder impact"
"debris flow and mudslide"

// Location Context
"in NH-6 near Cherrapunji"
"in Meghalaya mountain region"

// Description
+ User's incident description

// Quality Modifiers
+ "Professional disaster documentation photo"
+ "daylight, 4K quality, photorealistic"
+ "news-worthy image"
```

---

## Fallback System

If AI image generation fails:
- Automatically falls back to Unsplash images
- No errors or broken images
- User experience not affected

```
Attempt AI Generation
    ↓
If Success → Use AI Image
    ↓
If Failure → Use Unsplash Fallback
    ↓
Display in Frontend
```

---

## Image Quality Settings

Currently configured:
- **Resolution:** 512x512 pixels
- **Quality Steps:** 30 (higher = better quality, slower)
- **CFG Scale:** 7 (how closely to follow prompt)
- **Format:** PNG (base64 encoded)

To adjust, edit `AiImageService.java`:
```java
requestBody.put("height", 512);  // Change to 768 for higher quality
requestBody.put("width", 512);
requestBody.put("steps", 30);    // Change to 50 for better quality (slower)
```

---

## Pricing Breakdown

### Stability.ai:
- **Free Tier:** 25 images/month (perfect for demo)
- **Pro:** $10/month = 100 images
- **Pay-as-you-go:** $0.02-0.04 per image

### Cost for your app:
- 15 reports/seeding = ~$0.30-0.60 per full seed
- If seeded monthly = ~$4-7/month

---

## Troubleshooting

### "STABILITY_API_KEY is empty"
- Make sure you added the key to `.env`
- Backend didn't reload the env file
- **Solution:** Restart backend

### "Generated images look weird"
- The AI model might misinterpret the prompt
- Try different descriptions
- Increase CFG scale to 8-9 for better adherence

### "API rate limit exceeded"
- You've used your monthly limit
- Upgrade to paid plan
- Or wait until next month
- Or use Unsplash fallback images

### "Images show as data:image/png;base64,..."
- The image encoding is working
- Frontend should display them correctly
- Check browser console for errors

---

## Future Enhancements

### 1. Batch Generation
```java
// Generate multiple images per report
// Better variation in results
```

### 2. Image Caching
```java
// Cache generated images
// Reduce API calls
// Faster response times
```

### 3. User Uploads
```java
// Allow users to upload real photos
// Override AI-generated images
// Better authenticity
```

### 4. Advanced Prompting
```java
// Include GPS coordinates in prompt
// Add time of day to prompt
// Include weather conditions
```

---

## API Response Example

```json
{
  "status": "SUCCESS",
  "message": "Generated 15 sample landslide reports with AI images",
  "count": 15,
  "reports": [
    {
      "id": 1,
      "locationDescription": "NH-6 Km 45 near Cherrapunji",
      "mediaUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "severity": "CATASTROPHIC",
      "status": "VERIFIED"
    }
  ]
}
```

---

## Testing Without API Key

### If you don't have Stability.ai key yet:
1. Leave `STABILITY_API_KEY` empty in `.env`
2. Backend automatically uses Unsplash fallback images
3. Reports still display perfectly
4. Add API key later when ready

---

## Legal & Attribution

- **Stable Diffusion:** Open-source model
- **Generated Images:** You own them (can use commercially)
- **No copyright issues:** Images generated by your API key usage
- **Perfect for:** Demonstration, testing, educational purposes

---

## Questions?

- Stability.ai Documentation: https://platform.stability.ai/docs
- API Status: https://platform.stability.ai/status
- Community: https://discord.gg/stablediffusion

---

**Status:** ✅ Ready to use
**Cost:** Free tier available
**Setup Time:** 5 minutes
**Quality:** Professional, photorealistic
