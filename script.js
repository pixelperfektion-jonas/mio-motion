document.addEventListener("DOMContentLoaded", function () {
  // Core Plugins & Basics
  initCacheFix();
  initGSAP();
  initLenis();
  initDynamicCurrentYear();
  initScrollToTop();
  initClock();
  
  // UI & Globale Layer
  initCursor();
  initNavbarAnimation();
  initPageTransitions();

  // Content-spezifische Animationen
  initHeroAnimation();
  initHeroParallax();
  initIntroAnimation();
  initAboutIntroAnimation();
  initProjectAnimation();
  initWorkScrollIn();
  initWorkImageParallax();
  initWorkItemHover();
  initWorkTitleList();
  initStaggerLinks();
  initContactScroll();
  initFooterScroll();
  
  // Komponenten & Plugins
  initVJSPlayer();
  initEllipseCarousel();
  initImageTrail();
  initMatterJS();
  initServiceSwiper();
  initServiceHome();
  initAccordion();
  initGalleryScroll();
  initNextProjectScroll();

  // CMS/Logik
  initCmsFooter();
  initCmsMoreProjects();
  initFilterBasic();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBALE VARIABLEN & STATUS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let lenis;
let introScroll;
let introCopy;
let heightInitialized = false;
let lastActiveItem = null;
let isScrolling = false;
let initialScrollExecuted = false;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CORE SETUP (GSAP, Lenis, Cache)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initCacheFix() {
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
}

function initGSAP() {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);
  gsap.config({ nullTargetWarn: false });
}

function initLenis() {
  lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBALE UI KOMPONENTEN
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initDynamicCurrentYear() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = currentYear;
  });
}

function initScrollToTop() {
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
}

function initClock() {
  const clockElement = document.querySelector(".digital-clock");
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const cetTime = new Intl.DateTimeFormat("en-GB", options).format(now);
    clockElement.textContent = `[${cetTime}]`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function initNavbarAnimation() {
  const navBar = gsap.from(".g-navbar_wrapper", {
    yPercent: -100,
    paused: true,
    duration: 0.2,
  }).progress(1);

  const pathname = window.location.pathname;
  if (pathname !== "/work" && pathname !== "/work/") {
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        self.direction === -1 ? navBar.play() : navBar.reverse();
      },
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CURSOR LOGIK
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initCursor() {
  // Cursor Position
  gsap.set(".cursor", { xPercent: -50, yPercent: -50 });
  let globalXTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
  let globalYTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    globalXTo(e.clientX);
    globalYTo(e.clientY);
  });

  // Cursor Text Item
  let cursorItem = document.querySelector(".cursor-text");
  if (!cursorItem) return;

  let cursorParagraph = cursorItem.querySelector(".cursor-text-description");
  let targets = document.querySelectorAll("[data-cursor]");
  let xOffset = 6;
  let yOffset = 100;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = "";

  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });
  let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY;

    let xPercent = xOffset;
    let yPercent = yOffset;

    if (cursorX > windowWidth * 0.81) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      let newText = currentTarget.getAttribute("data-cursor");
      if (currentTarget.hasAttribute("data-easteregg") && cursorIsOnRight) {
        newText = currentTarget.getAttribute("data-easteregg");
      }
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    }

    gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  targets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      currentTarget = target;
      let newText = target.hasAttribute("data-easteregg")
        ? target.getAttribute("data-easteregg")
        : target.getAttribute("data-cursor");

      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    });
  });

  // SplitText Animation for Cursor
  SplitText.create("#cursorTextDescription", {
    type: "chars, words",
    linesClass: "line",
    wordsClass: "word",
    charsClass: "char",
    onComplete: () => self.revert(),
  });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const cursorText = el.getAttribute("data-cursor");
      const cursorTextContainer = document.querySelector(".cursor-text-description");
      if(!cursorTextContainer) return;

      cursorTextContainer.innerHTML = "";
      cursorText.split("").forEach((char) => {
        const span = document.createElement("span");
        span.classList.add("char");
        span.textContent = char;
        cursorTextContainer.appendChild(span);
      });

      gsap.fromTo(".cursor-text-description .char", 
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.5, stagger: { amount: 0.4 }, ease: "expo.out" }
      );
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(".cursor-text-description .char", {
        y: -10, opacity: 0, duration: 0.5, stagger: { amount: 0.2 }, ease: "expo.in"
      });
    });
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE TRANSITIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initPageTransitions() {
  const pageTransition = document.querySelector(".p-transition");
  const pageTransitionItem = document.querySelectorAll(".p-transition_item");
  if (!pageTransition) return;

  function disableScroll() { if(lenis) lenis.stop(); }
  function enableScroll() { 
    if(lenis) lenis.start(); 
    document.documentElement.style.overflow = "auto"; 
  }

  window.playPageTransition = function(destination) {
    disableScroll();
    pageTransition.style.display = "grid";

    gsap.fromTo(pageTransitionItem, 
      { yPercent: 100 },
      { yPercent: 0, duration: 1.5, ease: "quint.inOut", stagger: { amount: 0.2, from: "random" },
        onComplete: () => {
          const tempLink = document.createElement("a");
          tempLink.href = destination;
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        }
      }
    );
  };

  const pageTransitionAnimation = gsap.timeline({ onStart: disableScroll });
  pageTransitionAnimation
    .from(".hero_section", { borderRadius: "1.5rem", scale: 0.75, duration: 1.5, ease: "expo.inOut" }, 0.75)
    .from(".hero_bg", { scale: 2, duration: 1.5, ease: "expo.inOut" }, "<")
    .to(pageTransitionItem, {
      yPercent: -100, duration: 1, ease: "quint.inOut", stagger: { amount: 0.2, from: "random" },
      onComplete: () => {
        pageTransition.style.display = "none";
        gsap.set(".hero_section", { scale: 1 });
        if (ScrollTrigger) ScrollTrigger.refresh();
        enableScroll();
      }
    }, "<");

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (
        this.hostname === window.location.hostname &&
        this.href.indexOf("#") === -1 &&
        this.getAttribute("target") !== "_blank"
      ) {
        e.preventDefault();
        disableScroll();
        window.playPageTransition(this.href);
      }
    });
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HERO & INTRO ANIMATIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initHeroAnimation() {
  SplitText.create("#heroHeadline", { type: "words", linesClass: "line", wordsClass: "word", charsClass: "char", onComplete: () => self.revert() });
  SplitText.create("#heroCopy", { type: "lines, words", linesClass: "line", wordsClass: "word", charsClass: "char", onComplete: () => self.revert() });

  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    if (!sessionStorage.getItem("visited")) {
      let heroAnimation = gsap.timeline();
      heroAnimation.fromTo(".hero_bg",
        { scale: 0, rotationX: -90, transformPerspective: "20rem", borderRadius: "1.5rem" },
        { scale: 0.4, duration: 1.25, rotationX: 0, borderRadius: "1.5rem", ease: "quint.out", delay: 0.5 }, 0.3
      );
      heroAnimation.to(".hero_bg", { scale: 1, duration: 1, borderRadius: 0, ease: "quint.inOut" });
      heroAnimation.from(".g-navbar_wrapper", { duration: 1.25, y: -100, ease: "quint.out" }, "<-0.5");
      heroAnimation.from(".hero_headline .word", { y: 10, duration: 1, opacity: 0, stagger: { amount: 0.3 }, ease: "expo.out" }, ">-0.25");
      heroAnimation.from(".hero_copy .line", { y: 10, duration: 1.5, opacity: 0, stagger: { amount: 0.3 }, ease: "expo.out" }, ">-0.75");
      
      sessionStorage.setItem("visited", "true");
    }
  }
}

function initHeroParallax() {
  if(!document.querySelector(".hero_section")) return;
  let heroScroll = gsap.timeline({
    scrollTrigger: { trigger: ".hero_section", start: "top top", end: "bottom top", scrub: true },
  });
  heroScroll.to(".hero_bg_video", { y: "15%" });
  heroScroll.to(".background-image", { y: "15%" }, "<");
}

function initIntroAnimation() {
  if (!document.querySelector("#introCopy")) return;
  if (introCopy) introCopy.revert();
  if (introScroll) introScroll.kill();

  introCopy = SplitText.create("#introCopy", {
    type: "words, lines", autoSplit: true, linesClass: "line", wordsClass: "word", charsClass: "char",
    onSplit: (self) => {
      introScroll = gsap.timeline({
        scrollTrigger: { trigger: ".intro_section", start: "top 92%", end: "top 50%", toggleActions: "none play none reset" }
      });
      introScroll
        .from(".intro_subhead", { y: 20, opacity: 0, duration: 1.5, ease: "expo.out" })
        .from(self.lines, { y: 20, duration: 2, opacity: 0, stagger: { amount: 0.5 }, ease: "expo.out" }, "<0.2");
      return introScroll;
    },
  });
}

function initAboutIntroAnimation() {
  if (!document.querySelector(".about_intro_text")) return;
  SplitText.create(".about_intro_text", { type: "words, lines", linesClass: "line", wordsClass: "word", charsClass: "char", autoSplit: true });

  let aboutIntro = gsap.timeline({});
  aboutIntro
    .from(".about_subhead", { y: 20, opacity: 0, duration: 1.5, delay: 1.25, ease: "expo.out" })
    .fromTo(".about_intro_text .line",
      { y: 20, opacity: 0, rotateX: -30, transformPerspective: 800, transformOrigin: "top" },
      { y: 0, opacity: 1, rotateX: 0, ease: "expo.out", duration: 1, stagger: 0.2 }, "<0.2"
    );
}

function initProjectAnimation() {
  if (!document.querySelector(".work_project_title")) return;
  SplitText.create(".work_project_title", { type: "words", linesClass: "line", wordsClass: "word", charsClass: "char" });

  let projectHero = gsap.timeline({});
  projectHero
    .from(".hero_work_title_image_mask", { delay: 1.25, height: 0, transformOrigin: "center bottom", duration: 1, ease: "expo.out" })
    .from(".work_project_title .word", { y: 20, opacity: 0, ease: "expo.out", duration: 1, stagger: 0.1 }, "<")
    .from(".work_project_description", { y: 20, duration: 1.5, opacity: 0, ease: "expo.out" }, ">-0.75");
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WORK & PROJECTS SECTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initWorkScrollIn() {
  if (!document.querySelector(".work_section")) return;
  let workHomeScrollIn = gsap.timeline({
    scrollTrigger: { trigger: ".work_section", start: "top 100%", end: "top 80%", toggleActions: "none play none reset" },
  });
  workHomeScrollIn.from(".work_headline_container", { y: 50, opacity: 0, ease: "expo.out", duration: 1.5 });
  workHomeScrollIn.from(".work_container", { y: 50, opacity: 0, ease: "expo.out", duration: 1.5 }, "< 0.2");
}

function initWorkImageParallax() {
  // Requires jQuery based on your original code
  if(typeof $ !== 'undefined') {
    $(".work_image_wrapper").each(function () {
      let workImageScroll = gsap.timeline({
        scrollTrigger: { trigger: $(this), start: "top bottom", end: "bottom top", scrub: true },
      });
      workImageScroll.to($(this).find(".work_thumbnail_image"), { y: "12.5%" });
    });
  }
}

function initWorkItemHover() {
  if(typeof $ !== 'undefined') {
    $(".work_item_container").each(function () {
      let workItemTimeline = gsap.timeline({ paused: true });
      workItemTimeline.to($(this).find(".pink_slider"), { y: "-100%", duration: 1, ease: "quint.inOut" });
      workItemTimeline.to($(this).find(".work_preview_container"), { opacity: 1, duration: 0.2, ease: "quint.inOut" }, "<0.4");
      $(this).on("mouseenter", () => workItemTimeline.play());
      $(this).on("mouseleave", () => workItemTimeline.reverse());
    });
  }
}

function initNextProjectScroll() {
  if (!document.querySelector(".next_project")) return;
  
  let isReadyForScrollIndicator = false;
  let scrollProgress = 0;

  ScrollTrigger.create({
    trigger: ".next_project", start: "99% bottom", end: "top bottom",
    onEnter: () => { isReadyForScrollIndicator = true; },
    onLeaveBack: () => { isReadyForScrollIndicator = false; resetScrollIndicator(); },
  });

  function resetScrollIndicator() {
    scrollProgress = 0;
    gsap.to(".scroll_indicator", { width: "0%", duration: 1, ease: "quint.inOut" });
    gsap.to(".next_project_image", { filter: "saturate(0)", duration: 0.5, ease: "linear" });
  }

  window.addEventListener("wheel", (event) => {
    if (isReadyForScrollIndicator && event.deltaY > 0) {
      let isTrackpad = Math.abs(event.deltaY) < 50;
      let scrollStep = isTrackpad ? 1 : 5;
      scrollProgress = Math.min(scrollProgress + scrollStep, 100);

      gsap.to(".scroll_indicator", { width: `${scrollProgress}%`, duration: 0.2, ease: "linear" });
      gsap.to(".next_project_image", { filter: `saturate(${scrollProgress / 100})`, duration: 0.2, ease: "linear" });

      if (scrollProgress >= 100) {
        const linkElement = document.querySelector(".notice_link");
        if (linkElement && linkElement.getAttribute("href")) {
          if(window.playPageTransition) window.playPageTransition(linkElement.getAttribute("href"));
        }
      }
    }
  });
}

function initWorkTitleList() {
  function updateHeight() {
    const element = document.querySelector(".work_title_item_container");
    if (element) {
      document.documentElement.style.setProperty("--work-title-height", `${element.offsetHeight}px`);
      heightInitialized = true;
      updateActiveItems();
    }
  }

  function updateActiveItems() {
    if (!heightInitialized) { updateHeight(); return; }
    const activationCenter = window.innerHeight * 0.525;
    const items = Array.from(document.querySelectorAll(".work-title_list_item"));
    let closestItem = null;
    let smallestDistance = Infinity;

    items.forEach((item) => {
      if (item.dataset.filterStatus === "active" || item.dataset.filterStatus === undefined || item.style.visibility !== "hidden") {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(activationCenter - itemCenter);
        if (distance < smallestDistance) { smallestDistance = distance; closestItem = item; }
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
        video.classList.toggle("active", video.getAttribute("data-work-scroll-video-name") === listName);
      });
    } else {
      videos.forEach((video) => video.classList.remove("active"));
    }
    isScrolling = false;
    initialScrollExecuted = true;
  }

  // Initial Aufrufe & Event Listener
  updateHeight();
  setTimeout(updateHeight, 100);
  setTimeout(updateActiveItems, 100);

  window.addEventListener("load", () => {
    requestAnimationFrame(() => requestAnimationFrame(() => updateHeight()));
    setTimeout(updateActiveItems, 100);
  });

  window.addEventListener("resize", () => {
    updateHeight();
    setTimeout(updateActiveItems, 50);
  });

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(updateActiveItems);
    }
  }, { passive: true });

  window.updateActiveItemsExport = updateActiveItems; // Export for filter function
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CMS & FILTER
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initCmsFooter() {
  const currentPath = window.location.pathname;
  const currentSlug = currentPath.split("/").pop();
  const projects = Array.from(document.querySelectorAll("#link-util [data-link]"));
  const currentProject = projects.find((p) => p.getAttribute("data-link") === currentSlug);

  if (!currentProject) return;

  const currentIndex = projects.indexOf(currentProject);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  
  const noticeLink = document.querySelector(".notice_link");
  const nameElement = document.querySelector("[data-next-name]");
  const imgWrapper = document.querySelector(".next_project_image_wrapper");

  if (noticeLink && nameElement && imgWrapper) {
    noticeLink.href = `${window.location.origin}/work/${nextProject.getAttribute("data-link")}`;
    nameElement.textContent = nextProject.getAttribute("data-name");
    imgWrapper.innerHTML = "";
    imgWrapper.appendChild(nextProject.querySelector("img").cloneNode(true));
  }
}

function initCmsMoreProjects() {
  const currentSlug = window.location.pathname.split("/").pop();
  const visibleItems = Array.from(document.querySelectorAll(".more_projects_item"));
  const visibleSlugs = visibleItems.map((item) => {
    const link = item.querySelector(".more_projects_item_link_container");
    return link ? link.href.split("/").pop() : null;
  }).filter(Boolean);

  const currentIndex = visibleSlugs.findIndex((slug) => slug === currentSlug);
  if (currentIndex === -1) return;

  const allProjects = Array.from(document.querySelectorAll("#link-util [data-link]"));
  const replacementSlug = allProjects.map((p) => p.getAttribute("data-link")).find((s) => !visibleSlugs.includes(s) && s !== currentSlug);
  if (!replacementSlug) return;

  const currentItem = visibleItems[currentIndex];
  const replacementProject = allProjects.find((p) => p.getAttribute("data-link") === replacementSlug);

  const linkElement = currentItem.querySelector(".more_projects_item_link_container");
  if (linkElement) linkElement.href = `/projekte/${replacementSlug}`;

  const nameElement = currentItem.querySelector("[data-more-name]");
  if (nameElement) nameElement.textContent = replacementProject.getAttribute("data-name");

  const oldImage = currentItem.querySelector("[data-more-image]");
  if (oldImage) {
    const newImage = replacementProject.querySelector("img").cloneNode(true);
    newImage.className = "more_projects_image";
    newImage.style.filter = "none";
    newImage.setAttribute("data-more-image", "");
    oldImage.replaceWith(newImage);
  }
}

function initFilterBasic() {
  const filterButtons = document.querySelectorAll("[data-filter-target]");
  const allFilterItems = document.querySelectorAll("[data-filter-name]");
  
  const updateItemStatus = (item, shouldBeActive) => {
    item.setAttribute("data-filter-status", shouldBeActive ? "active" : "not-active");
    item.setAttribute("aria-hidden", !shouldBeActive);
  };

  const handleFilter = (target) => {
    if (window.activeFilterTimeouts) window.activeFilterTimeouts.forEach((id) => clearTimeout(id));
    const timeoutIds = [];
    const isAllFilter = target === "all";
    const TRANSITION_OUT_DURATION = 300;
    const STAGGER_DELAY = isAllFilter ? 80 : 50;

    allFilterItems.forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.filterStatus === "active") {
        item.dataset.filterStatus = "transition-out";
        timeoutIds.push(setTimeout(() => updateItemStatus(item, false), TRANSITION_OUT_DURATION));
      }
    });

    lastActiveItem = null;

    timeoutIds.push(setTimeout(() => {
      const activeItems = Array.from(allFilterItems).filter((item) => target === "all" || item.dataset.filterName === target);
      const INITIAL_DELAY = isAllFilter ? 150 : 0;
      const firstItem = activeItems[0];
      
      if (firstItem) {
        firstItem.style.transform = "translateY(1.5rem)";
        firstItem.style.opacity = "0";
        void firstItem.offsetHeight; // Force reflow
        firstItem.dataset.filterStatus = "active";
        firstItem.setAttribute("aria-hidden", "false");

        setTimeout(() => {
          firstItem.style.transform = "";
          firstItem.style.opacity = "";
          firstItem.classList.add("active");
          lastActiveItem = firstItem;

          const firstItemName = firstItem.getAttribute("data-work-scroll-list-name");
          document.querySelectorAll(".work_video_item").forEach((video) => {
            video.classList.toggle("active", video.getAttribute("data-work-scroll-video-name") === firstItemName);
          });
        }, 10);
      }

      activeItems.slice(1).forEach((item, index) => {
        timeoutIds.push(setTimeout(() => {
          item.style.transform = "translateY(1.5rem)";
          item.style.opacity = "0";
          item.dataset.filterStatus = "active";
          item.setAttribute("aria-hidden", "false");
          void item.offsetHeight;
          item.style.transform = "";
          item.style.opacity = "";

          if (index === activeItems.length - 2 && window.updateActiveItemsExport) {
            setTimeout(window.updateActiveItemsExport, 300);
          }
        }, INITIAL_DELAY + (index + 1) * STAGGER_DELAY));
      });
    }, TRANSITION_OUT_DURATION + 50));

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filterTarget === target;
      btn.dataset.filterStatus = isActive ? "active" : "not-active";
      btn.setAttribute("aria-pressed", isActive);
    });

    window.activeFilterTimeouts = timeoutIds;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.filterStatus === "active") return;
      handleFilter(button.dataset.filterTarget);
    });
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MISC COMPONENTS (Stagger, Contact, Footer, VideoJS)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initStaggerLinks() {
  SplitText.create("[stagger-link-text]", { type: "words, chars", linesClass: "line", wordsClass: "word", charsClass: "char" });
  document.querySelectorAll("[stagger-link]").forEach((link) => {
    const letters = link.querySelectorAll("[stagger-link-text] .char");
    link.addEventListener("mouseenter", () => gsap.to(letters, { yPercent: -100, duration: 0.5, ease: "expo.inOut", stagger: { each: 0.01 }, overwrite: true }));
    link.addEventListener("mouseleave", () => gsap.to(letters, { yPercent: 0, duration: 0.4, ease: "expo.inOut", stagger: { each: 0.01, from: "end" } }));
  });
}

function initContactScroll() {
  if (!document.querySelector(".contact_section")) return;
  SplitText.create("#contactHeadline", { linesClass: "line", wordsClass: "word", charsClass: "char", type: "words, lines", autoSplit: true });
  let contactScrollIn = gsap.timeline({ scrollTrigger: { trigger: ".contact_section", start: "top 100%", end: "top 80%", toggleActions: "none play none reset" } });
  contactScrollIn.from(".contact_wrapper", { y: 100, opacity: 0, duration: 1.5, ease: "expo.out" })
                 .from(".contact_headline .line", { y: 10, duration: 1.5, opacity: 0, stagger: { amount: 0.3 }, ease: "expo.out" }, "<0.2");
}

function initFooterScroll() {
  if (!document.querySelector(".footer_section")) return;
  let footerScrollIn = gsap.timeline({ scrollTrigger: { trigger: ".footer_section", start: "top 100%", end: "top 80%", toggleActions: "play none none none" } });
  footerScrollIn.from(".footer_wrapper", { yPercent: 75, ease: "expo.out", duration: 1.25 });
  // ID vergeben für Refresh Checks in Accordion
  footerScrollIn.vars.id = "footerScrollIn"; 
}

function initVJSPlayer() {
  if (typeof videojs === 'undefined') return;
  document.querySelectorAll(".vjs-player").forEach((vjsPlayer) => {
    const wrapper = vjsPlayer.closest(".vjs-player-wrapper");
    if (!wrapper) return;

    const vjsElement = vjsPlayer.querySelector("div");
    if (vjsElement) vjsElement.classList.add("video-js", "vjs-default-skin");

    const vjsVideoLink = vjsPlayer.getAttribute("data-vjs-video-id");
    if (!vjsVideoLink) return;
    
    const videoElement = vjsPlayer.querySelector("video");
    if (!videoElement) return;
    videoElement.setAttribute("src", `https://dl.dropboxusercontent.com/scl/fi/${vjsVideoLink}`);

    const player = videojs(videoElement, { inactivityTimeout: 300, userActions: { doubleClick: false, hotkeys: false } });

    // Event Listeners for Player
    wrapper.addEventListener("touchstart", () => { player.userActive(true); wrapper.classList.add("vjs-touch-active"); setTimeout(() => wrapper.classList.remove("vjs-touch-active"), 200); });
    player.on("useractive", () => { wrapper.classList.add("vjs-user-active"); wrapper.classList.remove("vjs-user-inactive"); if ("ontouchstart" in window) player.reportUserActivity(); });
    player.on("userinactive", () => { wrapper.classList.remove("vjs-user-active"); wrapper.classList.add("vjs-user-inactive"); });

    const posterImage = wrapper.querySelector(".vjs-player__poster-image");
    if (posterImage) player.poster(posterImage.getAttribute("src"));

    wrapper.addEventListener("mouseenter", () => { player.userActive(true); wrapper.setAttribute("data-vjs-hover", "true"); });
    wrapper.addEventListener("mouseleave", () => { player.reportUserActivity(); wrapper.setAttribute("data-vjs-hover", "false"); });
    wrapper.addEventListener("mousemove", () => { if (!player.userActive()) player.userActive(true); player.reportUserActivity(); });

    player.on("loadeddata", () => { 
      wrapper.setAttribute("data-vjs-loaded", "true");
      const isMuted = wrapper.getAttribute("data-vjs-muted") === "true";
      player.volume(isMuted ? 0 : 1);
      player.muted(isMuted);
    });
    player.on("playing", () => { wrapper.setAttribute("data-vjs-activated", "true"); wrapper.setAttribute("data-vjs-playing", "true"); });
    player.on("pause", () => wrapper.setAttribute("data-vjs-playing", "false"));

    const playBtn = wrapper.querySelector('[data-vjs-control="play"]');
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        const isMuted = wrapper.getAttribute("data-vjs-muted") === "true";
        player.volume(isMuted ? 0 : 1);
        player.muted(isMuted);
        player.play().then(() => { if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) player.muted(false); })
                     .catch((err) => { if (err.name === "NotAllowedError") { player.muted(true); player.play(); } });
      });
    }

    const pauseBtn = wrapper.querySelector('[data-vjs-control="pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        player.pause();
        if (wrapper.getAttribute("data-vjs-autoplay") === "true") wrapper.setAttribute("data-vjs-paused-by-user", "true");
      });
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EFFECTS & PLUGINS (Ellipse, Trail, MatterJS, Swiper, Gallery)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initEllipseCarousel() {
  const items = document.querySelectorAll(".people-card_item");
  if (items.length === 0 || !document.querySelector("#pathEllipse")) return;

  let animationTweens = [];
  let lastHoveredItem = null;
  const infoItem = document.querySelector(".people-card_info_item");
  const infoName = document.querySelector(".info-name");
  const infoRole = document.querySelector(".info-role");

  const initAnimations = () => {
    const pathElement = document.querySelector("#pathEllipse");
    if (!pathElement) return;
    animationTweens.forEach((tween) => tween.kill());
    animationTweens = [];

    gsap.set(".people-card_item", { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%", overwrite: true });
    const duration = pathElement.getTotalLength() / 75;

    items.forEach((item, index) => {
      animationTweens.push(gsap.to(item, {
        duration: duration, ease: "linear", repeat: -1,
        motionPath: { path: "#pathEllipse", align: "#pathEllipse", start: index / items.length, end: index / items.length + 1 }
      }));
    });
  };

  const updateInfo = (item) => { infoName.textContent = item.dataset.name; infoRole.textContent = item.dataset.role; };
  
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      items.forEach((c) => c.classList.remove("active"));
      item.classList.add("active");
      gsap.to(infoItem, { autoAlpha: 1, duration: 0.2, onStart: () => updateInfo(item) });
      lastHoveredItem = item;
    });
  });

  document.addEventListener("mouseleave", (e) => {
    if (e.target instanceof Element && !e.target.closest(".people-card_item") && lastHoveredItem) {
      items.forEach((c) => c.classList.remove("active"));
      lastHoveredItem.classList.add("active");
      updateInfo(lastHoveredItem);
    }
  });

  window.addEventListener("resize", () => setTimeout(initAnimations, 100));
  initAnimations();
  
  const initialItem = items[items.length - 1];
  updateInfo(initialItem);
  gsap.set(infoItem, { autoAlpha: 1 });
  lastHoveredItem = initialItem;
  initialItem.classList.add("active");
}

function initImageTrail() {
  const wrapper = document.querySelector('[data-trail="wrapper"]');
  if (!wrapper || window.innerWidth < 992) return;

  const state = { trailInterval: null, globalIndex: 0, last: { x: 0, y: 0 }, trailImageTimestamps: new Map(), trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')), isActive: false };

  function activate(trailImage, x, y) {
    if (!trailImage) return;
    const rect = trailImage.getBoundingClientRect();
    Object.assign(trailImage.style, { left: `${x - rect.width / 2}px`, top: `${y - rect.height / 2}px`, zIndex: state.globalIndex, display: "block" });
    state.trailImageTimestamps.set(trailImage, Date.now());
    gsap.fromTo(trailImage, { autoAlpha: 0, scale: 0.8 }, { scale: 1, autoAlpha: 1, duration: 0.2, overwrite: true });
    state.last = { x, y };
  }

  function fadeOut(img) {
    if (!img) return;
    gsap.to(img, { opacity: 0, scale: 0.2, duration: 0.8, ease: "expo.out", onComplete: () => gsap.set(img, { autoAlpha: 0 }) });
  }

  function handleMove(e) {
    if (!state.isActive) return;
    const rect = wrapper.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    if (Math.hypot(relX - state.last.x, relY - state.last.y) > window.innerWidth / 15) {
      activate(state.trailImages[state.globalIndex % state.trailImages.length], relX, relY);
      fadeOut(state.trailImages[(state.globalIndex - 5) % state.trailImages.length]);
      state.globalIndex++;
    }
  }

  function cleanup() {
    const now = Date.now();
    for (const [img, ts] of state.trailImageTimestamps.entries()) {
      if (now - ts > 300) { fadeOut(img); state.trailImageTimestamps.delete(img); }
    }
  }

  const start = () => { if (!state.isActive) { state.isActive = true; wrapper.addEventListener("mousemove", handleMove); state.trailInterval = setInterval(cleanup, 100); } };
  const stop = () => { if (state.isActive) { state.isActive = false; wrapper.removeEventListener("mousemove", handleMove); clearInterval(state.trailInterval); state.trailImages.forEach(fadeOut); state.trailImageTimestamps.clear(); } };

  ScrollTrigger.create({ trigger: wrapper, start: "top bottom", end: "bottom top", onEnter: start, onEnterBack: start, onLeave: stop, onLeaveBack: stop });
  window.addEventListener("resize", () => { window.innerWidth < 992 && state.isActive ? stop() : window.innerWidth >= 992 && !state.isActive && start(); });
}

function initMatterJS() {
  ScrollTrigger.create({
    trigger: ".canvas-matter", start: "top center", once: true,
    onEnter: () => {
      const canvas = document.querySelector("#canvas-target");
      if (!canvas || typeof Matter === 'undefined') return;

      const wordsToDisplay = ["Qualität", "Kundenorientierung", "Menschlichkeit", "Verantwortung", "Nachhaltigkeit", "Gewaltfreie Kommunikation", "Solidarität", "Toleranz", "Akzeptanz", "Weltoffenheit", "Zusammenhalt"];
      const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;
      const engine = Engine.create(); engine.world.gravity.y = 2;
      
      const render = Render.create({ element: canvas, engine: engine, options: { background: "transparent", wireframes: false, width: canvas.offsetWidth, height: canvas.offsetHeight, pixelRatio: window.devicePixelRatio || 1 } });
      Render.run(render);

      const walls = [
        Bodies.rectangle(-canvas.offsetWidth/4, canvas.offsetHeight/2, canvas.offsetWidth/2, canvas.offsetHeight, { isStatic: true, render: { visible: false } }),
        Bodies.rectangle(canvas.offsetWidth + canvas.offsetWidth/4, canvas.offsetHeight/2, canvas.offsetWidth/2, canvas.offsetHeight, { isStatic: true, render: { visible: false } }),
        Bodies.rectangle(canvas.offsetWidth/2, canvas.offsetHeight + canvas.offsetWidth/4, canvas.offsetWidth, canvas.offsetWidth/2, { isStatic: true, render: { visible: false } }),
        Bodies.rectangle(canvas.offsetWidth/2, -canvas.offsetWidth/4, canvas.offsetWidth, canvas.offsetWidth/2, { isStatic: true, render: { visible: false } })
      ];
      Composite.add(engine.world, walls);

      wordsToDisplay.forEach(word => {
        const fontSize = (window.innerWidth < 768) ? canvas.offsetWidth / 11.7 : canvas.offsetWidth / 17.5;
        render.context.font = `700 ${fontSize}px 'Helvetica Neue', sans-serif`;
        const textWidth = render.context.measureText(word).width;
        const body = Bodies.rectangle(Math.random() * (canvas.offsetWidth - textWidth) + textWidth/2, -fontSize*2, textWidth, fontSize, { restitution: 0.75, render: { fillStyle: "transparent", strokeStyle: "transparent" } });
        body.word = word; body.fontSize = fontSize;
        Composite.add(engine.world, body);
      });

      Runner.run(Runner.create(), engine);
      Composite.add(engine.world, MouseConstraint.create(engine, { mouse: Mouse.create(render.canvas), constraint: { stiffness: 0.2, render: { visible: false } } }));

      Events.on(render, "afterRender", () => {
        engine.world.bodies.forEach(body => {
          if (body.word) {
            render.context.save();
            render.context.translate(body.position.x, body.position.y);
            render.context.rotate(body.angle);
            render.context.textAlign = "center";
            render.context.textBaseline = "middle";
            render.context.font = `700 ${body.fontSize}px 'Helvetica Neue', sans-serif`;
            render.context.fillStyle = "#fff";
            render.context.fillText(body.word, 0, 0);
            render.context.restore();
          }
        });
      });
    }
  });
}

function initServiceSwiper() {
  if (document.querySelector(".swiper-services") && typeof Swiper !== 'undefined') {
    new Swiper(".swiper-services", {
      direction: "horizontal", loop: true, speed: 1000,
      breakpoints: { 320: { slidesPerView: 1.5, spaceBetween: 16 }, 480: { slidesPerView: 2.5, spaceBetween: 16 }, 640: { slidesPerView: 4, spaceBetween: 16 } },
      navigation: { nextEl: ".swiper-btn-next", prevEl: ".swiper-btn-prev" }
    });
  }
}

function initServiceHome() {
  const heading = document.getElementById("planung-heading");
  if (heading && window.innerWidth <= 768) heading.innerHTML = "Planung, Planung,<br>Planung";

  const wrap = document.querySelector('[data-sticky-title="wrap"]');
  if (!wrap) return;

  if (window.splitTextInstances) window.splitTextInstances.forEach((i) => i.revert());
  window.splitTextInstances = [];
  
  const containers = Array.from(wrap.querySelectorAll(".service_container"));
  containers.forEach(c => gsap.set(c, { autoAlpha: 0 }));

  containers.forEach(c => {
    const t = c.querySelector(".sticky-title-el");
    const p = c.querySelector(".sticky-paragraph-el");
    if (t) { c.titleSplit = new SplitText(t, { type: "words,chars", charsClass: "char", wordsClass: "word" }); window.splitTextInstances.push(c.titleSplit); }
    if (p) { c.paraSplit = new SplitText(p, { type: "words,lines", linesClass: "split-line", wordsClass: "word", charsClass: "char" }); window.splitTextInstances.push(c.paraSplit); }
  });

  const masterTl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: "top 40%", end: "bottom bottom", scrub: true } });

  containers.forEach((c, i) => {
    const chars = c.titleSplit ? c.titleSplit.chars : [];
    const lines = c.paraSplit ? c.paraSplit.lines : [];
    if (!chars.length && !lines.length) return;

    gsap.set(chars, { autoAlpha: 0, y: 20 });
    gsap.set(lines, { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline();
    tl.set(c, { visibility: "visible", autoAlpha: 1, onStart: () => { c.classList.remove("is--stacked"); if (i > 0) { for (let j=0; j<i; j++) gsap.set(containers[j], { autoAlpha: 0 }); } } });
    if (chars.length) tl.to(chars, { autoAlpha: 1, y: 0, stagger: 0.02, duration: 0.6, ease: "power2.out" });
    if (lines.length) tl.to(lines, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" }, chars.length ? `+=0` : 0);
    
    if (i < containers.length - 1 && (chars.length || lines.length)) {
      tl.to([...chars, ...lines], { autoAlpha: 0, y: -20, stagger: 0.02, duration: 0.4 }, `+=0.3`);
      tl.set(c, { autoAlpha: 0 });
    }
    tl.set(c, { onComplete: () => c.classList.add("is--stacked") });
    masterTl.add(tl, i === 0 ? 0 : `-=0`);
  });
}

function initAccordion() {
  const refreshLayout = () => {
    window.dispatchEvent(new Event("resize"));
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };

  document.querySelectorAll("[data-accordion-css-init]").forEach((accordion) => {
    accordion.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-accordion-toggle]");
      const item = toggle?.closest("[data-accordion-status]");
      if (!item) return;
      const isActive = item.getAttribute("data-accordion-status") === "active";
      item.setAttribute("data-accordion-status", isActive ? "not-active" : "active");
      
      if (accordion.getAttribute("data-accordion-close-siblings") === "true" && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sib) => { if (sib !== item) sib.setAttribute("data-accordion-status", "not-active"); });
      }
      [50, 300, 600].forEach(d => setTimeout(refreshLayout, d));
    });
  });

  const btn = document.querySelector(".accordion-css__toggle-button");
  if (btn) {
    let expanded = false;
    const items = document.querySelectorAll(".accordion-css__item");
    const update = () => {
      items.forEach((item, i) => item.classList.toggle("visible", expanded || i < 6));
      btn.querySelector(".button-text").textContent = expanded ? "Weniger anzeigen" : "Mehr anzeigen";
    };
    btn.addEventListener("click", () => { expanded = !expanded; update(); [50, 300].forEach(d => setTimeout(refreshLayout, d)); });
    update();
  }

  if (document.querySelectorAll('[data-accordion-status="active"]').length > 0) [50, 300].forEach(d => setTimeout(refreshLayout, d));
}

function initGalleryScroll() {
  const container = document.querySelector(".mwg_effect033 .container");
  if (!container) return;
  const medias = container.querySelectorAll(".media");
  if (!medias.length) return;

  gsap.to(".scroll", { autoAlpha: 0, duration: 0.5, scrollTrigger: { trigger: ".mwg_effect033", start: "top top", end: "top top-=1", toggleActions: "play none reverse none" } });

  medias.forEach(media => gsap.set(media, { x: (Math.random() - 0.5) * 0.1 * window.innerWidth, y: (Math.random() - 0.5) * 0.05 * window.innerWidth }));
  
  const distance = container.clientWidth - document.body.clientWidth;
  const scrollTween = gsap.to(container, { x: -distance, ease: "none", scrollTrigger: { trigger: container.parentNode, pin: true, scrub: 1, end: "+=" + distance, invalidateOnRefresh: true } });

  const interval = Math.ceil(medias.length / (window.innerWidth <= 768 ? 12 : 24));
  medias.forEach((media, index) => {
    if (window.innerWidth <= 768 && index % interval !== 0) return;
    const rot = (Math.random() - 0.5) * 40;
    const yP = (Math.random() - 0.5) * 150;
    const xP = Math.random() * 200;

    gsap.from(media, { rotation: rot, yPercent: yP, xPercent: xP, ease: "power1.out", scrollTrigger: { trigger: media, containerAnimation: scrollTween, start: "left 110%", end: "left 65%", scrub: 1 } });
    gsap.fromTo(media, { rotation: 0, yPercent: 0, xPercent: 0 }, { rotation: rot, yPercent: yP, xPercent: -xP, ease: "power1.in", scrollTrigger: { trigger: media, containerAnimation: scrollTween, start: "right 35%", end: "right -10%", scrub: 1 } });
  });
}
