import React, { useRef, useEffect } from 'react';

const ECGOscilloscope = ({ ecg_buffer, is_anomaly, width = 300, height = 100 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animFrame;
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Waveform
      if (ecg_buffer && ecg_buffer.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = is_anomaly ? '#ff3355' : '#00ff88';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = is_anomaly ? '#ff3355' : '#00ff88';
        
        const step = width / (ecg_buffer.length - 1);
        
        ecg_buffer.forEach((val, i) => {
          // Normalize val (assuming ECG mV roughly -0.5 to 1.5)
          const y = height / 2 - (val * (height / 3));
          const x = i * step;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset for next frame
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [ecg_buffer, is_anomaly, width, height]);

  return (
    <div className="relative bg-black/20 rounded-lg overflow-hidden border border-white/5">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="w-full block"
      />
      <div className="absolute top-1 right-2 text-[10px] text-accent-green opacity-50 font-mono">
        MMAE-ECG LIVE
      </div>
    </div>
  );
};

export default ECGOscilloscope;
