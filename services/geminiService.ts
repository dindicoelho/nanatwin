import { GoogleGenAI, Modality } from '@google/genai';
import { TrainingImageData, GeneratedImageData } from '../types';

interface GenerationSettings {
    camera: string;
    lens: string;
    framing: string;
    acting: string;
    expression: string;
    photographyType: string;
}

const DO_NOT_SPECIFY = "Don't specify";

export const generateTestImage = async (
    apiKey: string,
    testPrompt: string, 
    triggerWord: string, 
    referenceImages: TrainingImageData[], 
    settings: GenerationSettings,
    characterDescription: string
): Promise<GeneratedImageData> => {
    const ai = new GoogleGenAI({ apiKey });

    // Build a detailed prompt from the user's selections
    const photographyParts = [];
    if (settings.photographyType && settings.photographyType !== DO_NOT_SPECIFY) photographyParts.push(settings.photographyType);
    if (settings.framing && settings.framing !== DO_NOT_SPECIFY) photographyParts.push(settings.framing);
    if (settings.camera && settings.camera !== DO_NOT_SPECIFY) photographyParts.push(`photo taken with a ${settings.camera}`);
    if (settings.lens && settings.lens !== DO_NOT_SPECIFY) photographyParts.push(`using a ${settings.lens} lens`);
    const photographyDetails = photographyParts.join(', ');

    const characterParts = [];
    if (settings.acting && settings.acting !== DO_NOT_SPECIFY) characterParts.push(`The character is ${settings.acting}`);
    if (settings.expression && settings.expression !== DO_NOT_SPECIFY) characterParts.push(`with a ${settings.expression} facial expression`);
    const characterDetails = characterParts.join(' ');

    const basePrompt = testPrompt.replace(triggerWord, `a character named ${triggerWord}`);
    
    const characterContext = `Character concept: ${characterDescription}.`;
    
    const fullPrompt = [
        characterContext,
        photographyDetails,
        characterDetails,
        basePrompt
    ].filter(Boolean).join('. ') + '. The character\'s appearance MUST be consistent with the one in the provided images.';
    
    try {
        const imageParts = referenceImages.map(image => ({
            inlineData: {
                mimeType: image.mimeType,
                data: image.base64,
            },
        }));

        const textPart = { text: fullPrompt };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // nano banana
            contents: { parts: [...imageParts, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePartResponse && imagePartResponse.inlineData) {
            return {
                id: `test-${Date.now()}`,
                base64: imagePartResponse.inlineData.data,
                mimeType: imagePartResponse.inlineData.mimeType,
                prompt: testPrompt,
            };
        } else {
            throw new Error("The API response did not contain an image. This might be due to the safety policy.");
        }
    } catch (error) {
        console.error("Error generating test image:", error);
        // Forward the error to be handled by the UI, which can check for specific messages.
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to generate the test image. Please try a different prompt.");
    }
};
