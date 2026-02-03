import React, { useRef, useEffect } from 'react';

const Starfall = ({ count = 120, isDark = true }) => {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    
    let stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.7 + 0.3
    }));

    let animationId;

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Сначала рисуем линии соединения
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Рисуем линию только если звезды близко друг к другу
          if (distance < 120) {
            const opacity = 1 - (distance / 120);
            ctx.globalAlpha = opacity * 0.6;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1; // Сбрасываем прозрачность
      
      // Затем обновляем позиции звезд и рисуем их
      for (let star of stars) {
        // Звезды всегда падают вниз
        star.y += star.speed;
        
        // Если звезда упала, создаём новую
        if (star.y > height) {
          star.x = Math.random() * width;
          star.y = -2;
          star.r = Math.random() * 2 + 1;
          star.speed = Math.random() * 0.7 + 0.3;
        }
        
        // Отрисовка звезды
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 20;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, isDark]);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
    />
  );
}

export default Starfall;
