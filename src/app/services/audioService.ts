/**
 * audioService.ts
 * STT: Browser Web Speech API (supports en-IN, ml-IN, ta-IN)
 * TTS: OpenAI /v1/audio/speech (nova voice, multilingual)
 */

// ─── Language mapping ─────────────────────────────────────────────────────────
export const SPEECH_LANG_MAP: Record<string, string> = {
  EN: "en-IN",
  ML: "ml-IN",
  TA: "ta-IN",
};

// ─── STT : Web Speech API ─────────────────────────────────────────────────────

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T } ? T : unknown;

let activeRecognition: SpeechRecognitionType | null = null;

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

export interface STTCallbacks {
  onStart: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (error: string) => void;
}

export function startListening(lang: string, callbacks: STTCallbacks): void {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError("Speech recognition is not supported in this browser. Use Chrome or Edge.");
    return;
  }

  // Stop any existing session
  stopListening();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = SPEECH_LANG_MAP[lang] ?? "en-IN";
  recognition.interimResults = true; // show partial results
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => callbacks.onStart();

  recognition.onresult = (event: { results: { [key: number]: { transcript: string }; isFinal?: boolean; length: number }[] }) => {
    let transcript = "";
    let isFinal = false;
    for (let i = event.results.length - 1; i >= 0; i--) {
      transcript = event.results[i][0].transcript;
      isFinal = Boolean(event.results[i].isFinal);
    }
    callbacks.onResult(transcript, isFinal);
  };

  recognition.onerror = (event: { error: string }) => {
    const messages: Record<string, string> = {
      "no-speech": "No speech detected. Please try again.",
      "not-allowed": "Microphone access denied. Please allow microphone in browser settings.",
      network: "Network error. Check your internet connection.",
    };
    callbacks.onError(messages[event.error] ?? `Speech error: ${event.error}`);
  };

  recognition.onend = () => {
    activeRecognition = null;
    callbacks.onEnd();
  };

  recognition.start();
  activeRecognition = recognition;
}

export function stopListening(): void {
  if (activeRecognition) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (activeRecognition as any).stop();
    } catch (_) {/* ignore */}
    activeRecognition = null;
  }
}

/** Strip markdown formatting so TTS reads cleanly */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")        // bold
    .replace(/\*(.*?)\*/g, "$1")            // italic
    .replace(/\[ESCALATE\]/g, "")
    .replace(/Confidence: (High|Medium|Low) [✅⚠️❓]/g, "")
    .replace(/[🌱💧🐛☀️🌾💰📋⚠️✅❓🎓📍]/gu, "")  // emojis
    .replace(/#+\s/g, "")                   // headings
    .replace(/\n{2,}/g, ". ")              // double newlines → pause
    .replace(/\n/g, " ")
    .trim();
}

export type TTSVoice = "nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer";

// ─── TTS : Web Speech Synthesis (FREE, Native Browser API) ────────────────────

export function unlockAudio() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    // The ONLY bulletproof way to bless speechSynthesis on user interaction
    // is to immediately speak an empty string with non-zero volume.
    const u = new SpeechSynthesisUtterance("");
    u.volume = 0.01; 
    u.rate = 10;
    window.speechSynthesis.speak(u);
    
    // Pre-warm the voices asynchronously
    window.speechSynthesis.getVoices();
  }
}

// Keep a global reference to prevent Chrome garbage collection bugs which stop audio randomly
let activeUtterances: SpeechSynthesisUtterance[] = [];

export async function speak(
  text: string,
  voiceType?: "nova" // Kept parameter for API compatibility but unused here
): Promise<void> {
  // Stop any currently playing audio
  stopSpeaking();

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.error("Browser does not support Speech Synthesis API");
    return;
  }

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return;

  // Split long texts into sentences to prevent the Chrome 200-character cutoff bug
  const chunks = cleaned.match(/[^.!?\n]+[.!?\n]+/g) || [cleaned];

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => (v.name.includes("Google") || v.name.includes("Microsoft")) && v.lang.startsWith("en")
  );

  chunks.forEach((chunk) => {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) return;

    const utterance = new SpeechSynthesisUtterance(trimmedChunk);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    utterance.rate = 1.0;
    
    // Store globally to avoid GC sweeping it away
    activeUtterances.push(utterance);
    
    utterance.onend = () => {
      // Clean up finished utterances
      activeUtterances = activeUtterances.filter(u => u !== utterance);
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    activeUtterances = [];
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
