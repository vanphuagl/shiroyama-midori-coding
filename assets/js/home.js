const breakpoints = window.matchMedia("(max-width: 1023px)");

// ===== init =====
const homepage = () => {
  // #
  ScrollTrigger.clearScrollMemory("manual");
  ScrollTrigger.refresh();
  // # init loading
  initLoading();
};

// ===== lenis =====
let isLoading = true;
window.lenis = new Lenis({
  duration: 1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  smoothTouch: false,
  mouseMultiplier: 1,
  touchMultiplier: 1.5,
  autoRaf: true,
  infinite: false,
});
window.lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
function raf(t) {
  if (!isLoading) {
    window.lenis.raf(t);
  } else {
    window.lenis.scrollTo(0, { immediate: true });
  }
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== init loading =====
const preventScroll = (e) => e.preventDefault();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initLoading = async () => {
  if (sessionStorage.getItem("opening-displayed") === "true") {
    document.querySelector("[data-loading]").remove();
    swiperFv.autoplay.start();
    isLoading = false;
  } else {
    // # Block scroll events
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });

    // # step 1 -- fadein logo
    await delay(300);
    document.querySelector("[data-loading-logo]").classList.add("--show");

    // # step 2 -- fadeout background
    await delay(1500);
    document.querySelector("[data-loading]").classList.add("--done");

    // # Unblock scroll events
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("scroll", preventScroll);
    isLoading = false;

    // # play swiper fv
    swiperFv.autoplay.start();

    // # set sessionStorage
    sessionStorage.setItem("opening-displayed", !0);
  }
};

// ===== scroll logo shrink =====
const handleHeaderLogo = function () {
  const headerLogo = document.querySelector("[data-header-logo]");
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  if (!headerLogo || breakpoints.matches) return;

  headerLogo.classList.toggle("--shrink", scrollPosition > 80);
};
window.addEventListener("scroll", handleHeaderLogo);

// ===== init header =====
const handleHeaderNavbar = () => {
  const scrollY = window.scrollY;
  const navbar = document.querySelector("[data-header-navbar]");
  const hSize =
    document.querySelector("[data-offset-top]")?.getBoundingClientRect().top +
    scrollY;

  navbar.classList.toggle("--black", scrollY > hSize);
};

"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, handleHeaderNavbar);
});

// ===== fv =====
const swiperFv = new Swiper("[data-fv-swiper]", {
  effect: "fade",
  speed: 2500,
  allowTouchMove: false,
  draggable: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  on: {
    init: function () {
      this.autoplay.stop();
    },
  },
});

// # scrollTrigger fv-content
gsap.registerPlugin(ScrollTrigger);
const handleFvContent = () => {
  const fvContent = document.querySelector("[data-fv-content]");
  if (breakpoints.matches) return;
  gsap.to(fvContent, {
    y: "-50%",
    ease: "none",
    scrollTrigger: {
      trigger: "[data-fv]",
      start: "top top",
      end: () => "+=" + window.innerHeight * 2,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const fadeStart = 0.3;
        if (p < fadeStart) {
          fvContent.style.opacity = 0;
        } else {
          fvContent.style.opacity = 1;
        }
      },
    },
  });
};
"pageshow change".split(" ").forEach((evt) => {
  window.addEventListener(evt, handleFvContent);
});
window.addEventListener("resize", () => ScrollTrigger.refresh());

// # scroll overlay swiper
const handleFvOverlay = () => {
  const [overlay, content] = [
    document.querySelector("[data-fv-overlay]"),
    document.querySelector("[data-fv-content]"),
  ];
  if (breakpoints.matches) return;
  let cal = content.getBoundingClientRect().top + window.scrollY;
  let value = window.scrollY / cal;
  overlay.style.opacity = Math.min(Math.max(value, 0), 0.8);
};

"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, handleFvOverlay);
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", homepage);
