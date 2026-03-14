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
    icon.alt = formatTextField(relic.name) + " icon";

    const name = document.createElement("h3");
    name.textContent = formatTextField(relic.name);

    const desc = document.createElement("p");
    desc.textContent = formatTextField(relic.description);

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(desc);

    list.appendChild(card);
  });
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
