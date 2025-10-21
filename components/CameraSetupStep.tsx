import React, { useState } from 'react';

interface CameraSetupStepProps {
  onStartTraining: (camera: string, lens: string, framing: string) => void;
}

const cameraOptions = [
    { id: 'dslr', name: 'DSLR Profissional', description: 'Imagens nítidas e de alta qualidade com profundidade de campo.' },
    { id: 'cinema', name: 'Cinema Camera', description: 'Visual cinematográfico com cores ricas e amplo alcance dinâmico.' },
    { id: 'vintage', name: 'Vintage Film', description: 'Estilo nostálgico com grão de filme e cores analógicas.' },
    { id: 'smartphone', name: 'Smartphone', description: 'Aparência moderna e casual, como uma foto do dia a dia.' },
    { id: 'gopro', name: 'GoPro/Action', description: 'Perspectiva ampla e dinâmica, ideal para cenas de ação.' },
    { id: 'drone', name: 'Drone', description: 'Tomadas aéreas e vistas de cima para um contexto amplo.' },
];

const lensOptions = [
    { id: 'wide', name: 'Wide Angle (16-35mm)', description: 'Captura mais do ambiente, pode distorcer as bordas.' },
    { id: 'standard', name: 'Standard (35-70mm)', description: 'Perspectiva natural, semelhante ao olho humano.' },
    { id: 'portrait', name: 'Portrait (70-135mm)', description: 'Ideal para retratos, comprime o fundo e foca no sujeito.' },
    { id: 'telephoto', name: 'Telephoto (135mm+)', description: 'Aproxima objetos distantes, achatando a perspectiva.' },
    { id: 'macro', name: 'Macro', description: 'Para detalhes extremos e closes muito próximos.' },
    { id: 'fisheye', name: 'Fisheye', description: 'Visão ultra-ampla e esférica com distorção dramática.' },
];

const framingOptions = [
    { id: 'extreme-closeup', name: 'Extreme Close-up', description: 'Foca em um detalhe específico, como os olhos.' },
    { id: 'closeup', name: 'Close-up', description: 'Mostra a cabeça e os ombros, capturando emoções.' },
    { id: 'medium', name: 'Medium Shot', description: 'Enquadra da cintura para cima, mostrando linguagem corporal.' },
    { id: 'full-body', name: 'Full Body', description: 'Exibe o personagem inteiro, da cabeça aos pés.' },
    { id: 'wide', name: 'Wide Shot', description: 'Mostra o personagem dentro de seu ambiente.' },
];

const SelectionCard: React.FC<{ title: string; description: string; selected: boolean; onClick: () => void }> = ({ title, description, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            selected ? 'border-[#f873cf] bg-[#f873cf]/10 shadow-lg' : 'border-gray-300 bg-white/50 hover:border-gray-400 hover:shadow-md'
        }`}
        title={description}
    >
        <h4 className={`font-bold ${selected ? 'text-[#f873cf]' : 'text-[#4b4a4a]'}`}>{title}</h4>
        <p className="text-xs text-[#4b4a4a]/80 mt-1">{description}</p>
    </div>
);

const CameraSetupStep: React.FC<CameraSetupStepProps> = ({ onStartTraining }) => {
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [framing, setFraming] = useState('');

  const isComplete = camera && lens && framing;

  const handleStart = () => {
    if (isComplete) {
      onStartTraining(camera, lens, framing);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#4b4a4a] font-space-grotesk uppercase tracking-tight">Camera & Framing</h2>
            <p className="text-[#4b4a4a]/90 mt-2">
                Configure os aspectos fotográficos para guiar a geração das imagens.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Camera Type */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-center text-[#4b4a4a] font-space-grotesk">1. Tipo de Câmera</h3>
                <div className="space-y-3">
                    {cameraOptions.map(opt => (
                        <SelectionCard key={opt.id} title={opt.name} description={opt.description} selected={camera === opt.name} onClick={() => setCamera(opt.name)} />
                    ))}
                </div>
            </div>

            {/* Lens Type */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-center text-[#4b4a4a] font-space-grotesk">2. Tipo de Lente</h3>
                 <div className="space-y-3">
                    {lensOptions.map(opt => (
                        <SelectionCard key={opt.id} title={opt.name} description={opt.description} selected={lens === opt.name} onClick={() => setLens(opt.name)} />
                    ))}
                </div>
            </div>

            {/* Character Framing */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-center text-[#4b4a4a] font-space-grotesk">3. Enquadramento</h3>
                 <div className="space-y-3">
                    {framingOptions.map(opt => (
                        <SelectionCard key={opt.id} title={opt.name} description={opt.description} selected={framing === opt.name} onClick={() => setFraming(opt.name)} />
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-12 flex justify-center">
             <button
                onClick={handleStart}
                disabled={!isComplete}
                className="w-full max-w-md bg-[#f873cf] hover:bg-[#f873cf]/90 disabled:bg-[#4b4a4a]/20 disabled:text-[#4b4a4a]/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
                Next: Start Training
            </button>
        </div>
    </div>
  );
};

export default CameraSetupStep;
