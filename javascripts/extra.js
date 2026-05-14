// Typing effect for hero subtitle
document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("hero-typing");
  if (!el) return;

  const lines = [
    "TryHackMe · HackTheBox · CTF Events",
    "enumerate · exploit · escalate",
    "hack the planet",
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let pause = false;

  function type() {
    if (pause) {
      pause = false;
      setTimeout(type, 1800);
      return;
    }

    const current = lines[lineIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        pause = true;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }

    setTimeout(type, deleting ? 40 : 70);
  }

  type();
});
