/**
 * SABORES DO NORTE — RASTRO LUMINOSO DE CURSOR (#690174)
 * Trilha de luz fluida no tom exato do açaí puro (#690174) com faíscas cintilantes,
 * sem semente ou elemento obstrutivo sobre o ponteiro.
 */

(function () {
  'use strict';

  // Não ativa em dispositivos touch / móveis para preservar performance nativa
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  // 1. Criação do Canvas de Rastro em Tela Cheia
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Posições do Mouse
  let mouse = { x: -100, y: -100 };
  let isMoving = false;
  let moveTimeout;

  // Pontos da Trilha Luminosa
  const trailPoints = [];
  const maxTrailPoints = 26;

  // Faíscas Cintilantes no Tom de Açaí #690174
  const particles = [];

  class AcaiSparkle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 6;
      this.y = y + (Math.random() - 0.5) * 6;
      this.size = Math.random() * 2.4 + 1.0;
      this.alpha = 1;
      this.decay = Math.random() * 0.038 + 0.022;
      this.vx = (Math.random() - 0.5) * 1.4;
      this.vy = (Math.random() - 0.5) * 1.4 - 0.25;

      // Paleta centrada no tom oficial #690174 com variações de brilho
      const colors = ['#690174', '#850E91', '#A81CB8', '#C738D9', '#F09BFA'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size *= 0.94;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#850E91';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.2, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Rastreamento Suave do Ponteiro
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Adiciona ponto na cabeça da trilha
    trailPoints.unshift({ x: mouse.x, y: mouse.y });
    if (trailPoints.length > maxTrailPoints) {
      trailPoints.pop();
    }

    // Libera faíscas sutis durante o movimento
    if (Math.random() > 0.4) {
      particles.push(new AcaiSparkle(mouse.x, mouse.y));
    }

    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });

  // Loop de Renderização Contínua
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Desenho do Rastro de Luz Fluida (#690174)
    if (trailPoints.length > 2) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < trailPoints.length - 1; i++) {
        const pt = trailPoints[i];
        const nextPt = trailPoints[i + 1];
        const progress = 1 - i / trailPoints.length; // 1 na ponta (mouse), 0 no fim

        // Camada 1: Glow Difuso Externo no tom #690174
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.lineWidth = progress * 13;
        ctx.strokeStyle = `rgba(105, 1, 116, ${progress * 0.35})`;
        ctx.shadowColor = '#690174';
        ctx.shadowBlur = 14;
        ctx.stroke();

        // Camada 2: Fita Luminosa Intermediária
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.lineWidth = progress * 5.5;
        ctx.strokeStyle = `rgba(133, 14, 145, ${progress * 0.75})`;
        ctx.shadowColor = '#A81CB8';
        ctx.shadowBlur = 7;
        ctx.stroke();

        // Camada 3: Núcleo Incandescente com Brilho Suave
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.lineWidth = progress * 1.8;
        ctx.strokeStyle = `rgba(240, 155, 250, ${progress * 0.95})`;
        ctx.stroke();
      }

      ctx.restore();
    }

    // Retrai a trilha suavemente quando o mouse para
    if (!isMoving && trailPoints.length > 0) {
      trailPoints.pop();
    }

    // 2. Renderização das Faíscas
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
})();
