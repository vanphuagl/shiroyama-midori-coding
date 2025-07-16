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
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: true,
    mouseMultiplier: 1,
    touchMultiplier: 1.5,
    autoRaf: true,
    infinite: false,
    direction: "vertical",
    gestureDirection: "vertical",
  });
  function raf(t) {
    window.lenis.raf(t);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // # back to top
  const handleBacktoTop = () => {
    window.lenis.scrollTo(0, {
      duration: 1.5,
      easing: (t) => t * t * t * (t * (t * 6 - 15) + 10),
      force: true,
    });
  };
  document.querySelectorAll("[data-backtotop]")?.forEach((e) => {
    e.addEventListener("click", handleBacktoTop);
  });
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

// ===== scroll logo shrink =====
const handleHeaderLogo = () => {
  const headerLogo = document.querySelector("[data-header-shrink]");
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  if (!headerLogo) return;

  headerLogo.classList.toggle("--shrink", scrollPosition > 80);
};
window.addEventListener("scroll", handleHeaderLogo);

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

// ===== hide reservation =====
const [reservation, footer] = [
  document.querySelector("[data-reservation]"),
  document.querySelector("[data-footer]"),
];
const handleReservation = () => {
  const footerInView = footer.offsetTop;
  if (!reservation || !isMobile.matches) return;
  reservation?.classList.toggle(
    "--hidden",
    window.scrollY + window.innerHeight >= footerInView
  );
};
eventsTrigger.forEach((evt) => {
  window.addEventListener(evt, handleReservation);
});

// ===== clone slides when < 4 =====
const cloneSlidesIfNeeded = (swiperSelector, minSlidesRequired = 4) => {
  const swiperWrapper = document.querySelector(
    `${swiperSelector} .swiper-wrapper`
  );
  if (!swiperWrapper) return;
  const slides = swiperWrapper.querySelectorAll(".swiper-slide");
  if (slides.length >= minSlidesRequired) return;
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    const source = clone.querySelector("source");
    if (source && source.dataset.srcset) {
      source.srcset = source.dataset.srcset;
    }
    swiperWrapper.appendChild(clone);
  });
};

// ===== about page =====
// cloneSlidesIfNeeded("[data-about-archive-swiper]");
const aboutArchiveSwiper = new Swiper("[data-about-archive-swiper]", {
  initialSlide: 1,
  centeredSlides: true,
  // loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  speed: 1000,
  breakpoints: {
    0: {
      slidesPerView: 1.26,
      spaceBetween: 20,
      allowTouchMove: true,
      draggable: true,
    },
    1024: {
      slidesPerView: 1.815,
      spaceBetween: 30,
      allowTouchMove: false,
      draggable: false,
    },
  },
});

// ===== education page =====
const educationBasicSwiper = new Swiper("[data-education-basic-swiper]", {
  initialSlide: 1,
  centeredSlides: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  speed: 1000,
  breakpoints: {
    0: {
      slidesPerView: 1.26,
      spaceBetween: 20,
      allowTouchMove: true,
      draggable: true,
    },
    1024: {
      slidesPerView: 1.725,
      spaceBetween: 30,
      allowTouchMove: false,
      draggable: false,
    },
  },
});

// ===== daily page =====
const dailySwiper = new Swiper("[data-daily-swiper]", {
  speed: 1000,
  breakpoints: {
    0: {
      initialSlide: 1,
      centeredSlides: true,
      slidesPerView: 1.26,
      spaceBetween: 20,
      allowTouchMove: true,
      draggable: true,
    },
    1024: {
      initialSlide: 0,
      centeredSlides: false,
      slidesPerView: 3,
      spaceBetween: 35,
      allowTouchMove: false,
      draggable: false,
    },
  },
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);
