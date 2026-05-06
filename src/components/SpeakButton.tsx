"use client";

import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SpeakButtonProps = {
  text: string;
  label?: string;
  size?: "sm" | "md";
};

function getSpeech() {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang === "en-US") ??
    voices.find((voice) => voice.lang === "en-GB") ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    null
  );
}

export function SpeakButton({ text, label = "朗读 / Speak", size = "sm" }: SpeakButtonProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const voice = useMemo(() => pickEnglishVoice(voices), [voices]);
  const canSpeak = isSupported && text.trim().length > 0;

  useEffect(() => {
    const speech = getSpeech();
    if (!speech) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => setVoices(speech.getVoices());
    updateVoices();
    speech.addEventListener("voiceschanged", updateVoices);
    return () => {
      speech.cancel();
      speech.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  const toggleSpeak = () => {
    const speech = getSpeech();
    if (!speech || !canSpeak) return;

    if (isSpeaking) {
      speech.cancel();
      setIsSpeaking(false);
      return;
    }

    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang ?? "en-US";
    utterance.voice = voice;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speech.speak(utterance);
  };

  return (
    <Button
      className={cn("min-h-10", size === "md" && "px-4")}
      disabled={!canSpeak}
      onClick={toggleSpeak}
      size={size === "sm" ? "sm" : "default"}
      title={isSupported ? label : "浏览器不支持朗读 / Speech is unavailable"}
      type="button"
      variant="secondary"
    >
      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {isSpeaking ? "停止 / Stop" : label}
    </Button>
  );
}
