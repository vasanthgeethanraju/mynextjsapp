export default function UploadPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Upload Document</h1>
        <form
          className="mt-6 flex flex-col gap-4"
          action="/api/upload"
          method="post"
          encType="multipart/form-data"
        >
          <input
            type="file"
            name="document"
            className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
      </div>
    );
  }