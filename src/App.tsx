import React, { useState } from 'react';

const App: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">den-test1 Camera PWA</h1>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="mb-4"
      />
      {capturedImage && (
        <img 
          src={capturedImage} 
          alt="Captured" 
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default App;