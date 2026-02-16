import { useEffect, useRef } from "react";

export const useWithSound = (audioSource: string) => {
	const soundRef = useRef<HTMLAudioElement>(null);


  const playSound = () => {
    soundRef?.current?.play();
  }

  const pauseSound = () => {
    soundRef?.current?.pause();
  }

	useEffect(() => {
    soundRef.current = new Audio(audioSource);
	}, []);

	return { playSound, pauseSound };
};
