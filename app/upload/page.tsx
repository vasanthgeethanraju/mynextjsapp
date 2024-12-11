// uploadPage.tsx

'use client'; 

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get('document') as File;

    // Check if file exists and has a name before proceeding
    if (!file || !file.name) {
      toast.error('Please select a document to upload');
      return;
    }

    // Check if it's a PDF file
    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF document');
      return;
    }

    setIsUploading(true);
    // Show loading toast and store its ID
    const loadingToast = toast.loading('Please wait for the upload to complete');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success(data.message || 'Upload successful!');
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(data.error || 'Upload failed!');
      }
    } catch (error) {
      // Dismiss the loading toast in case of error
      toast.dismiss(loadingToast);
      toast.error('Something went wrong during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold text-blue-600">Upload Document</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <input
          type="file"
          name="document"
          accept=".pdf"
          className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-500 text-white hover:text-green-600"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}