import React, { useEffect, useRef } from 'react';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function WeatherCanvas({ weatherCode = 0, isDay = 1, theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const { type } = getWeatherInfo(weatherCode);
    const particles = [];
    const stars = [];

    if (!isDay) {
      for (let i = 0; i < 95; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.7),
          r: Math.random() * 1.6 + 0.4,
          alpha: Math.random(),
          delta: (Math.random() * 0.015 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        });
      }
    }

    if (type === 'rain' || type === 'drizzle' || type === 'storm') {
      const count = type === 'drizzle' ? 65 : 140;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          len: type === 'drizzle' ? Math.random() * 10 + 6 : Math.random() * 18 + 12,
          speedY: type === 'drizzle' ? Math.random() * 5 + 4 : Math.random() * 10 + 9,
          speedX: -1.8,
          opacity: Math.random() * 0.4 + 0.15,
        });
      }
    } else if (type === 'snow') {
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3.2 + 1.2,
          speedY: Math.random() * 1.4 + 0.6,
          drift: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.65 + 0.25,
        });
      }
    } else if (type === 'partly-cloudy' || type === 'cloudy' || type === 'fog') {
      const count = type === 'fog' ? 10 : 7;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.65),
          radius: Math.random() * 180 + 130,
          speedX: (Math.random() * 0.25 + 0.08) * (i % 2 === 0 ? 1 : -1),
          opacity: type === 'fog' ? 0.11 : 0.07,
        });
      }
    }

    let lightningFlash = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars at night
      if (!isDay) {
        stars.forEach((s) => {
          s.alpha += s.delta;
          if (s.alpha <= 0.15 || s.alpha >= 0.95) s.delta *= -1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 232, 240, ${s.alpha})`;
          ctx.fill();
        });
      }

      // Sun halo for clear/partly-cloudy daytime
      if (isDay && (type === 'clear' || type === 'partly-cloudy')) {
        const sunX = canvas.width * 0.82;
        const sunY = canvas.height * 0.16;
        const grad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 260);
        grad.addColorStop(0, 'rgba(253, 224, 71, 0.28)');
        grad.addColorStop(0.45, 'rgba(251, 146, 60, 0.10)');
        grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Weather particles
      if (type === 'rain' || type === 'drizzle' || type === 'storm') {
        ctx.lineWidth = 1.2;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.len);
          ctx.strokeStyle =
            theme === 'light'
              ? `rgba(37, 99, 235, ${p.opacity})`
              : `rgba(147, 197, 253, ${p.opacity})`;
          ctx.stroke();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > canvas.height) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < 0) p.x = canvas.width;
        });

        if (type === 'storm') {
          if (Math.random() < 0.004) lightningFlash = 0.28;
          if (lightningFlash > 0) {
            ctx.fillStyle = `rgba(224, 231, 255, ${lightningFlash})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lightningFlash *= 0.86;
            if (lightningFlash < 0.01) lightningFlash = 0;
          }
        }
      } else if (type === 'snow') {
        particles.forEach((p) => {
          p.drift += 0.02;
          p.x += Math.sin(p.drift) * 0.6;
          p.y += p.speedY;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(241, 245, 249, ${p.opacity})`;
          ctx.fill();

          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (type === 'partly-cloudy' || type === 'cloudy' || type === 'fog') {
        particles.forEach((c) => {
          c.x += c.speedX;
          if (c.x - c.radius > canvas.width) c.x = -c.radius;
          if (c.x + c.radius < 0) c.x = canvas.width + c.radius;

          const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [weatherCode, isDay, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}