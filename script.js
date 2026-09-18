(function () {
  "use strict";

  var splash = document.getElementById("splash");
  if (!splash) return;

  var video = document.getElementById("splash-video");
  var body = document.body;
  var closed = false;

  function closeSplash() {
    if (closed) return;
    closed = true;
    splash.classList.add("is-hidden");
    body.style.overflow = "";
    window.clearTimeout(safetyTimer);
    // Fully remove after the fade transition so it never blocks input.
    window.setTimeout(function () {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, 750);
  }

  // Respect reduced-motion preference: skip the video, show briefly, move on.
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  body.style.overflow = "hidden";

  // A safety timer guarantees the splash never traps a visitor if the
  // video fails to load or autoplay is blocked by the browser.
  var safetyTimer = window.setTimeout(closeSplash, 7000);

  if (prefersReducedMotion || !video) {
    window.setTimeout(closeSplash, 1200);
  } else {
    var isSmallScreen = window.matchMedia("(max-width: 820px)").matches;
    var src = isSmallScreen
      ? "assets/video/splash-mobile.mp4"
      : "assets/video/splash-desktop.mp4";

    video.src = src;
    video.addEventListener("ended", closeSplash);
    video.addEventListener("error", closeSplash);

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(closeSplash);
    }
  }
})();
