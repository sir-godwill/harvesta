# Hostinger Deployment: Complete Environment Variables Guide

## Overview

This guide lists all API keys and environment variables needed to deploy Harvesta on Hostinger. Hostinger uses cPanel/WHM for environment management.

---

## Required Environment Variables

### 1. **Supabase (Database & Auth) - REQUIRED**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get:**

- Log in to [Supabase Console](https://app.supabase.com)
- Select your project
- Go to Settings → API
- Copy the **Project URL** and **Anon Public Key**

**Why needed:**

- Database storage for all marketplace data
- User authentication
- Real-time subscriptions
- File storage for product images

---

### 2. **Payment Gateways (Optional but Recommended)**

#### A. **Stripe** (Credit/Debit Cards)

```
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

**Where to get:**

- Log in to [Stripe Dashboard](https://dashboard.stripe.com)
- Go to Developers → API Keys
- Copy **Publishable key** and **Secret key**

**Why needed:**

- Accept international credit/debit card payments
- Most popular payment method for B2B

**Cost:** 2.9% + $0.30 per transaction

---

#### B. **MTN Mobile Money** (Cameroon, Africa)

```
MTN_MOMO_API_KEY=your_mtn_api_key_here
MTN_MOMO_PRIMARY_KEY=4dd49a824c0343ebba9007da8dec84f2
MTN_MOMO_ENVIRONMENT=sandbox|production
```

**Where to get:**

- Register at [MTN MoMo Developer Portal](https://momodeveloperapi.mtn.com)
- Apply for production credentials
- Receive API keys via email

**Why needed:**

- Accept mobile money payments in Cameroon
- High penetration in target market
- Lower transaction fees (1-2%)

**Cost:** 1-2% per transaction

---

#### C. **Flutterwave** (Multi-country payments)

```
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_LIVE-xxxxxxxxxxxxx
FLUTTERWAVE_ENCRYPTION_KEY=xxxxxxxxxxxxx
```

**Where to get:**

- Create account at [Flutterwave Dashboard](https://dashboard.flutterwave.com)
- Go to Settings → API Keys
- Copy all three keys

**Why needed:**

- Accept payments in 150+ countries
- Supports mobile money, bank transfers, cards
- Automatic currency conversion

**Cost:** 1.4% + fixed amount per transaction

---

#### D. **Paystack** (Africa)

```
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

**Where to get:**

- Sign up at [Paystack Dashboard](https://dashboard.paystack.com)
- Go to Settings → API Keys & Webhooks
- Copy keys from Live section

**Why needed:**

- Popular in Nigeria and Ghana
- Simple integration
- Good for mobile money

**Cost:** 1.5% + flat fee

---

### 3. **Logistics & Shipping (Optional)**

#### DHL Express

```
DHL_API_KEY=xxxxxxxxxxxxx
DHL_ACCOUNT_NUMBER=xxxxxxxxxxxxx
DHL_BASE_URL=https://api.dhl.com
```

**Where to get:**

- Register at [DHL for Developers](https://developer.dhl.com)
- Create API key in dashboard
- Request account number from DHL sales

**Why needed:** International shipping rate quotes and tracking

---

#### Twilio (SMS Notifications)

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

**Where to get:**

- Create account at [Twilio Console](https://www.twilio.com/console)
- Go to Account Info
- Copy Account SID and Auth Token
- Purchase phone number in Console

**Why needed:** SMS notifications for order updates and delivery tracking

---

### 4. **Maps & Location Services (Optional)**

#### Google Maps / HERE Maps

```
MAPS_API_KEY=xxxxxxxxxxxxx
MAPS_PROVIDER=google|here
```

**Where to get:**

- Google: [Google Cloud Console](https://console.cloud.google.com) → Enable Maps API
- HERE: [HERE Developer Portal](https://developer.here.com)

**Why needed:** Route optimization, delivery tracking, map display

---

### 5. **Analytics & Monitoring (Optional)**

#### Google Analytics

```
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Where to get:**

- Go to [Google Analytics](https://analytics.google.com)
- Create new property
- Copy Measurement ID

**Why needed:** Track user behavior, conversion rates, traffic sources

---

#### Sentry (Error Tracking)

```
SENTRY_DSN=https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxx
```

**Where to get:**

- Sign up at [Sentry.io](https://sentry.io)
- Create new project (React)
- Copy DSN

**Why needed:** Real-time error monitoring and debugging

---

### 6. **AI & Recommendations (Optional)**

#### OpenAI API (for product recommendations)

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

**Where to get:**

- Go to [OpenAI Platform](https://platform.openai.com)
- Create API key in Billing → API Keys
- Enable billing

**Why needed:** AI-powered product recommendations, smart search

**Cost:** ~$0.002 per 1K tokens (varies by model)

---

### 7. **Email Service (Optional)**

#### Sendgrid

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@harvesta.com
```

**Where to get:**

- Sign up at [SendGrid](https://app.sendgrid.com)
- Go to Settings → API Keys
- Create new API key

**Why needed:** Transactional emails (confirmations, notifications)

---

## Environment Variables Setup on Hostinger

### Step 1: Access Hostinger Control Panel

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Select your hosting plan
3. Navigate to **Files → File Manager**

### Step 2: Create Environment File

1. Create a new file called `.env.production`
2. Add all required variables (see template below)

### Step 3: Configure Node.js

1. Go to **Node.js** section in hPanel
2. Set Node version to **20.x LTS**
3. Set **Package manager** to npm

### Step 4: Add Environment Variables

1. In hPanel, go to **Environment variables**
2. Add each variable:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project.supabase.co`
   - Click **Add**

---

## Complete .env.production Template

```dotenv
# ===== REQUIRED =====

# Supabase Database & Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== PAYMENT GATEWAYS (Choose at least 1) =====

# Stripe (Credit/Debit Cards)
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# MTN Mobile Money (Africa)
MTN_MOMO_API_KEY=your_api_key
MTN_MOMO_PRIMARY_KEY=your_primary_key
MTN_MOMO_ENVIRONMENT=production

# Flutterwave (Multi-country)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_LIVE-xxxxxxxxxxxxx
FLUTTERWAVE_ENCRYPTION_KEY=xxxxxxxxxxxxx

# Paystack
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# ===== LOGISTICS =====

# DHL Express
DHL_API_KEY=xxxxxxxxxxxxx
DHL_ACCOUNT_NUMBER=xxxxxxxxxxxxx

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# ===== MAPS & LOCATION =====
MAPS_API_KEY=xxxxxxxxxxxxx
MAPS_PROVIDER=google

# ===== ANALYTICS =====
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxx

# ===== AI & ML =====
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# ===== EMAIL =====
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@harvesta.com

# ===== APPLICATION =====
NODE_ENV=production
VITE_API_URL=https://yourdomain.com
```

---

## Deployment Checklist

- [ ] Register Supabase account and create project
- [ ] Get Supabase URL and Publishable Key
- [ ] Choose primary payment gateway (Stripe recommended for international)
- [ ] Register for payment gateway account
- [ ] Add all API keys to Hostinger environment variables
- [ ] Deploy code to Hostinger
- [ ] Test payment flow in sandbox mode first
- [ ] Switch to production credentials
- [ ] Set up SSL certificate (free with Hostinger)
- [ ] Configure custom domain
- [ ] Test all features on production

---

## Minimum Viable Setup for Hostinger

If you want to deploy quickly with minimal configuration:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

This allows:

- User authentication
- Product browsing
- Shopping cart
- Credit card payments (international)
- Order management

---

## Cost Breakdown

| Service     | Cost              | Purpose                        |
| ----------- | ----------------- | ------------------------------ |
| Hostinger   | $2.99-$12.99/mo   | Hosting                        |
| Supabase    | $0-$25+/mo        | Database (free tier available) |
| Stripe      | 2.9% + $0.30      | Payment processing             |
| MTN MoMo    | 1-2%              | Mobile money (regional)        |
| Twilio      | $0.0075/SMS       | SMS notifications              |
| Google Maps | $0-$200/mo        | Maps API                       |
| SendGrid    | $0-$99/mo         | Email                          |
| OpenAI      | ~$0.002/1K tokens | AI features                    |

**Total minimum:** ~$5-15/month (with free tiers)

---

## Security Notes

1. **Never commit `.env` files to GitHub**
2. **Use environment-specific keys** (sandbox for testing, production for live)
3. **Rotate API keys regularly** (monthly recommended)
4. **Enable IP whitelisting** where available
5. **Use strong passwords** for all accounts
6. **Enable 2FA** on all provider accounts
7. **Monitor API usage** for unusual activity
8. **Keep backup keys** in secure vault (1Password, LastPass)

---

## Support & Testing

- Stripe: Always test with `4242 4242 4242 4242`
- MTN MoMo: Use sandbox credentials first
- Twilio: Free trial includes $15 credit
- Flutterwave: Sandbox mode for testing

---

## Next Steps

1. Set up Supabase first (required)
2. Add Stripe for international payments
3. Add country-specific payment methods (MTN/Orange Money)
4. Add shipping integrations (DHL, Twilio)
5. Add analytics and error tracking
6. Optimize with AI recommendations

---

## Hostinger Specific Notes

- **Node.js version:** Use 20.x LTS
- **Build command:** `npm run build`
- **Start command:** `node server.js`
- **Port:** Automatically assigned (usually 3000)
- **SSL:** Free SSL included
- **Deployments:** Auto-deployments via Git or upload via File Manager

---

For detailed setup of each service, refer to individual provider documentation or reach out to Hostinger support for environment configuration help.
