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

  // começa fechado no mobile
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
    // fecha painel
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

// "Buscar" (exemplo): redireciona para página de imóveis com âncoras/param
(function searchForm() {
  const form = document.querySelector("#heroSearchForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = form.querySelector("[name='tipo']").value;
    const bairro = form.querySelector("[name='bairro']").value;
    const faixa = form.querySelector("[name='faixa']").value;

    const q = new URLSearchParams({ tipo, bairro, faixa }).toString();
    window.location.href = `imoveis.html?${q}#lista`;
  });
})();
// Filtro de imóveis na página de imóveis (imoveis.html)
