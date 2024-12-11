'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Chatbot({ documentContent }: { documentContent: string }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSend = async () => {
    if (userInput.trim()) {
      setChatHistory((prevHistory) => [...prevHistory, `You: ${userInput}`]);
      setUserInput('');

      // Call the API route for chatbot responses
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userInput, documentContent }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setChatHistory((prevHistory) => [...prevHistory, `Bot: ${data.message}`]);
    }

    if (!userInput) {
      toast.error('Please enter a message');
    }

  };

  return (
    <div className="p-4 bg-black text-white h-screen">
      <Toaster position="top-center" />
      <h1 className="text-2xl mb-4 text-blue-600">Chatbot for Document</h1>
      <div className="mb-4">
        <div className="text-sm">{documentContent}</div>
      </div>
      <div className="mb-4">
        <textarea
          className="w-full p-2 mb-2 text-white bg-black border-green-500 border-2" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something about the document..."
        />
        <button onClick={handleSend} className="p-2 bg-green-500 text-white">
          Send
        </button>
      </div>
      <div className="space-y-2">
        {chatHistory.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    </div>
  );
}
