/**
 * SABORES DO NORTE — SCRIPT PRINCIPAL & INTERAÇÕES
 * Interações da Dobra 02 (Nossa Essência), Revelação ao Scroll e Utilitários
 */

(function () {
  'use strict';

  // 1. Interação dos Cards da Dobra 02 (Nossa Essência)
  function initEssenceCards() {
    const grid = document.querySelector('.essence-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.essence-card');

    cards.forEach(card => {
      // Ao clicar ou passar o mouse, seleciona o card
      card.addEventListener('mouseenter', () => selectCard(card));
      card.addEventListener('click', () => selectCard(card));
    });

    function selectCard(selectedCard) {
      grid.classList.add('has-selected');
      cards.forEach(c => {
        if (c === selectedCard) {
          c.classList.add('is-selected');
        } else {
          c.classList.remove('is-selected');
        }
      });
    }

    // Ao retirar o mouse do grid inteiro, pode manter o primeiro ou limpar
    grid.addEventListener('mouseleave', () => {
      // Mantém o primeiro ou o que estiver em foco para estabilidade visual
    });

    // Inicia com o primeiro selecionado
    if (cards.length > 0) {
      selectCard(cards[0]);
    }
  }

  // 2. Animação de Revelação ao Rolar a Página (Intersection Observer)
  function initScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll, .stagger-group');
    
    if (!('IntersectionObserver' in window) || elementsToReveal.length === 0) {
      elementsToReveal.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));
  }

  // 3. Atualização Dinâmica do Ano do Copyright
  function updateCopyrightYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // 4. Pausa de vídeos fora da viewport para economia de bateria e performance
  function initVideoPerformance() {
    const videos = document.querySelectorAll('video');
    if (!('IntersectionObserver' in window) || videos.length === 0) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused && video.hasAttribute('autoplay')) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.2 });

    videos.forEach(v => videoObserver.observe(v));
  }

  // Inicialização Geral
  document.addEventListener('DOMContentLoaded', function () {
    initEssenceCards();
    initScrollReveal();
    updateCopyrightYear();
    initVideoPerformance();
  });

})();
