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
      if (textIndex < texts.length - 1) {
        setTimeout(() => {
          element.textContent = ""; // clear for next sentence
          textIndex++;
          charIndex = 0;
          type();
        }, pause);
      } else {
        // ✅ Finished typing all sentences
        setTimeout(() => {
          element.classList.add("fade-out"); // fade text
          setTimeout(() => {
            document.body.classList.add("finished"); // fade background
          }, fadeDelay);
        }, pause);
      }
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
    character.style.transform = `translateY(${-clampedScrollY * 0.35}px)`;
  }
});

// Screenshot Carousel
let currentSlide = 0;
let screenshots = [];

async function loadScreenshots() {
  // Try to fetch directory listing (requires server support)
  try {
    const response = await fetch('/starcatcher/images/screenshots/');
    const html = await response.text();
    
    // Parse HTML for image files
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');
    
    screenshots = Array.from(links)
      .map(link => link.href)
      .filter(href => /\.(jpg|jpeg|png|gif|webp)$/i.test(href))
      .sort();
    
    if (screenshots.length === 0) {
      throw new Error('No images found via directory listing');
    }
  } catch (err) {
    console.log('Directory listing failed, using fallback method...');
    // Fallback: Try common image patterns
    const commonFiles = [
      'Screenshot_1.jpg',
      'Screenshot_2.jpg',
      'Screenshot_3.jpg',
      'Screenshot_4.jpg',
      'Screenshot_5.jpg',
      'Screenshot_Delirium.jpg',
      'Screenshot_1.png',
      'Screenshot_2.png',
      'Screenshot_3.png',
      'Screenshot_4.png',
      'Screenshot_5.png'
    ];
    
    // Check which files exist
    for (const file of commonFiles) {
      try {
        const response = await fetch(`/starcatcher/images/screenshots/${file}`, { method: 'HEAD' });
        if (response.ok) {
          screenshots.push(`/starcatcher/images/screenshots/${file}`);
        }
      } catch (e) {
        // File doesn't exist, continue
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
    
    // Add dot
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    carouselDots.appendChild(dot);
  });
  
  // Setup button listeners
  document.getElementById('carousel-prev').addEventListener('click', prevSlide);
  document.getElementById('carousel-next').addEventListener('click', nextSlide);
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

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

// Load screenshots when page loads
window.addEventListener('DOMContentLoaded', loadScreenshots);


