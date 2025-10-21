import React, { useState } from 'react';

interface SetupStepProps {
  onComplete: (apiKey: string) => void;
}

const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15.5 7.8 12.25 11.05a2.5 2.5 0 1 1-3.53-3.53L12.2 4H15v3.8z"/><path d="m17 14-4.5 4.5a2.5 2.5 0 1 1-3.53-3.53L12.5 11.5"/></svg>
);

const SetupStep: React.FC<SetupStepProps> = ({ onComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (apiKey && agreed) {
      onComplete(apiKey.trim());
    }
  };

  const isButtonDisabled = !apiKey || !agreed;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl text-[#4b4a4a]">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-space-grotesk uppercase tracking-tighter">NanaTwin 🍌</h1>
            <p className="text-md text-[#4b4a4a]/80 mt-2">Create Consistent AI Characters</p>
        </div>

        <div className="mt-8">
            <h2 className="text-xl font-bold text-center">Setup Required</h2>
            <p className="text-center text-[#4b4a4a]/90 mt-2">
                To protect your privacy and give you control over API usage, this app requires your own Google AI Studio API key.
            </p>
        </div>

        <div className="space-y-6 mt-8">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-[#4b4a4a]/90 mb-2">Your Google AI API Key</label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4b4a4a]/40" />
                <input
                  id="apiKey"
                  type="password"
                  className="w-full bg-white/50 border border-[#4b4a4a]/20 rounded-md p-3 pl-10 text-[#4b4a4a] placeholder-[#4b4a4a]/60 focus:ring-2 focus:ring-[#f873cf] focus:border-[#f873cf] transition"
                  placeholder="Enter your API key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
               <p className="text-xs text-center text-[#4b4a4a]/80 mt-2">
                <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-[#f873cf] hover:underline">Get your API key</a> from Google AI Studio. Your key is stored only in your browser.
               </p>
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="focus:ring-[#f873cf] h-4 w-4 text-[#f873cf] border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-[#4b4a4a]">Terms of Use</label>
                    <p className="text-[#4b4a4a]/80 text-xs">
                        I understand that my uploaded images and prompts are sent to the Google API for processing. This application does not store my images. I am responsible for the content I generate.
                    </p>
                </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className="w-full flex items-center justify-center gap-2 bg-[#f873cf] hover:bg-[#f873cf]/90 disabled:bg-[#4b4a4a]/20 disabled:text-[#4b4a4a]/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                Start Creating
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SetupStep;
