import React, { useState } from 'react';
import { GeneratedImageData } from '../types';
import Spinner from './common/Spinner';

interface TestingStepProps {
  triggerWord: string;
  onGenerate: (prompt: string) => void;
  generatedImages: GeneratedImageData[];
  isLoading: boolean;
  onReset: () => void;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.93 2.53a2.46 2.46 0 0 0-2.36 2.36l.1 1.41a2.46 2.46 0 0 1-1.64 2.12l-1.4.56a2.46 2.46 0 0 0-1.64 2.12l-.1 1.41a2.46 2.46 0 0 0 2.36 2.36l1.41-.1a2.46 2.46 0 0 1 2.12 1.64l.56 1.4a2.46 2.46 0 0 0 2.12 1.64l1.41.1a2.46 2.46 0 0 0 2.36-2.36l-.1-1.41a2.46 2.46 0 0 1 1.64-2.12l1.4-.56a2.46 2.46 0 0 0 1.64-2.12l.1-1.41a2.46 2.46 0 0 0-2.36-2.36l-1.41.1a2.46 2.46 0 0 1-2.12-1.64l-.56-1.4a2.46 2.46 0 0 0-2.12-1.64Z" /></svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);


const TestingStep: React.FC<TestingStepProps> = ({
  triggerWord,
  onGenerate,
  generatedImages,
  isLoading,
  onReset,
}) => {
  const [prompt, setPrompt] = useState<string>(`A photo of ${triggerWord} sitting in a cafe`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  const handleDownload = (image: GeneratedImageData) => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.base64}`;
    const fileName = `${image.prompt.substring(0, 40).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${image.id}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[#4b4a4a] font-space-grotesk uppercase tracking-tight">Test Your Character Model</h2>
        <p className="text-[#4b4a4a]/90 mt-2 mb-6">Your character model is ready! Use your trigger word <code className="bg-[#4b4a4a] text-[#f7df6b] px-2 py-1 rounded font-mono text-sm">{triggerWord}</code> in a new prompt to generate images with your consistent character.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow bg-white border border-gray-300 rounded-md p-3 text-[#4b4a4a] placeholder-[#4b4a4a]/60 focus:ring-2 focus:ring-[#f873cf] focus:border-[#f873cf] transition"
          placeholder={`e.g., An illustration of ${triggerWord} exploring a forest`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="flex items-center justify-center gap-2 bg-[#f873cf] hover:bg-[#f873cf]/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-all duration-300"
        >
          {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
          <span className="text-inherit">Generate</span>
        </button>
      </form>
      
      <div className="border-t border-gray-200 pt-8 mt-8">
        <h3 className="text-xl font-bold text-center mb-6">Generated Gallery</h3>
        {isLoading && generatedImages.length === 0 && (
          <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg text-[#4b4a4a]">
            <Spinner />
            <span className="ml-2">Generating your first image...</span>
          </div>
        )}
        
        {generatedImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {isLoading && (
              <div className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 text-[#4b4a4a]">
                <Spinner />
              </div>
            )}
            {generatedImages.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src={`data:${image.mimeType};base64,${image.base64}`}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#4b4a4a]/80 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
                  <p className="text-white text-sm line-clamp-4">{image.prompt}</p>
                   <button
                      onClick={() => handleDownload(image)}
                      className="self-end text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                      aria-label="Download image"
                      title="Download image"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && (
          <p className="text-center text-gray-500">Your generated images will appear here.</p>
        )}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onReset}
          className="text-[#4b4a4a]/80 hover:text-[#f873cf] font-medium py-2 px-4 rounded-md transition"
        >
          Start a New Character
        </button>
      </div>

    </div>
  );
};

export default TestingStep;