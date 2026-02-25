// --- App Bar Scroll to Top ---
const downloadBtn = document.getElementById('nav-download-btn');
downloadBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Phone Frame Animation ---
const phoneFrame = document.getElementById('phone-frame');
const totalFrames = 255;
let currentFrame = 1;

// Preload the next few frames to avoid flickering
const preloadedImages = [];
const preloadCount = 10;
function preloadFrames(startIdx) {
  for (let i = 0; i < preloadCount; i++) {
    let idx = (startIdx + i) % totalFrames;
    if (idx === 0) idx = totalFrames;
    if (!preloadedImages[idx]) {
      const img = new Image();
      const frameNum = String(idx).padStart(3, '0');
      img.src = `assets/frames/ezgif-frame-${frameNum}.jpg`;
      preloadedImages[idx] = img;
    }
  }
}

function updateFrame() {
  currentFrame++;
  if (currentFrame > totalFrames) currentFrame = 1;

  const frameNum = String(currentFrame).padStart(3, '0');
  phoneFrame.src = `assets/frames/ezgif-frame-${frameNum}.jpg`;

  // Preload upcoming frames
  preloadFrames(currentFrame);
}

// Start preload
preloadFrames(1);
// 24 fps approx
setInterval(updateFrame, 41);


// --- Space Saved Progress Animation ---
const spaceCard = document.getElementById('space-saving-card');
const bytesText = document.getElementById('bytes-freed');
const progressBar = document.getElementById('progress-bar-fill');

const animateValue = (element, start, end, duration) => {
  let startTimestamp = null;
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    // Easing function for smoother counter (ease Out)
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * (end - start) + start);

    element.innerHTML = formatBytes(currentVal);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.innerHTML = "2.3 GB";
    }
  };
  window.requestAnimationFrame(step);
};

const targetBytes = 2.3 * 1024 * 1024 * 1024; // 2.3 GB

const spaceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger animations
      progressBar.style.width = '100%';
      animateValue(bytesText, 0, targetBytes, 2000);

      // Unobserve after running once
      spaceObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5 // Trigger when 50% of card is visible
});

if (spaceCard) {
  spaceObserver.observe(spaceCard);
}

// Ensure App Bar gets a slight shadow/glass pop when scrolling down
const appBar = document.getElementById('app-bar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    appBar.classList.add('shadow-xl', 'shadow-pastel-purple/10', 'bg-white/70');
    appBar.classList.remove('bg-glass-bg');
  } else {
    appBar.classList.remove('shadow-xl', 'shadow-pastel-purple/10', 'bg-white/70');
    appBar.classList.add('bg-glass-bg');
  }
});
