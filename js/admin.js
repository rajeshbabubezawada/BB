/*
  admin.js
  --------
  Schema-driven content editor. Renders a form for every editable field in
  content.js, keeps a working copy of the content in memory, and persists
  changes to localStorage (auto-save) plus an explicit Save button.
*/

(function () {
  "use strict";

  const store = window.BBContentStore;
  let state = store.getContent();
  let activeSectionId = null;
  let dirtyTimer = null;

  /* ---------------- Path helpers ---------------- */
  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (cur[k] == null) cur[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = value;
  }

  /* ---------------- Schema ---------------- */
  const ICON_OPTIONS = {
    "services.pillars": ["compass", "cube", "spark"],
    "footer.social": ["linkedin", "x", "instagram"],
  };

  const SCHEMA = [
    {
      id: "hero",
      title: "Hero",
      desc: "The first thing visitors see.",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Headline", type: "textarea" },
        { key: "hero.subheading", label: "Subheading", type: "textarea" },
        { key: "hero.primaryCtaLabel", label: "Primary button label", type: "text" },
        { key: "hero.primaryCtaHref", label: "Primary button link", type: "text" },
        { key: "hero.secondaryCtaLabel", label: "Secondary link label", type: "text" },
        { key: "hero.secondaryCtaHref", label: "Secondary link target", type: "text" },
      ],
    },
    {
      id: "nav",
      title: "Navigation",
      desc: "The sticky header menu and its call-to-action button.",
      fields: [
        { key: "nav.ctaLabel", label: "Header button label", type: "text" },
        { key: "nav.ctaHref", label: "Header button link", type: "text" },
        {
          key: "nav.links",
          label: "Menu links",
          type: "repeat",
          addLabel: "Add menu link",
          itemTitle: (item, i) => item.label || `Link ${i + 1}`,
          subfields: [
            { key: "label", label: "Label", type: "text" },
            { key: "href", label: "Link (e.g. #about)", type: "text" },
          ],
        },
      ],
    },
    {
      id: "industries",
      title: "Industries Band",
      desc: "The scrolling strip beneath the hero.",
      fields: [
        { key: "industries.heading", label: "Heading", type: "text" },
        { key: "industries.subheading", label: "Subheading", type: "text" },
        { key: "industries.items", label: "Industries", hint: "one per line", type: "lines" },
      ],
    },
    {
      id: "about",
      title: "About",
      desc: "The long-form story section.",
      fields: [
        { key: "about.eyebrow", label: "Eyebrow", type: "text" },
        { key: "about.heading", label: "Heading", type: "text" },
        {
          key: "about.paragraphs",
          label: "Story",
          hint: "separate paragraphs with a blank line",
          type: "paragraphs",
          tall: true,
        },
        { key: "about.closingLine", label: "Closing line", type: "text" },
      ],
    },
    {
      id: "services",
      title: "Services",
      desc: "The three-column pillars section.",
      fields: [
        { key: "services.eyebrow", label: "Eyebrow", type: "text" },
        { key: "services.heading", label: "Heading", type: "text" },
        { key: "services.subheading", label: "Subheading", type: "textarea" },
        {
          key: "services.pillars",
          label: "Pillars",
          type: "repeat",
          itemTitle: (item, i) => item.title || `Pillar ${i + 1}`,
          subfields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon", type: "select", options: ["compass", "cube", "spark"] },
          ],
        },
      ],
    },
    {
      id: "timeline",
      title: "How We Work",
      desc: "The step-by-step process timeline.",
      fields: [
        { key: "timeline.eyebrow", label: "Eyebrow", type: "text" },
        { key: "timeline.heading", label: "Heading", type: "text" },
        {
          key: "timeline.steps",
          label: "Steps",
          type: "repeat",
          itemTitle: (item, i) => item.title || `Step ${i + 1}`,
          subfields: [
            { key: "number", label: "Number", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ],
        },
      ],
    },
    {
      id: "closing",
      title: "Closing CTA",
      desc: "The bold final pitch before the footer.",
      fields: [
        { key: "closing.heading", label: "Heading", type: "textarea" },
        { key: "closing.subheading", label: "Subheading", type: "textarea" },
        { key: "closing.ctaLabel", label: "Button label", type: "text" },
        { key: "closing.ctaHref", label: "Button link", type: "text" },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      desc: "The contact section and form.",
      fields: [
        { key: "contact.eyebrow", label: "Eyebrow", type: "text" },
        { key: "contact.heading", label: "Heading", type: "text" },
        { key: "contact.subheading", label: "Subheading", type: "textarea" },
        { key: "contact.email", label: "Contact email", type: "text" },
        { key: "contact.ctaLabel", label: "Submit button label", type: "text" },
        { key: "contact.formNamePlaceholder", label: "Name field placeholder", type: "text" },
        { key: "contact.formEmailPlaceholder", label: "Email field placeholder", type: "text" },
        { key: "contact.formMessagePlaceholder", label: "Message field placeholder", type: "text" },
      ],
    },
    {
      id: "footer",
      title: "Footer",
      desc: "Copyright, legal links and social icons.",
      fields: [
        { key: "footer.tagline", label: "Tagline", type: "text" },
        { key: "footer.description", label: "Description", type: "text" },
        { key: "footer.copyright", label: "Copyright text", hint: "use {year} for the current year", type: "text" },
        {
          key: "footer.links",
          label: "Footer links",
          type: "repeat",
          addLabel: "Add link",
          itemTitle: (item, i) => item.label || `Link ${i + 1}`,
          subfields: [
            { key: "label", label: "Label", type: "text" },
            { key: "href", label: "Link", type: "text" },
          ],
        },
        {
          key: "footer.social",
          label: "Social links",
          type: "repeat",
          addLabel: "Add social link",
          itemTitle: (item, i) => item.label || `Social ${i + 1}`,
          subfields: [
            { key: "label", label: "Platform name", type: "text" },
            { key: "href", label: "URL", type: "text" },
            { key: "icon", label: "Icon", type: "select", options: ["linkedin", "x", "instagram"] },
          ],
        },
      ],
    },
  ];

  /* ---------------- DOM builders ---------------- */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => c && node.appendChild(c));
    return node;
  }

  function fieldLabel(field) {
    const label = el("label", { for: field.key });
    label.textContent = field.label;
    if (field.hint) {
      const hint = el("span", { class: "hint" });
      hint.textContent = field.hint;
      label.appendChild(hint);
    }
    return label;
  }

  function bindLiveUpdate(input, path, transformOut) {
    const handler = () => {
      const raw = input.value;
      const value = transformOut ? transformOut(raw) : raw;
      setPath(state, path, value);
      scheduleAutosave();
      refreshSidebarCounts();
    };
    input.addEventListener("input", handler);
  }

  function buildSimpleField(field) {
    const wrap = el("div", { class: "admin-field" }, [fieldLabel(field)]);
    const value = getPath(state, field.key);

    if (field.type === "textarea" || field.type === "paragraphs") {
      const ta = el("textarea", {
        class: "admin-textarea" + (field.tall ? " tall" : ""),
        id: field.key,
      });
      ta.value = field.type === "paragraphs" ? (value || []).join("\n\n") : value || "";
      bindLiveUpdate(ta, field.key, field.type === "paragraphs"
        ? (raw) => raw.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
        : undefined);
      wrap.appendChild(ta);
    } else if (field.type === "lines") {
      const ta = el("textarea", { class: "admin-textarea", id: field.key });
      ta.value = (value || []).join("\n");
      bindLiveUpdate(ta, field.key, (raw) =>
        raw.split("\n").map((s) => s.trim()).filter(Boolean)
      );
      wrap.appendChild(ta);
    } else {
      const input = el("input", { type: "text", class: "admin-input", id: field.key });
      input.value = value || "";
      bindLiveUpdate(input, field.key);
      wrap.appendChild(input);
    }
    return wrap;
  }

  function buildRepeatField(field) {
    const wrap = el("div", { class: "admin-field" }, [fieldLabel(field)]);
    const list = getPath(state, field.key) || [];

    list.forEach((item, index) => {
      wrap.appendChild(buildRepeatItem(field, item, index, list.length));
    });

    const addBtn = el("button", { type: "button", class: "admin-add-btn" });
    addBtn.textContent = "+ " + (field.addLabel || "Add item");
    addBtn.addEventListener("click", () => {
      const blank = {};
      field.subfields.forEach((sf) => (blank[sf.key] = sf.type === "select" ? sf.options[0] : ""));
      const arr = getPath(state, field.key) || [];
      arr.push(blank);
      setPath(state, field.key, arr);
      scheduleAutosave();
      renderActiveSection();
    });
    wrap.appendChild(addBtn);
    return wrap;
  }

  function buildRepeatItem(field, item, index, total) {
    const itemPath = `${field.key}.${index}`;
    const titleText = field.itemTitle ? field.itemTitle(item, index) : `Item ${index + 1}`;

    const head = el("div", { class: "admin-repeat-item-head" }, [
      el("span", { class: "admin-repeat-item-title", html: escapeHtml(titleText) }),
    ]);

    if (!field.fixed) {
      const removeBtn = el("button", { type: "button", class: "admin-remove-btn" });
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        const arr = getPath(state, field.key) || [];
        arr.splice(index, 1);
        setPath(state, field.key, arr);
        scheduleAutosave();
        renderActiveSection();
      });
      head.appendChild(removeBtn);
    }

    const card = el("div", { class: "admin-repeat-item" }, [head]);

    field.subfields.forEach((sf) => {
      const subPath = `${itemPath}.${sf.key}`;
      const subWrap = el("div", { class: "admin-field" }, [fieldLabel(sf)]);
      const value = getPath(state, subPath);

      if (sf.type === "textarea") {
        const ta = el("textarea", { class: "admin-textarea" });
        ta.value = value || "";
        bindLiveUpdate(ta, subPath);
        subWrap.appendChild(ta);
      } else if (sf.type === "select") {
        const select = el("select", { class: "admin-select" });
        sf.options.forEach((opt) => {
          const o = el("option", { value: opt });
          o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
          if (String(value) === opt) o.setAttribute("selected", "selected");
          select.appendChild(o);
        });
        select.addEventListener("change", () => {
          setPath(state, subPath, select.value);
          scheduleAutosave();
          renderActiveSection();
        });
        subWrap.appendChild(select);
      } else {
        const input = el("input", { type: "text", class: "admin-input" });
        input.value = value || "";
        input.addEventListener("input", () => {
          setPath(state, subPath, input.value);
          scheduleAutosave();
          if (sf.key === "title" || sf.key === "name" || sf.key === "label") {
            head.firstChild.textContent = input.value || titleText;
          }
        });
        subWrap.appendChild(input);
      }
      card.appendChild(subWrap);
    });

    return card;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------------- Section rendering ---------------- */
  function renderSidebar() {
    const sidebar = document.getElementById("admin-sidebar");
    sidebar.innerHTML = "";
    SCHEMA.forEach((section) => {
      const btn = el("button", {
        type: "button",
        class: "admin-nav-item" + (section.id === activeSectionId ? " active" : ""),
        "data-section": section.id,
      });
      const label = el("span", { class: "label" });
      label.textContent = section.title;
      btn.appendChild(label);
      btn.addEventListener("click", () => {
        activeSectionId = section.id;
        renderSidebar();
        renderActiveSection();
      });
      sidebar.appendChild(btn);
    });
  }

  function refreshSidebarCounts() {
    // Placeholder hook in case counts are added later; keeps API stable.
  }

  function renderActiveSection() {
    const formArea = document.getElementById("admin-form-area");
    const section = SCHEMA.find((s) => s.id === activeSectionId) || SCHEMA[0];
    activeSectionId = section.id;

    formArea.innerHTML = "";
    const wrap = el("div", { class: "admin-section active" }, [
      el("h2", { class: "admin-section-title", html: escapeHtml(section.title) }),
      el("p", { class: "admin-section-desc", html: escapeHtml(section.desc || "") }),
    ]);

    section.fields.forEach((field) => {
      wrap.appendChild(field.type === "repeat" ? buildRepeatField(field) : buildSimpleField(field));
    });

    formArea.appendChild(wrap);
    renderSidebar();
  }

  /* ---------------- Persistence ---------------- */
  const statusEl = () => document.getElementById("admin-status");

  function setStatus(text, dirty) {
    const s = statusEl();
    if (!s) return;
    s.textContent = text;
    s.classList.toggle("dirty", !!dirty);
  }

  function persist() {
    store.saveContent(state);
    setStatus("All changes saved", false);
    refreshPreview();
  }

  function scheduleAutosave() {
    setStatus("Unsaved changes…", true);
    clearTimeout(dirtyTimer);
    dirtyTimer = setTimeout(persist, 700);
  }

  function refreshPreview() {
    const frame = document.getElementById("preview-frame");
    if (!frame) return;
    try {
      frame.contentWindow.location.reload();
    } catch (e) {
      frame.src = frame.src;
    }
  }

  function showToast(message) {
    const toast = document.getElementById("admin-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  /* ---------------- Top bar actions ---------------- */
  function initTopbar() {
    document.getElementById("btn-save").addEventListener("click", () => {
      clearTimeout(dirtyTimer);
      persist();
      showToast("Changes saved. Your live site is updated in this browser.");
    });

    document.getElementById("btn-reset").addEventListener("click", () => {
      if (!confirm("Reset all content back to the original defaults? This cannot be undone.")) return;
      store.clearOverrides();
      state = store.getContent();
      persist();
      renderActiveSection();
      showToast("Content reset to defaults.");
    });

    document.getElementById("btn-download").addEventListener("click", () => {
      const text = store.exportAsFileText(state);
      store.downloadTextFile("content.js", text);
      showToast("Downloaded content.js — replace js/content.js with this file to publish permanently.");
    });

    document.getElementById("import-file").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = store.parseImportedFileText(String(reader.result));
          state = parsed;
          persist();
          renderActiveSection();
          showToast("Content imported successfully.");
        } catch (err) {
          alert("Could not import that file: " + err.message);
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    document.getElementById("btn-refresh-preview").addEventListener("click", refreshPreview);
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    activeSectionId = SCHEMA[0].id;
    initTopbar();
    renderSidebar();
    renderActiveSection();
  });
})();
