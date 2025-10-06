document.addEventListener('DOMContentLoaded', function() {
  // Add animations to timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  timelineItems.forEach(item => {
    observer.observe(item);
  });
  
  // Add animations to project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  projectCards.forEach(card => {
    projectObserver.observe(card);
  });
});
