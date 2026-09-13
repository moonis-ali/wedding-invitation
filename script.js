/* ============================================================
   Bride & Groom — Digital Wedding Invitation
   Edit CONFIG below to personalize the countdown & RSVP.
   Everything else (names, venues, events) is edited directly
   inside index.html — see the README.
   ============================================================ */

const CONFIG = {
  // Used for the JS countdown. Format: "YYYY-MM-DDTHH:MM:SS"
  // No time is shown on the page, so this defaults to midnight —
  // change the time portion if you want the countdown to hit zero
  // at a specific hour on the wedding day.
  weddingDateISO: "2026-12-07T00:00:00",

  // Optional: where RSVPs get emailed if you want a copy.
  // Leave as "" to skip the mailto fallback entirely.
  rsvpEmail: "",
};

/* ---------------- Doors open ---------------- */
(function setupDoors(){
  const frame = document.getElementById("frame");
  const sealBtn = document.getElementById("sealBtn");
  const invite = document.getElementById("invite");

  function open(){
    if (frame.classList.contains("opened")) return;
    frame.classList.add("opened");
    sealBtn.setAttribute("aria-expanded", "true");
    invite.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      invite.setAttribute("tabindex", "-1");
      invite.focus({ preventScroll: true });
    }, 800);
  }

  sealBtn.addEventListener("click", open);
  sealBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); }
  });
})();

/* ---------------- Slide to reveal ---------------- */
(function setupReveal(){
  const slider = document.getElementById("revealSlider");
  const frameEl = document.getElementById("revealFrame");
  const dateEl = document.getElementById("revealDate");
  if (!slider || !frameEl) return;

  slider.addEventListener("input", () => {
    const v = Number(slider.value);
    frameEl.style.setProperty("--reveal", `${100 - v}%`);
    dateEl.classList.toggle("shown", v > 85);
  });
})();

/* ---------------- Countdown ---------------- */
(function setupCountdown(){
  const target = new Date(CONFIG.weddingDateISO).getTime();
  const els = {
    days:  document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins:  document.getElementById("cd-mins"),
    secs:  document.getElementById("cd-secs"),
  };
  if (!target || Number.isNaN(target) || !els.days) return;

  function pad(n){ return String(n).padStart(2, "0"); }

  function tick(){
    let diff = target - Date.now();
    if (diff <= 0){
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = "00";
      clearInterval(timer);
      return;
    }
    const days  = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);  diff -= hours * 3600000;
    const mins  = Math.floor(diff / 60000);    diff -= mins * 60000;
    const secs  = Math.floor(diff / 1000);

    els.days.textContent  = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent  = pad(mins);
    els.secs.textContent  = pad(secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ---------------- RSVP ---------------- */
(function setupRSVP(){
  const yesBtn = document.getElementById("rsvpYes");
  const noBtn = document.getElementById("rsvpNo");
  const thanks = document.getElementById("rsvpThanks");
  if (!yesBtn || !noBtn || !thanks) return;

  function respond(attending){
    thanks.textContent = attending
      ? "Thank you — we can't wait to celebrate with you!"
      : "Thank you for letting us know — you'll be missed.";

    // Note: this only confirms in-browser. To actually collect RSVPs,
    // wire this up to a Google Form, Formspree, or similar — see README.
    if (CONFIG.rsvpEmail){
      const subject = encodeURIComponent("RSVP - " + (attending ? "Attending" : "Not attending"));
      const body = encodeURIComponent(
        `Name: \nAttending: ${attending ? "Yes" : "No"}\nNumber of guests: \n`
      );
      window.location.href = `mailto:${CONFIG.rsvpEmail}?subject=${subject}&body=${body}`;
    }
  }

  yesBtn.addEventListener("click", () => respond(true));
  noBtn.addEventListener("click", () => respond(false));
})();
