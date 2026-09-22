/* ============================================================
   WEDDING INVITATION — js/main.js
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// CONFIGURATION — swap these for real details
// ──────────────────────────────────────────────────────────────
const CONFIG = {
  brideName: "Kaushani",
  groomName: "Kanishka",
  brideInitial: "K",
  groomInitial: "K",
  monogram: "K & K",
  weddingDate: "October 29, 2026",
  weddingDateISO: "2026-10-29T10:00:00",
  weddingYear: 2026,
  weddingCity: "Ganemulla, Sri Lanka",
  rsvpDeadline: "September 30, 2026",
  iban: "LK1234 5678 9012 3456 7890 12",
  bankName: "Bank of Ceylon",
  accountHolder: "Kanishka & Kaushani",
  ceremony: {
    name: "St. Anthony's Church",
    time: "10:00 AM",
    address: "61 Kochchikade Street, Colombo 13, Sri Lanka",
    mapsUrl: "https://www.google.com/maps?q=St+Anthony%27s+Church+Colombo",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7987!2d79.8538!3d6.9366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259d97c637e51%3A0xd4f8fc5dfd0c54b5!2sSt.%20Anthony%27s%20Shrine%2C%20Kochchikade!5e0!3m2!1sen!2slk!4v1",
    parking: "Free street parking available on Kochchikade Street."
  },
  reception: {
    name: "Cinnamon Grand Ballroom",
    time: "6:30 PM",
    address: "77 Galle Road, Colombo 03, Sri Lanka",
    mapsUrl: "https://www.google.com/maps?q=Cinnamon+Grand+Colombo",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.12!2d79.8497!3d6.9108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25932f6771ce5%3A0xdf79b68d0e879b08!2sCinnamon%20Grand%20Colombo!5e0!3m2!1sen!2slk!4v1",
    parking: "Valet parking provided. Complimentary self-parking on levels B1–B3."
  }
};

// ──────────────────────────────────────────────────────────────
// DOM READY
// ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  populateContent();
  initCountdown();
  initScrollReveal();
  initTabs();
  initCollapsible();
  initCopyIBAN();
  initCalendarButton();
  initSmoothScroll();
  initGallery();
  initRSVP();

  // Preloader drives hero reveal — initHero is called from inside
  initPreloader();
});

// ──────────────────────────────────────────────────────────────
// PRELOADER — Envelope opening animation
// ──────────────────────────────────────────────────────────────
function initPreloader() {
  const preloader = document.getElementById("preloader");

  // Safety: if the HTML element is missing, fall back gracefully
  if (!preloader) {
    initHero();
    initSoundToggle();
    return;
  }

  // Lock scrolling while the envelope is showing
  document.body.classList.add("preloader-active");

  const envBody     = preloader.querySelector(".env-body");
  const seal        = document.getElementById("env-seal");
  const progressBar = document.getElementById("env-progress-bar");

  // ── Images to preload (hero + first 5 gallery slides) ──────
  const PRIORITY_IMAGES = [
    "images/ENV_6880.webp",  // hero background
    "images/ENV_6299.webp",
    "images/ENV_6335.webp",
    "images/ENV_6344.webp",
    "images/ENV_6391.webp",
    "images/ENV_6428.webp",
  ];

  const MIN_DISPLAY_MS = 1300;
  const MAX_DISPLAY_MS = 6000;

  let openAllowed    = false; // true once min time + images ready
  let openRequested  = false; // true if user tapped early
  let alreadyOpened  = false;

  // ── Preload images, track progress ─────────────────────────
  let loaded = 0;
  const total = PRIORITY_IMAGES.length;

  function onImageSettled() {
    loaded++;
    if (progressBar) {
      progressBar.style.width = Math.round((loaded / total) * 100) + "%";
    }
    if (loaded >= total) onImagesReady();
  }

  const imagePromises = PRIORITY_IMAGES.map(src => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => { onImageSettled(); resolve(); };
      img.src = src;
    });
  });

  // ── Timing gates ────────────────────────────────────────────
  const startTime = Date.now();
  let imagesReady = false;
  let minTimeReady = false;

  function onImagesReady() {
    imagesReady = true;
    tryOpen();
  }

  function tryOpen() {
    if (alreadyOpened) return;
    if ((imagesReady || openRequested) && minTimeReady) {
      openAllowed = true;
      doOpen();
    }
  }

  // Minimum display time
  setTimeout(() => {
    minTimeReady = true;
    if (seal) seal.classList.add("env-ready"); // start pulsing to hint it's tappable
    tryOpen();
  }, MIN_DISPLAY_MS);

  // Hard cap — open regardless after MAX_DISPLAY_MS
  setTimeout(() => {
    if (!alreadyOpened) {
      imagesReady = true;
      minTimeReady = true;
      doOpen();
    }
  }, MAX_DISPLAY_MS);

  // ── User tap to open early (once min time passed) ───────────
  function handleTap() {
    openRequested = true;
    if (minTimeReady) {
      doOpen();
    }
    // If minTime hasn't passed yet, tryOpen() will catch it when it does
  }

  if (envBody) envBody.addEventListener("click", handleTap);
  if (seal)    seal.addEventListener("click", handleTap);

  // ── The actual opening sequence ─────────────────────────────
  function doOpen() {
    if (alreadyOpened) return;
    alreadyOpened = true;

    // Remove tap listeners
    if (envBody) envBody.removeEventListener("click", handleTap);
    if (seal)    seal.removeEventListener("click", handleTap);
    if (seal)    seal.classList.remove("env-ready");

    // Progress bar to 100%
    if (progressBar) progressBar.style.width = "100%";

    // Step 1: flap opens + seal breaks
    if (envBody) envBody.classList.add("env-opening");

    // Give user gesture to music (tap = guaranteed user interaction)
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().catch(() => {});
    }

    // Step 2: after flap animation (700ms), expand & fade whole envelope
    setTimeout(() => {
      preloader.classList.add("env-open");

      // Step 3: trigger hero reveal at same moment
      initHero();
      initSoundToggle();

      // Step 4: after expand animation (550ms), add exit fade & restore scroll
      setTimeout(() => {
        preloader.classList.add("env-exit");
        document.body.classList.remove("preloader-active");

        // Step 5: after fade (700ms), remove from DOM entirely
        setTimeout(() => {
          preloader.remove();
        }, 750);
      }, 560);
    }, 720);
  }
}


// ──────────────────────────────────────────────────────────────
// POPULATE CONTENT
// ──────────────────────────────────────────────────────────────
function populateContent() {
  // Hero
  document.getElementById("hero-bride").textContent = CONFIG.brideName;
  document.getElementById("hero-groom").textContent = CONFIG.groomName;
  document.getElementById("hero-date").textContent = CONFIG.weddingDate;
  document.getElementById("hero-city").textContent = CONFIG.weddingCity;


  // Signature
  document.querySelectorAll(".js-bride").forEach(el => el.textContent = CONFIG.brideName);
  document.querySelectorAll(".js-groom").forEach(el => el.textContent = CONFIG.groomName);
  document.querySelectorAll(".js-wedding-date").forEach(el => el.textContent = CONFIG.weddingDate);
  document.querySelectorAll(".js-rsvp-deadline").forEach(el => el.textContent = CONFIG.rsvpDeadline);
  document.querySelectorAll(".js-monogram").forEach(el => el.textContent = CONFIG.monogram);
  document.querySelectorAll(".js-city").forEach(el => el.textContent = CONFIG.weddingCity);

  // Venues
  populateVenue("ceremony", CONFIG.ceremony);
  populateVenue("reception", CONFIG.reception);

}

function populateVenue(type, data) {
  const p = document.getElementById(`${type}-panel`);
  if (!p) return;
  p.querySelector(".venue-name").textContent = data.name;
  p.querySelector(".venue-time-badge").textContent = data.time;
  p.querySelector(".venue-address-text").textContent = data.address;
  p.querySelector(".map-embed").src = data.mapsEmbed;
  p.querySelector(".btn-directions").href = data.mapsUrl;
  p.querySelector(".parking-note-text").textContent = data.parking;
}


// ──────────────────────────────────────────────────────────────
// HERO
// ──────────────────────────────────────────────────────────────
function initHero() {
  // Called by initPreloader when the envelope opens —
  // adding "loaded" immediately triggers the CSS slow-zoom reveal.
  document.getElementById("hero")?.classList.add("loaded");
}



// ──────────────────────────────────────────────────────────────
// COUNTDOWN
// ──────────────────────────────────────────────────────────────
function initCountdown() {
  const target = new Date(CONFIG.weddingDateISO).getTime();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const grid = document.getElementById("countdown-grid");
  const overMsg = document.getElementById("wedding-over");

  function pad(n) { return String(n).padStart(2, "0"); }

  function flash(el) {
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 300);
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      if (grid) grid.style.display = "none";
      if (overMsg) overMsg.style.display = "block";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const newSecs = pad(secs);
    const newMins = pad(mins);
    const newHours = pad(hours);
    const newDays = String(days);

    if (secsEl && secsEl.textContent !== newSecs) { secsEl.textContent = newSecs; flash(secsEl); }
    if (minsEl && minsEl.textContent !== newMins) { minsEl.textContent = newMins; }
    if (hoursEl && hoursEl.textContent !== newHours) { hoursEl.textContent = newHours; }
    if (daysEl && daysEl.textContent !== newDays) { daysEl.textContent = newDays; }
  }

  tick();
  setInterval(tick, 1000);
}

// ──────────────────────────────────────────────────────────────
// SCROLL REVEAL (IntersectionObserver)
// ──────────────────────────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

// ──────────────────────────────────────────────────────────────
// TABS (Locations)
// ──────────────────────────────────────────────────────────────
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab + "-panel");
      if (target) target.classList.add("active");
    });
  });
}

// ──────────────────────────────────────────────────────────────
// COLLAPSIBLE (Gift Registry)
// ──────────────────────────────────────────────────────────────
function initCollapsible() {
  document.querySelectorAll(".collapsible-btn").forEach(btn => {
    const contentId = btn.dataset.target;
    const content = document.getElementById(contentId);
    if (!content) return;

    btn.addEventListener("click", () => {
      const isOpen = content.classList.contains("open");
      btn.classList.toggle("open", !isOpen);
      content.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      content.setAttribute("aria-hidden", String(isOpen));
      btn.querySelector(".collapsible-text").textContent = isOpen ? "Show details" : "Hide details";
    });
  });
}

// ──────────────────────────────────────────────────────────────
// COPY IBAN
// ──────────────────────────────────────────────────────────────
function initCopyIBAN() {
  const btn = document.getElementById("copy-iban-btn");
  const toast = document.getElementById("toast");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.iban.replace(/\s/g, ""));
      btn.classList.add("copied");
      btn.querySelector(".copy-text").textContent = "Copied!";

      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
      }
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.querySelector(".copy-text").textContent = "Copy IBAN";
      }, 2500);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = CONFIG.iban.replace(/\s/g, "");
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      btn.classList.add("copied");
    }
  });
}


// ──────────────────────────────────────────────────────────────
// ADD TO CALENDAR (.ics)
// ──────────────────────────────────────────────────────────────
function initCalendarButton() {
  const btn = document.getElementById("calendar-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    function toICSDate(d) {
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }

    const startDate = new Date(CONFIG.weddingDateISO);
    // Ceremony + reception + party — block out the whole day (12 hours from the start time)
    const endDate = new Date(startDate.getTime() + 12 * 60 * 60 * 1000);

    const start = toICSDate(startDate);
    const end = toICSDate(endDate);
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding//EN",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:Wedding of ${CONFIG.groomName} & ${CONFIG.brideName}`,
      `DESCRIPTION:You are warmly invited to celebrate the wedding of ${CONFIG.groomName} and ${CONFIG.brideName}.`,
      `LOCATION:${CONFIG.ceremony.name}, ${CONFIG.ceremony.address}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-kanishka-kaushani.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ──────────────────────────────────────────────────────────────
// SOUND TOGGLE (placeholder — no actual audio file required)
// ──────────────────────────────────────────────────────────────
function initSoundToggle() {
  const btn = document.getElementById("sound-toggle");
  const icon = document.getElementById("sound-icon");
  const bgMusic = document.getElementById("bg-music");
  if (!btn) return;

  let muted = false; // starts unmuted

  if (bgMusic) {
    bgMusic.play().then(() => {
      btn.setAttribute("aria-label", "Mute music");
      btn.setAttribute("title", "Mute music");
      icon.innerHTML = getSoundOnSVG();
    }).catch(e => {
      console.log("Autoplay blocked:", e);
      muted = true; // revert to muted if blocked
      btn.setAttribute("aria-label", "Unmute music");
      btn.setAttribute("title", "Unmute music");
      icon.innerHTML = getSoundOffSVG();
    });
  }

  btn.addEventListener("click", () => {
    muted = !muted;
    btn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    btn.setAttribute("title", muted ? "Unmute music" : "Mute music");

    icon.innerHTML = muted ? getSoundOffSVG() : getSoundOnSVG();

    if (bgMusic) {
      if (muted) {
        bgMusic.pause();
      } else {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
      }
    }
    //showToastMsg(muted ? "Music muted" : "Playing music 🎵");
  });
}

function getSoundOnSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>`;
}

function getSoundOffSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`;
}

// ──────────────────────────────────────────────────────────────
// SMOOTH SCROLL
// ──────────────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ──────────────────────────────────────────────────────────────
// GALLERY — Seamless Infinite Carousel
// ──────────────────────────────────────────────────────────────
function initGallery() {
  const carousel  = document.getElementById("gallery-carousel");
  const track     = document.getElementById("gc-track");
  const gcPrev    = document.getElementById("gc-prev");
  const gcNext    = document.getElementById("gc-next");
  const dotsWrap  = document.getElementById("gc-dots");
  const origSlides = Array.from(document.querySelectorAll(".gc-slide"));

  if (!carousel || !track || !origSlides.length) return;

  const TOTAL      = origSlides.length;
  const AUTO_DELAY = 2000;   // 2 seconds between auto-advances
  const TRANS_MS   = 650;    // must match CSS transition duration
  let autoTimer    = null;
  let isBusy       = false;  // block rapid-fire clicks during transition

  // ── Build infinite track: [clones] + [real slides] + [clones] ──
  // Layout indices:  0..TOTAL-1  |  TOTAL..2*TOTAL-1  |  2*TOTAL..3*TOTAL-1
  //                 before-clones     real slides          after-clones
  // We start at domIdx = TOTAL (== real slide 0).

  function makeClones(arr) {
    return arr.map(s => {
      const c = s.cloneNode(true);
      c.dataset.clone = "1";
      c.removeAttribute("id");
      c.tabIndex = -1;
      c.setAttribute("aria-hidden", "true");
      return c;
    });
  }

  // Prepend clones-before (insert in reverse so order is preserved)
  const clonesBefore = makeClones(origSlides);
  for (let i = clonesBefore.length - 1; i >= 0; i--) {
    track.insertBefore(clonesBefore[i], track.firstChild);
  }
  // Append clones-after
  const clonesAfter = makeClones(origSlides);
  clonesAfter.forEach(c => track.appendChild(c));

  // All DOM slide nodes (3 × TOTAL)
  const allSlides = Array.from(track.querySelectorAll(".gc-slide"));

  let domIdx  = TOTAL; // current DOM position (starts at first real slide)
  let realIdx = 0;     // current logical index (for dots)

  // ── Sizing ───────────────────────────────────────────────────────
  function landscapeWidth() {
    const vw = window.innerWidth;
    if (vw <= 600) return vw * 0.78;
    if (vw <= 900) return vw * 0.60;
    return Math.min(vw * 0.44, 660);
  }

  function slideGap() { return window.innerWidth <= 600 ? 16 : 24; }

  function applySlideWidths() {
    const lw       = landscapeWidth();
    const lh       = lw * (2 / 3);
    const pw       = lh * (2 / 3);
    allSlides.forEach(s => {
      s.style.width = (s.dataset.orientation === "portrait" ? pw : lw) + "px";
    });
  }

  // ── Dots ─────────────────────────────────────────────────────────
  const dots = [];
  if (dotsWrap) {
    origSlides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "gc-dot";
      d.setAttribute("aria-label", `Go to photo ${i + 1}`);
      d.addEventListener("click", () => { jumpToReal(i); resetAuto(); });
      dotsWrap.appendChild(d);
      dots.push(d);
    });
  }

  function updateActive() {
    allSlides.forEach((s, i) =>
      s.classList.toggle("gc-active", (i % TOTAL) === realIdx)
    );
    dots.forEach((d, i) => d.classList.toggle("gc-dot-active", i === realIdx));
    if (gcPrev) gcPrev.disabled = false;
    if (gcNext) gcNext.disabled = false;
  }

  // ── Offset calculation (sums actual widths for mixed aspect ratios) ──
  function calcOffset(idx) {
    const gap      = slideGap();
    const centerW  = carousel.offsetWidth;
    let sum = 0;
    for (let i = 0; i < idx; i++) sum += allSlides[i].offsetWidth + gap;
    return -sum + (centerW / 2) - (allSlides[idx].offsetWidth / 2);
  }

  function applyOffset(idx, animate) {
    track.style.transition = animate
      ? `transform ${TRANS_MS}ms cubic-bezier(.4,0,.2,1)`
      : "none";
    track.style.transform = `translateX(${calcOffset(idx)}px)`;
  }

  // ── Seamless step (forward: +1, backward: -1) ─────────────────────
  function step(dir) {
    if (isBusy) return;
    isBusy = true;

    domIdx  += dir;
    realIdx  = ((domIdx - TOTAL) % TOTAL + TOTAL) % TOTAL;

    applyOffset(domIdx, true);
    updateActive();

    // After transition completes: if we've drifted into clone zone,
    // silently teleport back to the matching real-slide position.
    setTimeout(() => {
      if (domIdx >= 2 * TOTAL) {
        domIdx -= TOTAL;
        applyOffset(domIdx, false);
      } else if (domIdx < TOTAL) {
        domIdx += TOTAL;
        applyOffset(domIdx, false);
      }
      isBusy = false;
    }, TRANS_MS + 30);
  }

  // ── Jump to a specific real slide (dot / click) ───────────────────
  function jumpToReal(idx) {
    isBusy  = false; // allow immediate jump
    domIdx  = TOTAL + idx;
    realIdx = idx;
    applyOffset(domIdx, true);
    updateActive();
    setTimeout(() => { isBusy = false; }, TRANS_MS + 30);
  }

  // ── Auto-scroll ───────────────────────────────────────────────────
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => step(1), AUTO_DELAY);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function resetAuto() { startAuto(); }

  // ── Init ─────────────────────────────────────────────────────────
  applySlideWidths();
  applyOffset(domIdx, false);
  updateActive();
  startAuto();

  window.addEventListener("resize", () => {
    applySlideWidths();
    applyOffset(domIdx, false);
  });

  // ── Arrows ───────────────────────────────────────────────────────
  if (gcPrev) gcPrev.addEventListener("click", () => { step(-1); resetAuto(); });
  if (gcNext) gcNext.addEventListener("click", () => { step(1);  resetAuto(); });

  // ── Click on real slide → jump to it ─────────────────────────────
  origSlides.forEach((slide, idx) => {
    slide.addEventListener("click", () => { jumpToReal(idx); resetAuto(); });
    slide.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); jumpToReal(idx); resetAuto();
      }
    });
  });

  // ── Hover pause ───────────────────────────────────────────────────
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // ── Keyboard ─────────────────────────────────────────────────────
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { step(1);  resetAuto(); }
    if (e.key === "ArrowLeft")  { step(-1); resetAuto(); }
  });

  // ── Touch swipe ───────────────────────────────────────────────────
  let touchStartX = 0;
  carousel.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  carousel.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? step(1) : step(-1);
    startAuto();
  }, { passive: true });
}


function showToastMsg(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ──────────────────────────────────────────────────────────────
// RSVP — Attend / Decline with Google Form + Counter
// ──────────────────────────────────────────────────────────────
function initRSVP() {
  const btnYes = document.getElementById("rsvp-yes");
  const btnNo = document.getElementById("rsvp-no");
  const countEl = document.getElementById("rsvp-count");
  const confirmEl = document.getElementById("rsvp-confirm");
  const nameInput       = document.getElementById("rsvp-name");
  const guestCountInput = document.getElementById("rsvp-participants"); // <-- අලුත් එක

  if (!btnYes || !btnNo) return;

  // ── Google Form config ────────────────────────────────────────
  // 1. Create a Google Form with two questions:
  //      Q1 "Your Name"        → Short answer
  //      Q2 "Are you attending?" → Multiple choice, options: Attending / Declining
  // 2. Replace FORM_ID below with your form's ID (from its share/edit URL)
  // 3. Replace NAME_ENTRY_ID and ATTEND_ENTRY_ID with the real entry IDs
  //    (see the setup guide for how to find these two numbers)
  const GOOGLE_FORM_URL    = "https://docs.google.com/forms/d/e/1FAIpQLScS4J8n9ARKeAoz_1JctJlrJ0Df5pItoIGdBEyvmRDSgD-Ujw/formResponse";
  const NAME_ENTRY_FIELD   = "entry.1247952776";
  const ATTEND_ENTRY_FIELD = "entry.932895368";
  const COUNT_ENTRY_FIELD  = "entry.1716365246"; // <-- No. of Participants
  const ENTRY_ATTEND  = "Yes";
  const ENTRY_DECLINE = "No";    // Form එකේ එන්නේ නැති අයට තෝරන්න දීලා තියෙන වචනය (උදා: "No") මෙතැනට දෙන්න.
  // ─────────────────────────────────────────────────────────────


  const STORAGE_KEY = "rsvp_kk2026";

  /* ---- Load persisted count / name ---- */
  let count = parseInt(localStorage.getItem(STORAGE_KEY + "_count") || "0", 10);
  const hasResponded = localStorage.getItem(STORAGE_KEY + "_choice");
  const savedName = localStorage.getItem(STORAGE_KEY + "_name") || "";

  setCount(count, false);
  if (nameInput && savedName) nameInput.value = savedName;

  /* ---- If already responded, lock buttons + name field ---- */
  if (hasResponded) {
    lockButtons(hasResponded);
    showConfirm(hasResponded);
    if (nameInput)       nameInput.disabled       = true;
    if (guestCountInput) guestCountInput.disabled = true; // <-- අලුත් එක
  }

  /* ---- Button click handlers ---- */
  btnYes.addEventListener("click", (e) => handleRSVP(e, "yes"));
  btnNo.addEventListener("click", (e) => handleRSVP(e, "no"));

  function handleRSVP(e, choice) {
    if (localStorage.getItem(STORAGE_KEY + "_choice")) return; // already voted

    const guestName  = nameInput        ? nameInput.value.trim()        : "";
    const guestCount = guestCountInput  ? (guestCountInput.value.trim() || "1") : "1"; // <-- අලුත් එක

    if (nameInput && !guestName) {
      nameInput.focus();
      showToastMsg("Please enter your name first 🙂");
      return;
    }

    // Block "Joyfully Accepts" if participant count is 0
    if (choice === "yes" && (parseInt(guestCount, 10) < 1 || guestCount === "" || guestCount === "0")) {
      if (guestCountInput) guestCountInput.focus();
      showToastMsg("Please add the number of participants 🙏");
      return;
    }

    triggerRipple(e);

    if (choice === "yes") {
      count++;
      setCount(count, true);
      fireConfetti(e);
      localStorage.setItem(STORAGE_KEY + "_count", count);
    }

    // Lock the UI and show the message immediately — don't make the guest
    // wait on the network request before they see any feedback.
    localStorage.setItem(STORAGE_KEY + "_choice", choice);
    if (guestName) localStorage.setItem(STORAGE_KEY + "_name", guestName);
    lockButtons(choice);
    showConfirm(choice);
    if (nameInput)       nameInput.disabled       = true;
    if (guestCountInput) guestCountInput.disabled = true; // <-- අලුත් එක

    submitToGoogleForm(guestName, choice === "yes" ? ENTRY_ATTEND : ENTRY_DECLINE, guestCount);
  }

  /* ---- Counter display with animated pop ---- */
  function setCount(n, animate) {
    if (!countEl) return;
    countEl.textContent = n;
    if (animate) {
      countEl.classList.remove("pop");
      void countEl.offsetWidth; // reflow
      countEl.classList.add("pop");
    }
  }

  /* ---- Lock both buttons after responding ---- */
  function lockButtons(choice) {
    btnYes.disabled = true;
    btnNo.disabled = true;
    btnYes.classList.add(choice === "yes" ? "rsvp-btn-chosen" : "rsvp-btn-done");
    btnNo.classList.add(choice === "no" ? "rsvp-btn-chosen" : "rsvp-btn-done");
  }

  /* ---- Confirmation message ---- */
  function showConfirm(choice) {
    if (!confirmEl) return;
    confirmEl.textContent = choice === "yes"
      ? "🎉 Thank you for confirming! We can't wait to celebrate this special day with you."
      : "💌 We're sorry you can't make it — you'll be missed! Thank you so much for letting us know.";
    confirmEl.classList.add("show");
  }

  /* ---- Ripple animation on click ---- */
  function triggerRipple(e) {
    const btn = e.currentTarget;
    const ripple = btn.querySelector(".rsvp-btn-ripple");
    if (!ripple) return;
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + "px";
    ripple.style.top = (e.clientY - rect.top) + "px";
    ripple.classList.remove("ripple-active");
    void ripple.offsetWidth;
    ripple.classList.add("ripple-active");
  }

  /* ---- Confetti burst (yes only) ---- */
  function fireConfetti(e) {
    const colors = ["#b8963e", "#e8c96e", "#fff", "#f4a742", "#d4af5a"];
    const origin = { x: e.clientX, y: e.clientY };
    for (let i = 0; i < 28; i++) {
      const el = document.createElement("div");
      el.className = "rsvp-confetti";
      el.style.cssText = [
        `left:${origin.x + (Math.random() - 0.5) * 120}px`,
        `top:${origin.y + (Math.random() - 0.5) * 60}px`,
        `background:${colors[Math.floor(Math.random() * colors.length)]}`,
        `animation-duration:${0.9 + Math.random() * 0.8}s`,
        `animation-delay:${Math.random() * 0.25}s`,
        `border-radius:${Math.random() > 0.5 ? "50%" : "2px"}`,
        `width:${6 + Math.random() * 6}px`,
        `height:${6 + Math.random() * 6}px`
      ].join(";");
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  /* ---- Submit to Google Form silently in the background ----
     FIX: the old version pointed the form's `target` at an iframe
     named "rsvp-iframe" that was never actually created anywhere in
     the page, so the browser had nowhere to submit to and the
     request effectively went nowhere. Using fetch() with
     mode: "no-cors" sends the same POST directly to Google's
     formResponse endpoint without needing any iframe at all. The
     response is opaque (we can't read it back, and Google Forms
     doesn't support CORS), but the submission itself goes through —
     you'll see it appear in the linked Google Sheet / form responses. */
  function submitToGoogleForm(name, attendValue, count) { // <-- count parameter අලුතින්
    if (GOOGLE_FORM_URL.includes("FORM_ID")) return; // placeholder still in place

    const body = new URLSearchParams();
    body.append(NAME_ENTRY_FIELD,   name);
    body.append(ATTEND_ENTRY_FIELD, attendValue);
    body.append(COUNT_ENTRY_FIELD,  count || "1"); // <-- අලුත් field එක

    fetch(GOOGLE_FORM_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    }).catch(err => {
      // Network failure only — the RSVP is still locked in locally either way.
      console.log("RSVP form submit failed:", err);
    });
  }
}