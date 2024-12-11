// app/api/chat/route.ts


export async function POST(request: Request) {
    try {
      const { userInput } = await request.json();
  
      if (!userInput) {
        return new Response(JSON.stringify({ error: 'No input provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Retrieve the document content from the global variable
      if (!globalThis.uploadedDocumentContent) {
        return new Response(
          JSON.stringify({ message: 'No document uploaded yet' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const documentContent = globalThis.uploadedDocumentContent;
  
      // Process the user's query with the uploaded document content
      const response = `You asked: "${userInput}". Based on the document: "${documentContent}"`;
  
      return new Response(JSON.stringify({ message: response }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in chatbot API:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  