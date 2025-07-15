
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const AudioManager = forwardRef((props, ref) => {
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);

  
  useImperativeHandle(ref, () => ({
    playCorrect() {
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play();
      }
    },
    playWrong() {
      if (wrongSoundRef.current) {
        wrongSoundRef.current.currentTime = 0;
        wrongSoundRef.current.play();
      }
    }
  }));

 
  return (
    <>
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={wrongSoundRef} src="/sounds/wrong.mp3" preload="auto" />
    </>
  );
});

export default AudioManager;