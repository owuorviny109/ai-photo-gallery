import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const GALLERY_API_URL = "https://cd0shp0kqe.execute-api.us-east-1.amazonaws.com/images";

const Gallery = forwardRef((props, ref) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  // Expose refresh function to parent component
  useImperativeHandle(ref, () => ({
    refreshGallery: fetchImages
  }));

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(GALLERY_API_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }
      
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-red-800 font-semibold">Error loading gallery</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchImages}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600 mb-4">No images yet</h3>
        <p className="text-gray-500">Upload some images to see them analyzed here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Photo Gallery</h2>
        <p className="text-gray-600">{images.length} analyzed images</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.image_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={image.image_url}
                alt={`Analyzed image ${image.image_id}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800 mb-1">AI Analysis</h3>
                <div className="flex flex-wrap gap-1">
                  {image.labels && image.labels.length > 0 ? (
                    image.labels.slice(0, 6).map((label, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        title={`Confidence: ${label.confidence}%`}
                      >
                        {label.name} ({label.confidence}%)
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No labels detected</span>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 border-t pt-2">
                <div>Uploaded: {formatTimestamp(image.timestamp)}</div>
                {image.file_size && (
                  <div>Size: {(image.file_size / 1024).toFixed(1)} KB</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={fetchImages}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Gallery
        </button>
      </div>
    </div>
  );
});

export default Gallery;