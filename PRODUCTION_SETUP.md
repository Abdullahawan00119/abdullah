# Production Deployment Guide

This guide will help you set up and deploy your portfolio application to production.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

## Step 1: Local Setup

### 1.1 Clone/Download the Project

```bash
git clone <your-repo-url>
cd abdullah-portfolio
```

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Create Environment File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in all required values (see Step 2 below)

## Step 2: Configure Services

### 2.1 Firebase Setup (REQUIRED)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to **Project Settings** → **Your apps** 
4. Under Web app, copy the configuration:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID`
   - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`
   - `measurementId` → `VITE_FIREBASE_MEASUREMENT_ID`

**Enable Firestore Database:**
- In Firebase Console, go to **Build** → **Firestore Database**
- Click **Create Database**
- Start in **Production mode** (set appropriate security rules later)
- Choose your region

**Required Collections:**
Your Firestore should have these collections:
- `portfolioMeta` - Your profile information
- `skills` - Your technical skills
- `experiences` - Your work experience
- `projects` - Your portfolio projects
- `testimonials` - Client testimonials
- `messages` - Contact form messages
- `visitor` - Visitor count tracking

### 2.2 Cloudinary Setup (REQUIRED for file uploads)

1. Go to [Cloudinary](https://cloudinary.com/console)
2. Sign up/login to your account
3. Get your **Cloud Name** from the dashboard
4. Create an unsigned upload preset:
   - Go to **Settings** → **Upload**
   - Scroll to **Upload presets**
   - Click **Add upload preset**
   - Name it `Portfolio` (or customize and update .env)
   - Set **Signing Mode** to `Unsigned`
   - Save

5. Update your .env:
   ```
   VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload
   VITE_CLOUDINARY_PRESET=Portfolio
   ```


### 2.4 Email Setup (OPTIONAL - for contact replies)

If you want to send email replies to contact form messages:

1. **Using Gmail:**
   - Enable 2-Step Verification on your Google Account
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or appropriate device type)
   - Copy the generated password to `.env`:
     ```
     VITE_SMTP_HOST=smtp.gmail.com
     VITE_SMTP_PORT=587
     VITE_SMTP_USER=your_email@gmail.com
     VITE_SMTP_PASS=generated_app_password
     ```

2. **Using other providers:**
   - Get SMTP credentials from your email provider
   - Update accordingly in `.env`

## Step 3: Test Locally

### 3.1 Development Server

```bash
npm run dev
```

Your app will run at `http://localhost:5173/`

### 3.2 Test Features

- ✅ CV download functionality
- ✅ File uploads (image, CV)
- ✅ AI bio generation
- ✅ Contact form
- ✅ Admin login and data management

## Step 4: Build for Production

### 4.1 Build the Application

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### 4.2 Test Production Build Locally

```bash
npm run preview
```

## Step 5: Deploy to Production

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Under "Environment Variables", add all variables from your `.env` file
6. Click "Deploy"

### Option B: Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variables in Site settings
8. Deploy

### Option C: Deploy to your own server

1. Build the app: `npm run build`
2. Upload the `dist/` folder to your web server
3. Configure web server to redirect all requests to `index.html` (SPA routing)

**Nginx example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/portfolio/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Step 6: Post-Deployment

### 6.1 Update Your App URL

Update in `.env` (or production environment):
```
VITE_APP_URL=https://yourdomain.com
```

### 6.2 Firebase Security Rules

Set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public reads for portfolio data
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Admin-only writes
    match /{document=**} {
      allow write: if request.auth.uid == 'YOUR_ADMIN_UID';
    }
  }
}
```

### 6.3 Cloudinary Security

1. Restrict upload to specific folders:
   - Go to **Settings** → **Upload**
   - Under "Moderation", enable virus scanning
   - Set folder restrictions if needed

### 6.4 Monitor and Maintain

- Check Firebase usage in Console
- Monitor Cloudinary API calls
- Review contact messages regularly
- Keep dependencies updated: `npm update`

## Troubleshooting

### CV Download Not Working
- Ensure Cloudinary upload preset is set to "Unsigned"
- Check if CV URL is accessible (test in browser)
- Verify CORS settings in Cloudinary

### Firebase Errors
- Check if collections exist in Firestore
- Verify security rules aren't blocking access
- Check browser console for specific Firebase errors

### File Upload Fails
- Verify Cloudinary credentials are correct
- Check upload preset name matches exactly
- Ensure file size is within limits

### AI Features Not Working
- Verify Gemini API key is correct
- Check API quota in Google AI Studio
- Ensure VITE_GEMINI_API_KEY is set

## Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | ✅ | Firebase Measurement ID |
| `VITE_GEMINI_API_KEY` | ✅ | Google Gemini API Key |
| `VITE_CLOUDINARY_URL` | ✅ | Cloudinary Upload URL |
| `VITE_CLOUDINARY_PRESET` | ✅ | Cloudinary Upload Preset |
| `VITE_SMTP_HOST` | ❌ | SMTP Host (for email) |
| `VITE_SMTP_PORT` | ❌ | SMTP Port (for email) |
| `VITE_SMTP_USER` | ❌ | SMTP Username (for email) |
| `VITE_SMTP_PASS` | ❌ | SMTP Password (for email) |
| `VITE_APP_URL` | ❌ | Your deployed app URL |
| `NODE_ENV` | ❌ | Set to 'production' |

## Support and Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Last Updated:** March 2026
