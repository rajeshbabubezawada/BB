/*
  main.js
  -------
  Renders window content (from content.js) into the DOM and wires up
  interactions: sticky header, mobile nav, scroll-spy, reveals, hero
  parallax, marquee, and the contact form.
*/

(function () {
  "use strict";

  const content = window.DEFAULT_CONTENT;
  if (!content) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeHref(href) {
    const value = String(href || "").trim();
    if (!value || /^javascript:/i.test(value) || /^data:/i.test(value)) return "#";
    return value;
  }

  /* ---------------- Icons ---------------- */
  const ICONS = {
    compass:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    cube:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7.5L12 12l8-4.5M12 12v9" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    spark:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  };

  /* ---------------- Simple field binding ---------------- */
  function renderSimpleBindings() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind");
      const value = getByPath(content, path);
      if (typeof value === "string") {
        if (path === "footer.copyright") {
          el.textContent = value.replace("{year}", String(new Date().getFullYear()));
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
            el.setAttribute(attr, attr === "href" ? safeHref(value) : value);
          }
        });
    });
  }

  /* ---------------- List renderers ---------------- */
  function renderNavLinks() {
    const links = content.nav && content.nav.links ? content.nav.links : [];
    const html = links
      .map(
        (link) =>
          `<li><a href="${escapeHtml(safeHref(link.href))}" data-nav-link>${escapeHtml(link.label)}</a></li>`
      )
      .join("");
    ["nav-list", "mobile-nav-list"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  function renderIndustries() {
    const items = (content.industries && content.industries.items) || [];
    const html = items
      .map((item) => `<span class="industry-chip">${escapeHtml(item)}</span>`)
      .join("");
    ["industries-track", "industries-track-2"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  function renderAboutParagraphs() {
    const el = document.getElementById("about-copy");
    if (!el) return;
    const paragraphs = (content.about && content.about.paragraphs) || [];
    el.innerHTML = paragraphs
      .map((text) => {
        const emphasis = text.length <= 44 ? " emphasis" : "";
        return `<p class="reveal-line${emphasis}">${escapeHtml(text)}</p>`;
      })
      .join("");
  }

  function renderPillars() {
    const el = document.getElementById("pillars-grid");
    if (!el) return;
    const pillars = (content.services && content.services.pillars) || [];
    el.innerHTML = pillars
      .map((p, i) => {
        const num = String(i + 1).padStart(2, "0");
        const hook = p.hook ? `<p class="bento-hook">${escapeHtml(p.hook)}</p>` : "";
        const description = escapeHtml(p.description || "").replace(/\n/g, "<br>");
        return `
        <article class="bento-card reveal-item">
          <span class="bento-index">${num}</span>
          <div class="bento-icon">${ICONS[p.icon] || ICONS.spark}</div>
          <h3>${escapeHtml(p.title)}</h3>
          ${hook}
          <p>${description}</p>
        </article>`;
      })
      .join("");
  }

  function renderTimeline() {
    const el = document.getElementById("timeline-list");
    if (!el) return;
    const steps = (content.timeline && content.timeline.steps) || [];
    el.innerHTML = steps
      .map(
        (s) => `
        <div class="timeline-step reveal-item">
          <span class="timeline-number">${escapeHtml(s.number)}</span>
          <h3>${escapeHtml(s.title)}</h3>
          <p>${escapeHtml(s.description)}</p>
        </div>`
      )
      .join("");
  }

  function renderFooterLinks() {
    const linksEl = document.getElementById("footer-links");
    if (!linksEl) return;
    const links =
      (content.footer && content.footer.links) ||
      (content.nav && content.nav.links) ||
      [];
    linksEl.innerHTML = links
      .map((l) => `<li><a href="${escapeHtml(safeHref(l.href))}">${escapeHtml(l.label)}</a></li>`)
      .join("");
  }

  function renderAll() {
    renderSimpleBindings();
    renderNavLinks();
    renderIndustries();
    renderAboutParagraphs();
    renderPillars();
    renderTimeline();
    renderFooterLinks();
  }

  /* ---------------- Announcement banner ---------------- */
  function initAnnouncementBar() {
    const bar = document.getElementById("announcement-bar");
    if (!bar) return;

    const hasText = !!(content.banner && content.banner.text && content.banner.text.trim());
    if (!hasText) {
      bar.hidden = true;
      document.documentElement.style.setProperty("--banner-h", "0px");
      return;
    }

    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem("bb_banner_dismissed") === "1";
    } catch (e) {
      /* sessionStorage unavailable */
    }

    function applyHeight() {
      const h = bar.classList.contains("hidden") || bar.hidden ? 0 : bar.offsetHeight;
      document.documentElement.style.setProperty("--banner-h", `${h}px`);
    }

    if (dismissed) bar.classList.add("hidden");
    applyHeight();
    window.addEventListener("resize", applyHeight, { passive: true });

    const closeBtn = document.getElementById("announcement-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        bar.classList.add("hidden");
        applyHeight();
        try {
          window.sessionStorage.setItem("bb_banner_dismissed", "1");
        } catch (e) {
          /* ignore */
        }
      });
    }
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
      toggle.setAttribute("aria-label", "Open menu");
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    }
    function open() {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
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
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        close();
        toggle.focus();
      }
    });
  }

  /* ---------------- Smooth anchor scrolling (offset for fixed header) ---------------- */
  function scrollToTarget(target) {
    const header = document.getElementById("site-header");
    const headerBottom = header ? header.getBoundingClientRect().bottom : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerBottom + 1;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        scrollToTarget(target);
        history.pushState(null, "", id);
      });
    });

    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        window.setTimeout(() => scrollToTarget(target), 0);
      }
    }
  }

  /* ---------------- Scroll-spy ---------------- */
  function initScrollSpy() {
    const sectionIds = ["about", "services", "contact"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const match = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", match);
        if (match) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
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

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }

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
    if (prefersReducedMotion) return;

    const hero = document.querySelector(".hero");
    const plate = document.querySelector(".hero-logo-plate");
    const shards = document.querySelectorAll(".shard");
    const glow = document.querySelector(".hero-glow");
    if (!hero) return;

    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (isFine) {
      hero.addEventListener("mousemove", (e) => {
        const { innerWidth: w, innerHeight: h } = window;
        const x = (e.clientX / w - 0.5) * 2;
        const y = (e.clientY / h - 0.5) * 2;
        if (plate) plate.style.transform = `translate(${Math.round(x * 10)}px, ${Math.round(y * 8)}px)`;
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
        if (scrolled < window.innerHeight && glow) {
          glow.style.transform = `translateY(${scrolled * 0.25}px)`;
        }
      },
      { passive: true }
    );
  }

  /* ---------------- Contact form ---------------- */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    const submit = document.getElementById("contact-submit");
    if (!form || !note) return;

    const endpoint =
      (content.contact && content.contact.formEndpoint) ||
      "https://erj8bb42dd.execute-api.ap-south-2.amazonaws.com/Prod/BMail";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const botcheck = form.querySelector('[name="botcheck"]');

      note.classList.remove("success", "error");

      if (botcheck && botcheck.checked) {
        note.textContent = "Thanks — your message has been sent.";
        note.classList.add("success");
        form.reset();
        return;
      }

      if (!name || !email || !message) {
        note.textContent = "Please fill in every field before sending.";
        note.classList.add("error");
        return;
      }

      if (!isValidEmail(email)) {
        note.textContent = "Please enter a valid email address.";
        note.classList.add("error");
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.setAttribute("aria-busy", "true");
      }
      note.textContent = "Sending your message…";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error((data && data.message) || "Send failed");
        }
        note.textContent = "Thanks — your message has been sent.";
        note.classList.add("success");
        form.reset();
      } catch (err) {
        note.textContent = "Something went wrong. Please try again in a moment.";
        note.classList.add("error");
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.removeAttribute("aria-busy");
        }
      }
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    initAnnouncementBar();
    initHeaderScroll();
    initMobileNav();
    initAnchorScroll();
    initScrollSpy();
    initReveal();
    initHeroParallax();
    initContactForm();
  });
})();
