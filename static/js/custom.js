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
  
  // Setup active section highlighting in sidebar TOC
  setupActiveTocHighlighting();
}

// Highlight active section in TOC
function setupActiveTocHighlighting() {
  const article = document.querySelector('.post-single');
  if (!article) return;
  
  const headings = Array.from(document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4'));
  const tocLinks = document.querySelectorAll('.sidebar-toc-content a');
  
  if (headings.length === 0 || tocLinks.length === 0) return;
  
  // Create an array of section positions
  const sectionPositions = headings.map(heading => {
    return {
      id: heading.id,
      top: heading.offsetTop - 100,
      element: heading
    };
  });
  
  // Add visible indicators to headings when in viewport
  const addHeadingIndicator = () => {
    headings.forEach(heading => {
      if (!heading.querySelector('.heading-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'heading-indicator';
        indicator.style.display = 'none';
        heading.appendChild(indicator);
      }
    });
  };
  
  addHeadingIndicator();
  
  // Update active section on scroll with smooth animation
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Find the current section
    let currentSection = sectionPositions[0]?.id;
    let currentHeading = null;
    
    for (let i = 0; i < sectionPositions.length; i++) {
      if (scrollPosition >= sectionPositions[i].top) {
        currentSection = sectionPositions[i].id;
        currentHeading = sectionPositions[i].element;
      } else {
        break;
      }
    }
    
    // Hide all indicators first
    document.querySelectorAll('.heading-indicator').forEach(indicator => {
      indicator.style.display = 'none';
    });
    
    // Show indicator for current heading
    if (currentHeading && currentHeading.querySelector('.heading-indicator')) {
      currentHeading.querySelector('.heading-indicator').style.display = 'inline-block';
    }
    
    // Update active class with smooth transition
    tocLinks.forEach(link => {
      link.classList.remove('active');
      
      // Get href without hash
      const href = link.getAttribute('href').substring(1);
      
      if (href === currentSection) {
        link.classList.add('active');
        
        // Ensure the active item is visible in the sidebar by scrolling if needed
        const sidebar = document.querySelector('.sidebar-toc-content');
        if (sidebar) {
          const linkTop = link.offsetTop;
          const sidebarScrollTop = sidebar.scrollTop;
          const sidebarHeight = sidebar.offsetHeight;
          
          if (linkTop < sidebarScrollTop || linkTop > sidebarScrollTop + sidebarHeight) {
            sidebar.scrollTo({
              top: linkTop - sidebarHeight / 2,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });
  
  // Add click event to TOC links for smooth scrolling
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
  
  // Trigger scroll event on page load
  window.dispatchEvent(new Event('scroll'));
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

