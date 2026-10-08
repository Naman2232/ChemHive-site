/**
 * ChemHive RFQ (Request for Quote) & Sample Basket Manager
 */

(function () {
  const CART_STORAGE_KEY = "chemhive_quote_basket_v1";

  // Helpers
  function getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Cart storage error", e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      updateCartBadge();
      renderCartDrawer();
    } catch (e) {
      console.error("Cart save error", e);
    }
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach((b) => {
      b.textContent = count;
      if (count > 0) {
        b.classList.remove("hidden");
        b.classList.add("flex");
      } else {
        b.classList.add("hidden");
        b.classList.remove("flex");
      }
    });
  }

  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const bgColors = {
      success: "bg-emerald-600 text-white border-emerald-500",
      info: "bg-slate-900 text-white border-cyan-500",
      warning: "bg-amber-600 text-white border-amber-500",
      error: "bg-rose-600 text-white border-rose-500"
    };

    const icon = type === "success" 
      ? '<i class="fa-solid fa-circle-check text-emerald-200"></i>' 
      : '<i class="fa-solid fa-circle-info text-cyan-300"></i>';

    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all transform duration-300 translate-y-3 opacity-0 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
      <button class="ml-2 text-white/80 hover:text-white" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-3", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    });

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function addToCart(productId, customGrade = null, qty = 1, unit = "Drums") {
    const products = typeof CHEMICAL_PRODUCTS !== "undefined" ? CHEMICAL_PRODUCTS : [];
    const product = products.find((p) => p.id === productId);
    if (!product) {
      showToast("Chemical item not found.", "error");
      return;
    }

    let cart = getCart();
    const existingIndex = cart.findIndex((item) => item.id === productId);

    if (existingIndex >= 0) {
      cart[existingIndex].qty += qty;
      showToast(`Updated quantity for ${product.name} in RFQ basket.`, "info");
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        cas: product.cas,
        formula: product.formula,
        category: product.category,
        grade: customGrade || (product.grade ? product.grade[0] : "Standard Tech"),
        qty: qty,
        unit: unit,
        packaging: product.packaging ? product.packaging[0] : "Standard Packaging",
        addedAt: new Date().toISOString()
      });
      showToast(`Added ${product.name} to your RFQ Inquiry Basket!`, "success");
    }

    saveCart(cart);
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    saveCart(cart);
    showToast("Item removed from inquiry basket.", "info");
  }

  function updateItem(productId, updates) {
    let cart = getCart();
    const idx = cart.findIndex((i) => i.id === productId);
    if (idx >= 0) {
      cart[idx] = { ...cart[idx], ...updates };
      saveCart(cart);
    }
  }

  function clearCart() {
    saveCart([]);
    showToast("RFQ inquiry basket emptied.", "info");
  }

  function ensureDrawerDom() {
    if (document.getElementById("rfq-drawer")) return;

    const drawerHtml = `
      <div id="rfq-backdrop" onclick="window.ChemHiveCart.closeDrawer()" 
           class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 opacity-0"></div>
      <div id="rfq-drawer" 
           class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300 flex flex-col">
        <div class="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-cyan-600/30 text-cyan-400 flex items-center justify-center">
              <i class="fa-solid fa-clipboard-list"></i>
            </div>
            <div>
              <h3 class="font-bold text-sm">Quote &amp; Sample Basket</h3>
              <p class="text-xs text-slate-400">Review requested chemicals before RFQ submission</p>
            </div>
          </div>
          <button onclick="window.ChemHiveCart.closeDrawer()" class="text-slate-400 hover:text-white text-lg">&times;</button>
        </div>
        <div class="p-4 flex-1 overflow-y-auto space-y-3">
          <div id="rfq-drawer-list" class="space-y-3"></div>
          <div id="rfq-drawer-empty" class="py-16 text-center text-slate-400">
            <i class="fa-solid fa-cart-shopping text-3xl mb-3 text-slate-300"></i>
            <p class="text-sm font-semibold text-slate-700">Your Quote Basket is empty</p>
            <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Click "+ Request Quote" on any chemical card to add it.</p>
          </div>
        </div>
        <div id="rfq-drawer-footer" class="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
          <div class="flex gap-2">
            <button onclick="window.ChemHiveCart.clear()" class="w-1/3 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition">
              Clear
            </button>
            <button onclick="window.ChemHiveCart.openRfqModal()" class="w-2/3 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow transition">
              Submit RFQ Inquiry &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = drawerHtml;
    while (tempDiv.firstChild) {
      document.body.appendChild(tempDiv.firstChild);
    }
  }

  function openDrawer() {
    ensureDrawerDom();
    const drawer = document.getElementById("rfq-drawer");
    const backdrop = document.getElementById("rfq-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("translate-x-full");
      backdrop.classList.remove("hidden");
      setTimeout(() => backdrop.classList.remove("opacity-0"), 10);
      renderCartDrawer();
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById("rfq-drawer");
    const backdrop = document.getElementById("rfq-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("translate-x-full");
      backdrop.classList.add("opacity-0");
      setTimeout(() => backdrop.classList.add("hidden"), 300);
    }
  }

  function renderCartDrawer() {
    ensureDrawerDom();
    const listEl = document.getElementById("rfq-drawer-list");
    const emptyEl = document.getElementById("rfq-drawer-empty");
    const footerEl = document.getElementById("rfq-drawer-footer");
    if (!listEl) return;

    const cart = getCart();

    if (cart.length === 0) {
      if (listEl) listEl.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("hidden");
      if (footerEl) footerEl.classList.add("hidden");
      return;
    }

    if (emptyEl) emptyEl.classList.add("hidden");
    if (footerEl) footerEl.classList.remove("hidden");

    listEl.innerHTML = cart
      .map(
        (item) => `
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2 transition hover:border-cyan-400">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h4 class="font-bold text-slate-900 text-sm leading-snug">${item.name}</h4>
              <p class="text-xs text-slate-500 font-mono">CAS: ${item.cas} | ${item.formula}</p>
            </div>
            <button onclick="window.ChemHiveCart.remove('${item.id}')" 
                    class="text-slate-400 hover:text-rose-600 p-1 text-xs transition" title="Remove Item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
            <div>
              <label class="text-[10px] uppercase font-bold text-slate-400 block">Grade</label>
              <span class="text-slate-700 font-medium truncate block">${item.grade}</span>
            </div>
            <div>
              <label class="text-[10px] uppercase font-bold text-slate-400 block">Quantity</label>
              <div class="flex items-center gap-1.5 mt-0.5">
                <input type="number" min="1" max="10000" value="${item.qty}" 
                       onchange="window.ChemHiveCart.update('${item.id}', { qty: parseInt(this.value) || 1 })"
                       class="w-14 px-1.5 py-0.5 border border-slate-300 rounded text-center text-xs font-semibold focus:outline-cyan-500">
                <select onchange="window.ChemHiveCart.update('${item.id}', { unit: this.value })"
                        class="text-xs border border-slate-300 rounded px-1 py-0.5 bg-white text-slate-700">
                  <option value="Drums" ${item.unit === "Drums" ? "selected" : ""}>Drums</option>
                  <option value="IBC Totes" ${item.unit === "IBC Totes" ? "selected" : ""}>IBC Totes</option>
                  <option value="Metric Tons" ${item.unit === "Metric Tons" ? "selected" : ""}>MT</option>
                  <option value="25kg Bags" ${item.unit === "25kg Bags" ? "selected" : ""}>Bags</option>
                  <option value="Sample Pack" ${item.unit === "Sample Pack" ? "selected" : ""}>Sample</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Submit RFQ modal trigger
  function openRfqModal() {
    closeDrawer();
    const modal = document.getElementById("rfq-submit-modal");
    if (!modal) {
      window.location.href = "contact.html#rfq-form";
      return;
    }
    modal.classList.remove("hidden");
    const summaryEl = document.getElementById("modal-rfq-summary");
    if (summaryEl) {
      const cart = getCart();
      summaryEl.innerHTML = cart
        .map((i) => `<li class="flex justify-between py-1 border-b border-slate-100">
          <span class="font-medium text-slate-800">${i.name} (${i.grade})</span>
          <span class="text-cyan-700 font-bold">${i.qty} ${i.unit}</span>
        </li>`)
        .join("");
    }
  }

  // Expose global API
  window.ChemHiveCart = {
    add: addToCart,
    remove: removeFromCart,
    update: updateItem,
    clear: clearCart,
    getItems: getCart,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    openRfqModal: openRfqModal,
    showToast: showToast,
    refreshBadge: updateCartBadge
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
  });
})();
