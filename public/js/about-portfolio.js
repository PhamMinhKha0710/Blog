// About Portfolio Enhanced Interactions

document.addEventListener('DOMContentLoaded', function() {
  // Smooth reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all content blocks and profile section
  document.querySelectorAll('.content-block, .about-profile-section').forEach(el => {
    fadeInObserver.observe(el);
  });

  // Enhanced tech stack hover with glow effect
  const techItems = document.querySelectorAll('.tech-item');
  techItems.forEach(item => {
    item.addEventListener('mouseenter', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 3D tilt effect for skill cards
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });

  // Avatar parallax on mouse move
  const avatarWrapper = document.querySelector('.profile-avatar-wrapper');
  if (avatarWrapper) {
    document.addEventListener('mousemove', function(e) {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      
      avatarWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
  }

  // Typing animation for tagline (optional enhancement)
  const taglineText = document.querySelector('.tagline-text');
  if (taglineText && taglineText.dataset.animated !== 'true') {
    const originalText = taglineText.textContent;
    taglineText.textContent = '';
    taglineText.dataset.animated = 'true';
    
    let charIndex = 0;
    const typingSpeed = 50;
    
    function typeChar() {
      if (charIndex < originalText.length) {
        taglineText.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      }
    }
    
    setTimeout(() => {
      typeChar();
    }, 500);
  }

  // Stagger animation for tech items
  const techGridItems = document.querySelectorAll('.tech-item');
  techGridItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
  });

  // Add active state tracking for CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect on click
      const ripple = document.createElement('span');
      ripple.classList.add('button-ripple');
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Smooth scroll behavior enhancement
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add scroll progress indicator (optional)
  const progressBar = document.createElement('div');
  progressBar.classList.add('about-scroll-progress');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
});

// Ripple effect styles (injected dynamically)
const style = document.createElement('style');
style.textContent = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(var(--accent-color-rgb), 0.3);
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    animation: ripple-animation 0.6s;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    from {
      opacity: 1;
      transform: scale(0);
    }
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
  
  .button-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    animation: ripple-animation 0.6s;
    pointer-events: none;
  }
  
  .about-scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--accent-color);
    z-index: 9999;
    transition: width 0.1s ease;
  }
`;
document.head.appendChild(style);

