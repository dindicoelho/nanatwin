import React from 'react';
import { AppStep } from '../types';

interface HeaderProps {
    currentStep: AppStep;
    onResetKey: () => void;
}

const steps = [
    { id: AppStep.CONCEPT, name: '1. Concept' },
    { id: AppStep.UPLOAD, name: '2. Upload' },
    { id: AppStep.TRAINING, name: '3. Training' },
    { id: AppStep.PROMPTING, name: '4. Prompting' },
];

export const Header: React.FC<HeaderProps> = ({ currentStep, onResetKey }) => {
    return (
        <header className="relative text-center py-6">
            <h1 className="text-4xl font-bold text-[#4b4a4a] font-space-grotesk uppercase tracking-tighter">
                NanaTwin 🍌
            </h1>
            <p className="text-md text-[#4b4a4a]/80 mt-2">Create consistent AI characters from your photos</p>
            <div className="flex justify-center mt-6">
                <div className="flex items-center p-2 bg-white/50 rounded-full shadow-inner">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex items-center">
                                <span className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${currentStep === step.id ? 'bg-[#f873cf] text-white' : 'text-[#4b4a4a]/70'}`}>
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-2"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="absolute top-4 right-4">
                <button
                    onClick={onResetKey}
                    className="bg-white/60 hover:bg-white/90 text-[#4b4a4a] text-xs font-semibold py-2 px-3 rounded-full shadow-md transition-all"
                    title="Change API Key"
                >
                    Change API Key
                </button>
            </div>
        </header>
    );
};