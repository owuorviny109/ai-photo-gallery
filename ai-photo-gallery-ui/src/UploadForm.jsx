import { useState } from 'react';

// ✅ Make sure this is your full API endpoint:
const API_URL = "https://a3dgaucjk2.execute-api.us-east-1.amazonaws.com/upload-url";

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setStatus("Please choose a file first.");

    setStatus("Requesting signed URL...");
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      console.log("Requesting URL for extension:", ext);
      
      const res = await fetch(`${API_URL}?ext=${ext}`);
      console.log("API Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Lambda response:", data);

      if (!data.upload_url) {
        throw new Error("No upload_url in response");
      }

      const { upload_url } = data;
      const contentType = file.type || "image/jpeg";
      console.log("Uploading with Content-Type:", contentType);
      console.log("Upload URL:", upload_url);

      setStatus("Uploading to S3...");
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      console.log("S3 Upload Response status:", uploadRes.status);
      console.log("S3 Upload Response headers:", [...uploadRes.headers.entries()]);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("S3 Upload failed:", errorText);
        console.error("S3 Upload status:", uploadRes.status, uploadRes.statusText);
        throw new Error(`S3 Upload Error: ${uploadRes.status} ${uploadRes.statusText} - ${errorText}`);
      }

      setStatus("✅ Upload successful!");
      
      // Call the success callback to refresh gallery
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus(`❌ Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
      <p className="mt-4 text-sm text-gray-600">{status}</p>
    </div>
  );
};
