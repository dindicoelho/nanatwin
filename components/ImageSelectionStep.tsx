import React, { useState } from 'react';
import { TrainingImageData } from '../types';

interface ImageUploadStepProps {
  uploadedImages: TrainingImageData[];
  onImagesChange: (images: TrainingImageData[]) => void;
  onProceed: () => void;
  minImages: number;
  maxImages: number;
}

const fileToTrainingImage = (file: File): Promise<TrainingImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const base64 = event.target.result.split(',')[1];
        resolve({
          id: `${file.name}-${file.lastModified}`,
          base64,
          mimeType: file.type,
        });
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


const ImageSelectionStep: React.FC<ImageUploadStepProps> = ({
  uploadedImages,
  onImagesChange,
  onProceed,
  minImages,
  maxImages
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const isReady = uploadedImages.length >= minImages;

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, maxImages - uploadedImages.length);
    if (newFiles.length === 0) return;

    try {
        const newImages = await Promise.all(newFiles.map(fileToTrainingImage));
        onImagesChange([...uploadedImages, ...newImages]);
    } catch (error) {
        console.error("Error processing files:", error);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    onImagesChange(uploadedImages.filter(img => img.id !== id));
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#4b4a4a] font-space-grotesk uppercase tracking-tight">Upload Your Training Images</h2>
        <p className="text-[#4b4a4a]/90 mt-2">
          Upload your own images of the character. For best results, use varied poses, expressions, and lighting.
        </p>
        <p className="text-[#4b4a4a]/90 mt-1">
          Provide at least <span className="font-bold text-[#4b4a4a]">{minImages}</span> and up to <span className="font-bold text-[#4b4a4a]">{maxImages}</span> images.
        </p>
         <p className="font-semibold mt-4 text-lg text-[#4b4a4a]">{uploadedImages.length} / {maxImages} uploaded</p>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <label
            htmlFor="file-upload"
            className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 ${isDragging ? 'border-[#f873cf]' : 'border-gray-300'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <span className="flex items-center space-x-2">
                <UploadCloudIcon className="w-8 h-8 text-gray-400" />
                <span className="font-medium text-[#4b4a4a]/80">
                    Drop files to attach, or <span className="text-[#f873cf] underline">browse</span>
                </span>
            </span>
            <input 
                id="file-upload"
                type="file"
                name="file_upload"
                className="hidden"
                multiple
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e.target.files)}
                disabled={uploadedImages.length >= maxImages}
             />
        </label>
      </div>


      {uploadedImages.length > 0 && (
         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={`data:${image.mimeType};base64,${image.base64}`}
                  alt={`Uploaded character image ${image.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => removeImage(image.id)} className="text-white bg-black/50 hover:bg-black/70 rounded-full p-1.5">
                         <XIcon className="h-5 w-5" />
                    </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onProceed}
          disabled={!isReady}
          className="bg-[#f873cf] hover:bg-[#f873cf]/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          Next: Start Training
        </button>
      </div>
    </div>
  );
};

export default ImageSelectionStep;
