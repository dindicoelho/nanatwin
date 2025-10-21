import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, TrainingImageData, GeneratedImageData } from './types';
import CharacterConceptStep from './components/CharacterConceptStep';
import ImageSelectionStep from './components/ImageSelectionStep';
import TrainingStep from './components/TrainingStep';
import PromptingStep from './components/PromptingStep';
import SetupStep from './components/SetupStep';
import { Header } from './components/Header';
import Footer from './components/Footer';
import { generateTestImage } from './services/geminiService';

interface GenerationSettings {
    prompt: string;
    camera: string;
    lens: string;
    framing: string;
    acting: string;
    expression: string;
    photographyType: string;
}

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyChecked, setIsApiKeyChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.CONCEPT);
  const [characterDescription, setCharacterDescription] = useState<string>('');
  const [triggerWord, setTriggerWord] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<TrainingImageData[]>([]);
  const [generatedTestImages, setGeneratedTestImages] = useState<GeneratedImageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
        setApiKey(storedApiKey);
    }
    setIsApiKeyChecked(true);
  }, []);

  const handleApiKeyComplete = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
  };

  const resetState = () => {
    setCurrentStep(AppStep.CONCEPT);
    setCharacterDescription('');
    setTriggerWord('');
    setSelectedImages([]);
    setGeneratedTestImages([]);
    setIsLoading(false);
    setError(null);
  };

  const handleResetKey = () => {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
      resetState();
  };

  const handleProceedToUpload = () => {
    if (!characterDescription || !triggerWord) {
      setError('Please provide a character description and a trigger word.');
      return;
    }
    setError(null);
    setCurrentStep(AppStep.UPLOAD);
  };

  const handleImagesChange = (images: TrainingImageData[]) => {
      setSelectedImages(images);
  }

  const handleProceedToTraining = () => {
    if (selectedImages.length < 5) {
      setError('Please upload at least 5 images for training.');
      return;
    }
    setError(null);
    setCurrentStep(AppStep.TRAINING);
  };

  const handleTrainingComplete = () => {
    setCurrentStep(AppStep.PROMPTING);
  };
  
  const handleGenerateTestImage = useCallback(async (settings: GenerationSettings) => {
    if (!apiKey) {
        setError('API Key is not set. Please configure it first.');
        return;
    }
    if (!settings.prompt) {
        setError('Please enter a prompt to generate an image.');
        return;
    }
    if (selectedImages.length === 0) {
        setError('Something went wrong, no training images found. Please start over.');
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newImage = await generateTestImage(apiKey, settings.prompt, triggerWord, selectedImages, settings, characterDescription);
      setGeneratedTestImages(prev => [newImage, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (errorMessage.includes('API key not valid')) {
          setError('Your API key is not valid. Please check it and try again.');
          handleResetKey();
      } else {
          setError(errorMessage);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, selectedImages, triggerWord, characterDescription]);

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.CONCEPT:
        return (
          <CharacterConceptStep
            description={characterDescription}
            setDescription={setCharacterDescription}
            triggerWord={triggerWord}
            setTriggerWord={setTriggerWord}
            onProceed={handleProceedToUpload}
          />
        );
      case AppStep.UPLOAD:
        return (
          <ImageSelectionStep
            uploadedImages={selectedImages}
            onImagesChange={handleImagesChange}
            onProceed={handleProceedToTraining}
            minImages={5}
            maxImages={15}
          />
        );
      case AppStep.TRAINING:
        return <TrainingStep onComplete={handleTrainingComplete} />;
      case AppStep.PROMPTING:
        return (
          <PromptingStep
            triggerWord={triggerWord}
            onGenerate={handleGenerateTestImage}
            generatedImages={generatedTestImages}
            isLoading={isLoading}
            onReset={resetState}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  if (!isApiKeyChecked) {
    return null; // or a loading spinner
  }

  if (!apiKey) {
    return <SetupStep onComplete={handleApiKeyComplete} />;
  }
  
  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#4b4a4a] font-sans flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
            <Header currentStep={currentStep} onResetKey={handleResetKey} />
            <main className="mt-8 flex-grow">
              {error && (
                <div className="bg-[#f873cf]/20 border border-[#f873cf]/50 text-[#4b4a4a] px-4 py-3 rounded-lg relative mb-6" role="alert">
                  <strong className="font-bold text-[#f873cf]">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                  <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg className="fill-current h-6 w-6 text-[#f873cf]/70 hover:text-[#f873cf]" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                  </button>
                </div>
              )}
              {renderStep()}
            </main>
        </div>
        <Footer />
    </div>
  );
};

export default App;
