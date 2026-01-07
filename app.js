// =====================================================
// LuxPrime - app.js
// =====================================================

// Ativa link "active" no menu baseado na página atual
(function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// Menu mobile (toggle)
(function mobileMenu() {
  const btn = document.querySelector("#burger");
  const panel = document.querySelector("#mobilePanel");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const isOpen = panel.getAttribute("data-open") === "true";
    const next = !isOpen;

    panel.setAttribute("data-open", String(next));
    btn.setAttribute("aria-expanded", String(next));

    panel.style.display = next ? "block" : "none";
    btn.classList.toggle("is-open", next);
  });

  panel.style.display = "none";
})();

// Fecha o painel móvel quando um link for clicado
(function closeMobileOnLink() {
  const panel = document.querySelector("#mobilePanel");
  const btn = document.querySelector("#burger");
  if (!panel || !btn) return;

  panel.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-nav]");
    if (!a) return;

    panel.setAttribute("data-open", "false");
    panel.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("is-open");
  });
})();

// Reveal on scroll
(function revealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
})();

// =====================================================
// Custom Select (.cs[data-cs])
// =====================================================
(function customSelectOnly() {
  const roots = document.querySelectorAll(".cs[data-cs]");
  if (!roots.length) return;

  function closeAll(except) {
    roots.forEach((r) => {
      if (r === except) return;
      r.setAttribute("data-open", "false");
      r.querySelector(".cs__btn")?.setAttribute("aria-expanded", "false");
    });
  }

  roots.forEach((root) => {
    const native = root.querySelector(".cs__native");
    const btn = root.querySelector(".cs__btn");
    const valueEl = root.querySelector(".cs__value");
    const opts = root.querySelectorAll(".cs__opt");

    if (!native || !btn || !valueEl || !opts.length) return;

    // 🔹 NÃO força texto aqui — vem do HTML
    valueEl.classList.add("is-placeholder");

    btn.addEventListener("click", () => {
      const open = root.getAttribute("data-open") === "true";
      closeAll(open ? null : root);
      root.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", String(!open));
    });

    opts.forEach((opt) => {
      opt.addEventListener("click", () => {
        const val = opt.dataset.value;
        native.value = val;

        valueEl.textContent = opt.textContent.trim();
        valueEl.classList.remove("is-placeholder");

        opts.forEach((o) => o.setAttribute("aria-selected", "false"));
        opt.setAttribute("aria-selected", "true");

        root.setAttribute("data-open", "false");
        btn.setAttribute("aria-expanded", "false");

        native.dispatchEvent(new Event("change", { bubbles: true }));
        btn.focus();
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".cs[data-cs]")) closeAll(null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
})();

// =====================================================
// Buscar (Hero)
// =====================================================
(function searchForm() {
  const form = document.querySelector("#heroSearchForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    ["tipo", "bairro", "faixa"].forEach((name) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (el && el.value) params.set(name, el.value);
    });

    window.location.href = `imoveis.html?${params.toString()}#lista`;
  });
})();

// =====================================================
// Ano automático
// =====================================================
(function yearFooter() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();
