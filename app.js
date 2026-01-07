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
// =====================================================
// WhatsApp Floating Button – dinâmica + eventos
// =====================================================
(function whatsappFloat() {
  const btn = document.getElementById("whatsappFloat");
  if (!btn) return;

  const phone = "5521000000000"; // 🔁 TROQUE PELO NÚMERO REAL
  const page = location.pathname.includes("imoveis")
    ? "imóveis"
    : location.pathname.includes("contato")
    ? "atendimento"
    : "site";

  const messageMap = {
    site: "Olá, gostaria de falar com um especialista da LuxPrime.",
    imóveis: "Olá, estou vendo imóveis no site da LuxPrime e gostaria de ajuda.",
    atendimento: "Olá, gostaria de atendimento personalizado da LuxPrime."
  };

  const text = encodeURIComponent(messageMap[page] || messageMap.site);
  btn.href = `https://wa.me/${phone}?text=${text}`;

  // animação após 5s
  setTimeout(() => {
    btn.classList.add("attention");
  }, 5000);

  // remove animação ao interagir
  ["mouseenter", "click", "touchstart"].forEach((evt) => {
    btn.addEventListener(evt, () => btn.classList.remove("attention"));
  });

  // =========================
  // Eventos de conversão
  // =========================
  btn.addEventListener("click", () => {
    // Google Analytics 4
    if (typeof gtag === "function") {
      gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: page
      });
    }

    // Meta Pixel
    if (typeof fbq === "function") {
      fbq("track", "Contact", {
        content_name: "WhatsApp LuxPrime",
        page
      });
    }
  });
})();
// =====================================================
// WhatsApp Inteligente – LuxPrime (PRO)
// =====================================================
(function whatsappPro() {
  btn.addEventListener("click", (e) => {
  e.preventDefault();
});

  const btn = document.getElementById("whatsappFloat");
  if (!btn) return;

  const phone = "5521000000000"; // 🔁 TROQUE
  const now = new Date();
  const day = now.getDay(); // 0 = domingo
  const hour = now.getHours();

  // =========================
  // 1️⃣ HORÁRIO COMERCIAL
  // =========================
  const isWeekday = day >= 1 && day <= 5 && hour >= 9 && hour < 19;
  const isSaturday = day === 6 && hour >= 9 && hour < 14;

  if (!isWeekday && !isSaturday) {
  btn.style.opacity = "0.75";
  btn.setAttribute("data-tooltip", "Atendimento: seg–sex 9h–19h");
  // NÃO retorna; mantém o botão visível
}

  

  // =========================
  // 2️⃣ A/B TEST TOOLTIP
  // =========================
  const tooltips = [
    "Fale com um especialista",
    "Atendimento personalizado"
  ];

  let tooltipVariant = localStorage.getItem("lp_tooltip_variant");

  if (!tooltipVariant) {
    tooltipVariant = Math.random() < 0.5 ? 0 : 1;
    localStorage.setItem("lp_tooltip_variant", tooltipVariant);
  }

  btn.setAttribute("data-tooltip", tooltips[tooltipVariant]);

  // =========================
  // 3️⃣ CAPTURA DE CONTEXTO (bairro / região)
  // =========================
  function getContext() {
    const params = new URLSearchParams(location.search);
    const regiao = params.get("regiao") || "";
    const bairro = params.get("bairro") || "";

    if (bairro) return `bairro ${bairro}`;
    if (regiao) return `região ${regiao}`;
    return null;
  }

  const context = getContext();
  const page =
    location.pathname.includes("imoveis") ? "imóveis" :
    location.pathname.includes("contato") ? "atendimento" :
    "site";

  let message = "Olá, gostaria de falar com um especialista da LuxPrime.";

  if (context) {
    message = `Olá, estou interessado em imóveis na ${context} e gostaria de atendimento.`;
  } else if (page === "imóveis") {
    message = "Olá, estou navegando pelos imóveis da LuxPrime e gostaria de ajuda.";
  }

  btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // =========================
  // 4️⃣ ANIMAÇÃO APÓS 5s
  // =========================
  setTimeout(() => btn.classList.add("attention"), 5000);

  ["mouseenter", "click", "touchstart"].forEach((evt) => {
    btn.addEventListener(evt, () => btn.classList.remove("attention"));
  });

  // =========================
  // 5️⃣ EVENTOS + CRM
  // =========================
  btn.addEventListener("click", () => {
    // GA4
    if (typeof gtag === "function") {
      gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: page,
        value: tooltipVariant
      });
    }

    // Meta Pixel
    if (typeof fbq === "function") {
      fbq("track", "Contact", {
        content_name: "WhatsApp LuxPrime",
        page,
        variant: tooltipVariant
      });
    }

    // CRM / Webhook
    fetch("https://SEU-WEBHOOK-AQUI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origem: "WhatsApp",
        pagina: page,
        contexto: context,
        tooltip: tooltips[tooltipVariant],
        data: new Date().toISOString()
      })
    }).catch(() => {});
  });
})();
(function headerOnScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  });
})();
