(() => {
  "use strict";

  /* ---------------- Nav toggle ---------------- */
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const open = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    primaryNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------- Filter & vergelijk ---------------- */
  const filtersEl = document.getElementById("filters");
  if (!filtersEl) return;

  const state = {
    brand: "alle", maxBudget: 399,
    bluetooth: false, nfc: false, qi: false,
    touch: false, eal6: false, openSource: false, quantum: false,
  };

  const cardGrid = document.getElementById("cardGrid");
  const cards = Array.from(cardGrid.querySelectorAll(".product-detail-card"));
  const budgetRange = document.getElementById("budgetRange");
  const budgetOutput = document.getElementById("budgetOutput");
  const brandSeg = document.getElementById("brandSeg");
  const toggleIds = {
    bluetooth: "fBluetooth", nfc: "fNfc", qi: "fQi",
    touch: "fTouch", eal6: "fEal6", openSource: "fOpenSource", quantum: "fQuantum",
  };
  const toggleEls = {};
  Object.entries(toggleIds).forEach(([key, id]) => (toggleEls[key] = document.getElementById(id)));
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");

  function matches(card) {
    const d = card.dataset;
    if (state.brand !== "alle" && d.brand !== state.brand) return false;
    if (Number(d.price) > state.maxBudget) return false;
    if (state.bluetooth && d.bluetooth !== "1") return false;
    if (state.nfc && d.nfc !== "1") return false;
    if (state.qi && d.qi !== "1") return false;
    if (state.touch && d.touch !== "1") return false;
    if (state.eal6 && d.eal6 !== "1") return false;
    if (state.openSource && d.opensource !== "1") return false;
    if (state.quantum && d.quantum !== "1") return false;
    return true;
  }

  function applyFilters() {
    let visibleCount = 0;
    cards.forEach((card) => {
      const ok = matches(card);
      if (ok) {
        visibleCount++;
        if (card.style.display === "none") {
          card.style.display = "";
          void card.offsetWidth;
        }
        card.classList.remove("card-hidden");
      } else {
        card.classList.add("card-hidden");
        setTimeout(() => {
          if (card.classList.contains("card-hidden")) card.style.display = "none";
        }, 220);
      }
    });
    resultCount.textContent = String(visibleCount);
    emptyState.classList.toggle("show", visibleCount === 0);
    cardGrid.style.display = visibleCount === 0 ? "none" : "grid";
  }

  brandSeg.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-brand]");
    if (!btn) return;
    state.brand = btn.dataset.brand;
    brandSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    applyFilters();
  });

  budgetRange.addEventListener("input", () => {
    state.maxBudget = Number(budgetRange.value);
    budgetOutput.textContent = state.maxBudget >= 399 ? "Tot €399 (alles)" : `Tot €${state.maxBudget}`;
    applyFilters();
  });

  Object.entries(toggleEls).forEach(([key, el]) => {
    el.addEventListener("change", () => {
      state[key] = el.checked;
      applyFilters();
    });
  });

  function resetFilters() {
    state.brand = "alle"; state.maxBudget = 399;
    state.bluetooth = false; state.nfc = false; state.qi = false;
    state.touch = false; state.eal6 = false; state.openSource = false; state.quantum = false;
    brandSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.brand === "alle"));
    budgetRange.value = 399;
    budgetOutput.textContent = "Tot €399 (alles)";
    Object.values(toggleEls).forEach((el) => (el.checked = false));
    applyFilters();
  }

  document.getElementById("resetFilters").addEventListener("click", resetFilters);
  document.getElementById("emptyReset").addEventListener("click", resetFilters);

  applyFilters();
})();
