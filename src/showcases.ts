import sizeInventory from "../public/data/sizes.json";

export { sizeInventory };

export interface Showcase {
  id: keyof typeof sizeInventory.applications;
  category: string;
  title: string;
  description: string;
  modules: string[];
  screenshots: { path: string; alt: string; label: string }[];
}

// Screenshot paths are relative to public/, e.g. "screenshots/custom-voice.webp".
export const showcases: Showcase[] = [
  {
    id: "custom-voice",
    category: "SPEECH",
    title: "Custom voice",
    description:
      "A focused voice interface built around Qwen3-TTS-12Hz-0.6B-CustomVoice.",
    modules: ["Qwen3-TTS-12Hz-0.6B-CustomVoice"],
    screenshots: [
      {
        label: "Speech generation",
        path: "screenshots/custom-voice.png",
        alt: "Qwen3-TTS CustomVoice native interface with text, voice and language controls, and a completed speech waveform.",
      },
    ],
  },
  {
    id: "motion-and-gaussians",
    category: "3D & MOTION",
    title: "Motion & Gaussian deformation",
    description:
      "A combined interface for TripoSplat, pose estimation, Kimodo motion correction, and custom GPU Gaussian deformation.",
    modules: [
      "TripoSplat",
      "MediaPipe Pose Landmarker Heavy",
      "Kimodo · MotionCorrection",
      "Custom GPU Gaussian deformation",
    ],
    screenshots: [
      {
        label: "Image → 3D",
        path: "screenshots/triposplat-image-to-3d.png",
        alt: "TripoSplat Studio Image to 3D workspace with an existing generated Gaussian character loaded in the preview and generation and export controls.",
      },
      {
        label: "Character motion",
        path: "screenshots/motion-and-gaussians.png",
        alt: "TripoSplat Studio character motion workspace showing the saved rigged demo character, motion prompt, timeline and playback controls.",
      },
    ],
  },
];
