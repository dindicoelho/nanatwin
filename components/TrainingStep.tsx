
import React, { useState, useEffect } from 'react';

interface TrainingStepProps {
  onComplete: () => void;
}

const trainingMessages = [
    { progress: 0, message: 'Initializing training environment...' },
    { progress: 15, message: 'Analyzing character features from selected images...' },
    { progress: 40, message: 'Building consistency model...' },
    { progress: 65, message: 'Fine-tuning base model with character data...' },
    { progress: 85, message: 'Compiling LoRA weights...' },
    { progress: 100, message: 'Training complete! Your character model is ready.' },
];

const TrainingStep: React.FC<TrainingStepProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(trainingMessages[0].message);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        const currentMessage = trainingMessages.find(
          (m, i) => newProgress >= m.progress && (!trainingMessages[i+1] || newProgress < trainingMessages[i+1].progress)
        );
        if (currentMessage) {
            setMessage(currentMessage.message);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1500);
          return 100;
        }
        return newProgress;
      });
    }, 80); 

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto text-center bg-[#f7df6b] text-[#4b4a4a] p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-[#4b4a4a] mb-4 font-space-grotesk uppercase tracking-tight">Training in Progress</h2>
      <p className="text-[#4b4a4a]/90 mb-8">Please wait while we create your custom character model. This may take a few moments.</p>

      <div className="w-full bg-white/50 rounded-full h-4 mb-4 overflow-hidden border border-white/80">
        <div
          className="bg-[#f873cf] h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-lg font-medium text-[#4b4a4a] mb-2">{progress}%</p>
      <p className="text-[#4b4a4a]/90 h-6">{message}</p>
    </div>
  );
};

export default TrainingStep;