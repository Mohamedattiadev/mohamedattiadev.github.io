import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const GH_USER = "Mohamedattiadev";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(hover:none),(pointer:coarse)").matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
$("#year").textContent = new Date().getFullYear();

/* ===== Owner mode (toggle journal edit controls) =====
   Activate: visit  #/?owner=1   ·   Deactivate: #/?owner=0
   Or auto-on when running on localhost / 127.0.0.1.
*/
(function ownerMode() {
  const q = new URLSearchParams(location.hash.split("?")[1] || "");
  if (q.get("owner") === "1") localStorage.setItem("pf:owner", "1");
  if (q.get("owner") === "0") localStorage.setItem("pf:owner", "0");
  const stored = localStorage.getItem("pf:owner");
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const isOwner = stored === "1" || (stored !== "0" && isLocal);
  document.body.classList.toggle("owner", isOwner);
  window.__isOwner = isOwner;
})();

/* ===== Lenis ===== */
const lenis = new Lenis({
  duration: 0.6,
  smoothWheel: !reduceMotion,
  lerp: 0.22,
  wheelMultiplier: 1.5,
  touchMultiplier: 1.6,
  easing: (t) => 1 - Math.pow(1 - t, 3),
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

const topbar = $(".topbar");
lenis.on("scroll", ({ scroll }) => topbar.classList.toggle("scrolled", scroll > 4));

/* ===== Back-to-top button ===== */
const toTop = $("#to-top");
lenis.on("scroll", ({ scroll }) => {
  if (scroll > 600) { toTop.hidden = false; toTop.classList.add("show"); }
  else              { toTop.classList.remove("show"); setTimeout(() => { if (!toTop.classList.contains("show")) toTop.hidden = true; }, 200); }
});
toTop.addEventListener("click", () => lenis.scrollTo(0, { duration: 0.7 }));

/* ===== Loader ===== */
gsap.to(".loader .bar", { width: "100%", duration: 0.7, ease: "power3.out" });
gsap.to(".loader", { autoAlpha: 0, duration: 0.4, delay: 0.85 });

/* ===== Toast helper ===== */
const toast = (msg, ms = 2200) => {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.setAttribute("aria-hidden", "false");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.setAttribute("aria-hidden", "true"), ms);
};

/* ===== Admin sign-in =====
   Password is hardcoded in frontend — this gates UI only.
   Real safety: the journal lives in user's own browser localStorage.
*/
const ADMIN_EMAIL = "mohamedattia.dev@gmail.com";
// SHA-256 hash of password. Source never contains the plaintext.
// To rotate: echo -n "new-password" | sha256sum  → paste hex below.
const ADMIN_PW_SHA256 = "364a1ef4c237030b3d57a1e7a8831d2a7fe1c4e0f15d2974f8cf359430b49f68";

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function setOwner(on) {
  if (on) localStorage.setItem("pf:owner", "1");
  else    localStorage.setItem("pf:owner", "0");
  document.body.classList.toggle("owner", on);
  window.__isOwner = on;
  // Force re-bind of journal editor (handlers gated on owner state)
  if (typeof bindJournalToolbar === "function") bindJournalToolbar.bound = false;
  if (currentRoute() === "/journal") { inited.journal = false; renderRoute(); }
}

async function adminSignIn() {
  const r = await ui.promptFields(
    "Sign in to manage the journal. Use the GitHub email tied to this site.",
    [
      { name: "email", label: "GitHub email", type: "email", default: "", placeholder: "you@example.com" },
      { name: "pw",    label: "Password",     type: "password", default: "" },
    ],
    "Admin sign in"
  );
  if (!r) return;
  const email = (r.email || "").trim().toLowerCase();
  const hash = await sha256Hex(r.pw || "");
  if (email === ADMIN_EMAIL && hash === ADMIN_PW_SHA256) {
    setOwner(true);
    toast("Signed in as admin");
    if (currentRoute() === "/admin") goRoute("/journal", true);
  } else {
    ui.alert("Email or password is wrong.", "Sign in failed");
  }
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#admin-in"))  { e.preventDefault(); adminSignIn(); }
  if (e.target.closest("#admin-out")) { e.preventDefault(); setOwner(false); toast("Signed out"); }
});

/* ===== Secret owner toggle: type "imowner" anywhere ===== */
(function ownerSecret() {
  let buf = "";
  addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea,select,[contenteditable]")) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-12);
    if (buf.endsWith("imowner")) {
      const next = !document.body.classList.contains("owner");
      document.body.classList.toggle("owner", next);
      if (next) localStorage.setItem("pf:owner", "1");
      else      localStorage.removeItem("pf:owner");
      window.__isOwner = next;
      toast(next ? "Owner mode: ON" : "Owner mode: OFF");
      buf = "";
      // re-render journal if visible
      if (currentRoute() === "/journal") { inited.journal = false; renderRoute(); }
    }
  });
})();

/* ===== In-app dialog (replaces native alert/confirm/prompt) ===== */
const dlg = $("#dialog");
const dlgTitle = $("#dialog-title");
const dlgMsg = $("#dialog-message");
const dlgFields = $("#dialog-fields");
const dlgOk = $("#dialog-ok");
const dlgCancel = $("#dialog-cancel");
let dlgResolve = null;

function dialog({ type = "confirm", title, message = "", fields = [], okText = "OK", cancelText = "Cancel" }) {
  return new Promise((resolve) => {
    dlgResolve = resolve;
    dlg.dataset.type = type;
    dlgTitle.textContent = title || (type === "alert" ? "Notice" : type === "prompt" ? "Input" : "Confirm");
    dlgMsg.textContent = message;
    dlgFields.innerHTML = fields.map((f) => `
      <label>${escapeHtml(f.label || f.name)}
        <input data-name="${escapeAttr(f.name)}" type="${f.type || "text"}" value="${escapeAttr(f.default || "")}" placeholder="${escapeAttr(f.placeholder || "")}" ${f.required ? "required" : ""}/>
      </label>
    `).join("");
    dlgOk.textContent = okText;
    dlgCancel.textContent = cancelText;
    dlg.setAttribute("aria-hidden", "false");
    setTimeout(() => (dlgFields.querySelector("input") || dlgOk).focus(), 30);
  });
}
function closeDlg(result) {
  dlg.setAttribute("aria-hidden", "true");
  if (dlgResolve) { dlgResolve(result); dlgResolve = null; }
}
dlgOk.addEventListener("click", () => {
  if (dlg.dataset.type === "prompt") {
    const out = {};
    $$("input[data-name]", dlgFields).forEach((i) => (out[i.dataset.name] = i.value));
    closeDlg(out);
  } else closeDlg(true);
});
dlgCancel.addEventListener("click", () => closeDlg(dlg.dataset.type === "prompt" ? null : false));
$$("[data-dclose]", dlg).forEach((n) => n.addEventListener("click", () => closeDlg(dlg.dataset.type === "prompt" ? null : false)));
addEventListener("keydown", (e) => {
  if (dlg.getAttribute("aria-hidden") !== "false") return;
  if (e.key === "Escape") closeDlg(dlg.dataset.type === "prompt" ? null : false);
  if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") { e.preventDefault(); dlgOk.click(); }
});
const ui = {
  alert:   (message, title) => dialog({ type: "alert", title, message }),
  confirm: (message, title) => dialog({ type: "confirm", title, message }),
  prompt:  (message, def = "", title) => dialog({ type: "prompt", title, message, fields: [{ name: "value", default: def }] }).then((r) => (r ? r.value : null)),
  promptFields: (message, fields, title) => dialog({ type: "prompt", title, message, fields }),
};

/* ===== Iframe preview modal (CV PDF + live demos) ===== */
const ifModal = $("#iframe-modal");
const ifFrame = $("#iframe-frame");
const ifFallback = $("#iframe-fallback");
const ifTitle = $("#iframe-title");
const ifOpen = $("#iframe-open");
const ifDl   = $("#iframe-download");
function openIframe({ url, title, download = null }) {
  ifTitle.textContent = title || "Preview";
  ifOpen.href = url;
  if (download) { ifDl.href = url; ifDl.setAttribute("download", download); ifDl.hidden = false; }
  else { ifDl.hidden = true; }
  ifFallback.hidden = true;
  ifFrame.src = url;
  ifModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeIframe() {
  ifModal.setAttribute("aria-hidden", "true");
  ifFrame.src = "about:blank";
  document.body.style.overflow = "";
}
$$("[data-close]", ifModal).forEach((n) => n.addEventListener("click", closeIframe));
addEventListener("keydown", (e) => { if (e.key === "Escape" && ifModal.getAttribute("aria-hidden") === "false") closeIframe(); });

// CV card opens preview
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#cv-open");
  if (!btn) return;
  e.preventDefault();
  openIframe({ url: "./assets/cv/mohamed-attia-cv.pdf", title: "CV — Mohamed Attia", download: "Mohamed-Attia-CV.pdf" });
});

/* ===== Magnetic — only .btn.pill + .btn.primary ===== */
function bindMagnetic(root = document) {
  if (isTouch) return;
  $$(".btn.pill[data-magnet]:not([data-mag-bound]), .btn.primary[data-magnet]:not([data-mag-bound])", root).forEach((n) => {
    n.dataset.magBound = "1";
    const strength = 0.22;
    n.addEventListener("pointermove", (e) => {
      const r = n.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(n, { x, y, duration: 0.4, ease: "power3.out" });
    });
    n.addEventListener("pointerleave", () => gsap.to(n, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
  });
}
bindMagnetic();

/* ===== Mobile menu ===== */
(function mobileMenu() {
  const btn = $(".menu-btn");
  const nav = $("#mobile-nav");
  const toggle = (open) => {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    nav.classList.toggle("open", open);
  };
  btn.addEventListener("click", () => toggle(btn.getAttribute("aria-expanded") !== "true"));
  $$("#mobile-nav a").forEach((a) => a.addEventListener("click", () => toggle(false)));
})();

/* ===== Hash router ===== */
function currentRoute() {
  const h = location.hash.replace(/^#/, "") || "/";
  return h.startsWith("/") ? h : "/" + h;
}
function goRoute(route, replace = false) {
  if (replace) history.replaceState(null, "", "#" + route);
  else location.hash = route;
}
function renderRoute() {
  const route = currentRoute();
  // /admin → trigger sign-in dialog, fall through to journal page underneath
  if (route === "/admin") {
    if (window.__isOwner) { goRoute("/journal", true); return; }
    adminSignIn();
    // show journal page in background
    $$(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === "/journal"));
    return;
  }
  $$(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === route));
  $$(".navlink, #mobile-nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === route));
  const active = $(`.page[data-page="${route}"]`);
  if (active) {
    lenis.scrollTo(0, { immediate: true });
    gsap.fromTo(active, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
    runPageInit(route);
    ScrollTrigger.refresh();
  }
}
addEventListener("hashchange", renderRoute);
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-route]");
  if (!a) return;
  e.preventDefault();
  goRoute(a.dataset.route);
});

const inited = {};
function runPageInit(route) {
  if (route === "/" && !inited.home) { initHome(); inited.home = true; }
  if (route === "/work" && !inited.work) { initWork(); inited.work = true; }
  if (route === "/journal") { initJournal(); inited.journal = true; }
  if (route === "/contact" && !inited.contact) { initContact(); inited.contact = true; }
}

/* ====================================
   HOME — hero + stack marquee
   ==================================== */
const STACK = [
  ["TypeScript", "typescript"],
  ["React",      "react"],
  ["Next.js",    "nextdotjs"],
  ["Node.js",    "nodedotjs"],
  ["Three.js",   "threedotjs"],
  ["Python",     "python"],
  ["Go",         "go"],
  ["GSAP",       "greensock"],
  ["Postgres",   "postgresql"],
  ["Tailwind",   "tailwindcss"],
  ["Linux",      "linux"],
  ["Vim",        "vim"],
  ["Git",        "git"],
  ["Docker",     "docker"],
];

function buildStackMarquee() {
  const track = $("#stack-track");
  if (!track) return;
  const itemHTML = STACK.map(([name, slug]) =>
    `<span class="stack-item"><img src="https://cdn.simpleicons.org/${slug}/a78bfa" alt="" width="20" height="20" loading="lazy" decoding="async"/><span>${name}</span></span>`
  ).join("");
  // duplicate 2x so -50% loop is seamless
  track.innerHTML = itemHTML + itemHTML;
  if (reduceMotion) return;
  // animate after layout settles
  requestAnimationFrame(() => {
    gsap.to(track, {
      xPercent: -50,
      duration: 30,
      ease: "none",
      repeat: -1,
    });
  });
}

function initHome() {
  buildStackMarquee();

  $$("#page-home [data-split]").forEach((el) => splitChars(el));
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.2 });
  tl.from("#page-home .hero-meta", { y: -10, autoAlpha: 0, duration: 0.5 }, 0);
  $$("#page-home [data-split]").forEach((el, i) => {
    tl.from(el.querySelectorAll(".char"), { yPercent: 110, duration: 0.9, stagger: 0.018 }, 0.05 + i * 0.06);
  });
  tl.from("#page-home .lede", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.5");
  tl.from("#page-home .hero-cta .btn", { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, "-=0.4");
  tl.from("#page-home .hero-scroll", { autoAlpha: 0, duration: 0.4 }, "-=0.2");

  gsap.from("#page-home .stack-marquee", {
    scrollTrigger: { trigger: "#page-home .stack-marquee", start: "top 90%" },
    autoAlpha: 0, y: 20, duration: 0.7, ease: "expo.out",
  });
  gsap.from("#page-home .about-card", {
    scrollTrigger: { trigger: "#page-home .about-grid", start: "top 80%" },
    y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: "expo.out",
  });
  gsap.from("#page-home .about-h", {
    scrollTrigger: { trigger: "#page-home .about-h", start: "top 85%" },
    y: 24, autoAlpha: 0, duration: 0.7, ease: "expo.out",
  });
  gsap.from("#page-home .cta-band", {
    scrollTrigger: { trigger: "#page-home .cta-band", start: "top 85%" },
    y: 20, autoAlpha: 0, duration: 0.45, ease: "power2.out",
  });
}

/* ====================================
   WORK — uniform grid + popup
   ==================================== */
/* Manual overrides for live demos (use when homepage points wrong place).
   Key = repo name. Value = full https URL. */
const LIVE_DEMOS = {};

/* Hide these repos from the Work page (case-sensitive match on repo name) */
const HIDE_REPOS = new Set([
  "mohamedattiadev.github.io",
  "Q-A-code-questions-",
  "DataMining_Project",
  "Mohamedattiadev",
  "HM-1-2-",
]);

/* Manual extras to PREPEND to the Work grid. Use for repos not on GitHub
   or projects you want pinned to the top. Each item is a fake-repo shape
   so the same render code works. */
const PINNED_PROJECTS = [
  {
    name: "University DBMS",
    full_name: "Kerim123-k/University-Database-Management-System-Project-",
    description: "Group project — full SQL-based university DBMS: students, courses, grades, enrollment. SENG class.",
    html_url: "https://github.com/Kerim123-k/University-Database-Management-System-Project-",
    homepage: null, has_pages: false,
    language: "SQL",
    stargazers_count: 0, forks_count: 0, open_issues_count: 0,
    pushed_at: "2026-01-15T00:00:00Z",
    topics: ["school", "sql", "dbms"],
    owner: { login: GH_USER, avatar_url: `https://github.com/${GH_USER}.png` },
  },
  {
    name: "literature review — Louvain Algorithm",
    full_name: "Kerim123-k/Design-And-Analysis-Of-Algorithms-Project-SENG303",
    description: "Literature review + implementation of the Louvain community-detection algorithm. SENG303 project.",
    html_url: "https://github.com/Kerim123-k/Design-And-Analysis-Of-Algorithms-Project-SENG303",
    homepage: null, has_pages: false,
    language: "Python",
    stargazers_count: 0, forks_count: 0, open_issues_count: 0,
    pushed_at: "2026-01-10T00:00:00Z",
    topics: ["algorithms", "graphs", "school"],
    owner: { login: GH_USER, avatar_url: `https://github.com/${GH_USER}.png` },
  },
  {
    name: "Portfolio + social-media project",
    full_name: "Mohamedattiadev/portfolio-social",
    description: "Personal portfolio combined with a small social-feed app. In progress. Repo coming soon.",
    html_url: "https://github.com/Mohamedattiadev",
    homepage: null, has_pages: false,
    language: "TypeScript",
    stargazers_count: 0, forks_count: 0, open_issues_count: 0,
    pushed_at: "2026-06-20T00:00:00Z",
    topics: ["wip", "portfolio"],
    owner: { login: GH_USER, avatar_url: `https://github.com/${GH_USER}.png` },
  },
];

function liveURL(r) {
  if (LIVE_DEMOS[r.name]) return LIVE_DEMOS[r.name];
  // GitHub Pages enabled on this repo → predictable URL
  if (r.has_pages) {
    const user = (r.owner?.login || GH_USER).toLowerCase();
    return `https://${user}.github.io/${r.name}/`;
  }
  // Explicit homepage on repo, with strict filter
  if (!r.homepage || !/^https?:\/\//.test(r.homepage)) return null;
  const blocked = /(^https?:\/\/(www\.)?(github\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|linkedin\.com))/i;
  if (blocked.test(r.homepage)) return null;
  if (r.html_url && r.homepage.replace(/\/+$/, "") === r.html_url.replace(/\/+$/, "")) return null;
  return r.homepage;
}
function relTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  const units = [["year",31536000],["month",2592000],["week",604800],["day",86400],["hour",3600],["minute",60]];
  for (const [u, s] of units) {
    const v = Math.floor(sec / s);
    if (v >= 1) return `Updated ${v} ${u}${v>1?"s":""} ago`;
  }
  return "Updated just now";
}

async function initWork() {
  const grid = $("#grid");
  const filters = $("#page-work .work-filters");
  const preview = $("#preview");
  try {
    let repos;
    const cached = sessionStorage.getItem("pf:repos:v6");
    if (cached) repos = JSON.parse(cached);
    else {
      const r = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
      if (!r.ok) throw 0;
      repos = await r.json();
      sessionStorage.setItem("pf:repos:v6", JSON.stringify(repos));
    }
    repos = repos
      .filter((r) => !HIDE_REPOS.has(r.name))
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)));
    repos = [...PINNED_PROJECTS, ...repos];
    if (!repos.length) { grid.innerHTML = `<p class="muted">No public repos.</p>`; return; }

    let activeLang = "all";
    let page = 1;
    const PER_PAGE = 9;

    const filteredRepos = () => activeLang === "all" ? repos : repos.filter((r) => r.language === activeLang);
    const pageRepos = () => {
      const all = filteredRepos();
      return all.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    };

    const langs = [...new Set(repos.map((r) => r.language).filter(Boolean))];
    const renderFilters = () => {
      filters.innerHTML =
        `<button class="chip ${activeLang==='all'?'active':''}" data-filter="all">All · ${repos.length}</button>` +
        langs.map((l) => {
          const c = repos.filter((r) => r.language === l).length;
          return `<button class="chip ${activeLang===l?'active':''}" data-filter="${escapeAttr(l)}">${escapeHtml(l)} · ${c}</button>`;
        }).join("");
    };
    renderFilters();

    grid.removeAttribute("aria-busy");
    const renderCards = () => {
    grid.innerHTML = "";
    const slice = pageRepos();
    const baseIdx = (page - 1) * PER_PAGE;
    slice.forEach((r, i0) => {
      const i = baseIdx + i0;
      const live = liveURL(r);
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.lang = r.language || "";
      // store repo data for popup
      card._repo = r;
      card.innerHTML = `
        <div class="top">
          <span class="idx">/ ${String(i + 1).padStart(2, "0")}</span>
          ${r.language ? `<span class="lang">${escapeHtml(r.language)}</span>` : ``}
        </div>
        <h3>${escapeHtml(r.name)}</h3>
        ${r.description ? `<p class="desc">${escapeHtml(r.description)}</p>` : `<p class="desc muted">No description.</p>`}
        <div class="actions">
          <a class="action" href="${r.html_url}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.33.96.1-.74.4-1.26.72-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.03 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.74.11 3.03.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12v3.15c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
            Source
          </a>
          ${live ? `<a class="action live" href="${live}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7M21 3l-9 9M5 5h6v2H7v10h10v-4h2v6H5z"/></svg>
            Visit
          </a>` : ``}
        </div>
      `;
      grid.appendChild(card);
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 95%" },
        y: 14, autoAlpha: 0, duration: 0.35, ease: "power2.out",
      });
    });
    bindCardHovers();
    renderPagination();
    };

    const renderPagination = () => {
      let pager = $("#pager");
      if (!pager) {
        pager = document.createElement("nav");
        pager.id = "pager";
        pager.className = "pager";
        pager.setAttribute("aria-label", "Pagination");
        // append OUTSIDE work-layout so it doesn't steal the preview column
        const layout = $(".work-layout");
        layout.parentNode.insertBefore(pager, layout.nextSibling);
      }
      const total = Math.max(1, Math.ceil(filteredRepos().length / PER_PAGE));
      if (total <= 1) { pager.innerHTML = ""; return; }
      let html = `<button class="page-btn" data-page="prev" ${page<=1?'disabled':''}>‹ Prev</button>`;
      for (let p = 1; p <= total; p++) {
        html += `<button class="page-btn ${p===page?'active':''}" data-page="${p}">${p}</button>`;
      }
      html += `<button class="page-btn" data-page="next" ${page>=total?'disabled':''}>Next ›</button>`;
      pager.innerHTML = html;
    };

    // ===== sticky preview panel =====
    let activeRepo = null;
    let pinnedCard = null;

    const fillPreview = async (r) => {
      activeRepo = r;
      preview.dataset.empty = "false";
      $("#preview-title").textContent = r.name;
      $("#preview-owner").textContent = r.full_name || `${GH_USER}/${r.name}`;
      $("#preview-avatar").src = (r.owner && r.owner.avatar_url) ? r.owner.avatar_url : `https://github.com/${GH_USER}.png?size=120`;
      // banner: real screenshot of live site if exists, else GitHub social card
      const banner = $(".preview-banner");
      const live0 = liveURL(r);
      banner.style.backgroundImage = live0
        ? `url('https://image.thum.io/get/width/900/${encodeURIComponent(live0)}'), url('https://opengraph.githubassets.com/1/${r.full_name}')`
        : `url('https://opengraph.githubassets.com/1/${r.full_name}')`;
      const langEl = $("#preview-lang");
      if (r.language) { langEl.textContent = r.language; langEl.style.display = ""; }
      else langEl.style.display = "none";
      $("#preview-desc").textContent = r.description || "No description provided.";
      $("#preview-stars").textContent  = r.stargazers_count ?? 0;
      $("#preview-forks").textContent  = r.forks_count ?? 0;
      $("#preview-issues").textContent = r.open_issues_count ?? 0;
      $("#preview-license").textContent = r.license?.spdx_id ? `License · ${r.license.spdx_id}` : "License · —";
      $("#preview-branch").textContent  = r.default_branch ? `Branch · ${r.default_branch}` : "";
      $("#preview-updated").textContent = relTime(r.pushed_at);
      $("#preview-topics").innerHTML = (r.topics || []).slice(0, 6).map((t) => `<span class="topic">#${escapeHtml(t)}</span>`).join("");
      $("#preview-source").href = r.html_url;
      const visit = $("#preview-visit"); const live = liveURL(r);
      if (live) { visit.href = live; visit.hidden = false; } else visit.hidden = true;

      const readmeEl = $("#preview-readme");
      readmeEl.classList.remove("empty");
      readmeEl.textContent = "Loading README…";
      const cacheKey = `pf:readme:${r.full_name}`;
      let md = sessionStorage.getItem(cacheKey);
      if (md === null) {
        try {
          const rr = await fetch(`https://api.github.com/repos/${r.full_name}/readme`, {
            headers: { Accept: "application/vnd.github.raw" },
          });
          md = rr.ok ? await rr.text() : "";
          sessionStorage.setItem(cacheKey, md);
        } catch { md = ""; }
      }
      if (activeRepo !== r) return;
      if (!md) {
        readmeEl.classList.add("empty");
        readmeEl.textContent = "No README found.";
        return;
      }
      const { marked } = await import("marked");
      const trimmed = md
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "")
        .trim()
        .slice(0, 1200);
      readmeEl.innerHTML = marked.parse(trimmed);
    };

    const setActive = (card) => {
      $$(".card", grid).forEach((c) => c.classList.toggle("active", c === card));
    };

    function bindCardHovers() {
      $$(".card", grid).forEach((card) => {
        card.addEventListener("pointerenter", () => {
          if (pinnedCard) return;
          fillPreview(card._repo);
          setActive(card);
        });
        card.addEventListener("click", (e) => {
          if (e.target.closest(".action")) return;
          e.preventDefault();
          if (pinnedCard === card) { pinnedCard = null; card.classList.remove("pinned"); }
          else { pinnedCard = card; fillPreview(card._repo); setActive(card); }
        });
      });
    }

    renderCards();
    if (filteredRepos()[0]) fillPreview(filteredRepos()[0]);
    requestAnimationFrame(() => {
      const first = $(".card", grid);
      if (first) setActive(first);
    });

    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      activeLang = b.dataset.filter;
      page = 1;
      renderFilters();
      renderCards();
      ScrollTrigger.refresh();
    });

    document.addEventListener("click", (e) => {
      const b = e.target.closest(".page-btn"); if (!b || b.disabled) return;
      const total = Math.max(1, Math.ceil(filteredRepos().length / PER_PAGE));
      if (b.dataset.page === "prev") page = Math.max(1, page - 1);
      else if (b.dataset.page === "next") page = Math.min(total, page + 1);
      else page = +b.dataset.page;
      renderCards();
      lenis.scrollTo($("#page-work").offsetTop, { duration: 0.5 });
    });
  } catch (e) {
    console.warn(e);
    grid.innerHTML = `<p class="muted">Could not load projects. <a class="ulink" href="https://github.com/${GH_USER}" target="_blank" rel="noopener">View on GitHub →</a></p>`;
  }
}

/* ====================================
   JOURNAL — all posts editable + deletable
   Storage: pf:posts:v1 = full array.
   On first load (key absent), seed with defaults.
   ==================================== */
const LS_KEY = "pf:posts:v2";
const TODAY = new Date().toISOString().slice(0, 10);

const DEFAULT_POSTS = [
  {
    id: "_d_hello",
    title: "Hello, world",
    date: "2026-06-22",
    body: `# Hello, world\n\nI'm **Mohamed Attia**, software engineering student at AYBU. This is where I drop build logs, notes, and write-ups for projects on the Work page.\n\n## What lives here\n\n- Short technical notes from things I'm learning\n- Deep-dives on projects I ship\n- Strong opinions about tooling, loosely held\n\nReach me via the **Contact** page.\n`,
  },
  {
    id: "_d_portfolio",
    title: "How I built this portfolio",
    date: "2026-06-20",
    body: `# How I built this portfolio\n\n## Constraints\n\n1. **Zero build step.** Pure HTML/CSS/ES modules. GitHub Pages.\n2. **No framework.** GSAP + Lenis + marked from CDN via importmap.\n3. **Hash router.** Four pages, in-app transitions.\n4. **Local journal CRUD** in \`localStorage\`. Owner-mode unlocks editor (type \`imowner\`).\n\n## Stack\n\n| Layer  | Tool              |\n| ------ | ----------------- |\n| Build  | None              |\n| Anim   | GSAP + ScrollTrigger |\n| Scroll | Lenis             |\n| MD     | marked            |\n| Icons  | simpleicons CDN   |\n\n## What surprised me\n\n- Vanilla feels fast because *nothing else is happening*.\n- GitHub social cards (\`opengraph.githubassets.com/1/owner/repo\`) make instant project previews.\n- thum.io renders live-site screenshots for free, no API key.\n`,
  },
  {
    id: "_d_dotfiles",
    title: "Why I wrote my own dotfiles installer",
    date: "2026-06-15",
    body: `# Why I wrote my own dotfiles installer\n\nEvery existing tool wanted me to learn its DSL. \`chezmoi\` has templates. \`yadm\` has hooks. \`stow\` punts on secrets. I just wanted: *new laptop → one command → my exact setup*.\n\n## What I shipped\n\n\`\`\`bash\ncurl -fsSL dot.attia.dev | bash\n\`\`\`\n\n- Detects OS (Arch / Debian / macOS)\n- Symlinks configs from a single tree\n- Idempotent — re-run any time\n\n## What I learned\n\n- POSIX shell + \`set -euo pipefail\` covers 95% of cases\n- \`hyperfine\` proved my install runs in ~9s on a clean Arch VM\n- Writing the README first kept the surface small\n\nRepo: \`Newdotfile-\` on GitHub.\n`,
  },
  {
    id: "_d_autoclaude",
    title: "Auto-clicking the Claude CLI to skip permission prompts",
    date: "2026-06-10",
    body: `# Auto-clicking the Claude CLI to skip permission prompts\n\nClaude Code asks before every tool call. Great for safety, painful when you're running a 40-step plan and want to walk away.\n\n## Approach\n\nWrap the Claude CLI in a pty. Watch stdout for the \`╭ Allow this command?\` prompt regex. Send \`<enter>\` if the proposed command matches an allowlist.\n\n\`\`\`ts\nconst ALLOW = [/^git (status|diff|log)/, /^ls/, /^cat /];\npty.onData((d) => {\n  if (/Allow this command/.test(d) && ALLOW.some((r) => r.test(lastCmd))) {\n    pty.write("\\r");\n  }\n});\n\`\`\`\n\n## What went wrong\n\n- First version sent enter to EVERY prompt → almost ran \`rm -rf\`. Allowlist is the only safe design.\n- ANSI escape codes break naive regex. Strip with \`strip-ansi\` first.\n\nRepo: \`auto-claude\`. Use at your own risk.\n`,
  },
  {
    id: "_d_excalivault",
    title: "Excalidraw as a study system",
    date: "2026-06-05",
    body: `# Excalidraw as a study system\n\nI tried Obsidian, Notion, Anki. None survived the semester. What stuck: **draw the concept first, write the words second.**\n\n## Setup\n\n- One \`.excalidraw\` file per topic\n- Library of stencils (arrows, brackets, code-block frames)\n- Git LFS for binary diff\n\n## Why it works\n\n- Drawing forces understanding before vocabulary\n- Visual recall > textual recall for system diagrams\n- Re-drawing tomorrow's revision is faster than re-reading notes\n\nRepo: \`excalidraw-vault\`.\n`,
  },
  {
    id: "_d_til-og",
    title: "TIL: GitHub social cards are a hidden API",
    date: "2026-06-02",
    body: `# TIL: GitHub social cards are a hidden API\n\n\`\`\`\nhttps://opengraph.githubassets.com/1/<owner>/<repo>\n\`\`\`\n\nReturns the auto-generated PNG GitHub uses for link previews. The \`1\` is a cache buster — change it to invalidate.\n\nUseful for:\n\n- Project list pages (no need to manually screenshot)\n- README header images\n- Quick visual repo previews in dashboards\n\nUndocumented. Use sparingly.\n`,
  },
  {
    id: "_d_lenis",
    title: "Lenis vs native scroll: when smooth scroll hurts",
    date: "2026-05-28",
    body: `# Lenis vs native scroll: when smooth scroll hurts\n\nLenis is gorgeous on a landing page. Painful in three places:\n\n1. **Nested scroll areas.** Lenis hijacks wheel events for the whole page. Use \`data-lenis-prevent\` on inner-scroll containers.\n2. **Anchor jumps.** Browser \`scrollIntoView\` no longer instant — has to go through Lenis' easing.\n3. **Accessibility.** Users with \`prefers-reduced-motion\` need it disabled. Pass \`smoothWheel: !reduceMotion\`.\n\n## My current defaults\n\n\`\`\`js\nnew Lenis({\n  duration: 0.6,\n  lerp: 0.22,\n  wheelMultiplier: 1.5,\n  easing: (t) => 1 - Math.pow(1 - t, 3),\n});\n\`\`\`\n\nLower duration + higher lerp = snappy. The defaults feel laggy on a fast trackpad.\n`,
  },
  {
    id: "_d_go-students",
    title: "Go for student projects: one-week verdict",
    date: "2026-05-20",
    body: `# Go for student projects: one-week verdict\n\nSpent a week rewriting a Python script in Go to learn it for real.\n\n## Wins\n\n- **Single binary.** Sharing a tool with a classmate is \`scp\` not \`pip install -r\`.\n- **Errors as values** is annoying for two days, then liberating.\n- \`go test ./...\` is genuinely fast.\n\n## Misses\n\n- No generics ergonomics yet. Even with 1.18+, type constraints fight you.\n- Module system trips beginners. \`go.mod\` + replace directives = lost afternoon.\n\n## When I'd reach for it\n\n- CLIs I want to ship to other people\n- Long-running services with low ceremony\n- Anything I want compiled, fast, and boring\n\nNot Go: data analysis, prototypes, throwaway scripts. Python still wins those.\n`,
  },
  {
    id: "_d_bug-gsap",
    title: "Bug hunt: why my GSAP timeline ran twice",
    date: "2026-05-12",
    body: `# Bug hunt: why my GSAP timeline ran twice\n\n## Symptom\n\nHero text split, then animated. Then animated *again* 800ms later, from the wrong starting state.\n\n## What I checked first (wrong)\n\n- React strict mode (not React)\n- Double script tag (only one)\n- Event listener double-binding (none)\n\n## Actual cause\n\nMy hash router called \`initHome()\` on every route change, not just the first visit. \`splitChars()\` was wrapping already-split spans into more spans. The timeline ran each time.\n\n## Fix\n\n\`\`\`js\nconst inited = {};\nfunction runPageInit(route) {\n  if (route === "/" && !inited.home) { initHome(); inited.home = true; }\n}\n\`\`\`\n\n## Lesson\n\nIdempotent init functions or memoized init flags. Pick one. I picked the flag.\n`,
  },
  {
    id: "_d_summer-2026",
    title: "What I'm building in summer 2026",
    date: "2026-05-01",
    body: `# What I'm building in summer 2026\n\nThree open projects, all student-budget:\n\n## 1. dcli-pkgs\nPackage manager for shell tools written as single Go binaries. Auto-detects shell, drops aliases, supports \`update\` and \`pin\`.\n\n## 2. IntentTube v2\nYouTube wrapper that asks *why* you opened it before showing the feed. Logs the intent vs. what you actually watched. Self-shaming as a service.\n\n## 3. AYBU SE Student Guide\nUnofficial single-page guide for new AYBU SE students. Curriculum map, internship rules, professor cheat-sheet. Already used by ~80 first-years last semester.\n\n## What I want feedback on\n\n- IntentTube's intent capture — too friction-y? Too soft?\n- dcli-pkgs vs Homebrew taps for simple tools — am I reinventing?\n\nEmail or X if you've tried similar.\n`,
  },
];

const TEMPLATES = {
  blank: ``,
  project: `# {{project name}}\n\n**Status:** WIP / Shipped / Archived\n**Repo:** \`owner/repo\`\n**Live:** https://...\n\n## Problem\n\nWhat were you trying to solve and for whom?\n\n## Approach\n\nKey design choices. What did you reject?\n\n## Stack\n\n- \n- \n\n## Result\n\nScreenshots, numbers, real-world usage.\n\n## What I learned\n\n- \n- \n\n## What I'd do differently\n\n- \n`,
  tutorial: `# How to {{do the thing}}\n\n> **Audience:** beginners / intermediate / advanced\n> **Reading time:** ~X min\n\n## Why this matters\n\nThe problem this solves, in one paragraph.\n\n## Prerequisites\n\n- \n- \n\n## Step 1 — \n\nExplain. Then show:\n\n\`\`\`ts\n// code\n\`\`\`\n\n## Step 2 — \n\n## Step 3 — \n\n## Wrap up\n\nWhat you can now do that you couldn't before.\n`,
  note: `# Quick note — ${TODAY}\n\n- \n- \n`,
  til: `# TIL: {{thing}}\n\n_${TODAY}_\n\n\`\`\`\n// the actual snippet / command / link\n\`\`\`\n\n**Why it matters:**\n\n**Where I'd use it:**\n`,
  changelog: `# Changelog — vX.Y.Z\n\n_${TODAY}_\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n\n### Removed\n- \n`,
  weekly: `# Week of ${TODAY}\n\n## Shipped\n\n- \n\n## In progress\n\n- \n\n## Stuck on\n\n- \n\n## Next week\n\n- \n\n## Learned\n\n- \n`,
  bughunt: `# Bug hunt: {{symptom}}\n\n## Symptom\n\nWhat the user / I saw.\n\n## What I checked first (wrong leads)\n\n- \n- \n\n## Actual cause\n\nThe real reason, plus the line that fixed it.\n\n\`\`\`diff\n- broken line\n+ fixed line\n\`\`\`\n\n## How I'd catch this faster next time\n\n- \n`,
  review: `# Review: {{book / tool / paper}}\n\n**Author / maker:**\n**Read / used over:**\n**Rating:** ★★★★☆\n\n## In one sentence\n\n## What I took away\n\n- \n- \n\n## Where I disagree\n\n- \n\n## Who should read / use this\n\n- \n`,
  postmortem: `# Postmortem: {{incident}}\n\n_${TODAY}_\n\n## What happened\n\n## Timeline (UTC)\n\n- 12:00 — \n- 12:15 — \n- 12:40 — resolved\n\n## Root cause\n\n## What worked\n\n- \n\n## What didn't\n\n- \n\n## Action items\n\n- [ ] \n- [ ] \n`,
};

// Posts auto-published by the weekly CI script. Cached in-memory.
let AUTO_POSTS = [];
async function fetchAutoPosts() {
  if (AUTO_POSTS.length) return AUTO_POSTS;
  try {
    const r = await fetch("./assets/data/journal.json", { cache: "no-cache" });
    if (r.ok) AUTO_POSTS = await r.json();
  } catch {}
  return AUTO_POSTS;
}

function loadPosts() {
  const raw = localStorage.getItem(LS_KEY);
  let user = [];
  if (raw === null) {
    const seed = DEFAULT_POSTS.slice();
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    user = seed;
  } else {
    try { user = JSON.parse(raw) || []; } catch {}
  }
  // merge auto-published posts; user-edited ones (same id) win
  const ids = new Set(user.map((p) => p.id));
  const extra = AUTO_POSTS.filter((p) => !ids.has(p.id));
  return [...user, ...extra].sort(byDateDesc);
}
function savePosts(arr) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }
function byDateDesc(a, b) { return (b.date || "").localeCompare(a.date || ""); }

let activePostId = null;
async function initJournal() {
  await fetchAutoPosts();
  renderJournalList();
  bindJournalToolbar();
}
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TREE_COLLAPSED = new Set(); // keys: "Y" or "Y-M"

function renderJournalList() {
  const list = $("#journal-list");
  const posts = loadPosts();
  list.innerHTML = "";
  if (!posts.length) {
    $("#journal-view").innerHTML = `<p class="muted">No posts yet.${window.__isOwner ? ` Click <strong>New post</strong> to add one.` : ``}</p>`;
    return;
  }
  const buckets = {};
  posts.forEach((p) => {
    const [y, m] = (p.date || "").split("-");
    if (!y) return;
    buckets[y] ??= {};
    buckets[y][m || "00"] ??= [];
    buckets[y][m || "00"].push(p);
  });

  const years = Object.keys(buckets).sort().reverse();
  years.forEach((y) => {
    const yCollapsed = TREE_COLLAPSED.has(y);
    const yh = document.createElement("button");
    yh.type = "button";
    yh.className = "journal-tree-year" + (yCollapsed ? " collapsed" : "");
    yh.innerHTML = `<span class="caret">${yCollapsed ? "▸" : "▾"}</span> ${y}/`;
    yh.addEventListener("click", () => {
      if (TREE_COLLAPSED.has(y)) TREE_COLLAPSED.delete(y);
      else TREE_COLLAPSED.add(y);
      renderJournalList();
    });
    list.appendChild(yh);
    if (yCollapsed) return;

    const months = Object.keys(buckets[y]).sort().reverse();
    months.forEach((m) => {
      const key = `${y}-${m}`;
      const mCollapsed = TREE_COLLAPSED.has(key);
      const mh = document.createElement("button");
      mh.type = "button";
      mh.className = "journal-tree-month" + (mCollapsed ? " collapsed" : "");
      mh.innerHTML = `<span class="caret">${mCollapsed ? "▸" : "▾"}</span> └─ ${MONTHS[(+m) - 1] || m}`;
      mh.addEventListener("click", () => {
        if (TREE_COLLAPSED.has(key)) TREE_COLLAPSED.delete(key);
        else TREE_COLLAPSED.add(key);
        renderJournalList();
      });
      list.appendChild(mh);
      if (mCollapsed) return;

      const arr = buckets[y][m];
      arr.forEach((p, i) => {
        const last = i === arr.length - 1;
        const b = document.createElement("button");
        b.className = "post-item";
        b.dataset.id = p.id;
        b.innerHTML = `
          <span class="glyph">${last ? "└─" : "├─"}</span>
          <span class="ttl">${escapeHtml(p.title)}</span>
          <span class="dt">${escapeHtml((p.date || "").slice(-2))}</span>
        `;
        b.addEventListener("click", () => openPost(p.id));
        list.appendChild(b);
      });
    });
  });
  const target = activePostId && posts.find((p) => p.id === activePostId) ? activePostId : posts[0].id;
  openPost(target);
}
function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}
function readingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

async function openPost(id) {
  activePostId = id;
  $$("#journal-list .post-item").forEach((x) => x.classList.toggle("active", x.dataset.id === id));
  const post = loadPosts().find((p) => p.id === id);
  const view = $("#journal-view");
  if (!post) { view.innerHTML = `<p class="muted">Post not found.</p>`; return; }
  const { marked } = await import("marked");
  const html = marked.parse(post.body || "");
  const mins = readingTime(post.body);

  // build TOC from h2/h3
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const headings = [...tmp.querySelectorAll("h2, h3")];
  const slugSeen = {};
  headings.forEach((h) => {
    let s = slugify(h.textContent);
    if (slugSeen[s]) { slugSeen[s]++; s = `${s}-${slugSeen[s]}`; } else slugSeen[s] = 1;
    h.id = s;
  });
  const showToc = headings.length >= 3;
  const tocHTML = showToc
    ? `<nav class="post-toc" aria-label="On this page"><strong>On this page</strong><ol>${
        headings.map((h) => `<li class="lvl-${h.tagName.toLowerCase()}"><a href="#${h.id}">${escapeHtml(h.textContent)}</a></li>`).join("")
      }</ol></nav>`
    : "";

  view.innerHTML = `
    ${window.__isOwner ? `<div class="post-actions">
      <button class="btn ghost sm" id="post-edit">Edit</button>
      <button class="btn danger sm" id="post-del">Delete</button>
    </div>` : ``}
    <p class="post-meta-line"><span>${escapeHtml(post.date || "")}</span><span>·</span><span>${mins} min read</span><span>·</span><span>${headings.length} section${headings.length===1?"":"s"}</span></p>
    ${tocHTML}
    ${tmp.innerHTML}
  `;
  // intra-page TOC clicks: smooth scroll via lenis
  $$(".post-toc a", view).forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      const target = view.querySelector("#" + CSS.escape(id));
      if (target) lenis.scrollTo(target, { offset: -80, duration: 0.5 });
    });
  });
  gsap.from(view.children, { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.03, ease: "expo.out" });
  if (window.__isOwner) {
    $("#post-edit").addEventListener("click", () => openEditor(post));
    $("#post-del").addEventListener("click", async () => {
      if (!(await ui.confirm(`Delete "${post.title}"?`, "Delete post"))) return;
      savePosts(loadPosts().filter((p) => p.id !== post.id));
      activePostId = null;
      renderJournalList();
    });
  }
}

function bindJournalToolbar() {
  if (bindJournalToolbar.bound) return; bindJournalToolbar.bound = true;
  if (!window.__isOwner) return;
  $("#post-new").addEventListener("click", () => openEditor(null));
  $("#post-export").addEventListener("click", (e) => {
    e.preventDefault();
    const data = JSON.stringify(loadPosts(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  });
  $("#post-import").addEventListener("click", (e) => { e.preventDefault(); $("#post-import-file").click(); });
  $("#post-import-file").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!Array.isArray(data)) throw 0;
      const existing = loadPosts();
      const ids = new Set(existing.map((p) => p.id));
      data.forEach((p) => { if (p.id && p.title && !ids.has(p.id)) existing.push(p); });
      savePosts(existing);
      renderJournalList();
      ui.alert("Posts imported successfully.", "Import complete");
    } catch { ui.alert("Could not parse the file. Make sure it's a valid JSON export.", "Invalid file"); }
    e.target.value = "";
  });

  const modal = $("#post-modal");
  $$("[data-close]", modal).forEach((n) => n.addEventListener("click", closeEditor));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeEditor(); });
  $("#post-body").addEventListener("input", updatePreview);
  $("#post-title").addEventListener("input", updatePreview);
  $("#post-save").addEventListener("click", savePost);
  $("#post-delete").addEventListener("click", async () => {
    const id = modal.dataset.editId;
    if (!id || !(await ui.confirm("Delete this post? This cannot be undone.", "Delete post"))) return;
    savePosts(loadPosts().filter((p) => p.id !== id));
    closeEditor();
    activePostId = null;
    renderJournalList();
  });

  // Template selector
  $("#post-template").addEventListener("change", async (e) => {
    const key = e.target.value;
    if (!key) return;
    const ta = $("#post-body");
    if (ta.value.trim() && !(await ui.confirm("Replace the current body with this template? Unsaved text will be lost.", "Use template"))) {
      e.target.value = "";
      return;
    }
    ta.value = TEMPLATES[key] || "";
    updatePreview();
    e.target.value = "";
  });

  // Markdown toolbar
  $$(".editor-toolbar .tb[data-md]").forEach((b) => {
    b.addEventListener("click", (e) => { e.preventDefault(); applyMd(b.dataset.md); });
  });
  $("#md-image-url").addEventListener("click", async (e) => {
    e.preventDefault();
    const r = await ui.promptFields("Insert image from URL", [
      { name: "url", label: "Image URL", default: "https://", placeholder: "https://example.com/img.png" },
      { name: "alt", label: "Alt text", default: "", placeholder: "Describe the image" },
    ], "Insert image");
    if (!r || !r.url) return;
    insertAtCursor($("#post-body"), `![${r.alt || ""}](${r.url})`);
    updatePreview();
  });
  $("#md-image-file").addEventListener("click", (e) => { e.preventDefault(); $("#md-image-input").click(); });
  $("#md-image-input").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 500 * 1024) {
      const ok = await ui.confirm(`This image is ${(f.size/1024).toFixed(0)}KB. Base64-encoded images live in localStorage (~5MB total quota). Continue?`, "Large image");
      if (!ok) { e.target.value = ""; return; }
    }
    const dataURL = await fileToDataURL(f);
    insertAtCursor($("#post-body"), `![${f.name}](${dataURL})`);
    updatePreview();
    e.target.value = "";
  });
}

function fileToDataURL(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });
}
function insertAtCursor(ta, text) {
  const s = ta.selectionStart ?? ta.value.length;
  const e = ta.selectionEnd   ?? ta.value.length;
  ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
  const caret = s + text.length;
  ta.focus();
  ta.setSelectionRange(caret, caret);
}
function wrapSelection(ta, before, after = before, placeholder = "") {
  const s = ta.selectionStart ?? 0;
  const e = ta.selectionEnd   ?? 0;
  const sel = ta.value.slice(s, e) || placeholder;
  const out = before + sel + after;
  ta.value = ta.value.slice(0, s) + out + ta.value.slice(e);
  ta.focus();
  ta.setSelectionRange(s + before.length, s + before.length + sel.length);
}
function applyMd(kind) {
  const ta = $("#post-body");
  switch (kind) {
    case "bold":   wrapSelection(ta, "**", "**", "bold"); break;
    case "italic": wrapSelection(ta, "*", "*", "italic"); break;
    case "h2": {
      const s = ta.selectionStart ?? 0;
      // insert at start of current line
      const before = ta.value.slice(0, s);
      const lineStart = before.lastIndexOf("\n") + 1;
      ta.value = ta.value.slice(0, lineStart) + "## " + ta.value.slice(lineStart);
      ta.focus(); ta.setSelectionRange(lineStart + 3, lineStart + 3);
      break;
    }
    case "link": {
      ui.prompt("Link URL", "https://", "Insert link").then((url) => {
        if (!url) return;
        wrapSelection(ta, "[", `](${url})`, "link text");
        updatePreview();
      });
      return;
    }
    case "code":  wrapSelection(ta, "`", "`", "code"); break;
    case "quote": {
      const s = ta.selectionStart ?? 0;
      const before = ta.value.slice(0, s);
      const lineStart = before.lastIndexOf("\n") + 1;
      ta.value = ta.value.slice(0, lineStart) + "> " + ta.value.slice(lineStart);
      ta.focus(); ta.setSelectionRange(lineStart + 2, lineStart + 2);
      break;
    }
  }
  updatePreview();
}

function openEditor(post) {
  const modal = $("#post-modal");
  modal.setAttribute("aria-hidden", "false");
  $("#post-modal-title").textContent = post ? "Edit post" : "New post";
  $("#post-title").value = post?.title || "";
  $("#post-date").value  = post?.date  || new Date().toISOString().slice(0, 10);
  $("#post-body").value  = post?.body  || "";
  $("#post-template").value = "";
  $("#post-delete").hidden = !post;
  modal.dataset.editId = post?.id || "";
  updatePreview();
  setTimeout(() => $("#post-title").focus(), 50);
}
function closeEditor() { $("#post-modal").setAttribute("aria-hidden", "true"); }

async function updatePreview() {
  const { marked } = await import("marked");
  const md = $("#post-body").value;
  const title = $("#post-title").value;
  $("#post-preview").innerHTML = (title ? `<h1>${escapeHtml(title)}</h1>` : "") + marked.parse(md || "");
}

function savePost() {
  const title = $("#post-title").value.trim();
  const date  = $("#post-date").value  || new Date().toISOString().slice(0, 10);
  const body  = $("#post-body").value;
  if (!title) { ui.alert("Please enter a title before saving.", "Title required"); return; }
  const id = $("#post-modal").dataset.editId || ("p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
  const all = loadPosts();
  const idx = all.findIndex((p) => p.id === id);
  const next = { id, title, date, body };
  if (idx >= 0) all[idx] = next; else all.unshift(next);
  try {
    savePosts(all);
  } catch (e) {
    ui.alert("Save failed — localStorage quota exceeded. Try smaller images, or export your posts and clear some.", "Cannot save");
    return;
  }
  closeEditor();
  activePostId = id;
  renderJournalList();
}

/* ====================================
   CONTACT
   ==================================== */
function initContact() {
  gsap.from("#page-contact .contact-card", {
    scrollTrigger: { trigger: "#page-contact .contact-grid", start: "top 85%" },
    y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "expo.out",
  });
}

/* ===== Helpers ===== */
function splitChars(el) {
  const txt = el.textContent;
  el.textContent = "";
  const frag = document.createDocumentFragment();
  [...txt].forEach((c) => {
    const s = document.createElement("span");
    s.className = "char";
    s.style.display = "inline-block";
    s.style.willChange = "transform";
    s.textContent = c === " " ? " " : c;
    frag.appendChild(s);
  });
  el.appendChild(frag);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

/* ===== Boot ===== */
if (!location.hash) goRoute("/", true);
renderRoute();
// re-bind magnetic on DOM additions (only matches .btn.pill / .btn.primary w/ data-magnet)
const mo = new MutationObserver(() => bindMagnetic());
mo.observe(document.body, { childList: true, subtree: true });
