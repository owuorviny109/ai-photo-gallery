import { useState, useRef } from 'react';
import UploadForm from './UploadForm';
import Gallery from './Gallery';

function App() {
  const [activeTab, setActiveTab] = useState('gallery');
  const galleryRef = useRef();

  const handleUploadSuccess = () => {
    // Switch to gallery tab and refresh it
    setActiveTab('gallery');
    // Give a moment for the tab to switch, then refresh gallery
    setTimeout(() => {
      if (galleryRef.current) {
        galleryRef.current.refreshGallery();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">AI Photo Gallery</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-8">
        {activeTab === 'upload' ? (
          <div className="flex items-center justify-center">
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <Gallery ref={galleryRef} />
        )}
      </main>
    </div>
  );
}

export default App;
