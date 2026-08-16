import React, {useEffect, useRef} from 'react';

import styles from './styles.module.css';

const MAX_DPR = 1.5;
const DESKTOP_PARTICLES = 86;
const COMPACT_PARTICLES = 44;
const LINK_DISTANCE = 150;
const POINTER_RADIUS = 170;

function createRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cssVariable(name, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d', {alpha: true});
    if (!context) {
      return undefined;
    }

    const host = canvas.parentElement;
    const random = createRandom(0x7ce2026);
    const pointer = {x: -1000, y: -1000, active: false};
    const state = {
      width: 0,
      height: 0,
      ratio: 1,
      particles: [],
      animationFrame: 0,
      visible: !document.hidden,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      colors: {
        accent: cssVariable('--ifm-color-primary', '#167a5c'),
      },
    };

    const compact = () => window.matchMedia('(max-width: 700px)').matches;
    const lowPower = () => window.navigator.connection?.saveData || (window.navigator.hardwareConcurrency || 8) <= 2;

    const resetParticles = () => {
      const count = compact() || lowPower() ? COMPACT_PARTICLES : DESKTOP_PARTICLES;
      state.particles = Array.from({length: count}, () => ({
        x: random() * state.width,
        y: random() * state.height,
        vx: (random() - 0.5) * 0.16,
        vy: (random() - 0.5) * 0.16,
        radius: 1.1 + random() * 1.8,
      }));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      state.width = Math.max(1, rect.width);
      state.height = Math.max(1, rect.height);
      state.ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(state.width * state.ratio);
      canvas.height = Math.round(state.height * state.ratio);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
      resetParticles();
      draw(0);
    };

    const draw = (time) => {
      if (!state.width || !state.height) {
        return;
      }

      context.clearRect(0, 0, state.width, state.height);
      const distance = compact() ? 112 : LINK_DISTANCE;
      const pulse = state.reducedMotion ? 0 : Math.sin(time * 0.00035) * 0.15;

      if (!state.reducedMotion) {
        state.particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -20) particle.x = state.width + 20;
          if (particle.x > state.width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = state.height + 20;
          if (particle.y > state.height + 20) particle.y = -20;

          if (pointer.active) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const pointerDistance = Math.hypot(dx, dy);
            if (pointerDistance < POINTER_RADIUS && pointerDistance > 0.1) {
              const force = (1 - pointerDistance / POINTER_RADIUS) * 0.0025;
              particle.vx += dx * force;
              particle.vy += dy * force;
            }
          }

          particle.vx *= 0.999;
          particle.vy *= 0.999;
        });
      }

      context.lineWidth = 1;
      for (let i = 0; i < state.particles.length; i += 1) {
        const first = state.particles[i];
        for (let j = i + 1; j < state.particles.length; j += 1) {
          const second = state.particles[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const pairDistance = Math.hypot(dx, dy);
          if (pairDistance > distance) continue;

          const alpha = (1 - pairDistance / distance) * (0.17 + pulse);
          context.strokeStyle = state.colors.accent;
          context.globalAlpha = Math.max(0.035, alpha);
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }

      state.particles.forEach((particle) => {
        const pointerDistance = pointer.active
          ? Math.hypot(pointer.x - particle.x, pointer.y - particle.y)
          : POINTER_RADIUS + 1;
        const proximity = Math.max(0, 1 - pointerDistance / POINTER_RADIUS);
        context.globalAlpha = 0.22 + proximity * 0.62;
        context.fillStyle = state.colors.accent;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius + proximity * 1.7, 0, Math.PI * 2);
        context.fill();
      });

      if (pointer.active && !state.reducedMotion) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, POINTER_RADIUS);
        glow.addColorStop(0, `${state.colors.accent}20`);
        glow.addColorStop(1, `${state.colors.accent}00`);
        context.globalAlpha = 1;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(pointer.x, pointer.y, POINTER_RADIUS, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const animate = (time) => {
      if (!state.visible) {
        state.animationFrame = 0;
        return;
      }

      draw(time);
      if (!state.reducedMotion) {
        state.animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const start = () => {
      if (!state.animationFrame && state.visible && !state.reducedMotion) {
        state.animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const updatePointer = (event) => {
      if (event.pointerType === 'touch' || state.reducedMotion) {
        return;
      }

      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      state.visible = !document.hidden;
      if (state.visible) {
        draw(0);
        start();
      }
    };

    const handleThemeChange = () => {
      state.colors.accent = cssVariable('--ifm-color-primary', '#167a5c');
      draw(0);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (event) => {
      state.reducedMotion = event.matches;
      if (state.reducedMotion && state.animationFrame) {
        window.cancelAnimationFrame(state.animationFrame);
        state.animationFrame = 0;
      }
      draw(0);
      start();
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);

    resizeObserver?.observe(host);
    resize();
    start();
    if (!resizeObserver) {
      window.addEventListener('resize', resize, {passive: true});
    }
    window.addEventListener('pointermove', updatePointer, {passive: true});
    window.addEventListener('blur', clearPointer);
    document.addEventListener('visibilitychange', handleVisibility);
    mediaQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      if (state.animationFrame) {
        window.cancelAnimationFrame(state.animationFrame);
      }
      observer.disconnect();
      resizeObserver?.disconnect();
      if (!resizeObserver) {
        window.removeEventListener('resize', resize);
      }
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('blur', clearPointer);
      document.removeEventListener('visibilitychange', handleVisibility);
      mediaQuery.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

export default ParticleField;
