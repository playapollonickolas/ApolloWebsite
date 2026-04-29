function typeWriterEffect(elementId, texts, speed = 100, pause = 1000, fadeDelay = 2000) {
  const element = document.getElementById(elementId);
  let textIndex = 0;
  let charIndex = 0;

    function type() {
    if (charIndex < texts[textIndex].length) {
      element.textContent += texts[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, speed);
    } else {
      setTimeout(() => {
        element.textContent = "";
        textIndex = (textIndex + 1) % texts.length; // loops back to 0
        charIndex = 0;
        type();
      }, pause);
    }
  }

  type();
}

typeWriterEffect("typewriter", [
  "Star God, heed my wish...",
  "Destroy my enemies,",
  "And thou shall be my existence..."
], 100, 1500);

function formatTextField(field) {
  if (Array.isArray(field)) return field[0] || "";
  if (typeof field === "string") return field;
  return "";
}


function renderRelics(relics) {
  const list = document.getElementById("relic-list");
  if (!list) return;

  relics.forEach(relic => {
    const card = document.createElement("div");
    card.className = "relic-card";

    const icon = document.createElement("img");
    icon.className = "relic-icon";
    icon.src = relic.icon;
    icon.alt = relic.name[0] + " icon"; // use first name as alt

    const name = document.createElement("h3");
    name.textContent = relic.name[0]; // pick first language or handle dynamically

    const desc = document.createElement("p");
    // Format description with values
    const formattedDescriptions = formatDescription(relic.description, relic.values);
    desc.textContent = formattedDescriptions[0]; // pick first language for now

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(desc);

    list.appendChild(card);
  });
}

function formatDescription(descArray, values) {
  const valueString = values.join("/");
  return descArray.map(desc => desc.replace("&value", valueString));
}


fetch("relics.json")
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data)) {
      renderRelics(data);
    } else {
      console.warn("Expected relics.json as array", data);
    }
  })
  .catch(err => {
    console.error("Failed to load relics.json", err);
  });


window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = window.innerHeight * 1.5; // Clamp scroll to 1.5x viewport height
  const clampedScrollY = Math.min(scrollY, maxScroll);
  
  // Background moves slower (parallax effect)
  const background = document.querySelector('.background');
  if (background) {
    background.style.transform = `translateY(${-clampedScrollY * 0.15}px)`;
  }

  // Character moves at medium speed (parallax effect)
  const character = document.querySelector('.character');
  if (character) {
    character.style.transform = `translateY(${-clampedScrollY * 0.375}px)`;
  }
});

let currentSlide = 0;
let screenshots = [];
let autoPlayInterval = null;
const AUTO_PLAY_DELAY = 5000; // 4 seconds between slides

async function loadScreenshots() {
  // For static hosting (GitHub Pages, etc.), directly try to load known screenshot files
  const commonFiles = [
    'Screenshot_1.jpg',
    'Screenshot_2.jpg',
    'Screenshot_3.jpg',
    'Screenshot_Hysteria.png',
    'Screenshot_4.jpg',
    'Screenshot_5.jpg',
    'Screenshot_5.png',
    'Screenshot_Delirium.png'
  ];
  
  // Try both absolute and relative paths
  const pathPrefixes = [
    './starcatcher/images/screenshots/',  // Relative from root   
  ];
  
  // Try to load each file - add it to screenshots if the image loads successfully
  for (const file of commonFiles) {
    for (const prefix of pathPrefixes) {
      const src = prefix + file;
      try {
        // Attempt to load the image
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
        screenshots.push(src);
        console.log(`Loaded screenshot: ${src}`);
        break; // Move to next file if this one loaded
      } catch (e) {
        // Image didn't load, try next path prefix
        console.log(`Skipped ${src} (not found or failed to load)`);
      }
    }
  }
  
  if (screenshots.length > 0) {
    initCarousel();
  } else {
    console.warn('No screenshots found');
  }
}

function initCarousel() {
  const carouselInner = document.getElementById('carousel-inner');
  const carouselDots = document.getElementById('carousel-dots');
  
  // Clear existing content
  carouselInner.innerHTML = '';
  carouselDots.innerHTML = '';
  
  // Add carousel items
  screenshots.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Screenshot ${index + 1}`;
    
    item.appendChild(img);
    carouselInner.appendChild(item);
    
    // Add star icon button for this slide
    const dot = document.createElement('img');
    // use absolute path (works when site is served from root)
    dot.src = '/starcatcher/images/icons/starIcon.png';
    dot.alt = `Select slide ${index + 1}`;
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => goToSlide(index));
    carouselDots.appendChild(dot);
  });
  
  // Setup button listeners
  document.getElementById('carousel-prev').addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
  document.getElementById('carousel-next').addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
  
  // Start auto-play
  startAutoPlay();
}

function showSlide(index) {
  const items = document.querySelectorAll('.carousel-item');
  const dots = document.querySelectorAll('.dot');
  
  items.forEach(item => item.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if (items[index]) {
    items[index].classList.add('active');
  }
  if (dots[index]) {
    dots[index].classList.add('active');
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % screenshots.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + screenshots.length) % screenshots.length;
  showSlide(currentSlide);
}

function startAutoPlay() {
  if (screenshots.length <= 1) return; // Don't auto-play if only 1 slide
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  
  autoPlayInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % screenshots.length;
    showSlide(currentSlide);
  }, AUTO_PLAY_DELAY);
}

function resetAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  startAutoPlay();
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
  resetAutoPlay();
}

// Load screenshots when page loads
loadScreenshots();


