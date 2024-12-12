// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(request: Request) {
  try {
    const { userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json(
        { error: 'No input provided' },
        { status: 400 }
      );
    }

    // Get the most recent PDF file from the uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.pdf'));
    
    if (files.length === 0) {
      return NextResponse.json(
        { message: 'No PDF document found' },
        { status: 404 }
      );
    }

    // Get the most recent file (you might want to modify this logic based on your needs)
    const mostRecentFile = files[files.length - 1];
    const filePath = path.join(uploadsDir, mostRecentFile);

    // Load and parse the PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const documentContent = docs.map(doc => doc.pageContent).join('\n');

    // For now, we'll just return a simple response with the document content
    // This is where we'll integrate OpenAI in the next step
    const response = `Query: "${userInput}"\n\nDocument content available: ${documentContent.substring(0, 200)}...`;

    return NextResponse.json({ message: response });

  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
  