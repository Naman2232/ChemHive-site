/**
 * ChemHive Chemical Catalog Controller
 * Handles search, filtering, card rendering, and product modal dialogs.
 */

(function () {
  let activeCategory = "All";
  let activeGrade = "All";
  let searchQuery = "";
  let currentSort = "name-asc";

  function initCatalog() {
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    setupFilters();
    setupSearch();
    renderProducts();

    // Check URL parameters (e.g. ?search=acetone or ?category=pharma)
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    const catParam = urlParams.get("category");

    if (searchParam) {
      const searchInput = document.getElementById("catalog-search-input");
      if (searchInput) {
        searchInput.value = searchParam;
        searchQuery = searchParam.toLowerCase();
      }
    }
    if (catParam) {
      activeCategory = catParam;
      highlightActiveCategory(catParam);
    }
    renderProducts();
  }

  function setupFilters() {
    const catButtons = document.querySelectorAll(".category-filter-btn");
    catButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        catButtons.forEach((b) => b.classList.remove("active", "bg-cyan-600", "text-white"));
        btn.classList.add("active", "bg-cyan-600", "text-white");
        activeCategory = btn.getAttribute("data-category") || "All";
        renderProducts();
      });
    });

    const gradeSelect = document.getElementById("filter-grade-select");
    if (gradeSelect) {
      gradeSelect.addEventListener("change", (e) => {
        activeGrade = e.target.value;
        renderProducts();
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }
  }

  function highlightActiveCategory(categoryName) {
    const catButtons = document.querySelectorAll(".category-filter-btn");
    catButtons.forEach((btn) => {
      if (btn.getAttribute("data-category") === categoryName) {
        btn.classList.add("active", "bg-cyan-600", "text-white");
      } else {
        btn.classList.remove("active", "bg-cyan-600", "text-white");
      }
    });
  }

  function setupSearch() {
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderProducts();
      });
    }
  }

  function getFilteredProducts() {
    if (typeof CHEMICAL_PRODUCTS === "undefined") return [];

    return CHEMICAL_PRODUCTS.filter((prod) => {
      // Category match
      const catMatch = activeCategory === "All" || prod.category === activeCategory;

      // Grade match
      const gradeMatch =
        activeGrade === "All" ||
        prod.grade.some((g) => g.toLowerCase().includes(activeGrade.toLowerCase()));

      // Search match (Name, CAS, Formula, Synonyms, Applications)
      const q = searchQuery;
      const searchMatch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.cas.toLowerCase().includes(q) ||
        prod.formula.toLowerCase().includes(q) ||
        (prod.synonyms && prod.synonyms.toLowerCase().includes(q)) ||
        prod.applications.some((app) => app.toLowerCase().includes(q));

      return catMatch && gradeMatch && searchMatch;
    }).sort((a, b) => {
      if (currentSort === "name-asc") return a.name.localeCompare(b.name);
      if (currentSort === "name-desc") return b.name.localeCompare(a.name);
      if (currentSort === "cas") return a.cas.localeCompare(b.cas);
      return 0;
    });
  }

  function renderProducts() {
    const grid = document.getElementById("catalog-grid");
    const countEl = document.getElementById("product-count-display");
    if (!grid) return;

    const filtered = getFilteredProducts();

    if (countEl) {
      countEl.innerHTML = `Showing <strong class="text-slate-900">${filtered.length}</strong> of ${CHEMICAL_PRODUCTS.length} chemicals`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl">
            <i class="fa-solid fa-flask-vial"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800">No chemicals matching your criteria</h3>
          <p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Try adjusting your search keywords, CAS number, or filter settings. We also provide custom synthesis and global sourcing on request.
          </p>
          <button onclick="window.ChemHiveCatalog.resetFilters()" 
                  class="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((chem) => {
        const isHazardous = chem.hazardClass && !chem.hazardClass.includes("Non-Hazardous");
        const hazardBadge = isHazardous
          ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
               <i class="fa-solid fa-triangle-exclamation text-[10px]"></i> ${chem.unNumber || "Hazmat"}
             </span>`
          : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
               <i class="fa-solid fa-shield-check text-[10px]"></i> Standard Transport
             </span>`;

        return `
        <div class="group bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
          <!-- Top Accent Line -->
          <div class="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 opacity-80 group-hover:opacity-100"></div>
          
          <div class="p-6 flex-1 flex flex-col">
            <!-- Header Badges -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                ${chem.category}
              </span>
              ${hazardBadge}
            </div>

            <!-- Title & Formula -->
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition leading-snug">
              ${chem.name}
            </h3>
            
            <div class="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1 mb-3">
              <span class="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded font-semibold border border-cyan-100">
                Formula: ${chem.formula}
              </span>
              <span>CAS: <strong>${chem.cas}</strong></span>
            </div>

            <!-- Description -->
            <p class="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              ${chem.description}
            </p>

            <!-- Spec Grid -->
            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 mt-auto">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Standard Purity</span>
                <span class="font-bold text-slate-800">${chem.purity}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Available Grades</span>
                <span class="font-semibold text-slate-700 truncate block" title="${chem.grade.join(', ')}">
                  ${chem.grade[0]}
                </span>
              </div>
              <div class="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span class="text-slate-500"><i class="fa-solid fa-box mr-1 text-slate-400"></i> ${chem.packaging[0]}</span>
                <span class="text-emerald-600 font-medium"><i class="fa-solid fa-check-circle mr-1"></i> In Stock</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2 pt-2">
              <button onclick="window.ChemHiveCatalog.openDetailModal('${chem.id}')"
                      class="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-circle-info"></i> Specs & SDS
              </button>
              <button onclick="window.ChemHiveCart.add('${chem.id}')"
                      class="px-3 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-cart-plus"></i> Request Quote
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  function resetFilters() {
    activeCategory = "All";
    activeGrade = "All";
    searchQuery = "";
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) searchInput.value = "";
    const gradeSelect = document.getElementById("filter-grade-select");
    if (gradeSelect) gradeSelect.value = "All";
    highlightActiveCategory("All");
    renderProducts();
  }

  function openDetailModal(productId) {
    const chem = CHEMICAL_PRODUCTS.find((p) => p.id === productId);
    if (!chem) return;

    const modal = document.getElementById("chemical-detail-modal");
    if (!modal) return;

    document.getElementById("modal-chem-name").textContent = chem.name;
    document.getElementById("modal-chem-cas").textContent = chem.cas;
    document.getElementById("modal-chem-formula").textContent = chem.formula;
    document.getElementById("modal-chem-mw").textContent = chem.mw;
    document.getElementById("modal-chem-purity").textContent = chem.purity;
    document.getElementById("modal-chem-desc").textContent = chem.description;
    document.getElementById("modal-chem-origin").textContent = chem.origin || "Global Verified";
    document.getElementById("modal-chem-hazard").textContent = chem.hazardClass;
    document.getElementById("modal-chem-un").textContent = chem.unNumber;
    document.getElementById("modal-chem-appearance").textContent = chem.appearance;
    document.getElementById("modal-chem-moq").textContent = chem.moq;

    // Grades
    const gradesList = document.getElementById("modal-chem-grades");
    if (gradesList) {
      gradesList.innerHTML = chem.grade
        .map((g) => `<span class="px-2.5 py-1 bg-cyan-50 text-cyan-800 text-xs font-medium rounded-full border border-cyan-200">${g}</span>`)
        .join("");
    }

    // Packaging
    const packList = document.getElementById("modal-chem-packaging");
    if (packList) {
      packList.innerHTML = chem.packaging
        .map((pk) => `<li class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-check text-emerald-500"></i> ${pk}</li>`)
        .join("");
    }

    // Applications
    const appList = document.getElementById("modal-chem-apps");
    if (appList) {
      appList.innerHTML = chem.applications
        .map((app) => `<span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">${app}</span>`)
        .join("");
    }

    // Buttons
    const addBtn = document.getElementById("modal-add-to-cart-btn");
    if (addBtn) {
      addBtn.onclick = () => {
        window.ChemHiveCart.add(chem.id);
        closeDetailModal();
      };
    }

    const sdsBtn = document.getElementById("modal-download-sds-btn");
    if (sdsBtn) {
      sdsBtn.onclick = () => {
        window.ChemHiveCompliance.downloadMockSDS(chem.cas, chem.name);
      };
    }

    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function closeDetailModal() {
    const modal = document.getElementById("chemical-detail-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  }

  window.ChemHiveCatalog = {
    init: initCatalog,
    resetFilters: resetFilters,
    openDetailModal: openDetailModal,
    closeDetailModal: closeDetailModal
  };

  document.addEventListener("DOMContentLoaded", initCatalog);
})();
