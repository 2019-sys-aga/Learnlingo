# Deploy Jungle AI to Vercel

## Quick Deployment Steps:

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with your GitHub account
3. **Click "New Project"**
4. **Import your repository** (or upload the `/workspace/jungle-ai-clone` folder)
5. **Configure the project:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Add Environment Variable:**
   - Name: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyBhdr73u9yk2FjNs2g2cvsGmtaz9Wa-ekA`

7. **Click "Deploy"**

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variable
vercel env add VITE_GEMINI_API_KEY
# Enter: AIzaSyBhdr73u9yk2FjNs2g2cvsGmtaz9Wa-ekA

# Redeploy with environment variable
vercel --prod
```

### Option 3: GitHub Integration

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/jungle-ai-clone.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to Vercel dashboard
   - Import from GitHub
   - Select your repository
   - Deploy

## Environment Variables

Make sure to set these in Vercel:
- `VITE_GEMINI_API_KEY`: `AIzaSyBhdr73u9yk2FjNs2g2cvsGmtaz9Wa-ekA`

## Features Ready for Production:

✅ **AI Integration**: Gemini API configured
✅ **File Upload**: Drag & drop functionality
✅ **Flashcard Generation**: AI-powered content creation
✅ **Quiz System**: Multiple choice and true/false questions
✅ **Chat Assistant**: Interactive AI chat
✅ **Progress Tracking**: Study analytics
✅ **Responsive Design**: Works on all devices

## After Deployment:

Your app will be available at: `https://your-project-name.vercel.app`

You can then:
1. Upload study materials
2. Generate AI flashcards and quizzes
3. Chat with the AI assistant
4. Track your study progress

All AI features are fully functional with your Gemini API key!