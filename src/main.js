// Main JavaScript file
console.log('Meme website loaded!');

// Detect if device is touch-enabled
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Add sparkle effect on click
document.addEventListener('DOMContentLoaded', () => {
  const memeImage = document.querySelector('.meme-image');
  const container = document.querySelector('.container');
  
  // Create sparkle effect
  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '6px';
    sparkle.style.height = '6px';
    sparkle.style.backgroundColor = '#fff';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
    sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
    sparkle.style.zIndex = '1000';
    container.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 600);
  }
  
  // Get coordinates from event (works for both mouse and touch)
  function getEventCoordinates(e) {
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
  
  // Add sparkle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkle {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: scale(2) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add click/touch effect
  let lastSparkleTime = 0;
  function handleSparkle(e) {
    // Prevent double-firing on mobile (both click and touchend)
    const currentTime = Date.now();
    if (currentTime - lastSparkleTime < 300) {
      return;
    }
    lastSparkleTime = currentTime;
    
    const coords = getEventCoordinates(e);
    const containerRect = container.getBoundingClientRect();
    const x = coords.x - containerRect.left;
    const y = coords.y - containerRect.top;
    
    // Create multiple sparkles (fewer on mobile for performance)
    const sparkleCount = isTouchDevice ? 6 : 8;
    for (let i = 0; i < sparkleCount; i++) {
      setTimeout(() => {
        const angle = (Math.PI * 2 * i) / sparkleCount;
        const distance = isTouchDevice ? 25 : 30;
        createSparkle(
          x + Math.cos(angle) * distance,
          y + Math.sin(angle) * distance
        );
      }, i * 30);
    }
  }
  
  // Touch event handling for mobile
  let touchStartTime = 0;
  let lastTap = 0;
  
  if (isTouchDevice) {
    // Handle touch start
    memeImage.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      memeImage.style.transition = 'transform 0.1s ease';
      memeImage.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    // Handle touch end - sparkle and double tap detection
    memeImage.addEventListener('touchend', (e) => {
      const touchEndTime = Date.now();
      const tapDuration = touchEndTime - touchStartTime;
      
      // Touch feedback reset
      setTimeout(() => {
        memeImage.style.transform = '';
        memeImage.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      }, 100);
      
      // Single tap - sparkle effect
      if (tapDuration < 300) {
        const timeSinceLastTap = touchEndTime - lastTap;
        
        // Check for double tap
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          // Double tap - shake animation
          e.preventDefault();
          memeImage.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            memeImage.style.animation = '';
          }, 500);
          lastTap = 0;
        } else {
          // Single tap - sparkle
          handleSparkle(e);
          lastTap = touchEndTime;
        }
      }
    }, { passive: false });
  } else {
    // Desktop: click for sparkle and double click for shake
    let lastClick = 0;
    memeImage.addEventListener('click', (e) => {
      const currentTime = Date.now();
      const clickLength = currentTime - lastClick;
      
      if (clickLength < 300 && clickLength > 0) {
        // Double click - shake animation
        memeImage.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          memeImage.style.animation = '';
        }, 500);
      } else {
        // Single click - sparkle
        handleSparkle(e);
      }
      lastClick = currentTime;
    });
  }
  
  // Add mouse move parallax effect (desktop only)
  if (!isTouchDevice) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / 25;
      const moveY = (y - centerY) / 25;
      
      memeImage.style.transform = `translate(${moveX}px, ${moveY - 10}px) rotate(${moveX / 8}deg) scale(1.03)`;
      memeImage.style.transition = 'transform 0.1s ease-out';
    });
    
    container.addEventListener('mouseleave', () => {
      memeImage.style.transform = '';
      memeImage.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
  }
  
  // Add shake animation
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent += `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px) rotate(-2deg); }
      75% { transform: translateX(10px) rotate(2deg); }
    }
  `;
  document.head.appendChild(shakeStyle);
  
  // Prevent image drag
  memeImage.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
});

