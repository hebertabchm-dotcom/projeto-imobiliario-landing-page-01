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
    if (next) {
      panel.style.display = "block";
      btn.classList.add("is-open");
    } else {
      panel.style.display = "none";
      btn.classList.remove("is-open");
    }
  });

  panel.style.display = "none";
})();

// Fecha o painel móvel quando um link interno for clicado
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
  const els = Array.from(document.querySelectorAll(".reveal"));
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

// Custom Select (Premium) - evita dropdown branco/azul do Windows
(function customSelects() {
  const selects = Array.from(document.querySelectorAll("[data-custom-select]"));
  if (!selects.length) return;

  function closeAll(except) {
    selects.forEach((root) => {
      if (root === except) return;
      root.classList.remove("is-open");
      const btn = root.querySelector(".cs-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  selects.forEach((root) => {
    const native = root.querySelector("select.native-select");
    const btn = root.querySelector(".cs-btn");
    const valueEl = root.querySelector(".cs-value");
    const pop = root.querySelector(".cs-pop");
    const opts = Array.from(root.querySelectorAll(".cs-opt"));

    if (!native || !btn || !valueEl || !pop || !opts.length) return;

    // inicializa com value do native
    const initialText =
      native.options[native.selectedIndex]?.textContent?.trim() || "";
    valueEl.textContent = initialText;

    btn.addEventListener("click", () => {
      const isOpen = root.classList.contains("is-open");
      if (isOpen) {
        root.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        closeAll(root);
        root.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    opts.forEach((optBtn) => {
      optBtn.addEventListener("click", () => {
        const val = optBtn.getAttribute("data-value");
        const text = optBtn.textContent.trim();

        // Atualiza native select (mantém o form funcionando)
        native.value = val;
        valueEl.textContent = text;

        // atualiza aria-selected
        opts.forEach((b) => b.setAttribute("aria-selected", "false"));
        optBtn.setAttribute("aria-selected", "true");

        // fecha
        root.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", (e) => {
    const inside = e.target.closest("[data-custom-select]");
    if (!inside) closeAll(null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
})();

// "Buscar": redireciona para página de imóveis com querystring
(function searchForm() {
  const form = document.querySelector("#heroSearchForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = form.querySelector("[name='tipo']").value;
    const bairro = form.querySelector("[name='bairro']").value;
    const faixa = form.querySelector("[name='faixa']").value;
const params = new URLSearchParams();
if (tipo) params.set("tipo", tipo);
if (bairro) params.set("bairro", bairro);
if (faixa) params.set("faixa", faixa);

window.location.href = `imoveis.html?${params.toString()}#lista`;

  });
})();

// Custom Select (apenas para .cs)
(function customSelectOnly() {
  const roots = Array.from(document.querySelectorAll(".cs[data-cs]"));
  if (!roots.length) return;

  function closeAll(except) {
    roots.forEach((r) => {
      if (r === except) return;
      r.setAttribute("data-open", "false");
      const b = r.querySelector(".cs__btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  roots.forEach((root) => {
    const native = root.querySelector(".cs__native");
    const btn = root.querySelector(".cs__btn");
    const valueEl = root.querySelector(".cs__value");
    const opts = Array.from(root.querySelectorAll(".cs__opt"));

    if (!native || !btn || !valueEl || !opts.length) return;

    // init
    valueEl.textContent = native.options[native.selectedIndex]?.textContent?.trim() || valueEl.textContent;

    btn.addEventListener("click", () => {
      const open = root.getAttribute("data-open") === "true";
      closeAll(open ? null : root);
      root.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });

    opts.forEach((o) => {
      o.addEventListener("click", () => {
        const val = o.getAttribute("data-value");
        native.value = val;
        valueEl.textContent = o.textContent.trim();

        opts.forEach((x) => x.setAttribute("aria-selected", "false"));
        o.setAttribute("aria-selected", "true");

        root.setAttribute("data-open", "false");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", (e) => {
    const inside = e.target.closest(".cs[data-cs]");
    if (!inside) closeAll(null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
})();
