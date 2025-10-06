document.addEventListener('DOMContentLoaded', function() {
  // Add animation to timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length > 0) {
    timelineItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 200 * (index + 1));
    });
  }

  // Add hover effects to project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  if (projectCards.length > 0) {
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      });
    });
  }

  // Add typing effect to the introduction
  const introText = document.querySelector('h2#giới-thiệu + p');
  
  if (introText) {
    const text = introText.textContent;
    introText.textContent = '';
    introText.style.borderRight = '2px solid var(--color-primary)';
    
    let charIndex = 0;
    const typingSpeed = 30; // milliseconds per character
    
    function typeText() {
      if (charIndex < text.length) {
        introText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, typingSpeed);
      } else {
        introText.style.borderRight = 'none';
      }
    }
    
    // Start the typing effect with a small delay
    setTimeout(typeText, 500);
  }
});
