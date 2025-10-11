// Custom JavaScript for blog

document.addEventListener('DOMContentLoaded', function() {
  // Add copy button to code blocks
  addCodeCopyButtons();
  
  // Add reading progress bar
  addReadingProgressBar();
  
  // Toggle table of contents on mobile
  setupTocToggle();
  
  // Add scroll to top button
  addScrollToTopButton();
  
  // Initialize syntax highlighting
  highlightCodeBlocks();
  
  // Add image lightbox
  setupImageLightbox();
  
  // Initialize Table of Contents scroll spy
  initTocScrollSpy();
});

// Add copy button to code blocks
function addCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre > code');
  
  if (codeBlocks.length === 0) return;
  
  codeBlocks.forEach(function(codeBlock) {
    const pre = codeBlock.parentNode;
    
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.innerHTML = '<i class="far fa-copy"></i>';
    copyButton.setAttribute('aria-label', 'Copy code');
    copyButton.setAttribute('title', 'Copy code');
    
    // Add to pre element
    pre.appendChild(copyButton);
    
    // Add click event
    copyButton.addEventListener('click', function() {
      const code = codeBlock.textContent;
      
      navigator.clipboard.writeText(code).then(function() {
        // Success feedback
        copyButton.innerHTML = '<i class="fas fa-check"></i>';
        copyButton.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(function() {
          copyButton.innerHTML = '<i class="far fa-copy"></i>';
          copyButton.classList.remove('copied');
        }, 2000);
      }).catch(function(err) {
        console.error('Failed to copy code: ', err);
      });
    });
  });
}

// Add reading progress bar
function addReadingProgressBar() {
  // Only add on post pages
  const article = document.querySelector('.post-single');
  if (!article) return;
  
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Calculate scroll percentage
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    // Update progress bar width
    progressBar.style.width = scrollPercent + '%';
  });
}

// Toggle table of contents on mobile
function setupTocToggle() {
  const tocTitle = document.querySelector('.post-toc-title');
  const tocContent = document.querySelector('.post-toc-content');
  const tocDropdownBtn = document.querySelector('.toc-dropdown-btn');
  
  if (!tocTitle || !tocContent || !tocDropdownBtn) return;
  
  // Add click event
  tocTitle.addEventListener('click', function() {
    tocContent.classList.toggle('collapsed');
    tocDropdownBtn.classList.toggle('active');
  });
}

// Add scroll to top button
function addScrollToTopButton() {
  // Create button
  const scrollButton = document.createElement('button');
  scrollButton.className = 'scroll-to-top';
  scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollButton.setAttribute('aria-label', 'Scroll to top');
  scrollButton.setAttribute('title', 'Scroll to top');
  
  // Add to document
  document.body.appendChild(scrollButton);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  });
  
  // Add click event
  scrollButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Highlight code blocks
function highlightCodeBlocks() {
  // This function assumes you're using the built-in syntax highlighting
  // Add language badge to pre blocks
  const preBlocks = document.querySelectorAll('pre');
  
  preBlocks.forEach(function(pre) {
    const code = pre.querySelector('code');
    
    if (code && code.className) {
      // Extract language from class
      const languageMatch = code.className.match(/language-(\w+)/);
      
      if (languageMatch && languageMatch[1]) {
        const language = languageMatch[1];
        pre.setAttribute('data-language', language);
      }
    }
  });
}

// Setup image lightbox
function setupImageLightbox() {
  // Only process content images
  const contentImages = document.querySelectorAll('.post-content img');
  
  if (contentImages.length === 0) return;
  
  contentImages.forEach(function(img) {
    // Skip images that are already in a figure or have class to skip
    if (img.parentNode.tagName === 'FIGURE' || img.classList.contains('no-lightbox')) {
      return;
    }
    
    // Make image clickable
    img.style.cursor = 'pointer';
    
    // Add click event
    img.addEventListener('click', function() {
      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'image-lightbox';
      
      // Create lightbox content
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close">&times;</button>
          <img src="${img.src}" alt="${img.alt || ''}">
          ${img.alt ? `<div class="lightbox-caption">${img.alt}</div>` : ''}
        </div>
      `;
      
      // Add to document
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Add click event to close
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }
      });
    });
  });
}

// Initialize Table of Contents scroll spy
function initTocScrollSpy() {
  // Get TOC links and content headings
  const tocLinks = document.querySelectorAll('.post-toc-content a, .sidebar-toc-content a');
  if (tocLinks.length === 0) return;
  
  // Get all headings in the content
  const headings = document.querySelectorAll('.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id], .post-content h5[id], .post-content h6[id]');
  if (headings.length === 0) return;
  
  // Create an array of heading positions
  let headingPositions = [];
  
  function updateHeadingPositions() {
    headingPositions = Array.from(headings).map(function(heading) {
      return {
        id: heading.id,
        top: heading.getBoundingClientRect().top + window.scrollY,
        element: heading
      };
    });
  }
  
  // Initial calculation
  updateHeadingPositions();
  
  // Recalculate on window resize
  window.addEventListener('resize', updateHeadingPositions);
  
  // Function to update active TOC link
  function updateActiveTocLink() {
    const scrollPosition = window.scrollY + 100; // Offset for better UX
    
    // Find the current heading
    let currentHeading = null;
    
    for (let i = headingPositions.length - 1; i >= 0; i--) {
      if (scrollPosition >= headingPositions[i].top) {
        currentHeading = headingPositions[i];
        break;
      }
    }
    
    // Remove all active classes
    tocLinks.forEach(function(link) {
      link.classList.remove('active');
    });
    
    // Add active class to current heading's link
    if (currentHeading) {
      tocLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href && href.includes('#' + currentHeading.id)) {
          link.classList.add('active');
          
          // Auto-scroll TOC to show active item
          const tocContent = link.closest('.post-toc-content, .sidebar-toc-content');
          if (tocContent) {
            const linkTop = link.offsetTop;
            const linkHeight = link.offsetHeight;
            const containerHeight = tocContent.clientHeight;
            const scrollTop = tocContent.scrollTop;
            
            // Scroll if link is not fully visible
            if (linkTop < scrollTop || linkTop + linkHeight > scrollTop + containerHeight) {
              tocContent.scrollTo({
                top: linkTop - containerHeight / 2 + linkHeight / 2,
                behavior: 'smooth'
              });
            }
          }
        }
      });
    }
  }
  
  // Update on scroll with throttling for performance
  let isScrolling = false;
  
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        updateActiveTocLink();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  
  // Initial update
  updateActiveTocLink();
  
  // Smooth scroll when clicking TOC links
  tocLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const href = this.getAttribute('href');
      if (!href || !href.includes('#')) return;
      
      const targetId = href.split('#')[1];
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}





