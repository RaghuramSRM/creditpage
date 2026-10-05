import { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId;
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Synthwave floating particles — gold / pink / cyan / purple
    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      const colors = [
        'rgba(255,199,0,',
        'rgba(255,0,127,',
        'rgba(0,240,255,',
        'rgba(147,51,234,',
        'rgba(255,230,0,',
      ];
      for (let i = 0; i < count; i++) {
        particles.push({
          x:         Math.random() * canvas.width,
          y:         Math.random() * canvas.height,
          radius:    Math.random() * 2.5 + 0.6,
          baseColor: colors[Math.floor(Math.random() * colors.length)],
          vx:        (Math.random() - 0.5) * 0.3,
          vy:        -(Math.random() * 0.4 + 0.05),
          life:      Math.random(),
          lifeSpeed: Math.random() * 0.003 + 0.0006,
        });
      }
    };
    createParticles();
    window.addEventListener('resize', createParticles);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += p.lifeSpeed;

        if (p.x < 0)  p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0)  p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = Math.sin(p.life * Math.PI) * 0.85 + 0.08;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grad.addColorStop(0, `${p.baseColor}${alpha})`);
        grad.addColorStop(1, `${p.baseColor}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        if (p.life >= 1) {
          p.life = 0;
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
        }
      });
      animFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', createParticles);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Synthwave cityscape background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/synthwave_bg.png')`,
          filter: 'brightness(0.85) saturate(1.2)',
        }}
      />

      {/* Radial glow center — purple haze */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%,
              rgba(147,51,234,0.18) 0%,
              rgba(255,0,127,0.08) 45%,
              transparent 70%
            )
          `,
        }}
      />

      {/* Bottom horizon glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              transparent 55%,
              rgba(255,0,127,0.07) 80%,
              rgba(255,199,0,0.10) 100%
            )
          `,
        }}
      />

      {/* Bokeh particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 160px rgba(0,0,0,0.55)' }}
      />
    </div>
  );
}
