"use strict";

// ===== globals =====
const isMobile = window.matchMedia("(max-width: 1023px)");
const eventsTrigger = ["pageshow", "scroll"];

// ===== init =====
const init = () => {
  // # #
  console.clear();
  // # app height
  appHeight();
  // # init year
  initYear();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 0,
    elements_selector: ".lazy",
  });
};

// ===== lenis =====
if (!window.lenis) {
  window.lenis = new Lenis({
    duration: 1.0,
    easing: t => t * (2 - t),
    smooth: true,
    mouseMultiplier: 1.0,
    smoothTouch: true,
    touchMultiplier: 1.5,
    infinite: false,
    direction: "vertical",
    gestureDirection: "vertical",
  });
  function raf(t) {
    window.lenis.raf(t);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  const menuH = Math.max(doc.clientHeight, window.innerHeight || 0);

  if (!isMobile.matches) return;

  doc.style.setProperty("--app-height", `${doc.clientHeight}px`);
  doc.style.setProperty("--menu-height", `${menuH}px`);
};
window.addEventListener("resize", appHeight);

// ===== href fadeout =====
document.addEventListener("click", (evt) => {
  const link = evt.target.closest(
    'a:not([href^="#"]):not([target]):not([href^="mailto"]):not([href^="tel"])'
  );
  if (!link) return;

  evt.preventDefault();
  const url = link.getAttribute("href");

  if (url && url !== "") {
    const idx = url.indexOf("#");
    const hash = idx !== -1 ? url.substring(idx) : "";

    if (hash && hash !== "#") {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return false;
        }
      } catch (err) {
        console.error("Invalid hash selector:", hash, err);
      }
    }

    document.body.classList.add("fadeout");
    setTimeout(function () {
      window.location = url;
    }, 500);
  }

  return false;
});

// ===== init year =====
const initYear = () => {
  const years = document.querySelectorAll("[data-years]");
  years.forEach((n) => {
    n.textContent = new Date().getFullYear();
  });
};

// ===== menu =====
const [overlay, menu, menuTogglers] = [
  document.querySelector("[data-header-overlay]"),
  document.querySelector("[data-header-menu]"),
  document.querySelectorAll("[data-header-toggler]"),
];

const detectOverlay = (detect) => {
  if (detect) {
    overlay.classList.add("--show");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("--show");
    document.body.style.removeProperty("overflow");
  }
};

const toggleMenu = () => {
  if (menu.classList.contains("--show")) {
    menu.classList.remove("--show");
    detectOverlay(false);
  } else {
    menu.classList.add("--show");
    detectOverlay(true);
  }
};

menuTogglers.forEach((btn) => btn.addEventListener("click", toggleMenu));
overlay.addEventListener("click", () => {
  toggleMenu();
  detectOverlay(false);
});

// ===== scroll fade in/out =====
const fadeInArray = document.querySelectorAll("[data-fadein]");
const initFadeIn = () => {
  for (let i = 0; i < fadeInArray.length; i++) {
    let elem = fadeInArray[i];
    let distInView =
      elem.getBoundingClientRect().top - window.innerHeight + 100;
    elem.classList.toggle("--show", distInView < 0);
  }
};
eventsTrigger.forEach((evt) => {
  window.addEventListener(evt, initFadeIn);
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);
