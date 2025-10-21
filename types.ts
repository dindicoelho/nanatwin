export enum AppStep {
  CONCEPT,
  UPLOAD,
  TRAINING,
  PROMPTING,
}

export interface TrainingImageData {
  id: string;
  base64: string;
  mimeType: string;
}

export interface GeneratedImageData extends TrainingImageData {
  prompt: string;
}
