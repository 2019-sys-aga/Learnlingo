# Jungle AI Clone - Setup Instructions

## Quick Start

1. **Get your Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Set up the API Key**:
   
   **Option A: Environment Variable (Recommended)**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API key
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   **Option B: In-App Setup**
   - Run the application
   - Enter your API key when prompted
   - The key will be stored locally in your browser

3. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```

4. **Open your browser** and go to `http://localhost:5173`

## Features

### 🤖 AI-Powered Features
- **Smart Content Generation**: Upload PDFs, documents, or text files and AI will automatically create flashcards and quiz questions
- **Interactive Chat**: Ask questions about your study material and get AI-powered explanations
- **Content Summarization**: Get AI-generated summaries of your study materials
- **Concept Explanation**: Ask AI to explain specific concepts from your content

### 📚 Study Features
- **Flashcards**: 3D flip animations with self-assessment
- **Quizzes**: Multiple choice and true/false questions with explanations
- **Progress Tracking**: Monitor your study progress and accuracy
- **Study Sets**: Organize your materials into themed study sets

### 🎨 UI Features
- **Jungle Theme**: Beautiful animated background with nature elements
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with smooth animations

## How to Use

1. **Upload Files**: Drag and drop your study materials (PDF, DOC, TXT files)
2. **Generate Content**: Click "Generate Study Set" to create flashcards and quizzes
3. **Study**: Use flashcards and take quizzes to test your knowledge
4. **Chat**: Ask the AI assistant questions about your material
5. **Track Progress**: Monitor your learning progress and accuracy

## File Support

- **PDF files**: Text extraction and content analysis
- **Text files**: Direct content processing
- **Document files**: Basic text extraction (DOC, DOCX)
- **Presentation files**: Basic text extraction (PPT, PPTX)

## Troubleshooting

### API Key Issues
- Make sure your API key is valid and has the correct permissions
- Check that the key is properly set in your environment variables or stored locally
- Verify you have internet connectivity

### File Upload Issues
- Ensure files are in supported formats (PDF, TXT, DOC, DOCX, PPT, PPTX)
- Check file size (recommended under 10MB for best performance)
- Make sure files contain readable text content

### AI Generation Issues
- Verify your API key is working by testing in the chat
- Check your internet connection
- Try with smaller content chunks if processing fails

## Development

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Build Tool**: Vite
- **Icons**: Lucide React

### Environment Variables
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── services/       # AI and file processing services
├── pages/          # Main application pages
├── types/          # TypeScript type definitions
└── lib/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and demonstrates AI integration in educational applications.