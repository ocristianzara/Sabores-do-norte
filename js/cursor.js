/**
 * SABORES DO NORTE — CURSOR PERSONALIZADO COM SEMENTE DE AÇAÍ E RASTRO DE LUZ
 * Cria o rastro de luz fluida no tom do açaí (tons roxo/violeta com brilho e faíscas)
 * com a semente do açaí na ponta do mouse.
 */

(function () {
  'use strict';

  // Não ativar em dispositivos móveis ou touch
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  // 1. Criação do elemento da semente de açaí
  const acaiCursor = document.createElement('div');
  acaiCursor.id = 'acai-cursor';
  acaiCursor.innerHTML = '<img src="IMAGENS/acai_cursor.png" alt="Açaí Cursor" width="32" height="32">';
  document.body.appendChild(acaiCursor);

  // 2. Criação do Canvas para o Rastro de Luz Fluido
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
  let prevMouse = { x: -100, y: -100 };
  let isMoving = false;
  let moveTimeout;

  // Pontos da trilha de luz
  const trailPoints = [];
  const maxTrailPoints = 28;

  // Partículas cintilantes (faíscas de luz no tom de açaí)
  const particles = [];

  class SparkleParticle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 8;
      this.y = y + (Math.random() - 0.5) * 8;
      this.size = Math.random() * 2.8 + 1.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.035 + 0.02;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.3; // leve subida
      // Tons de Açaí Luminoso: púrpura, violeta neon e brilho lavanda
      const colors = ['#D670F7', '#A844E8', '#8B1EA8', '#E9B9FB', '#58085E'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size *= 0.95;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#D670F7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.2, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Rastreamento do Mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Atualiza posição do elemento da semente de açaí
    acaiCursor.style.transform = `translate3d(${mouse.x - 16}px, ${mouse.y - 16}px, 0)`;

    // Adiciona ponto ao rastro
    trailPoints.unshift({ x: mouse.x, y: mouse.y, age: 0 });
    if (trailPoints.length > maxTrailPoints) {
      trailPoints.pop();
    }

    // Gera faíscas cintilantes ao mover
    if (Math.random() > 0.35) {
      particles.push(new SparkleParticle(mouse.x, mouse.y));
    }

    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 120);
  });

  // Efeito de Hover em botões e links
  const interactives = 'a, button, input, [role="button"], .essence-card, .gallery-slide';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      acaiCursor.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      acaiCursor.classList.remove('cursor-hover');
    }
  });

  // Loop de Renderização da Trilha de Luz Fluida
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Atualizar e Desenhar a Trilha de Luz Fluida (Tom de Açaí)
    if (trailPoints.length > 2) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Desenha múltiplos passes para o efeito de Glow intenso da referência
      // Camada externa (Glow Suave Açaí)
      for (let i = 0; i < trailPoints.length - 1; i++) {
        const pt = trailPoints[i];
        const nextPt = trailPoints[i + 1];
        const progress = 1 - i / trailPoints.length; // 1 na frente, 0 atrás

        // Fita externa suave
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.lineWidth = progress * 14;
        ctx.strokeStyle = `rgba(139, 30, 168, ${progress * 0.28})`;
        ctx.shadowColor = '#C154F3';
        ctx.shadowBlur = 16;
        ctx.stroke();

        // Fita intermediária vibrante
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.lineWidth = progress * 6;
        ctx.strokeStyle = `rgba(186, 75, 237, ${progress * 0.65})`;
        ctx.shadowColor = '#E9B9FB';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Linha central de luz incandescente
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.lineWidth = progress * 2.2;
        ctx.strokeStyle = `rgba(248, 225, 255, ${progress * 0.9})`;
        ctx.stroke();
      }

      ctx.restore();
    }

    // Envelhece e remove pontos do rastro
    for (let i = 0; i < trailPoints.length; i++) {
      trailPoints[i].age++;
    }
    if (!isMoving && trailPoints.length > 0) {
      trailPoints.pop();
    }

    // 2. Atualizar e Desenhar Partículas de Faíscas
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
