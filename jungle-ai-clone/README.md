# Jungle AI Clone

A modern, jungle-themed educational platform that generates flashcards and quizzes from study materials using AI. This is a clone of the popular Jungle AI application.

## Features

### 🎯 Core Functionality
- **File Upload**: Upload PDFs, documents, and text files
- **AI-Powered Content Generation**: Automatically creates flashcards and quizzes from uploaded materials
- **Interactive Study Modes**: 
  - Flashcards with 3D flip animations
  - Multiple choice quizzes
  - True/False questions
- **Progress Tracking**: Monitor your study progress and accuracy
- **AI Chat Assistant**: Get explanations and ask questions about your study material

### 🎨 Design Features
- **Jungle Theme**: Beautiful jungle-themed UI with animated background elements
- **Modern Interface**: Clean, responsive design with smooth animations
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Mobile Responsive**: Works seamlessly on all device sizes

### 🚀 Technical Features
- **React 18**: Built with the latest React features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Context API**: State management for study data
- **React Router**: Client-side routing for navigation

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jungle-ai-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIChat.tsx      # AI chat interface
│   ├── FileUpload.tsx  # File upload component
│   ├── Flashcard.tsx   # Flashcard display with 3D flip
│   ├── Header.tsx      # Navigation header
│   ├── JungleBackground.tsx # Animated jungle background
│   ├── QuizQuestion.tsx # Quiz question component
│   └── StudySetCard.tsx # Study set display card
├── contexts/           # React Context providers
│   └── StudyContext.tsx # Study data management
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
├── pages/             # Page components
│   ├── DemoPage.tsx   # AI chat demo page
│   ├── HomePage.tsx   # Main dashboard
│   └── StudyPage.tsx  # Study session page
├── types/             # TypeScript type definitions
│   └── index.ts       # Application types
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Key Components

### Flashcard Component
- 3D flip animation using CSS transforms
- Interactive study modes (reveal answer, self-assessment)
- Progress tracking for individual cards

### Quiz System
- Multiple choice questions
- True/False questions
- Immediate feedback and explanations
- Progress tracking and scoring

### AI Chat Assistant
- Interactive chat interface
- Context-aware responses
- Quick action buttons
- Message history

### File Upload
- Drag and drop functionality
- Support for multiple file types
- File processing simulation
- Upload progress tracking

## Customization

### Styling
The application uses Tailwind CSS with custom jungle-themed colors:
- `jungle-*`: Green color palette for primary elements
- `leaf-*`: Lighter green palette for accents
- Custom animations and transitions

### Adding New Features
1. Create new components in the `src/components/` directory
2. Add new pages in the `src/pages/` directory
3. Update types in `src/types/index.ts`
4. Add routes in `App.tsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and is a clone of the Jungle AI application.

## Acknowledgments

- Inspired by the original Jungle AI application
- Icons provided by Lucide React
- Styling with Tailwind CSS
- Built with React and TypeScript