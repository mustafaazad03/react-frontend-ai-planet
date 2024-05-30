# PDF Chat Application with AI Integration (Frontend)

This repository contains the frontend code for a chat application that integrates AI functionalities. The application allows users to upload PDF files, ask questions about the content, and receive responses from an AI model. It also handles online status, loading states, and displays chat history.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Components](#components)
- [Context](#context)
- [Hooks](#hooks)
- [Contributer](#contributer)
- [Features](#features)
- [Future Improvements](#future-improvements)

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Axios**: A promise-based HTTP client for making requests to the backend.
- **React Hot Toast**: A library for showing notifications in React applications.
- **React Hooks**: For managing state and side effects.
- **React Context API**: For global state management.
- **Vite**: A fast build tool that provides instant server start and hot module replacement.
- **ESLint**: A pluggable linting utility for JavaScript and JSX.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/mustafaazad03/react-frontend-ai-planet.git
   cd react-frontend-ai-planet
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the backend URI:

   ```sh
   VITE_BACKEND_URI=http://your-backend-uri
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Upload a PDF file using the "Upload PDF" button in the navbar.
3. Ask questions about the content of the uploaded PDF.
4. View the responses from the AI model in the chat interface.
5. Monitor your online status and loading states.

## File Structure

```
src/
├── assets/                # Image assets
├── components/            # React components
│   ├── Chat.jsx
│   ├── Loading.jsx
│   ├── Navbar.jsx
│   └── PromptBar.jsx
├── context/               # Context for global state management
│   └── Context.jsx
├── hooks/                 # Custom hooks
│   └── useOnlineStatus.jsx
├── utils/                 # Utility functions
│   └── OnlineStatus.jsx
├── App.jsx                # Main app component
├── index.css              # Global styles
└── main.jsx               # Entry point
```

## Components

### Navbar

The `Navbar` component handles the display of the application logo, PDF upload button, and the name of the currently uploaded PDF.

### Chat

The `Chat` component manages and displays the chat interface, including the chat history, user input, AI responses, loading states, and online status.

### Loading

The `Loading` component displays a loading animation when the AI model is processing a question.

### PromptBar

The `PromptBar` component is responsible for user input, allowing users to type and send their questions.

## Context

### Context.jsx

The `Context.jsx` file contains the global state management using React Context API. It provides functionalities for uploading PDFs, fetching chat history, and asking questions to the AI model.

### Functions

- **uploadPdf**: Handles PDF upload and manages state updates.
- **askQuestion**: Sends a question to the backend and processes the response.

## Hooks

### useOnlineStatus.jsx

The `useOnlineStatus` hook monitors the online status of the user and provides real-time updates.

## Features

- **PDF Upload**: Users can upload PDF files to the application.
- **Chat Interface**: Users can ask questions about the content of the uploaded PDF.
- **AI Integration**: The application uses an AI model to answer user questions.
- **Online Status**: The application displays the online status of the user.
- **Loading States**: The application shows loading animations when processing requests.

## Future Improvements

- **User Authentication**: Implement user authentication for personalized experiences.
- **Chat History**: Store chat history for future reference.
- **AI Model Selection**: Allow users to choose from multiple AI models.
- **Customization**: Provide options for customizing the chat interface.
- **Multiple PDFs**: Allow users to upload and switch between multiple PDF files.
- **Multi-Language Support**: Add support for multiple languages in the chat interface.
- **Multi Document Support**: Allow users to upload multiple documents and switch between them.

## Contributor

- [Mustafa Azad](https://github.com/mustafaazad03)
