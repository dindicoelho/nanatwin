import React, { useState } from 'react';
import { GeneratedImageData } from '../types';
import Spinner from './common/Spinner';

interface GenerationSettings {
    prompt: string;
    camera: string;
    lens: string;
    framing: string;
    acting: string;
    expression: string;
    photographyType: string;
}

interface PromptingStepProps {
  triggerWord: string;
  onGenerate: (settings: GenerationSettings) => void;
  generatedImages: GeneratedImageData[];
  isLoading: boolean;
  onReset: () => void;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.93 2.53a2.46 2.46 0 0 0-2.36 2.36l.1 1.41a2.46 2.46 0 0 1-1.64 2.12l-1.4.56a2.46 2.46 0 0 0-1.64 2.12l-.1 1.41a2.46 2.46 0 0 0 2.36 2.36l1.41-.1a2.46 2.46 0 0 1 2.12 1.64l.56 1.4a2.46 2.46 0 0 0 2.12 1.64l1.41.1a2.46 2.46 0 0 0 2.36-2.36l-.1-1.41a2.46 2.46 0 0 1 1.64-2.12l1.4-.56a2.46 2.46 0 0 0 1.64-2.12l.1-1.41a2.46 2.46 0 0 0-2.36-2.36l-1.41.1a2.46 2.46 0 0 1-2.12-1.64l-.56-1.4a2.46 2.46 0 0 0-2.12-1.64Z" /></svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const DO_NOT_SPECIFY = "Don't specify";

const cameraOptions = [
    { id: 'none', name: DO_NOT_SPECIFY },
    { id: 'dslr', name: 'DSLR - Professional, versatile' },
    { id: 'cinema', name: 'Cinema camera - RED, ARRI aesthetic' },
    { id: 'medium-format', name: 'Medium format - Hasselblad, ultra high quality' },
    { id: '35mm', name: '35mm film camera - Classic analog' },
    { id: 'polaroid', name: 'Polaroid/Instant - Nostalgic, unique colors' },
    { id: 'smartphone', name: 'Smartphone camera - Modern, casual' },
    { id: 'gopro', name: 'GoPro/Action camera - Wide, dynamic' },
    { id: 'drone', name: 'Drone camera - Aerial, unique perspective' },
    { id: 'vintage', name: 'Vintage camera - Retro, heavy grain' },
    { id: 'large-format', name: 'Large format camera - 4x5, ultra detailed' },
];

const lensOptions = [
    { id: 'none', name: DO_NOT_SPECIFY },
    { id: 'wide', name: 'Wide angle (16-35mm) - Broad environment' },
    { id: 'standard', name: 'Standard (35-50mm) - Natural vision' },
    { id: 'portrait', name: 'Portrait (85mm) - Flattering compression' },
    { id: 'telephoto', name: 'Telephoto (135-200mm) - Creamy bokeh' },
    { id: 'macro', name: 'Macro lens - Extreme details' },
    { id: 'fisheye', name: 'Fisheye - Creative distortion' },
    { id: 'tilt-shift', name: 'Tilt-shift - Perspective control' },
    { id: '50mm', name: '50mm f/1.2 - Shallow depth, dreamy' },
    { id: '24mm', name: '24mm f/1.4 - Wide + low light' },
    { id: '70-200mm', name: '70-200mm f/2.8 - Versatile pro zoom' },
];

const framingOptions = [
    { id: 'none', name: DO_NOT_SPECIFY },
    { id: 'extreme-closeup', name: 'Extreme close-up - Eyes, facial details' },
    { id: 'closeup', name: 'Close-up - Full face' },
    { id: 'medium-closeup', name: 'Medium close-up - Head and shoulders' },
    { id: 'medium', name: 'Medium shot - Waist up' },
    { id: 'cowboy', name: 'Cowboy shot - Mid-thigh up' },
    { id: 'full-body', name: 'Full body - Entire body, feet visible' },
    { id: 'wide', name: 'Wide shot - Character + environment' },
    { id: 'over-shoulder', name: 'Over the shoulder - Behind shoulder view' },
    { id: 'dutch', name: 'Dutch angle - Tilted camera, dynamic' },
    { id: 'birds-eye', name: "Bird's eye view - Overhead view" },
];

const actingOptions = [
    { id: 'none', name: DO_NOT_SPECIFY },
    { id: 'standing', name: 'Standing confidently - Strong posture, power' },
    { id: 'walking', name: 'Walking towards camera - Movement, energy' },
    { id: 'sitting', name: 'Sitting casually - Relaxed, accessible' },
    { id: 'leaning', name: 'Leaning against wall - Cool, laid-back' },
    { id: 'hand-pocket', name: 'Hand in pocket - Casual confidence' },
    { id: 'arms-crossed', name: 'Arms crossed - Assertive, serious' },
    { id: 'over-shoulder', name: 'Looking over shoulder - Mysterious, intriguing' },
    { id: 'laughing', name: 'Mid-laugh - Genuine, joyful' },
    { id: 'hair-flip', name: 'Hair flip/movement - Dynamic, editorial' },
    { id: 'hands-frame', name: 'Hands in frame - Interacting, storytelling' },
];

const expressionOptions = [
    { id: 'none', name: DO_NOT_SPECIFY },
    { id: 'serious', name: 'Serious/intense gaze - Dramatic, editorial' },
    { id: 'smile', name: 'Genuine smile - Joyful, approachable' },
    { id: 'smirk', name: 'Subtle smirk - Confident, mysterious' },
    { id: 'contemplative', name: 'Contemplative - Thoughtful, introspective' },
    { id: 'fierce', name: 'Fierce/powerful - Strong, determined' },
    { id: 'soft', name: 'Soft/gentle - Delicate, vulnerable' },
    { id: 'playful', name: 'Playful - Fun, energetic' },
    { id: 'neutral', name: 'Neutral/stoic - Minimalist, fashion' },
    { id: 'surprised', name: 'Surprised/candid - Spontaneous, natural' },
    { id: 'melancholic', name: 'Melancholic - Emotional, artistic' },
];

const photographyTypeOptions = [
    { id: 'none', name: DO_NOT_SPECIFY },
    { id: 'portrait', name: 'Portrait photography - Person in focus' },
    { id: 'editorial', name: 'Editorial fashion - High-end magazine' },
    { id: 'street', name: 'Street photography - Urban, documentary' },
    { id: 'cinematic', name: 'Cinematic portrait - Movie still aesthetic' },
    { id: 'studio', name: 'Studio photography - Controlled, clean' },
    { id: 'film', name: 'Film photography - Grain, analog texture' },
    { id: 'lookbook', name: 'Fashion lookbook - Catalog, clothing focus' },
    { id: 'lifestyle', name: 'Lifestyle photography - Natural, everyday' },
    { id: 'fine-art', name: 'Fine art portrait - Artistic, conceptual' },
    { id: 'commercial', name: 'Commercial photography - Advertising, product' },
];


const SelectControl: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: {id: string, name: string}[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-[#4b4a4a]/90 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-white border border-gray-300 rounded-md p-2 text-[#4b4a4a] focus:ring-2 focus:ring-[#f873cf] focus:border-[#f873cf] transition"
        >
            {options.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
        </select>
    </div>
);


const PromptingStep: React.FC<PromptingStepProps> = ({
  triggerWord,
  onGenerate,
  generatedImages,
  isLoading,
  onReset,
}) => {
  const [prompt, setPrompt] = useState<string>(`A photo of ${triggerWord} sitting in a cafe`);
  const [camera, setCamera] = useState(DO_NOT_SPECIFY);
  const [lens, setLens] = useState(DO_NOT_SPECIFY);
  const [framing, setFraming] = useState(DO_NOT_SPECIFY);
  const [acting, setActing] = useState(DO_NOT_SPECIFY);
  const [expression, setExpression] = useState(DO_NOT_SPECIFY);
  const [photographyType, setPhotographyType] = useState(DO_NOT_SPECIFY);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ prompt, camera, lens, framing, acting, expression, photographyType });
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
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[#4b4a4a] font-space-grotesk uppercase tracking-tight">Test Your Character Model</h2>
        <p className="text-[#4b4a4a]/90 mt-2 mb-6">Your character model is ready! Use your trigger word <code className="bg-[#4b4a4a] text-[#f7df6b] px-2 py-1 rounded font-mono text-sm">{triggerWord}</code> in a new prompt to generate images with your consistent character.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#4b4a4a]/90 mb-1">Main Prompt</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md p-3 text-[#4b4a4a] placeholder-[#4b4a4a]/60 focus:ring-2 focus:ring-[#f873cf] focus:border-[#f873cf] transition"
            placeholder={`e.g., An illustration of ${triggerWord} exploring a forest`}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SelectControl label="Types of Photography" value={photographyType} onChange={(e) => setPhotographyType(e.target.value)} options={photographyTypeOptions} />
            <SelectControl label="Camera" value={camera} onChange={(e) => setCamera(e.target.value)} options={cameraOptions} />
            <SelectControl label="Lens" value={lens} onChange={(e) => setLens(e.target.value)} options={lensOptions} />
            <SelectControl label="Framing" value={framing} onChange={(e) => setFraming(e.target.value)} options={framingOptions} />
            <SelectControl label="Action / Pose" value={acting} onChange={(e) => setActing(e.target.value)} options={actingOptions} />
            <SelectControl label="Facial Expression" value={expression} onChange={(e) => setExpression(e.target.value)} options={expressionOptions} />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full flex items-center justify-center gap-2 bg-[#f873cf] hover:bg-[#f873cf]/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-all duration-300"
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

export default PromptingStep;