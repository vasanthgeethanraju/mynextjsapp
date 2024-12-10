import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Here you can:
    // 1. Save the file to your server
    // 2. Upload to cloud storage (S3, Cloud Storage, etc.)
    // 3. Process the file
    
    // Example: Save file name and size
    const fileName = file.name;
    const fileSize = file.size;

    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        fileName,
        fileSize 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests
export async function GET() {
  return NextResponse.json(
    { message: 'Upload endpoint ready' },
    { status: 200 }
  );
}