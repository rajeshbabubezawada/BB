/*
  main.js
  -------
  Renders window content (from content.js + any saved edits) into the DOM
  and wires up the site's interactions: sticky/blurred header, mobile nav,
  scroll-spy navigation, scroll-reveal animations, hero parallax, marquee,
  and the contact form.
*/

(function () {
  "use strict";

  const content = window.BBContentStore.getContent();

  function getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  /* ---------------- Icons ---------------- */
  const ICONS = {
    compass:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    cube:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7.5L12 12l8-4.5M12 12v9" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    spark:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    linkedin:
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9Z"/></svg>',
    x:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-7.3L4.2 22H1l8.2-9.3L1 2h7.3l5 6.7L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z"/></svg>',
    instagram:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>',
    arrow:
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /* ---------------- Simple field binding ---------------- */
  function renderSimpleBindings() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind");
      const value = getByPath(content, path);
      if (typeof value === "string") {
        if (path === "footer.copyright") {
          el.textContent = value.replace("{year}", new Date().getFullYear());
        } else {
          el.textContent = value;
        }
      }
    });

    document.querySelectorAll("[data-bind-attr]").forEach((el) => {
      el.getAttribute("data-bind-attr")
        .split(";")
        .map((pair) => pair.trim())
        .filter(Boolean)
        .forEach((pair) => {
          const [attr, path] = pair.split(":").map((s) => s.trim());
          const value = getByPath(content, path);
          if (typeof value === "string" && value) {
            el.setAttribute(attr, value);
          }
        });
    });
  }

  /* ---------------- List renderers ---------------- */
  function renderNavLinks() {
    const links = content.nav.links || [];
    ["nav-list", "mobile-nav-list"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = links
        .map((link) => `<li><a href="${link.href}" data-nav-link>${link.label}</a></li>`)
        .join("");
    });
  }

  function renderIndustries() {
    const items = content.industries.items || [];
    const html = items.map((item) => `<span class="industry-chip">${item}</span>`).join("");
    ["industries-track", "industries-track-2"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  function renderAboutParagraphs() {
    const el = document.getElementById("about-copy");
    if (!el) return;
    const paragraphs = content.about.paragraphs || [];
    el.innerHTML = paragraphs
      .map((text) => {
        const emphasis = text.length <= 44 ? " emphasis" : "";
        return `<p class="reveal-line${emphasis}">${text}</p>`;
      })
      .join("");
  }

  function renderPillars() {
    const el = document.getElementById("pillars-grid");
    if (!el) return;
    const pillars = content.services.pillars || [];
    el.innerHTML = pillars
      .map((p, i) => {
        const num = String(i + 1).padStart(2, "0");
        return `
        <div class="bento-card reveal-item">
          <span class="bento-index">${num}</span>
          <div class="bento-icon">${ICONS[p.icon] || ICONS.spark}</div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>`;
      })
      .join("");
  }

  function renderTimeline() {
    const el = document.getElementById("timeline-list");
    if (!el) return;
    const steps = content.timeline.steps || [];
    el.innerHTML = steps
      .map(
        (s) => `
        <div class="timeline-step reveal-item">
          <span class="timeline-number">${s.number}</span>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>`
      )
      .join("");
  }

  function renderFooterLists() {
    const linksEl = document.getElementById("footer-links");
    if (linksEl) {
      linksEl.innerHTML = (content.footer.links || [])
        .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
        .join("");
    }
    const socialEl = document.getElementById("footer-social");
    if (socialEl) {
      socialEl.innerHTML = (content.footer.social || [])
        .map(
          (s) =>
            `<li><a href="${s.href}" aria-label="${s.label}" target="_blank" rel="noopener">${
              ICONS[s.icon] || ""
            }</a></li>`
        )
        .join("");
    }
  }

  function renderAll() {
    renderSimpleBindings();
    renderNavLinks();
    renderIndustries();
    renderAboutParagraphs();
    renderPillars();
    renderTimeline();
    renderFooterLists();
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    if (!toggle || !mobileNav) return;

    function close() {
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    }
    function open() {
      toggle.setAttribute("aria-expanded", "true");
      mobileNav.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });
    mobileNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });
  }

  /* ---------------- Smooth anchor scrolling (offset for fixed header) ---------------- */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerH = document.getElementById("site-header")?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
        window.scrollTo({ top, behavior: "smooth" });
        history.pushState(null, "", id);
      });
    });
  }

  /* ---------------- Scroll-spy ---------------- */
  function initScrollSpy() {
    const sectionIds = ["about", "services", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const match = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", match);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .reveal-line, .reveal-item");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      observer.observe(el);
    });
  }

  /* ---------------- Hero parallax ---------------- */
  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    const logo = document.getElementById("hero-logo");
    const shards = document.querySelectorAll(".shard");
    if (!hero) return;

    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (isFine) {
      hero.addEventListener("mousemove", (e) => {
        const { innerWidth: w, innerHeight: h } = window;
        const x = (e.clientX / w - 0.5) * 2;
        const y = (e.clientY / h - 0.5) * 2;
        if (logo) logo.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0) rotate(${x * 1.2}deg)`;
        shards.forEach((s, i) => {
          const depth = 8 + i * 4;
          s.style.setProperty("transform", `translate3d(${x * depth}px, ${y * depth}px, 0)`);
        });
      });
    }

    window.addEventListener(
      "scroll",
      () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          hero.style.setProperty("--scrollY", scrolled);
          const glow = document.querySelector(".hero-glow");
          if (glow) glow.style.transform = `translateY(${scrolled * 0.25}px)`;
        }
      },
      { passive: true }
    );
  }

  /* ---------------- Contact form ---------------- */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "Please fill in every field before sending.";
        note.classList.remove("success");
        return;
      }

      const to = content.contact.email || "hello@theblackbird.ai";
      const subject = encodeURIComponent(`New inquiry from ${name} via theblackbird.ai`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      note.textContent = "Opening your email app to send this message…";
      note.classList.add("success");
      form.reset();
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    initHeaderScroll();
    initMobileNav();
    initAnchorScroll();
    initScrollSpy();
    initReveal();
    initHeroParallax();
    initContactForm();
  });
})();
