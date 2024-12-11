import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('document') as File;

    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a temporary file path for storing the uploaded file
    const filePath = path.join(process.cwd(), 'uploads', file.name);
    
    // Create the uploads folder if it doesn't exist
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Save the file content to the uploads directory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // You can later process the file content here if needed
    // For example, extract text from a PDF or store the path for further processing

    return new NextResponse(
      JSON.stringify({ message: 'File uploaded successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing file upload:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
