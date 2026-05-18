window.addEventListener("pageshow", function (event) {
  const navEntry = performance.getEntriesByType("navigation")[0];

  const isBackForward =
    event.persisted ||
    (navEntry && navEntry.type === "back_forward") ||
    window.performance.navigation.type === 2;

  if (location.pathname === "/work" && isBackForward) {
    location.reload();
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GSAP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({ nullTargetWarn: false });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lenis
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on("scroll", ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Current Year
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initDynamicCurrentYear() {
  const currentYear = new Date().getFullYear();
  const currentYearElements = document.querySelectorAll("[data-current-year]");
  currentYearElements.forEach((currentYearElement) => {
    currentYearElement.textContent = currentYear;
  });
}

// Initialize Dynamic Current Year
document.addEventListener("DOMContentLoaded", () => {
  initDynamicCurrentYear();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scroll to top
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const footerLogo = document.querySelector(".footer_logo_container");
  if (footerLogo) {
    footerLogo.addEventListener("click", () => {
      if (typeof lenis !== "undefined") {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cursor
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

let xTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
let yTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});

// Cursor Text
document.addEventListener("DOMContentLoaded", () => {
  let cursorItem = document.querySelector(".cursor-text");
  let cursorParagraph = cursorItem.querySelector(".cursor-text-description");
  let targets = document.querySelectorAll("[data-cursor]");
  let xOffset = 6;
  let yOffset = 100;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = "";

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quick.to for a more performative tween on the cursor
  let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  // On mousemove, call the quickTo functions to the actual cursor position
  window.addEventListener("mousemove", (e) => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY; // Adjust cursorY to account for scroll

    // Default offsets
    let xPercent = xOffset;
    let yPercent = yOffset;

    // Adjust X offset if in the rightmost 19% of the window
    if (cursorX > windowWidth * 0.81) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    // Adjust Y offset if in the bottom 10% of the current viewport
    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      let newText = currentTarget.getAttribute("data-cursor");
      if (currentTarget.hasAttribute("data-easteregg") && cursorIsOnRight) {
        newText = currentTarget.getAttribute("data-easteregg");
      }

      if (newText !== lastText) {
        // Only update if the text is different
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    }

    gsap.to(cursorItem, {
      xPercent: xPercent,
      yPercent: yPercent,
      duration: 0.9,
      ease: "power3",
    });
    xTo(cursorX);
    yTo(cursorY - scrollY); // Subtract scroll for viewport positioning
  });

  // Add a mouse enter listener for each link that has a data-cursor attribute
  targets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      currentTarget = target; // Set the current target

      // If element has data-easteregg attribute, load different text
      let newText = target.hasAttribute("data-easteregg")
        ? target.getAttribute("data-easteregg")
        : target.getAttribute("data-cursor");

      // Update only if the text changes
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cursor Text Animation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SplitText.create("#cursorTextDescription", {
  type: "chars, words",
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
  onComplete: () => self.revert(),
});

document.querySelectorAll("[data-cursor]").forEach((el) => {
  // Event-Listener für Hover auf `data-cursor`-Elemente
  el.addEventListener("mouseenter", () => {
    // Hole den Text aus dem `data-cursor`-Attribut
    const cursorText = el.getAttribute("data-cursor");
    const cursorTextContainer = document.querySelector(
      ".cursor-text-description"
    );

    // Setze den Text und teile ihn in einzelne Zeichen auf
    cursorTextContainer.innerHTML = "";
    cursorText.split("").forEach((char) => {
      const span = document.createElement("span");
      span.classList.add("char");
      span.textContent = char;
      cursorTextContainer.appendChild(span);
    });

    // Stagger-Animation für die `.char`-Elemente
    gsap.fromTo(
      ".cursor-text-description .char",
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: { amount: 0.4 },
        ease: "expo.out",
      }
    );
  });

  el.addEventListener("mouseleave", () => {
    // Text ausblenden, wenn der Hover endet
    gsap.to(".cursor-text-description .char", {
      y: -10,
      opacity: 0,
      duration: 0.5,
      stagger: { amount: 0.2 },
      ease: "expo.in",
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Nav Bar Animation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const navBar = gsap
  .from(".g-navbar_wrapper", {
    yPercent: -100,
    paused: true,
    duration: 0.2,
  })
  .progress(1);

// Pfad ohne Query-Parameter oder Hash prüfen
const pathname = window.location.pathname;

// Nur deaktivieren, wenn der Pfad GENAU /work ist (case-sensitive)
if (pathname !== "/work" && pathname !== "/work/") {
  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      self.direction === -1 ? navBar.play() : navBar.reverse();
    },
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hero Animation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let heroHeadline = SplitText.create("#heroHeadline", {
  type: "words",
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
  onComplete: () => self.revert(),
});

let heroCopy = SplitText.create("#heroCopy", {
  type: "lines, words",
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
  onComplete: () => self.revert(),
});

/// wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    if (!sessionStorage.getItem("visited")) {
      // Hero Animation
      let heroAnimation = gsap.timeline();
      heroAnimation.fromTo(
        ".hero_bg",
        {
          scale: 0,
          rotationX: -90,
          transformPerspective: "20rem",
          borderRadius: "1.5rem",
        },
        {
          scale: 0.4,
          duration: 1.25,
          rotationX: 0,
          borderRadius: "1.5rem",
          ease: "quint.out",
          delay: 0.5,
        },
        0.3
      );
      heroAnimation.to(".hero_bg", {
        scale: 1,
        duration: 1,
        borderRadius: 0,
        ease: "quint.inOut",
      });
      heroAnimation.from(
        ".g-navbar_wrapper",
        {
          duration: 1.25,
          y: -100,
          ease: "quint.out",
        },
        "<-0.5"
      );
      heroAnimation.from(
        ".hero_headline .word",
        {
          y: 10,
          duration: 1,
          opacity: 0,
          stagger: { amount: 0.3 },
          ease: "expo.out",
        },
        ">-0.25"
      );
      heroAnimation.from(
        ".hero_copy .line",
        {
          y: 10,
          duration: 1.5,
          opacity: 0,
          stagger: { amount: 0.3 },
          ease: "expo.out",
        },
        ">-0.75"
      );

      // Set the visited flag in sessionStorage
      sessionStorage.setItem("visited", "true");
    } else {
    }
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hero Parallax
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let heroScroll = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero_section",
    start: "top top",
    end: "bottom top",
    markers: false,
    scrub: true,
  },
});
heroScroll.to(".hero_bg_video", { y: "15%" });
heroScroll.to(".background-image", { y: "15%" }, "<");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Intro
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let introScroll;
let introCopy;

function setupIntroAnimation() {
  // Falls schon ein Split vorhanden: rückgängig machen
  if (introCopy) introCopy.revert();

  // Falls schon eine Timeline existiert: killen
  if (introScroll) introScroll.kill();

  // Neuer Split mit dynamischer Timeline-Erstellung
  introCopy = SplitText.create("#introCopy", {
    type: "words, lines",
    autoSplit: true,
    linesClass: "line",
    wordsClass: "word",
    charsClass: "char",
    onSplit: (self) => {
      introScroll = gsap.timeline({
        scrollTrigger: {
          trigger: ".intro_section",
          start: "top 92%",
          end: "top 50%",
          markers: false,
          toggleActions: "none play none reset",
        },
      });

      introScroll
        .from(".intro_subhead", {
          y: 20,
          opacity: 0,
          duration: 1.5,
          ease: "expo.out",
        })
        .from(
          self.lines,
          {
            y: 20,
            duration: 2,
            opacity: 0,
            stagger: { amount: 0.5 },
            ease: "expo.out",
          },
          "<0.2"
        );

      return introScroll;
    },
  });
}

// Initial aufrufen
setupIntroAnimation();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Work ScrollIn
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let workHomeScrollIn = gsap.timeline({
  scrollTrigger: {
    trigger: ".work_section",
    start: "top 100%",
    end: "top 80%",
    markers: false,
    scrub: false,
    toggleActions: "none play none reset",
  },
});
workHomeScrollIn.from(".work_headline_container", {
  y: 50,
  opacity: 0,
  ease: "expo.out",
  duration: 1.5,
});
workHomeScrollIn.from(
  ".work_container",
  {
    y: 50,
    opacity: 0,
    ease: "expo.out",
    duration: 1.5,
  },
  "< 0.2"
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Work Image Parallax
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(".work_image_wrapper").each(function () {
  let workImageScroll = gsap.timeline({
    scrollTrigger: {
      trigger: $(this),
      start: "top bottom",
      end: "bottom top",
      markers: false,
      scrub: true,
    },
  });
  workImageScroll.to($(this).find(".work_thumbnail_image"), { y: "12.5%" });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Work Item Hover with Timeline
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(".work_item_container").each(function () {
  // Erstelle eine GSAP-Timeline für jedes Element
  let workItemTimeline = gsap.timeline({
    paused: true, // Timeline pausieren, bis sie benötigt wird
  });
  workItemTimeline.to($(this).find(".pink_slider"), {
    y: "-100%",
    duration: 1,
    ease: "quint.inOut",
  });
  workItemTimeline.to(
    $(this).find(".work_preview_container"),
    {
      opacity: 1, // Setze die Opazität
      duration: 0.2,
      ease: "quint.inOut",
    },
    "<0.4"
  );

  // Füge Event-Listener für Mausbewegungen hinzu
  $(this).on("mouseenter", () => workItemTimeline.play());
  $(this).on("mouseleave", () => workItemTimeline.reverse());
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Stagger Links
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SplitText.create("[stagger-link-text]", {
  type: "words, chars",
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
});

const staggerLinks = document.querySelectorAll("[stagger-link]");
staggerLinks.forEach((link) => {
  const letters = link.querySelectorAll("[stagger-link-text] .char");
  link.addEventListener("mouseenter", function () {
    gsap.to(letters, {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.inOut",
      stagger: { each: 0.01 },
      overwrite: true,
    });
  });
  link.addEventListener("mouseleave", function () {
    gsap.to(letters, {
      yPercent: 0,
      duration: 0.4,
      ease: "expo.inOut",
      stagger: { each: 0.01, from: "end" },
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Contact Scroll
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SplitText.create("#contactHeadline", {
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
  type: "words, lines",
  autoSplit: true,
});

let contactScrollIn = gsap.timeline({
  scrollTrigger: {
    trigger: ".contact_section",
    start: "top 100%",
    end: "top 80%",
    markers: false,
    scrub: false,
    toggleActions: "none play none reset",
  },
});
contactScrollIn.from(".contact_wrapper", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "expo.out",
});
contactScrollIn.from(
  ".contact_headline .line",
  {
    y: 10,
    duration: 1.5,
    opacity: 0,
    stagger: { amount: 0.3 },
    ease: "expo.out",
  },
  "<0.2"
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Footer
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let footerScrollIn = gsap.timeline({
  scrollTrigger: {
    trigger: ".footer_section",
    start: "top 100%",
    end: "top 80%",
    markers: false,
    scrub: false,
    toggleActions: "play none none none",
  },
});
footerScrollIn.from(".footer_wrapper", {
  yPercent: 75,
  ease: "expo.out",
  duration: 1.25,
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Uhrzeit
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funktion zur Aktualisierung der Uhrzeit
function updateClock() {
  const clockElement = document.querySelector(".digital-clock");
  if (!clockElement) return;

  const now = new Date();

  // CET-Zeit ermitteln (UTC+1 oder UTC+2 im Sommer)
  const options = {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const cetTime = new Intl.DateTimeFormat("en-GB", options).format(now);

  // Uhrzeit mit [ ] einrahmen
  clockElement.textContent = `[${cetTime}]`;
}

// Erste Aktualisierung sofort ausführen
updateClock();

// Aktualisierung alle 1 Sekunde
setInterval(updateClock, 1000);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page Transition
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const pageTitleElement = document.querySelector("#pageTitle");
const pageTransition = document.querySelector(".p-transition");
const pageTransitionItem = document.querySelectorAll(".p-transition_item");

// Scrollsteuerung über Lenis
function disableScroll() {
  lenis.stop(); // Lenis pausieren
}

function enableScroll() {
  lenis.start(); // Lenis reaktivieren
  document.documentElement.style.overflow = "auto";
}

// Funktion zur Anzeige der Transition
function playPageTransition(destination) {
  disableScroll(); // Scroll deaktivieren
  pageTransition.style.display = "grid";

  gsap.fromTo(
    pageTransitionItem,
    {
      yPercent: 100,
    },
    {
      yPercent: 0,
      duration: 1.5,
      ease: "quint.inOut",
      stagger: {
        amount: 0.2,
        from: "random",
      },
      onComplete: () => {
        const tempLink = document.createElement("a");
        tempLink.href = destination;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      },
    }
  );
}

// Transition beim Seitenladen aktivieren
const pageTransitionAnimation = gsap.timeline({
  onStart: disableScroll, // Scroll deaktivieren beim Start der Animation
});
pageTransitionAnimation
  .from(
    ".hero_section",
    {
      borderRadius: "1.5rem",
      scale: 0.75,
      duration: 1.5,
      ease: "expo.inOut",
    },
    0.75
  )
  .from(
    ".hero_bg",
    {
      scale: 2,
      duration: 1.5,
      ease: "expo.inOut",
    },
    "<"
  )
  .to(
    pageTransitionItem,
    {
      yPercent: -100,
      duration: 1,
      ease: "quint.inOut",
      stagger: {
        amount: 0.2,
        from: "random",
      },
      onComplete: () => {
        // Seite wieder zurücksetzen
        pageTransition.style.display = "none";

        // Explizit scale auf 1 setzen
        gsap.set(".hero_section", { scale: 1 });

        // ScrollTrigger-Instanzen aktualisieren
        if (ScrollTrigger) {
          ScrollTrigger.refresh();
        }

        enableScroll(); // Scroll aktivieren
      },
    },
    "<"
  );

// Click-Event für Links
const links = document.querySelectorAll("a");
links.forEach((link) => {
  link.addEventListener("click", function (e) {
    if (
      this.hostname === window.location.hostname &&
      this.href.indexOf("#") === -1 &&
      this.getAttribute("target") !== "_blank"
    ) {
      e.preventDefault();

      // Scroll deaktivieren beim Klick auf einen Link
      disableScroll();

      let destination = this.href;
      playPageTransition(destination);
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scroll in Next Project
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Prüfen, ob ".next_page" existiert
if (document.querySelector(".next_project")) {
  // Variablen
  let isReadyForScrollIndicator = false;
  let scrollProgress = 0;

  // ScrollTrigger für die "next_page"-Section
  ScrollTrigger.create({
    trigger: ".next_project",
    start: "99% bottom",
    end: "top bottom",
    markers: false,
    onEnter: () => {
      isReadyForScrollIndicator = true;
    },
    onLeaveBack: () => {
      isReadyForScrollIndicator = false;
      resetScrollIndicator();
    },
  });

  // Funktion: Scroll-Indikator zurücksetzen
  function resetScrollIndicator() {
    scrollProgress = 0;
    gsap.to(".scroll_indicator", {
      width: "0%",
      duration: 1,
      ease: "quint.inOut",
    });
    gsap.to(".next_project_image", {
      filter: "saturate(0)",
      duration: 0.5,
      ease: "linear",
    });
  }

  // Event-Listener für weiteres Scrollen am Ende der Seite
  window.addEventListener("wheel", (event) => {
    if (isReadyForScrollIndicator && event.deltaY > 0) {
      // Bestimmen des Eingabegeräts basierend auf deltaY
      let isTrackpad = Math.abs(event.deltaY) < 50;

      // Anpassung der Scroll-Geschwindigkeit basierend auf dem Eingabegerät
      let scrollStep = isTrackpad ? 1 : 5;

      // Aktualisieren des Scroll-Fortschritts mit Begrenzung auf 100
      scrollProgress = Math.min(scrollProgress + scrollStep, 100);

      // Aktualisieren der Scroll-Anzeige
      gsap.to(".scroll_indicator", {
        width: `${scrollProgress}%`,
        duration: 0.2,
        ease: "linear",
      });

      // Aktualisieren des Sättigungsfilters des nächsten Projektbildes
      gsap.to(".next_project_image", {
        filter: `saturate(${scrollProgress / 100})`,
        duration: 0.2,
        ease: "linear",
      });

      // Überprüfen, ob der Scroll-Fortschritt 100% erreicht hat
      if (scrollProgress >= 100) {
        const linkElement = document.querySelector(".notice_link");
        if (linkElement && linkElement.getAttribute("href")) {
          const projectLink = linkElement.getAttribute("href");
          playPageTransition(projectLink);
        } else {
          console.error(
            "Kein gültiger Link in der Klasse 'notice_link' gefunden."
          );
        }
      }
    }
  });
}

function initCmsFooter() {
  // 1. Aktuelle URL analysieren
  const currentPath = window.location.pathname; // z.B. "/work/kempinski-hotels-x-social-content"
  const currentSlug = currentPath.split("/").pop(); // "kempinski-hotels-x-social-content"

  // 2. Projekte aus der Link-Liste holen
  const projects = Array.from(
    document.querySelectorAll("#link-util [data-link]")
  );

  // 3. Aktuelles Projekt finden
  const currentProject = projects.find(
    (project) => project.getAttribute("data-link") === currentSlug
  );

  if (!currentProject) return;

  // 4. Nächstes Projekt bestimmen
  const currentIndex = projects.indexOf(currentProject);
  const nextIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextIndex];

  // 5. DOM Elemente aktualisieren
  const noticeLink = document.querySelector(".notice_link");
  const nameElement = document.querySelector("[data-next-name]");
  const imgWrapper = document.querySelector(".next_project_image_wrapper");

  if (noticeLink && nameElement && imgWrapper) {
    // Link aktualisieren
    const nextSlug = nextProject.getAttribute("data-link");
    noticeLink.href = `${window.location.origin}/work/${nextSlug}`;

    // Namen aktualisieren
    nameElement.textContent = nextProject.getAttribute("data-name");

    // Bild aktualisieren (mit Clone)
    const newImg = nextProject.querySelector("img").cloneNode(true);
    imgWrapper.innerHTML = "";
    imgWrapper.appendChild(newImg);
  }
}

initCmsFooter();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// videoJS Player
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initVJSPlayer() {
  // Selektiere alle inneren Player-Elemente
  const vjsPlayers = document.querySelectorAll(".vjs-player");

  vjsPlayers.forEach((vjsPlayer) => {
    // Finde den äußeren Wrapper
    const wrapper = vjsPlayer.closest(".vjs-player-wrapper");
    if (!wrapper) return;

    // Füge dem inneren div-Element die nötigen Video.js-Klassen hinzu
    const vjsElement = vjsPlayer.querySelector("div");
    if (vjsElement) {
      vjsElement.classList.add("video-js", "vjs-default-skin");
    }

    // Hole den Video-Link und baue die URL zusammen
    const vjsVideoLink = vjsPlayer.getAttribute("data-vjs-video-id");
    if (!vjsVideoLink) return;
    const vjsVideoURL = `https://dl.dropboxusercontent.com/scl/fi/${vjsVideoLink}`;

    // Hole das Video-Element
    const videoElement = vjsPlayer.querySelector("video");
    if (!videoElement) return;
    videoElement.setAttribute("src", vjsVideoURL);

    // Nach der Player-Initialisierung:
    const player = videojs(videoElement, {
      inactivityTimeout: 300,
      userActions: {
        doubleClick: false, // Native Doppelklick-Handling deaktivieren
        hotkeys: false, // Hotkeys deaktivieren
      },
    });

    // Touch-Handling für Mobile hinzufügen
    wrapper.addEventListener("touchstart", () => {
      player.userActive(true);

      // Temporäre Klasse für visuelles Feedback
      wrapper.classList.add("vjs-touch-active");
      setTimeout(() => {
        wrapper.classList.remove("vjs-touch-active");
      }, 200);
    });

    // Mobile-spezifisches Inaktivitäts-Reset
    player.on("userinactive", () => {
      if ("ontouchstart" in window) {
      }
    });

    player.on("useractive", () => {
      wrapper.classList.add("vjs-user-active");
      wrapper.classList.remove("vjs-user-inactive");
      // Für Mobile: Touch-Interaktion erzwingen
      if ("ontouchstart" in window) {
        player.reportUserActivity();
      }
    });

    player.on("userinactive", () => {
      wrapper.classList.remove("vjs-user-active");
      wrapper.classList.add("vjs-user-inactive");
    });

    // Nehme an, das Poster-Div liegt außerhalb des eigentlichen Players
    const posterImage = wrapper.querySelector(".vjs-player__poster-image");
    if (posterImage) {
      const posterUrl = posterImage.getAttribute("src");
      player.poster(posterUrl);
    }

    // Für Desktop: Wenn die Maus über dem Wrapper ist, bleibt der Player aktiv.
    wrapper.addEventListener("mouseenter", () => {
      player.userActive(true);
    });

    wrapper.addEventListener("mouseleave", () => {
      setTimeout(() => {
        player.userActive(false);
      }, 0);
    });

    // Ersetze den mouseleave-Listener durch diesen Code:
    wrapper.addEventListener("mouseleave", () => {
      // Nicht sofort inaktiv setzen, sondern dem Timeout vertrauen
      player.reportUserActivity();
    });

    // Füge diesen Mousemove-Listener für den Wrapper hinzu:
    wrapper.addEventListener("mousemove", () => {
      if (player.userActive() === false) {
        player.userActive(true);
      }
      player.reportUserActivity();
    });

    // Setze die Custom-Attribute am Wrapper, damit sie auch in deinem CSS greifen
    player.on("loadeddata", function () {
      wrapper.setAttribute("data-vjs-loaded", "true");
    });

    player.on("playing", function () {
      wrapper.setAttribute("data-vjs-activated", "true");
      wrapper.setAttribute("data-vjs-playing", "true");
    });

    player.on("pause", function () {
      wrapper.setAttribute("data-vjs-playing", "false");
    });

    // Optional: Hover-Zustand per JavaScript setzen (für Desktop)
    wrapper.addEventListener("mouseenter", () => {
      wrapper.setAttribute("data-vjs-hover", "true");
    });
    wrapper.addEventListener("mouseleave", () => {
      wrapper.setAttribute("data-vjs-hover", "false");
    });

    // Function: Play Video
    function vjsPlayerPlay() {
      wrapper.setAttribute("data-vjs-activated", "true");
      wrapper.setAttribute("data-vjs-playing", "true");
      player.play();
    }

    // Function: Pause Video
    function vjsPlayerPause() {
      wrapper.setAttribute("data-vjs-playing", "false");
      player.pause();
    }

    const playBtn = wrapper.querySelector('[data-vjs-control="play"]');
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        const isMuted = wrapper.getAttribute("data-vjs-muted") === "true";

        // 1. Volume SOFORT setzen
        player.volume(isMuted ? 0 : 1);
        player.muted(isMuted);

        // 2. Play mit Error-Handling
        player
          .play()
          .then(() => {
            // 3. Nach erfolgreichem Playback auf Mobile
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
              player.muted(false);
            }
          })
          .catch((error) => {
            // 4. Fallback für Autoplay-Beschränkungen
            if (error.name === "NotAllowedError") {
              player.muted(true);
              player.play();
            }
          });

        // 5. Custom Play-Funktion
        vjsPlayerPlay();
      });
    }

    player.on("loadeddata", function () {
      const isMuted = wrapper.getAttribute("data-vjs-muted") === "true";
      player.volume(isMuted ? 0 : 1);
      player.muted(isMuted);
    });

    // Click: Pause
    const pauseBtn = wrapper.querySelector('[data-vjs-control="pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        vjsPlayerPause();
        // Wenn der Benutzer pausiert => deaktiviere das scroll-basierte Autoplay
        if (wrapper.getAttribute("data-vjs-autoplay") === "true") {
          wrapper.setAttribute("data-vjs-paused-by-user", "true");
          // Entferne den Scroll-Listener (falls gewünscht)
          window.removeEventListener("scroll", checkVisibility);
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initVJSPlayer();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CMS Mehr Projekte Filter
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initCmsMoreProjects() {
  // 1. Aktuelle URL analysieren
  const currentSlug = window.location.pathname.split("/").pop();

  // 2. Sichtbare Projekte sammeln
  const visibleItems = Array.from(
    document.querySelectorAll(".more_projects_item")
  );
  const visibleSlugs = visibleItems
    .map((item) => {
      const link = item.querySelector(".more_projects_item_link_container");
      return link ? link.href.split("/").pop() : null;
    })
    .filter(Boolean);

  // 3. Aktuelles Projekt finden
  const currentIndex = visibleSlugs.findIndex((slug) => slug === currentSlug);
  if (currentIndex === -1) return;

  // 4. Ersatzprojekt finden
  const allProjects = Array.from(
    document.querySelectorAll("#link-util [data-link]")
  );
  const allSlugs = allProjects.map((p) => p.getAttribute("data-link"));
  const replacementSlug = allSlugs.find(
    (s) => !visibleSlugs.includes(s) && s !== currentSlug
  );
  if (!replacementSlug) return;

  // 5. DOM Updates
  const currentItem = visibleItems[currentIndex];
  const replacementProject = allProjects.find(
    (p) => p.getAttribute("data-link") === replacementSlug
  );

  // Link aktualisieren
  const linkElement = currentItem.querySelector(
    ".more_projects_item_link_container"
  );
  if (linkElement) linkElement.href = `/projekte/${replacementSlug}`;

  // Namen aktualisieren
  const nameElement = currentItem.querySelector("[data-more-name]");
  if (nameElement)
    nameElement.textContent = replacementProject.getAttribute("data-name");

  // Bild aktualisieren
  const oldImage = currentItem.querySelector("[data-more-image]");
  if (oldImage) {
    const newImage = replacementProject.querySelector("img").cloneNode(true);
    newImage.className = "more_projects_image";
    newImage.style.filter = "none";
    newImage.setAttribute("data-more-image", "");
    oldImage.replaceWith(newImage);
  }
}

// Automatisch ausführen wenn DOM bereit
document.addEventListener("DOMContentLoaded", initCmsMoreProjects);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Work Title List
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Höhe eines Items
let heightInitialized = false;

function updateHeight() {
  const element = document.querySelector(".work_title_item_container");
  if (element) {
    const height = element.offsetHeight;
    document.documentElement.style.setProperty(
      "--work-title-height",
      `${height}px`
    );

    // Markiere dass die Höhe initialisiert wurde
    heightInitialized = true;

    // Nach dem Setzen der Höhe, auch die aktiven Elemente aktualisieren
    updateActiveItems();
  }
}

// Beim Laden: Mehrere Möglichkeiten abdecken
window.addEventListener("DOMContentLoaded", function () {
  // Sofort versuchen, die Höhe zu aktualisieren
  updateHeight();

  // Und noch einmal nach kurzem Delay
  setTimeout(updateHeight, 100);
});

// Warte auf vollständiges Laden aller Ressourcen
window.addEventListener("load", function () {
  // Mit mehreren Frames sicherstellen, dass alles berechnet ist
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateHeight();
    });
  });
});

// Bei Fenstergrößenänderung
window.addEventListener("resize", updateHeight);

//Scroll

let lastActiveItem = null;
let isScrolling = false;
let initialScrollExecuted = false;

function updateActiveItems() {
  if (!heightInitialized) {
    // Wenn die Höhe noch nicht initialisiert wurde, versuche es jetzt
    updateHeight();
    return;
  }

  const activationCenter = window.innerHeight * 0.525;
  const items = Array.from(document.querySelectorAll(".work-title_list_item"));

  let closestItem = null;
  let smallestDistance = Infinity;

  items.forEach((item) => {
    // Nur aktive oder sichtbare Items berücksichtigen
    if (
      item.dataset.filterStatus === "active" ||
      item.dataset.filterStatus === undefined ||
      item.style.visibility !== "hidden"
    ) {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(activationCenter - itemCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestItem = item;
      }
    }
  });

  if (closestItem !== lastActiveItem) {
    items.forEach((item) => item.classList.remove("active"));
    if (closestItem) closestItem.classList.add("active");
    lastActiveItem = closestItem;
  }

  const videos = document.querySelectorAll(".work_video_item");

  if (closestItem) {
    const listName = closestItem.getAttribute("data-work-scroll-list-name");

    videos.forEach((video) => {
      const videoName = video.getAttribute("data-work-scroll-video-name");
      video.classList.toggle("active", videoName === listName);
    });
  } else {
    videos.forEach((video) => video.classList.remove("active"));
  }

  isScrolling = false;

  // Markiere, dass die erste Ausführung abgeschlossen ist
  initialScrollExecuted = true;
}

// Initialer Aufruf nach DOM-Laden
document.addEventListener("DOMContentLoaded", function () {
  // Erst nach kurzem Delay ausführen, damit alle Elemente ihre Höhe haben
  setTimeout(updateActiveItems, 100);
});

// Scroll-Handler MIT requestAnimationFrame
window.addEventListener(
  "scroll",
  () => {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(updateActiveItems);
    }
  },
  { passive: true }
);

// Zusätzliche Initialisierung beim vollständigen Laden der Seite
window.addEventListener("load", function () {
  // Sicherstellen, dass die Elemente erst nach vollständigem Laden aktualisiert werden
  setTimeout(updateActiveItems, 100);
});

// Verbesserter Resize-Handler
window.addEventListener("resize", function () {
  // Zuerst Höhe aktualisieren, dann aktive Elemente
  updateHeight();
  // Nach kurzer Verzögerung erneut ausführen
  setTimeout(updateActiveItems, 50);
});

// Filter

function initFilterBasic() {
  // 1. Filter-Buttons direkt auswählen
  const filterButtons = document.querySelectorAll("[data-filter-target]");

  // 2. Items global auswählen
  const allFilterItems = document.querySelectorAll("[data-filter-name]");
  const transitionDelay = 300;

  // Status-Update Funktion
  const updateItemStatus = (item, shouldBeActive) => {
    item.setAttribute(
      "data-filter-status",
      shouldBeActive ? "active" : "not-active"
    );
    item.setAttribute("aria-hidden", !shouldBeActive);
  };

  // Filter-Handler
  const handleFilter = (target) => {
    if (window.activeFilterTimeouts) {
      window.activeFilterTimeouts.forEach((id) => clearTimeout(id));
    }
    const timeoutIds = [];

    const isAllFilter = target === "all";
    const TRANSITION_OUT_DURATION = 300;
    const STAGGER_DELAY = isAllFilter ? 80 : 50;

    // Erst alle aktiven Status entfernen
    allFilterItems.forEach((item) => {
      // Wichtig: Auch die "active" Klasse von ALLEN Items entfernen
      item.classList.remove("active");

      if (item.dataset.filterStatus === "active") {
        item.dataset.filterStatus = "transition-out";
        timeoutIds.push(
          setTimeout(
            () => updateItemStatus(item, false),
            TRANSITION_OUT_DURATION
          )
        );
      }
    });

    // Auch den lastActiveItem zurücksetzen
    lastActiveItem = null;

    timeoutIds.push(
      setTimeout(() => {
        document.documentElement.getBoundingClientRect();

        const activeItems = Array.from(allFilterItems).filter(
          (item) => target === "all" || item.dataset.filterName === target
        );

        const INITIAL_DELAY = isAllFilter ? 150 : 0;

        // Aktiviere immer das erste Item der gefilterten Liste
        const firstItem = activeItems[0];
        if (firstItem) {
          // Setze zuerst die Transformation für den Einblendeffekt
          firstItem.style.transform = "translateY(1.5rem)";
          firstItem.style.opacity = "0";

          // Force reflow
          void firstItem.offsetHeight;

          // Dann den Status setzen
          firstItem.dataset.filterStatus = "active";
          firstItem.setAttribute("aria-hidden", "false");

          // WICHTIG: Nach kurzem Delay die Transform zurücksetzen
          setTimeout(() => {
            firstItem.style.transform = "";
            firstItem.style.opacity = "";

            // Setze das erste Item aktiv
            firstItem.classList.add("active");
            lastActiveItem = firstItem;

            // Aktiviere das entsprechende Video
            const firstItemName = firstItem.getAttribute(
              "data-work-scroll-list-name"
            );
            const videos = document.querySelectorAll(".work_video_item");
            videos.forEach((video) => {
              const videoName = video.getAttribute(
                "data-work-scroll-video-name"
              );
              video.classList.toggle("active", videoName === firstItemName);
            });
          }, 10);
        }

        // Rest der Items mit Verzögerung einblenden
        activeItems.slice(1).forEach((item, index) => {
          timeoutIds.push(
            setTimeout(() => {
              // Wichtig: Zuerst die Eigenschaften setzen
              item.style.transform = "translateY(1.5rem)";
              item.style.opacity = "0";

              // Dann Status setzen für Sichtbarkeit
              item.dataset.filterStatus = "active";
              item.setAttribute("aria-hidden", "false");

              // Force reflow - wichtig für die Animation
              void item.offsetHeight;

              // Jetzt die Transformation zurücksetzen für die Einblendanimation
              item.style.transform = "";
              item.style.opacity = "";

              // Nach der Transition des letzten Elements
              if (index === activeItems.length - 2) {
                setTimeout(updateActiveItems, 300);
              }
            }, INITIAL_DELAY + (index + 1) * STAGGER_DELAY)
          );
        });
      }, TRANSITION_OUT_DURATION + 50)
    );

    // 3. Buttons updaten
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filterTarget === target;
      btn.dataset.filterStatus = isActive ? "active" : "not-active";
      btn.setAttribute("aria-pressed", isActive);
    });

    window.activeFilterTimeouts = timeoutIds;
  };

  // Click-Listener für Buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.filterTarget;
      if (button.dataset.filterStatus === "active") return;
      handleFilter(target);
    });
  });
}

// Initialize Basic Filter Setup
document.addEventListener("DOMContentLoaded", () => {
  initFilterBasic();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elipse Carousel
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gsap.registerPlugin(MotionPathPlugin);

// Prüfung aller notwendigen Elemente am Anfang
const requiredElements = () => {
  const items = document.querySelectorAll(".people-card_item");
  return (
    items.length > 0 &&
    document.querySelector("#pathEllipse") &&
    document.querySelector(".people-card_info_item") &&
    document.querySelector(".info-name") &&
    document.querySelector(".info-role")
  );
};

// Nur ausführen wenn alle Elemente existieren
if (requiredElements()) {
  const items = document.querySelectorAll(".people-card_item");
  let totalItems = items.length;
  let animationTweens = [];
  let lastHoveredItem = null;

  // Funktion zur Initialisierung/Neukalkulation
  const initAnimations = () => {
    const pathElement = document.querySelector("#pathEllipse");
    if (!pathElement) return;

    animationTweens.forEach((tween) => tween.kill());
    animationTweens = [];

    gsap.set(".people-card_item", {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
      overwrite: true,
    });

    const pathLength = pathElement.getTotalLength();
    const speed = 75;
    const duration = pathLength / speed;

    items.forEach((item, index) => {
      const tween = gsap.to(item, {
        duration: duration,
        ease: "linear",
        repeat: -1,
        motionPath: {
          path: "#pathEllipse",
          align: "#pathEllipse",
          start: index / totalItems,
          end: index / totalItems + 1,
        },
      });
      animationTweens.push(tween);
    });
  };

  // Resize-Handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initAnimations, 100);
  });

  // Restlicher Code
  const infoItem = document.querySelector(".people-card_info_item");
  const infoName = document.querySelector(".info-name");
  const infoRole = document.querySelector(".info-role");
  const peopleCards = document.querySelectorAll(".people-card_item");

  const updateInfoContent = (item) => {
    infoName.textContent = item.dataset.name;
    infoRole.textContent = item.dataset.role;
  };

  const removeActiveStates = () => {
    peopleCards.forEach((card) => card.classList.remove("active"));
  };

  const showInitialItem = () => {
    const initialItem = peopleCards[peopleCards.length - 1];
    updateInfoContent(initialItem);
    gsap.set(infoItem, { autoAlpha: 1 });
    lastHoveredItem = initialItem;
    initialItem.classList.add("active");
  };

  peopleCards.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      removeActiveStates();
      item.classList.add("active");
      gsap.to(infoItem, {
        autoAlpha: 1,
        duration: 0.2,
        onStart: () => updateInfoContent(item),
      });
      lastHoveredItem = item;
    });
  });

  document.addEventListener("mouseleave", (event) => {
    const target = event.target;
    if (
      target instanceof Element &&
      !target.closest(".people-card_item") &&
      lastHoveredItem
    ) {
      removeActiveStates();
      lastHoveredItem.classList.add("active");
      updateInfoContent(lastHoveredItem);
    }
  });

  // Initialisierung
  initAnimations();
  showInitialItem();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Image Trail
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initImageTrail(config = {}) {
  // config + defaults
  const options = {
    minWidth: config.minWidth ?? 992,
    moveDistance: config.moveDistance ?? 15,
    stopDuration: config.stopDuration ?? 300,
    trailLength: config.trailLength ?? 5,
  };

  const wrapper = document.querySelector('[data-trail="wrapper"]');

  if (!wrapper || window.innerWidth < options.minWidth) {
    return;
  }

  // State management
  const state = {
    trailInterval: null,
    globalIndex: 0,
    last: { x: 0, y: 0 },
    trailImageTimestamps: new Map(),
    trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
    isActive: false,
  };

  // Utility functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  function getRelativeCoordinates(e, rect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function activate(trailImage, x, y) {
    if (!trailImage) return;

    const rect = trailImage.getBoundingClientRect();
    const styles = {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
      zIndex: state.globalIndex,
      display: "block",
    };

    Object.assign(trailImage.style, styles);
    state.trailImageTimestamps.set(trailImage, Date.now());

    // Here, animate how the images will appear!
    gsap.fromTo(
      trailImage,
      { autoAlpha: 0, scale: 0.8 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.2,
        overwrite: true,
      }
    );

    state.last = { x, y };
  }

  function fadeOutTrailImage(trailImage) {
    if (!trailImage) return;

    // Here, animate how the images will disappear!
    gsap.to(trailImage, {
      opacity: 0,
      scale: 0.2,
      duration: 0.8,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(trailImage, { autoAlpha: 0 });
      },
    });
  }

  function handleOnMove(e) {
    if (!state.isActive) return;

    const rectWrapper = wrapper.getBoundingClientRect();
    const { x: relativeX, y: relativeY } = getRelativeCoordinates(
      e,
      rectWrapper
    );

    const distanceFromLast = MathUtils.distance(
      relativeX,
      relativeY,
      state.last.x,
      state.last.y
    );

    if (distanceFromLast > window.innerWidth / options.moveDistance) {
      const lead =
        state.trailImages[state.globalIndex % state.trailImages.length];
      const tail =
        state.trailImages[
          (state.globalIndex - options.trailLength) % state.trailImages.length
        ];

      activate(lead, relativeX, relativeY);
      fadeOutTrailImage(tail);
      state.globalIndex++;
    }
  }

  function cleanupTrailImages() {
    const currentTime = Date.now();
    for (const [
      trailImage,
      timestamp,
    ] of state.trailImageTimestamps.entries()) {
      if (currentTime - timestamp > options.stopDuration) {
        fadeOutTrailImage(trailImage);
        state.trailImageTimestamps.delete(trailImage);
      }
    }
  }

  function startTrail() {
    if (state.isActive) return;

    state.isActive = true;
    wrapper.addEventListener("mousemove", handleOnMove);
    state.trailInterval = setInterval(cleanupTrailImages, 100);
  }

  function stopTrail() {
    if (!state.isActive) return;

    state.isActive = false;
    wrapper.removeEventListener("mousemove", handleOnMove);
    clearInterval(state.trailInterval);
    state.trailInterval = null;

    // Clean up remaining trail images
    state.trailImages.forEach(fadeOutTrailImage);
    state.trailImageTimestamps.clear();
  }

  // Initialize ScrollTrigger
  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    onEnter: startTrail,
    onEnterBack: startTrail,
    onLeave: stopTrail,
    onLeaveBack: stopTrail,
  });

  // Clean up on window resize
  const handleResize = () => {
    if (window.innerWidth < options.minWidth && state.isActive) {
      stopTrail();
    } else if (window.innerWidth >= options.minWidth && !state.isActive) {
      startTrail();
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    stopTrail();
    window.removeEventListener("resize", handleResize);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const imageTrail = initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 300,
    trailLength: 5,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MatterJS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initFallingTextMatterJS() {
  const canvas = document.querySelector("#canvas-target");
  if (!canvas) return;

  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;
  const wallDepth = canvasWidth / 4;

  const wordsToDisplay = [
    "Qualität",
    "Kundenorientierung",
    "Menschlichkeit",
    "Verantwortung",
    "Nachhaltigkeit",
    "Gewaltfreie Kommunikation",
    "Solidarität",
    "Toleranz",
    "Akzeptanz",
    "Weltoffenheit",
    "Zusammenhalt",
  ];

  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Mouse,
    MouseConstraint,
    Events,
  } = Matter;

  const engine = Engine.create();
  engine.world.gravity.y = 2;

  const render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      background: "transparent",
      wireframes: false,
      width: canvasWidth,
      height: canvasHeight,
      pixelRatio: window.devicePixelRatio || 1,
    },
  });
  Render.run(render);

  // Begrenzungen
  const walls = [
    Bodies.rectangle(
      -wallDepth,
      canvasHeight / 2,
      wallDepth * 2,
      canvasHeight,
      { isStatic: true, render: { visible: false } }
    ),
    Bodies.rectangle(
      canvasWidth + wallDepth,
      canvasHeight / 2,
      wallDepth * 2,
      canvasHeight,
      { isStatic: true, render: { visible: false } }
    ),
    Bodies.rectangle(
      canvasWidth / 2,
      canvasHeight + wallDepth,
      canvasWidth,
      wallDepth * 2,
      { isStatic: true, render: { visible: false } }
    ),
    Bodies.rectangle(canvasWidth / 2, -wallDepth, canvasWidth, wallDepth * 2, {
      isStatic: true,
      render: { visible: false },
    }),
  ];
  Composite.add(engine.world, walls);

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createWordBody(word) {
    // Dynamische Schriftgröße: mobil = größer
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? canvasWidth / 11.7 : canvasWidth / 17.5;

    const context = render.context;
    context.font = `700 ${fontSize}px 'Helvetica Neue', sans-serif`;
    const metrics = context.measureText(word);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    const xPos = getRandomNumber(textWidth / 2, canvasWidth - textWidth / 2);
    const yPos = -textHeight * 2;

    const body = Bodies.rectangle(xPos, yPos, textWidth, textHeight, {
      restitution: 0.75,
      render: {
        fillStyle: "transparent",
        strokeStyle: "transparent",
      },
    });

    body.word = word;
    body.fontSize = fontSize;
    return body;
  }

  wordsToDisplay.forEach((word) => {
    Composite.add(engine.world, createWordBody(word));
  });

  const runner = Runner.create();
  Runner.run(runner, engine);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  Composite.add(engine.world, mouseConstraint);

  // Text rendern
  Events.on(render, "afterRender", function () {
    const ctx = render.context;
    engine.world.bodies.forEach((body) => {
      if (body.word) {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `700 ${body.fontSize}px 'Helvetica Neue', sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.fillText(body.word, 0, 0);
        ctx.restore();
      }
    });
  });
}

// ScrollTrigger Setup
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".canvas-matter",
  start: "top center",
  once: true,
  onEnter: () => {
    initFallingTextMatterJS();
  },
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Service Swiper
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const swiper = new Swiper(".swiper-services", {
  // Optional parameters
  direction: "horizontal",
  loop: true,
  slidesPerView: 4,
  spaceBetween: 16,
  speed: 1000,

  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.5,
      spaceBetween: 16,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2.5,
      spaceBetween: 16,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-btn-next",
    prevEl: ".swiper-btn-prev",
  },
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Service Home
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  // Überprüfe, ob das Heading-Element existiert, bevor darauf zugegriffen wird
  const heading = document.getElementById("planung-heading");
  if (heading && window.innerWidth <= 768) {
    heading.innerHTML = "Planung, Planung,<br>Planung";
  }

  // Überprüfe, ob die Sticky-Container-Funktionalität initialisiert werden soll
  const stickyWrap = document.querySelector('[data-sticky-title="wrap"]');
  if (stickyWrap) {
    initStickyContainerScroll();
  }
});

function initStickyContainerScroll() {
  // Alle früheren SplitText-Instanzen aufräumen (falls vorhanden)
  if (window.splitTextInstances) {
    window.splitTextInstances.forEach((instance) => instance.revert());
  }
  window.splitTextInstances = [];
  const wrap = document.querySelector('[data-sticky-title="wrap"]');
  if (!wrap) return; // Frühzeitig beenden, wenn das Element nicht existiert

  const containers = Array.from(wrap.querySelectorAll(".service_container"));
  if (containers.length === 0) return; // Frühzeitig beenden, wenn keine Container vorhanden sind

  // Überprüfen, ob GSAP SplitText verfügbar ist
  if (typeof SplitText !== "function") {
    console.warn(
      "GSAP SplitText ist nicht definiert. Die Sticky-Container-Animation wird nicht ausgeführt."
    );
    return;
  }

  // Überprüfen, ob GSAP und ScrollTrigger verfügbar sind
  if (!gsap || !gsap.timeline || !ScrollTrigger) {
    console.warn(
      "GSAP oder ScrollTrigger ist nicht verfügbar. Die Sticky-Container-Animation wird nicht ausgeführt."
    );
    return;
  }

  // Zuerst alle Container verstecken, um Überlappung zu vermeiden
  containers.forEach((container) => {
    gsap.set(container, { autoAlpha: 0 });
  });

  // Split-Elemente überprüfen und verarbeiten
  containers.forEach((container) => {
    const titleEl = container.querySelector(".sticky-title-el");
    const paraEl = container.querySelector(".sticky-paragraph-el");

    // GSAP SplitText initialisieren und Referenzen speichern
    if (titleEl) {
      // Speichern des SplitText-Objekts an das Container-Element
      container.titleSplit = new SplitText(titleEl, {
        type: "words,chars",
        charsClass: "char",
        wordsClass: "word",
      });
      window.splitTextInstances.push(container.titleSplit);
    }

    if (paraEl) {
      // Speichern des SplitText-Objekts an das Container-Element
      container.paraSplit = new SplitText(paraEl, {
        type: "words,lines",
        linesClass: "split-line",
        wordsClass: "word",
        charsClass: "char",
      });
      window.splitTextInstances.push(container.paraSplit);
    }
  });

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: "top 40%",
      end: "bottom bottom",
      scrub: true,
    },
  });

  const revealDur = 0.6,
    hideDur = 0.4,
    pauseDur = 0.3,
    overlap = 0.0;

  containers.forEach((container, i) => {
    // Sicherstellen, dass alle benötigten Elemente vorhanden sind
    const titleChars = container.titleSplit ? container.titleSplit.chars : [];
    const paraLines = container.paraSplit ? container.paraSplit.lines : [];

    // Alle Elemente kombinieren für Animation
    const chars = titleChars;
    const lines = paraLines;

    if (chars.length === 0 && lines.length === 0) return; // Diesen Container überspringen

    // Initial verstecken
    gsap.set(chars, { autoAlpha: 0, y: 20 });
    gsap.set(lines, { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline();

    // a) sichtbar machen und vorherige Container ausblenden
    tl.set(container, {
      visibility: "visible",
      autoAlpha: 1,
      onStart: () => {
        container.classList.remove("is--stacked");

        // Alle vorherigen Container verstecken um Überlappung zu vermeiden
        if (i > 0) {
          for (let j = 0; j < i; j++) {
            gsap.set(containers[j], { autoAlpha: 0 });
          }
        }
      },
    });

    // b) Header rein (nur wenn chars vorhanden)
    if (chars.length > 0) {
      tl.to(chars, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.02,
        duration: revealDur,
        ease: "power2.out",
      });
    }

    // c) Paragraph rein (nur wenn lines vorhanden)
    if (lines.length > 0) {
      tl.to(
        lines,
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.05,
          duration: revealDur,
          ease: "power2.out",
        },
        chars.length > 0 ? `+=0` : 0
      );
    }

    // d) kurze Pause, dann beides ausblenden (außer beim letzten Block)
    if (i < containers.length - 1 && (chars.length > 0 || lines.length > 0)) {
      // Kombiniere alle Elemente für das Ausblenden
      const allElements = [...chars, ...lines];

      tl.to(
        allElements,
        {
          autoAlpha: 0,
          y: -20,
          stagger: 0.02,
          duration: hideDur,
        },
        `+=${pauseDur}`
      );

      // Stelle sicher, dass nach dem Ausblenden alles bereinigt ist
      tl.set(container, { autoAlpha: 0 });
    }

    // e) Container wieder stapeln
    tl.set(container, {
      onComplete: () => container.classList.add("is--stacked"),
    });

    // f) Sub-Timeline ins Master packen
    if (i === 0) masterTl.add(tl);
    else masterTl.add(tl, `-=${overlap}`);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Home Accordion
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initAccordionCSS() {
  let ignoreNextRefresh = false;
  const refreshLayout = () => {
    window.dispatchEvent(new Event("resize"));
    if (window.ScrollTrigger && !ignoreNextRefresh) {
      // ScrollTrigger aktualisieren, aber Animation des Footers blockieren
      const footerTimeline = window.gsap?.getById?.("footerScrollIn");
      if (footerTimeline) {
        const progress = footerTimeline.progress();
        const wasActive = footerTimeline.isActive();
        window.ScrollTrigger.refresh();
        footerTimeline.progress(progress);
        if (!wasActive) footerTimeline.pause();
      } else {
        window.ScrollTrigger.refresh();
      }
    }
    ignoreNextRefresh = false;
  };
  document
    .querySelectorAll("[data-accordion-css-init]")
    .forEach((accordion) => {
      const closeSiblings =
        accordion.getAttribute("data-accordion-close-siblings") === "true";
      accordion.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-accordion-toggle]");
        const singleAccordion = toggle?.closest("[data-accordion-status]");
        if (!singleAccordion) return;
        const isActive =
          singleAccordion.getAttribute("data-accordion-status") === "active";
        singleAccordion.setAttribute(
          "data-accordion-status",
          isActive ? "not-active" : "active"
        );
        if (closeSiblings && !isActive) {
          accordion
            .querySelectorAll('[data-accordion-status="active"]')
            .forEach((sibling) => {
              if (sibling !== singleAccordion)
                sibling.setAttribute("data-accordion-status", "not-active");
            });
        }
        [50, 300, 600].forEach((delay) => setTimeout(refreshLayout, delay));
      });
    });
}
function initAccordionShowMore() {
  const accordion = document.querySelector("[data-accordion-css-init]");
  if (!accordion) return;
  const items = accordion.querySelectorAll(".accordion-css__item");
  const toggleButton = document.querySelector(".accordion-css__toggle-button");
  // Falls der Button nicht vorhanden ist, auf das Vorhandensein warten
  if (!toggleButton) {
    console.error("Toggle Button wurde nicht gefunden!");
    return;
  }
  const visibleCount = 6;
  let expanded = false;
  const updateVisibility = () => {
    items.forEach((item, index) => {
      if (expanded || index < visibleCount) {
        item.classList.add("visible");
      } else {
        item.classList.remove("visible");
      }
    });
    toggleButton.querySelector(".button-text").textContent = expanded
      ? "Weniger anzeigen"
      : "Mehr anzeigen";
  };
  toggleButton.addEventListener("click", () => {
    expanded = !expanded;
    updateVisibility();
    // Layout und ScrollTrigger aktualisieren, wenn mehr/weniger Elemente angezeigt werden
    [50, 300].forEach((delay) =>
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        if (window.ScrollTrigger) {
          const footerTimeline = window.gsap?.getById?.("footerScrollIn");
          if (footerTimeline) {
            const progress = footerTimeline.progress();
            const wasActive = footerTimeline.isActive();
            window.ScrollTrigger.refresh();
            footerTimeline.progress(progress);
            if (!wasActive) footerTimeline.pause();
          } else {
            window.ScrollTrigger.refresh();
          }
        }
      }, delay)
    );
  });
  updateVisibility();
}
document.addEventListener("DOMContentLoaded", () => {
  initAccordionCSS();
  initAccordionShowMore(); // "Mehr anzeigen"-Feature initialisieren
  // Prüfen, ob nach Seitenrefresh ein Accordion geöffnet ist
  if (
    document.querySelectorAll('[data-accordion-status="active"]').length > 0
  ) {
    [50, 300].forEach((delay) =>
      setTimeout(() => {
        // Hier auch den Footer-Status beibehalten
        const footerTimeline = window.gsap?.getById?.("footerScrollIn");
        if (footerTimeline) {
          const progress = footerTimeline.progress();
          const wasActive = footerTimeline.isActive();
          window.dispatchEvent(new Event("resize"));
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          footerTimeline.progress(progress);
          if (!wasActive) footerTimeline.pause();
        } else {
          window.dispatchEvent(new Event("resize"));
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        }
      }, delay)
    );
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gallery Scroll
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const effectContainer = document.querySelector(".mwg_effect033");
  if (!effectContainer) return; // Abbrechen, wenn das Hauptelement nicht existiert

  const container = effectContainer.querySelector(".container");
  if (!container) return;

  const medias = container.querySelectorAll(".media");
  if (medias.length === 0) return;

  // Gallery Scroll
  gsap.to(".scroll", {
    autoAlpha: 0,
    duration: 0.5,
    scrollTrigger: {
      trigger: ".mwg_effect033",
      start: "top top",
      end: "top top-=1",
      toggleActions: "play none reverse none",
    },
  });

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  medias.forEach((media) => {
    gsap.set(media, {
      x: (Math.random() - 0.5) * 0.1 * windowWidth,
      y: (Math.random() - 0.5) * 0.05 * windowWidth,
    });
  });

  const distance = container.clientWidth - document.body.clientWidth;

  const scrollTween = gsap.to(container, {
    x: -distance,
    ease: "none",
    scrollTrigger: {
      trigger: container.parentNode,
      pin: true,
      scrub: 1,
      end: "+=" + distance,
      invalidateOnRefresh: true,
    },
  });

  const animateInterval = Math.ceil(
    medias.length / (window.innerWidth <= 768 ? 12 : 24)
  );

  medias.forEach((media, index) => {
    if (window.innerWidth <= 768 && index % animateInterval !== 0) return;

    const rotationAmount = (Math.random() - 0.5) * 40;
    const yPercentAmount = (Math.random() - 0.5) * 150;
    const xPercentAmount = Math.random() * 200;

    gsap.from(media, {
      rotation: rotationAmount,
      yPercent: yPercentAmount,
      xPercent: xPercentAmount,
      ease: "power1.out",
      scrollTrigger: {
        trigger: media,
        containerAnimation: scrollTween,
        start: "left 110%",
        end: "left 65%",
        scrub: 1,
      },
    });

    gsap.fromTo(
      media,
      {
        rotation: 0,
        yPercent: 0,
        xPercent: 0,
      },
      {
        rotation: rotationAmount,
        yPercent: yPercentAmount,
        xPercent: -xPercentAmount,
        ease: "power1.in",
        scrollTrigger: {
          trigger: media,
          containerAnimation: scrollTween,
          start: "right 35%",
          end: "right -10%",
          scrub: 1,
        },
      }
    );
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Project Animation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SplitText.create(".work_project_title", {
  type: "words",
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
});

let projectHero = gsap.timeline({});

projectHero
  .from(".hero_work_title_image_mask", {
    delay: 1.25,
    height: 0,
    transformOrigin: "center bottom",
    duration: 1,
    ease: "expo.out",
  })
  .from(
    ".work_project_title .word",
    {
      y: 20,
      opacity: 0,
      ease: "expo.out",
      duration: 1,
      stagger: 0.1,
    },
    "<"
  )
  .from(
    ".work_project_description",
    {
      y: 20,
      duration: 1.5,
      opacity: 0,
      ease: "expo.out",
    },
    ">-0.75"
  );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// About Intro Animation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SplitText.create(".about_intro_text", {
  type: "words, lines",
  linesClass: "line",
  wordsClass: "word",
  charsClass: "char",
  autoSplit: true,
});

let aboutIntro = gsap.timeline({});

aboutIntro
  .from(".about_subhead", {
    y: 20,
    opacity: 0,
    duration: 1.5,
    delay: 1.25,
    ease: "expo.out",
  })
  .fromTo(
    ".about_intro_text .line",
    {
      y: 20,
      opacity: 0,
      rotateX: -30,
      transformPerspective: 800,
      transformOrigin: "top",
    },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      ease: "expo.out",
      duration: 1,
      stagger: 0.2,
    },
    "<0.2"
  );
