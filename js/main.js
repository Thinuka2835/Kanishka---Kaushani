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
  weddingDate: "December 14, 2026",
  weddingDateISO: "2026-12-14T10:00:00",
  weddingYear: 2026,
  weddingCity: "Colombo, Sri Lanka",
  rsvpDeadline: "November 15, 2026",
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
  initHero();
  initCountdown();
  initScrollReveal();
  initTabs();
  initCollapsible();
  initCopyIBAN();
  initCalendarButton();
  initSoundToggle();
  initSmoothScroll();
  initGallery();
  initRSVP();
});

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
  // Trigger hero animation immediately since intro is removed
  setTimeout(() => {
    document.getElementById("hero")?.classList.add("loaded");
  }, 150);
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
  if (!btn) return;

  let muted = true; // starts muted

  btn.addEventListener("click", () => {
    muted = !muted;
    btn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    btn.setAttribute("title", muted ? "Unmute music" : "Mute music");

    icon.innerHTML = muted ? getSoundOffSVG() : getSoundOnSVG();

    showToastMsg(muted ? "Music muted" : "Playing music 🎵");
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
// GALLERY — Auto-scrolling Centered Carousel
// ──────────────────────────────────────────────────────────────
function initGallery() {
  const carousel = document.getElementById("gallery-carousel");
  const track = document.getElementById("gc-track");
  const gcPrev = document.getElementById("gc-prev");
  const gcNext = document.getElementById("gc-next");
  const dotsWrap = document.getElementById("gc-dots");
  const slides = Array.from(document.querySelectorAll(".gc-slide"));

  if (!carousel || !track || !slides.length) return;

  const TOTAL = slides.length;
  const AUTO_DELAY = 3500; // ms between auto-advances
  let gcIdx = 0;
  let autoTimer = null;

  /* ---- Slide sizing ---- */
  function slideWidth() {
    const vw = window.innerWidth;
    if (vw <= 600) return vw * 0.78;
    if (vw <= 900) return vw * 0.60;
    return Math.min(vw * 0.48, 700);
  }
  function slideGap() { return window.innerWidth <= 600 ? 16 : 24; }

  function applySlideWidths() {
    const w = slideWidth();
    slides.forEach(s => { s.style.width = w + "px"; });
  }

  /* ---- Build dots ---- */
  const dots = [];
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "gc-dot";
    d.setAttribute("aria-label", `Go to photo ${i + 1}`);
    d.addEventListener("click", () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  /* ---- Core goTo ---- */
  function goTo(idx) {
    // Wrap around for infinite loop
    gcIdx = ((idx % TOTAL) + TOTAL) % TOTAL;

    const w = slideWidth();
    const gap = slideGap();
    const containerW = carousel.offsetWidth;
    const offset = -(gcIdx * (w + gap)) + (containerW / 2) - (w / 2);
    track.style.transform = `translateX(${offset}px)`;

    slides.forEach((s, i) => s.classList.toggle("gc-active", i === gcIdx));
    dots.forEach((d, i) => d.classList.toggle("gc-dot-active", i === gcIdx));

    // Disable prev/next at edges (optional — comment out for true infinite feel)
    if (gcPrev) gcPrev.disabled = false;
    if (gcNext) gcNext.disabled = false;
  }

  /* ---- Auto-scroll ---- */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(gcIdx + 1), AUTO_DELAY);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function resetAuto() { startAuto(); } // restart timer after manual interaction

  /* ---- Init ---- */
  applySlideWidths();
  goTo(0);
  startAuto();

  window.addEventListener("resize", () => { applySlideWidths(); goTo(gcIdx); });

  /* ---- Manual arrows ---- */
  if (gcPrev) gcPrev.addEventListener("click", () => { goTo(gcIdx - 1); resetAuto(); });
  if (gcNext) gcNext.addEventListener("click", () => { goTo(gcIdx + 1); resetAuto(); });

  /* ---- Click on slide → navigate to it ---- */
  slides.forEach((slide, idx) => {
    slide.addEventListener("click", () => { goTo(idx); resetAuto(); });
    slide.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(idx); resetAuto(); }
    });
  });

  /* ---- Pause on hover ---- */
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  /* ---- Keyboard ---- */
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { goTo(gcIdx + 1); resetAuto(); }
    if (e.key === "ArrowLeft") { goTo(gcIdx - 1); resetAuto(); }
  });

  /* ---- Touch swipe ---- */
  let touchStartX = 0;
  carousel.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  carousel.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(gcIdx + 1) : goTo(gcIdx - 1);
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
  const confirmEl = document.getElementById("rsvp-confirm");
  const nameInput = document.getElementById("rsvp-name");

  if (!btnYes || !btnNo) return;

  // ── Google Form config ────────────────────────────────────────
  // 1. Create a Google Form with two questions:
  //      Q1 "Your Name"        → Short answer
  //      Q2 "Are you attending?" → Multiple choice, options: Attending / Declining
  // 2. Replace FORM_ID below with your form's ID (from its share/edit URL)
  // 3. Replace NAME_ENTRY_ID and ATTEND_ENTRY_ID with the real entry IDs
  //    (see the setup guide for how to find these two numbers)
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScS4J8n9ARKeAoz_1JctJlrJ0Df5pItoIGdBEyvmRDSgD-Ujw/formResponse";
  const NAME_ENTRY_FIELD = "entry.1247952776";
  const ATTEND_ENTRY_FIELD = "entry.932895368";
  const ENTRY_ATTEND = "Yes";
  const ENTRY_DECLINE = "No";    // Form එකේ එන්නේ නැති අයට තෝරන්න දීලා තියෙන වචනය (උදා: "No") මෙතැනට දෙන්න.
  // ─────────────────────────────────────────────────────────────

  const STORAGE_KEY = "rsvp_kk2026";

  /* ---- Load persisted name / choice ---- */
  const hasResponded = localStorage.getItem(STORAGE_KEY + "_choice");
  const savedName = localStorage.getItem(STORAGE_KEY + "_name") || "";

  if (nameInput && savedName) nameInput.value = savedName;

  /* ---- If already responded, lock buttons + name field ---- */
  if (hasResponded) {
    lockButtons(hasResponded);
    showConfirm(hasResponded);
    if (nameInput) nameInput.disabled = true;
  }

  /* ---- Button click handlers ---- */
  btnYes.addEventListener("click", (e) => handleRSVP(e, "yes"));
  btnNo.addEventListener("click", (e) => handleRSVP(e, "no"));

  function handleRSVP(e, choice) {
    if (localStorage.getItem(STORAGE_KEY + "_choice")) return; // already voted

    const guestName = nameInput ? nameInput.value.trim() : "";
    if (nameInput && !guestName) {
      nameInput.focus();
      showToastMsg("Please enter your name first 🙂");
      return;
    }

    triggerRipple(e);

    if (choice === "yes") {
      fireConfetti(e);
    }

    localStorage.setItem(STORAGE_KEY + "_choice", choice);
    if (guestName) localStorage.setItem(STORAGE_KEY + "_name", guestName);
    lockButtons(choice);
    showConfirm(choice);
    if (nameInput) nameInput.disabled = true;
    submitToGoogleForm(guestName, choice === "yes" ? ENTRY_ATTEND : ENTRY_DECLINE);
  }



  /* ---- Lock both buttons after responding ---- */
  function lockButtons(choice) {
    btnYes.classList.add(choice === "yes" ? "rsvp-btn-chosen" : "rsvp-btn-done");
    btnNo.classList.add(choice === "no" ? "rsvp-btn-chosen" : "rsvp-btn-done");
  }

  /* ---- Confirmation message ---- */
  function showConfirm(choice) {
    confirmEl.textContent = choice === "yes"
      ? "🎉 Thank you! We can't wait to celebrate with you."
      : "💌 We'll miss you! Thank you for letting us know.";
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

  /* ---- Submit to Google Form silently via hidden iframe ---- */
  function submitToGoogleForm(name, attendValue) {
    // Skip if placeholder URL is still in place
    if (GOOGLE_FORM_URL.includes("FORM_ID")) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_FORM_URL;
    form.target = "rsvp-iframe";
    form.style.display = "none";

    const nameField = document.createElement("input");
    nameField.type = "hidden";
    nameField.name = NAME_ENTRY_FIELD;
    nameField.value = name;
    form.appendChild(nameField);

    const attendField = document.createElement("input");
    attendField.type = "hidden";
    attendField.name = ATTEND_ENTRY_FIELD;
    attendField.value = attendValue;
    form.appendChild(attendField);

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => form.remove(), 2000);
  }
}
