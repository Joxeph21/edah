// src/lib/reveal.ts
// Import once from any section's <script>. Fades in every [data-reveal]
// inside a [data-reveal-section] when that section scrolls into view.
import { animate, inView, stagger } from "motion";

function init() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document
    .querySelectorAll<HTMLElement>("[data-reveal-section]:not([data-bound])")
    .forEach((section) => {
      section.dataset.bound = "true";
      if (reduceMotion) return;

      const items = Array.from(
        section.querySelectorAll<HTMLElement>("[data-reveal]")
      );
      if (!items.length) return;

      const stop = inView(
        section,
        () => {
          animate(
            items,
            { opacity: [0, 1], y: [24, 0] },
            { duration: 0.6, delay: stagger(0.08), ease: "easeOut" }
          );
          stop();
        },
        { margin: "0px 0px -15% 0px" }
      );
    });
}

init();
document.addEventListener("astro:page-load", init);