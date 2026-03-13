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
