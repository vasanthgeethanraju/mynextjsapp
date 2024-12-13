// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAI } from "openai";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json(
        { error: 'No input provided' },
        { status: 400 }
      );
    }

    // Get the most recent PDF file
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.pdf'));
    
    if (files.length === 0) {
      return NextResponse.json(
        { message: 'No PDF document found' },
        { status: 404 }
      );
    }

    const mostRecentFile = files[files.length - 1];
    const filePath = path.join(uploadsDir, mostRecentFile);

    // Load and parse the PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    // Split the document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);

    // Create context from the most relevant chunks
    const contextText = splits.map(doc => doc.pageContent).join('\n').substring(0, 3000);

    // Create the messages array for the chat completion
    const messages = [
      {
        role: "system" as const,
        content: "You are a helpful assistant that answers questions based on the provided document content. Keep your answers concise and relevant to the document content."
      },
      {
        role: "user" as const,
        content: `Document content: ${contextText}\n\nQuestion: ${userInput}\n\nPlease answer the question based on the document content provided above.`
      }
    ];

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({ message: answer });

  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
  