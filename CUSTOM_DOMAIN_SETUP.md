# Custom Domain Setup Guide - harvestá.com on Render

## Current Status

- **Current Render URL:** `https://harvesta-f1iq.onrender.com`
- **Target Domain:** `https://harvestá.com`
- **Status:** Ready to configure after deployment verification

---

## Prerequisites

Before proceeding, ensure:

- ✅ Render deployment is successful at `https://harvesta-f1iq.onrender.com`
- ✅ App loads correctly
- ✅ Health check works: `/api/health`
- ✅ Domain `harvestá.com` is registered and accessible

---

## Step-by-Step: Connect harvestá.com to Render

### Step 1: Verify Render Service is Live (Do This First!)

Before connecting a domain, make sure your service works:

```bash
# Test the current Render URL
curl https://harvesta-f1iq.onrender.com/
# Should return HTML

curl https://harvesta-f1iq.onrender.com/api/health
# Should return: {"status":"ok",...}
```

✅ **Only proceed to Step 2 if above tests pass!**

---

### Step 2: Add Custom Domain in Render Dashboard

1. Go to https://dashboard.render.com
2. Select your **harvesta** service
3. Go to **Settings** tab (top right)
4. Scroll to **Custom Domain** section
5. Click **Add Custom Domain**
6. Enter: `harvestá.com` (or `www.harvestá.com`)
7. Click **Add**

You'll see a message:

```
Custom domain added!
Pending verification. Update your DNS records.
```

---

### Step 3: Update DNS Records

Render will provide DNS instructions. You have two options:

#### Option A: CNAME Record (Easier, Recommended)

```
Type: CNAME
Name: harvestá.com (or leave blank for @)
Value: harvesta-f1iq.onrender.com
TTL: 3600 (or default)
```

#### Option B: A Record (If CNAME not allowed)

```
Type: A
Name: @ (or harvestá.com)
Value: 34.111.29.243 (Render IP - check dashboard for exact value)
TTL: 3600
```

**Where to update DNS:**

- Go to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
- Find DNS settings
- Add the appropriate record (CNAME or A)
- Save changes

---

### Step 4: Wait for DNS Propagation

DNS changes can take:

- **Fast:** 5-15 minutes (lucky!)
- **Normal:** 30 minutes to 2 hours
- **Slow:** Up to 24 hours (rare)

**Check propagation status:**

```bash
# In PowerShell
nslookup harvestá.com
# Should resolve to Render IP

# Or use online tool
# https://dnschecker.org/
```

---

### Step 5: Verify Custom Domain Works

Once DNS propagates, test:

```bash
# Should now work
curl https://harvestá.com/
curl https://harvestá.com/api/health
curl https://www.harvestá.com/  (if you added www subdomain)
```

---

## SSL/TLS Certificate

Render **automatically provides SSL** via Let's Encrypt:

- ✅ HTTPS enabled automatically
- ✅ Certificate auto-renewed
- ✅ No additional setup needed

You'll have:

- `https://harvestá.com` ✅
- `https://www.harvestá.com` ✅ (if configured)

---

## Subdomain Setup (Optional)

If you want subdomains like `api.harvestá.com`:

1. In Render dashboard, add another custom domain: `api.harvestá.com`
2. In DNS, add:
   ```
   Type: CNAME
   Name: api
   Value: harvesta-f1iq.onrender.com
   ```

---

## Rollback Plan (If Something Goes Wrong)

If custom domain doesn't work:

1. Your app still works at: `https://harvesta-f1iq.onrender.com`
2. Remove custom domain from Render dashboard
3. Fix DNS issue
4. Try again

**Users won't be affected** - they can still use the Render URL.

---

## Redirect Old URL to New Domain (Recommended)

After `harvestá.com` is working, optionally redirect the old URL:

In `server.js`, add before other routes:

```javascript
// Redirect from Render URL to custom domain (optional)
app.get("*", (req, res, next) => {
  if (req.hostname === "harvesta-f1iq.onrender.com") {
    return res.redirect(301, `https://harvestá.com${req.originalUrl}`);
  }
  next();
});
```

This ensures everyone goes to your custom domain.

---

## Checklist: Before Going Live with harvestá.com

### Pre-DNS Changes

- [ ] Render service shows "Live" at `harvesta-f1iq.onrender.com`
- [ ] App loads: `https://harvesta-f1iq.onrender.com/`
- [ ] Health check works: `https://harvesta-f1iq.onrender.com/api/health`
- [ ] Domain `harvestá.com` is registered
- [ ] Have access to domain registrar DNS settings

### DNS Configuration

- [ ] Added custom domain in Render dashboard
- [ ] Updated DNS records (CNAME or A record)
- [ ] Waited 15+ minutes for propagation
- [ ] Verified DNS with `nslookup` or online tool

### Post-DNS Verification

- [ ] `https://harvestá.com/` loads ✅
- [ ] `https://harvestá.com/api/health` returns JSON ✅
- [ ] HTTPS certificate valid (no browser warnings) ✅
- [ ] SPA routing works: `https://harvestá.com/products` loads app ✅

---

## Troubleshooting

### Custom Domain Stuck on "Pending Verification"

**Solution:**

1. Verify DNS records are correct: `nslookup harvestá.com`
2. Wait 30+ minutes
3. In Render, click "Retry" or remove and re-add domain

### Getting 404 or "Service Unavailable"

**Possible causes:**

1. DNS still propagating (wait 30+ min)
2. Wrong DNS records
3. Render service not running (restart from dashboard)

**Fix:**

```bash
# Check if DNS resolved
nslookup harvestá.com

# If DNS OK, try clearing browser cache
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

# Check Render service is running
# Go to dashboard and verify status
```

### SSL Certificate Issues

**Symptoms:** Browser warning about certificate
**Solution:**

1. Render auto-generates certificate (takes ~5 min)
2. Wait 5-10 minutes
3. Clear browser cache
4. Try https://harvestá.com again

---

## Final Configuration

Once `harvestá.com` is live, update these references:

### Documentation Updates

Update all guides to use: `https://harvestá.com` instead of `https://harvesta-f1iq.onrender.com`

### Environment Variables (If Needed)

```
VITE_API_URL=https://harvestá.com  (if you have API calls)
```

### Social Media & Marketing

Update links on social profiles to point to `https://harvestá.com`

---

## Monitoring After DNS Change

### 1. Check SSL Certificate (Should be valid)

```bash
# In PowerShell
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null
$web = New-Object System.Net.WebClient
$web.DownloadString("https://harvestá.com/")
```

### 2. Monitor Render Logs

- Go to Render dashboard
- Select your service
- Watch logs for any errors when accessing via custom domain

### 3. Check Response Time

Should be <200ms typically

---

## Timeline Summary

| Action                      | Time          |
| --------------------------- | ------------- |
| Verify Render deployment    | Now           |
| Add custom domain in Render | 1 min         |
| Update DNS records          | 1 min         |
| Wait for DNS propagation    | 5-30 min      |
| Verify custom domain works  | 1 min         |
| **Total**                   | **10-35 min** |

---

## Important Notes

⚠️ **Don't:**

- Remove the Render service until DNS is fully working
- Update DNS before verifying Render service is live
- Use redirects without testing first

✅ **Do:**

- Test at each step
- Keep old Render URL as backup
- Monitor after DNS changes
- Clear browser cache if having issues

---

## Support Resources

- **Render Custom Domain Docs:** https://render.com/docs/custom-domains
- **DNS Propagation Checker:** https://dnschecker.org/
- **SSL Certificate Test:** https://www.sslshopper.com/ssl-checker.html

---

## Quick Command Reference

```bash
# PowerShell Commands

# Check DNS resolution
nslookup harvestá.com

# Flush DNS cache
ipconfig /flushdns

# Test HTTPS connection
(Invoke-WebRequest -Uri "https://harvestá.com/" -UseBasicParsing).StatusCode

# Check SSL certificate
$req = [System.Net.HttpWebRequest]::Create("https://harvestá.com/")
$cert = $req.ServicePoint.Certificate
$cert.Subject
```

---

## After Everything Works

Once `harvestá.com` is confirmed working:

1. ✅ Update bookmarks and documentation
2. ✅ Announce new URL to users
3. ✅ Monitor for 24-48 hours for any issues
4. ✅ Keep Render dashboard bookmarked for monitoring

Your Harvestá platform is now on a professional custom domain! 🎉

---

## Need Help?

If you get stuck at any step, check:

1. **Render service status:** Dashboard shows "Live"
2. **DNS resolution:** `nslookup harvestá.com` returns Render IP
3. **Browser cache:** Clear and try again
4. **Wait time:** DNS can take up to 24 hours (usually 15-30 min)

Good luck! 🚀
