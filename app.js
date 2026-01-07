// Ativa link "active" no menu baseado na página atual
(function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// Menu mobile (toggle)
(function mobileMenu(){
  const btn = document.querySelector("#burger");
  const panel = document.querySelector("#mobilePanel");
  if(!btn || !panel) return;

  btn.addEventListener("click", ()=>{
    const isOpen = panel.getAttribute("data-open") === "true";
    panel.setAttribute("data-open", String(!isOpen));
    panel.style.display = isOpen ? "none" : "block";
  });

  // começa fechado no mobile
  panel.style.display = "none";
})();

// Reveal on scroll
(function revealOnScroll(){
  const els = Array.from(document.querySelectorAll(".reveal"));
  if(!els.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el=> io.observe(el));
})();

// "Buscar" (exemplo): redireciona para página de imóveis com âncoras/param
(function searchForm(){
  const form = document.querySelector("#heroSearchForm");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const tipo = form.querySelector("[name='tipo']").value;
    const bairro = form.querySelector("[name='bairro']").value;
    const faixa = form.querySelector("[name='faixa']").value;

    const q = new URLSearchParams({ tipo, bairro, faixa }).toString();
    window.location.href = `imoveis.html?${q}#lista`;
  });
})();
// Filtro de imóveis na página de imóveis (imoveis.html)