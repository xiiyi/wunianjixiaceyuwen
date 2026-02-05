import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#fdfbf7'; // Match bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center the visualizer
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#c0392b'); // Red top
        gradient.addColorStop(1, '#1e3a8a'); // Blue bottom

        ctx.fillStyle = gradient;
        // Rounded bars logic simplified
        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      // Clear canvas on stop
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [analyser, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="rounded-lg w-full max-w-[300px] h-[100px]"
    />
  );
};

export default Visualizer;