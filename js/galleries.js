/**
 * SABORES DO NORTE — GALERIAS INTERATIVAS COM EFEITO DE PROFUNDIDADE
 * Utilizado na Dobra 05 (Nossos Pratos Reais) e Dobra 09 (Nosso Espaço)
 */

(function () {
  'use strict';

  function createDepthGallery(containerSelector, options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.gallery-slide'));
    const prevBtn = container.querySelector('.gallery-prev');
    const nextBtn = container.querySelector('.gallery-next');
    const dotsContainer = container.querySelector('.gallery-dots');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    const total = slides.length;

    // Criação dos dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `gallery-dot ${idx === 0 ? 'is-active' : ''}`;
        dot.setAttribute('aria-label', `Ir para foto ${idx + 1}`);
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlides() {
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery-dot') : [];

      slides.forEach((slide, idx) => {
        slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');

        if (idx === currentIndex) {
          slide.classList.add('is-active');
        } else if (idx === (currentIndex - 1 + total) % total) {
          slide.classList.add('is-prev');
        } else if (idx === (currentIndex + 1) % total) {
          slide.classList.add('is-next');
        } else {
          slide.classList.add('is-hidden');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }

    function goToSlide(index) {
      currentIndex = (index + total) % total;
      updateSlides();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Eventos de clique nas setas
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Clique direto no slide adjacente para selecioná-lo
    slides.forEach((slide, idx) => {
      slide.addEventListener('click', () => {
        if (idx !== currentIndex) {
          goToSlide(idx);
        }
      });
    });

    // Suporte a Swipe / Toque no Celular
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        nextSlide();
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
      }
    }

    // Inicialização
    updateSlides();
  }

  // Inicializa quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', function () {
    createDepthGallery('#dishes-gallery');
    createDepthGallery('#space-gallery');
  });

})();
