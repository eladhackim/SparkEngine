# Firebase Console Setup Guide

This document describes the manual steps needed in the Firebase Console to complete the Firebase infrastructure setup for Idea Forge.

## Prerequisites

- Access to Firebase Console (https://console.firebase.google.com)
- Google Cloud project linked to Firebase

## 1. Enable Authentication Providers

Navigate to: **Firebase Console > Authentication > Sign-in method**

### Email/Password Provider
1. Click on "Email/Password"
2. Enable the first toggle: "Email/Password"
3. Keep "Email link (passwordless sign-in)" disabled for MVP
4. Click "Save"

### Google OAuth Provider
1. Click on "Google"
2. Enable the provider
3. Add a project support email
4. Configure OAuth consent screen if prompted:
   - App name: "Idea Forge"
   - User support email: your email
   - Developer contact: your email
5. Click "Save"

## 2. Configure Authorized Domains

Navigate to: **Firebase Console > Authentication > Settings > Authorized domains**

Add your production domain(s):
- `idea-forge.web.app` (Firebase Hosting)
- `idea-forge.firebaseapp.com` (Firebase Hosting)
- Your custom domain if applicable

## 3. Create Firestore Database

Navigate to: **Firebase Console > Firestore Database**

1. Click "Create database"
2. Select "Production mode" (our security rules will handle access)
3. Choose your preferred location:
   - **Recommended**: `us-central1` (Iowa) for lowest latency with Cloud Functions
   - Or choose region closest to your users
4. Click "Enable"

**Note**: Database location cannot be changed after creation.

## 4. Deploy Security Rules

From your local machine:

```bash
cd /path/to/project
firebase deploy --only firestore:rules --project idea-forge
```

Or manually in Console:
1. Navigate to: **Firestore Database > Rules**
2. Copy contents of `firestore.rules`
3. Click "Publish"

## 5. Deploy Indexes

From your local machine:

```bash
firebase deploy --only firestore:indexes --project idea-forge
```

**Note**: Index creation can take several minutes. Check progress in:
**Firebase Console > Firestore Database > Indexes**

## 6. Set Up Cloud Secret Manager (for API Keys)

Navigate to: **Google Cloud Console > Secret Manager**

### Create Secrets

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com --project=idea-forge

# Create secrets
gcloud secrets create GROK_API_KEY --project=idea-forge
gcloud secrets create GEMINI_API_KEY --project=idea-forge
gcloud secrets create NEWS_API_KEY --project=idea-forge

# Add secret versions
echo -n "your-grok-api-key" | gcloud secrets versions add GROK_API_KEY --data-file=- --project=idea-forge
echo -n "your-gemini-api-key" | gcloud secrets versions add GEMINI_API_KEY --data-file=- --project=idea-forge
echo -n "your-news-api-key" | gcloud secrets versions add NEWS_API_KEY --data-file=- --project=idea-forge
```

### Grant Cloud Functions Access

```bash
# Get the service account email
SERVICE_ACCOUNT="idea-forge@appspot.gserviceaccount.com"

# Grant access to each secret
gcloud secrets add-iam-policy-binding GROK_API_KEY \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor" \
  --project=idea-forge

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor" \
  --project=idea-forge

gcloud secrets add-iam-policy-binding NEWS_API_KEY \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor" \
  --project=idea-forge
```

## 7. Configure Cloud Scheduler (for Daily Generation)

This will be set up when Cloud Functions are deployed. The scheduler job:
- **Name**: `generate-ideas-daily`
- **Schedule**: `0 6 * * *` (6:00 AM UTC daily)
- **Target**: HTTP Cloud Function URL

## 8. Environment Variables

Create a `.env.local` file in your project root (DO NOT commit to git):

```bash
# Firebase Client Config (safe to expose - restricted by domain)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=idea-forge.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=idea-forge
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=idea-forge.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Development
NODE_ENV=development
NEXT_PUBLIC_USE_EMULATORS=true
```

Get these values from: **Firebase Console > Project Settings > General**

## 9. Verify Setup

### Test Authentication
1. Start the emulators: `firebase emulators:start`
2. Navigate to Auth UI: `http://localhost:4000/auth`
3. Create a test user

### Test Firestore
1. Navigate to Firestore UI: `http://localhost:4000/firestore`
2. Verify collections can be created

### Test Security Rules
```bash
firebase emulators:start
npm test  # Run security rules tests
```

## 10. Production Checklist

Before going live:

- [ ] Authentication providers enabled
- [ ] Authorized domains configured
- [ ] Security rules deployed
- [ ] All 12 indexes created and "Enabled"
- [ ] Secret Manager secrets created
- [ ] Cloud Functions have secret access
- [ ] Environment variables set in Vercel/hosting
- [ ] Billing alerts configured in GCP Console

## Troubleshooting

### Index Build Failed
- Check Firestore limits (max 500 composite indexes)
- Verify field paths exist in documents

### Security Rules Not Working
- Use Rules Playground in Console to test
- Check for typos in field names
- Verify user is authenticated

### Auth Provider Issues
- Verify domain is authorized
- Check OAuth consent screen is configured
- Verify API keys are not restricted incorrectly
