import React from 'react';

interface CharacterConceptStepProps {
  description: string;
  setDescription: (value: string) => void;
  triggerWord: string;
  setTriggerWord: (value: string) => void;
  onProceed: () => void;
}

const CharacterConceptStep: React.FC<CharacterConceptStepProps> = ({
  description,
  setDescription,
  triggerWord,
  setTriggerWord,
  onProceed,
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-[#92cff2] p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center text-[#4b4a4a] mb-2 font-space-grotesk uppercase tracking-tight">Define Your Character</h2>
      <p className="text-center text-[#4b4a4a]/90 mb-8">Describe your character's appearance and personality.</p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#4b4a4a]/90 mb-2">Character Description</label>
          <textarea
            id="description"
            rows={5}
            className="w-full bg-white/50 border border-[#4b4a4a]/20 rounded-md p-3 text-[#4b4a4a] placeholder-[#4b4a4a]/60 focus:ring-2 focus:ring-[#f873cf] focus:border-[#f873cf] transition"
            placeholder="e.g., A young female elf with silver hair, bright green eyes, and wearing ornate leather armor. She has a curious and adventurous personality."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="triggerWord" className="block text-sm font-medium text-[#4b4a4a]/90 mb-2">Unique Trigger Word</label>
          <input
            id="triggerWord"
            type="text"
            className="w-full bg-white/50 border border-[#4b4a4a]/20 rounded-md p-3 text-[#4b4a4a] placeholder-[#4b4a4a]/60 focus:ring-2 focus:ring-[#f873cf] focus:border-[#f873cf] transition"
            placeholder="e.g., elara_silverwind"
            value={triggerWord}
            onChange={(e) => setTriggerWord(e.target.value)}
          />
          <p className="text-xs text-[#4b4a4a]/80 mt-2">A unique, single word to identify your character in prompts. Use something that won't be confused with common words.</p>
        </div>

        <div className="pt-4">
          <button
            onClick={onProceed}
            disabled={!description || !triggerWord}
            className="w-full flex items-center justify-center gap-2 bg-[#f873cf] hover:bg-[#f873cf]/90 disabled:bg-[#4b4a4a]/20 disabled:text-[#4b4a4a]/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            Next: Upload Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterConceptStep;