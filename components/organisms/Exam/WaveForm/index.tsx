import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WavesurferProps {
  audioFile: string;
  play: boolean;
}

const Wavesurfer: React.FC<WavesurferProps> = ({ audioFile, play }) => {
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(audioFile);
    } else {
      wavesurferRef.current = WaveSurfer.create({
        container: '#wavesurfer',
        waveColor: '#384C66',
        progressColor: 'red',
        barWidth: 1,
        responsive: true,
        height: 40,
        cursorColor: 'transparent',
      });

      wavesurferRef.current.load(audioFile);
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioFile]);

  useEffect(() => {
    if (wavesurferRef.current) {
      if (play) {
        wavesurferRef.current.play();
      } else {
        wavesurferRef.current.pause();
      }
    }
  }, [play]);

  return <div id="wavesurfer" className="flex-1" />;
};

export default Wavesurfer;
