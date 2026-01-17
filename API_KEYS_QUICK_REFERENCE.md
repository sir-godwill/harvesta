# API Keys Quick Reference for Hostinger

## 🔴 REQUIRED (Must have to deploy)

| API Key | Service | Where to Get | Free Tier |
|---------|---------|-------------|-----------|
| `VITE_SUPABASE_URL` | Database | [supabase.com](https://app.supabase.com) | ✅ Yes ($5/mo plan) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Auth | [supabase.com](https://app.supabase.com) | ✅ Yes |

## 🟠 HIGHLY RECOMMENDED (Need at least 1)

### Payment Processing
| API Key | Service | Where to Get | Fee | Free Trial |
|---------|---------|-------------|-----|-----------|
| `STRIPE_PUBLIC_KEY` | Credit Cards | [stripe.com](https://dashboard.stripe.com) | 2.9% + $0.30 | ✅ Free account |
| `STRIPE_SECRET_KEY` | Credit Cards | [stripe.com](https://dashboard.stripe.com) | 2.9% + $0.30 | ✅ Free account |
| `MTN_MOMO_API_KEY` | Mobile Money (Africa) | [momodeveloperapi.mtn.com](https://momodeveloperapi.mtn.com) | 1-2% | ✅ Sandbox available |
| `PAYSTACK_PUBLIC_KEY` | Africa Payments | [paystack.com](https://dashboard.paystack.com) | 1.5% + fee | ✅ Free account |
| `PAYSTACK_SECRET_KEY` | Africa Payments | [paystack.com](https://dashboard.paystack.com) | 1.5% + fee | ✅ Free account |
| `FLUTTERWAVE_PUBLIC_KEY` | 150+ Countries | [flutterwave.com](https://dashboard.flutterwave.com) | 1.4% + fee | ✅ Sandbox mode |
| `FLUTTERWAVE_SECRET_KEY` | 150+ Countries | [flutterwave.com](https://dashboard.flutterwave.com) | 1.4% + fee | ✅ Sandbox mode |

## 🟡 OPTIONAL (Nice to have)

### Shipping & Logistics
| API Key | Service | Where to Get | Cost |
|---------|---------|-------------|------|
| `DHL_API_KEY` | Shipping Rates | [developer.dhl.com](https://developer.dhl.com) | Free to register |
| `TWILIO_ACCOUNT_SID` | SMS Notifications | [twilio.com](https://www.twilio.com/console) | $0.0075/SMS |
| `TWILIO_AUTH_TOKEN` | SMS Notifications | [twilio.com](https://www.twilio.com/console) | $0.0075/SMS |

### Analytics & Monitoring
| API Key | Service | Where to Get | Cost |
|---------|---------|-------------|------|
| `VITE_GOOGLE_ANALYTICS_ID` | Analytics | [analytics.google.com](https://analytics.google.com) | Free |
| `SENTRY_DSN` | Error Tracking | [sentry.io](https://sentry.io) | $29/mo |

### AI Features
| API Key | Service | Where to Get | Cost |
|---------|---------|-------------|------|
| `OPENAI_API_KEY` | AI Recommendations | [openai.com](https://platform.openai.com) | Pay-as-you-go |

### Email
| API Key | Service | Where to Get | Cost |
|---------|---------|-------------|------|
| `SENDGRID_API_KEY` | Transactional Email | [sendgrid.com](https://app.sendgrid.com) | Free tier: 100/day |

---

## 🚀 Fastest Setup (15 minutes)

1. **Create Supabase account** (~2 min)
   - Go to [supabase.com](https://app.supabase.com)
   - Create new project
   - Copy URL and Publishable Key

2. **Create Stripe account** (~5 min)
   - Go to [stripe.com](https://dashboard.stripe.com)
   - Create account
   - Get test keys (free)

3. **Add to Hostinger** (~5 min)
   - Go to hPanel → Environment variables
   - Add 4 variables above
   - Deploy

4. **You're live!** ✅

---

## 📋 All Environment Variables (Copy-Paste)

```dotenv
# REQUIRED
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=

# PAYMENT - Choose at least Stripe
STRIPE_PUBLIC_KEY=pk_live_
STRIPE_SECRET_KEY=sk_live_

# PAYMENT - Optional but recommended for Africa
MTN_MOMO_API_KEY=
MTN_MOMO_PRIMARY_KEY=
PAYSTACK_PUBLIC_KEY=pk_live_
PAYSTACK_SECRET_KEY=sk_live_
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE-
FLUTTERWAVE_SECRET_KEY=FLWSECK_LIVE-

# LOGISTICS - Optional
DHL_API_KEY=
TWILIO_ACCOUNT_SID=AC
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# ANALYTICS - Optional
VITE_GOOGLE_ANALYTICS_ID=G-
SENTRY_DSN=https://

# AI - Optional
OPENAI_API_KEY=sk-

# EMAIL - Optional
SENDGRID_API_KEY=SG.
SENDGRID_FROM_EMAIL=noreply@harvesta.com

# Application
NODE_ENV=production
VITE_API_URL=https://yourdomain.com
```

---

## 🔐 Security Checklist

- [ ] Use **production keys**, not sandbox keys
- [ ] Add keys to Hostinger environment variables (not in code)
- [ ] Never commit `.env` files to Git
- [ ] Enable 2FA on all provider accounts
- [ ] Store backup keys in password manager
- [ ] Rotate keys every 3 months
- [ ] Monitor API usage for unusual activity

---

## 💰 Cost Estimate

| Service | Cost | Status |
|---------|------|--------|
| Hostinger | $2.99-12.99/mo | Hosting only |
| Supabase | $0/mo (free tier) | Database |
| Stripe | 2.9% + $0.30/tx | Pay-per-use |
| Twilio | $0.0075/SMS | Optional |
| Google Analytics | Free | Optional |
| **TOTAL** | **$3-15/mo** | Minimum viable |

---

## 🆘 Common Issues

### "API key not found"
- Check key is added to Hostinger environment
- Restart Node.js application in hPanel
- Verify spelling of variable name matches code

### "Payment gateway connection failed"
- Verify correct environment (sandbox vs production)
- Check API key is valid in provider dashboard
- Ensure IP whitelist allows Hostinger servers

### "Supabase connection error"
- Verify URL and key are from same project
- Check project is in "Active" status
- Confirm network access is enabled

---

## 📚 Full Documentation
See `HOSTINGER_DEPLOYMENT_ENV_GUIDE.md` for complete details on each service.

---

## Quick Start Links

| Service | Link | Time |
|---------|------|------|
| Supabase | [app.supabase.com](https://app.supabase.com) | 2 min |
| Stripe | [dashboard.stripe.com](https://dashboard.stripe.com) | 5 min |
| Paystack | [dashboard.paystack.com](https://dashboard.paystack.com) | 3 min |
| MTN MoMo | [momodeveloperapi.mtn.com](https://momodeveloperapi.mtn.com) | 5 min |
| Hostinger | [hpanel.hostinger.com](https://hpanel.hostinger.com) | 2 min |

**Total setup time: ~20 minutes** ⏱️
