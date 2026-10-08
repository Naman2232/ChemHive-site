/**
 * ChemHive Main Interactive Controller
 * Mobile navigation, drawer bindings, quote submission, and page initialization.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Navbar scroll styling
  const navbar = document.getElementById("main-nav");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.classList.add("shadow-md", "bg-white/95", "backdrop-blur-md");
        navbar.classList.remove("bg-white");
      } else {
        navbar.classList.remove("shadow-md", "bg-white/95", "backdrop-blur-md");
        navbar.classList.add("bg-white");
      }
    });
  }

  // Header quick search
  const headerSearchForm = document.getElementById("header-search-form");
  if (headerSearchForm) {
    headerSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("header-search-input");
      if (input && input.value.trim()) {
        window.location.href = `products.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  }

  // RFQ Submission Form inside modal or contact page
  const rfqSubmitForm = document.getElementById("rfq-submit-form");
  if (rfqSubmitForm) {
    rfqSubmitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = rfqSubmitForm.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.innerHTML : "Submit Quote Request";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Generating RFQ...';
      }

      setTimeout(() => {
        const refNum = "RFQ-CH-" + Math.floor(100000 + Math.random() * 900000);
        
        // Show success modal or view
        const modal = document.getElementById("rfq-submit-modal");
        if (modal) modal.classList.add("hidden");

        const successModal = document.getElementById("rfq-success-modal");
        if (successModal) {
          const refEl = document.getElementById("success-rfq-ref");
          if (refEl) refEl.textContent = refNum;
          successModal.classList.remove("hidden");
        } else {
          alert(`Your RFQ Reference #${refNum} has been received! Our chemical logistics specialist will contact you within 2 business hours.`);
        }

        if (window.ChemHiveCart) {
          window.ChemHiveCart.clear();
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        rfqSubmitForm.reset();
      }, 1000);
    });
  }

  // Highlight current navigation link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("text-cyan-600", "font-bold");
      link.classList.remove("text-slate-600");
    }
  });
});
