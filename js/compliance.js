/**
 * ChemHive Compliance & SDS / COA Documentation Engine
 * Provides interactive search, preview, and generation of Safety Data Sheets & Certificates of Analysis.
 */

(function () {
  function downloadMockSDS(casNumber, chemicalName) {
    if (window.ChemHiveCart && window.ChemHiveCart.showToast) {
      window.ChemHiveCart.showToast(`Preparing Safety Data Sheet (GHS Rev 9) for ${chemicalName}...`, "info");
    }

    setTimeout(() => {
      // Create mock SDS text/HTML content and trigger printable view or preview modal
      openSdsPreview(casNumber, chemicalName);
    }, 400);
  }

  function openSdsPreview(casNumber, chemicalName) {
    let modal = document.getElementById("sds-preview-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "sds-preview-modal";
      modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm";
      document.body.appendChild(modal);
    }

    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const sdsDocId = `SDS-CH-${casNumber.replace(/[^0-9]/g, "")}-${new Date().getFullYear()}`;

    modal.innerHTML = `
      <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">SDS</span>
            <div>
              <h3 class="font-bold text-sm tracking-wide">SAFETY DATA SHEET (GHS COMPLIANT)</h3>
              <p class="text-xs text-slate-400 font-mono">Doc ID: ${sdsDocId} | Revised: ${today}</p>
            </div>
          </div>
          <button onclick="document.getElementById('sds-preview-modal').remove()" class="text-slate-400 hover:text-white text-lg">&times;</button>
        </div>

        <!-- Scrollable Document Content -->
        <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
          <!-- Section 1 -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-cyan-700 uppercase tracking-wider text-xs mb-2">SECTION 1: Identification of the Substance & Company</h4>
            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong>Product Name:</strong> ${chemicalName}</div>
              <div><strong>CAS Registry Number:</strong> ${casNumber}</div>
              <div><strong>Supplier:</strong> ChemHive Global Chemical Supply Co.</div>
              <div><strong>Emergency 24/7 Hotline:</strong> +1 (800) 555-CHEM (Hazmat Class Support)</div>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-cyan-700 uppercase tracking-wider text-xs mb-2">SECTION 2: Hazard(s) Identification (GHS-US / REACH)</h4>
            <div class="flex items-center gap-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
              <i class="fa-solid fa-triangle-exclamation text-amber-600 text-2xl"></i>
              <div>
                <p class="font-bold">Signal Word: DANGER / WARNING</p>
                <p>Hazard Statements: H225 Highly flammable liquid and vapor. H319 Causes serious eye irritation. H336 May cause drowsiness or dizziness.</p>
              </div>
            </div>
          </div>

          <!-- Section 3 & 4 -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-cyan-700 uppercase tracking-wider text-xs mb-2">SECTION 4: First-Aid Measures</h4>
            <ul class="list-disc pl-5 text-xs space-y-1 text-slate-600">
              <li><strong>Inhalation:</strong> Move to fresh air. If not breathing, provide artificial respiration.</li>
              <li><strong>Skin Contact:</strong> Immediately rinse with plenty of clean water for at least 15 minutes.</li>
              <li><strong>Eye Contact:</strong> Rinse cautiously with water for several minutes. Remove contact lenses.</li>
              <li><strong>Ingestion:</strong> Rinse mouth thoroughly with water. Never give anything by mouth to an unconscious person.</li>
            </ul>
          </div>

          <!-- Section 7 & 8 -->
          <div>
            <h4 class="font-bold text-cyan-700 uppercase tracking-wider text-xs mb-2">SECTION 7: Handling and Storage</h4>
            <p class="text-xs text-slate-600">
              Store in a tightly closed container in a dry, cool, and well-ventilated area away from incompatible substances, open flames, and heat sources. Ground/bond container and receiving equipment.
            </p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <span class="text-xs text-slate-500 font-mono">ChemHive ISO 9001:2015 & REACH Certified</span>
          <div class="flex gap-2">
            <button onclick="window.print()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition">
              <i class="fa-solid fa-print mr-1"></i> Print / Save as PDF
            </button>
            <button onclick="document.getElementById('sds-preview-modal').remove()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function verifyLotNumber(lotNumber) {
    if (!lotNumber || lotNumber.trim().length < 4) {
      return { success: false, message: "Please provide a valid 6-to-10 digit Lot Number." };
    }
    return {
      success: true,
      lot: lotNumber.toUpperCase(),
      product: "USP Grade Multi-Compounded Raw Material",
      manufactureDate: "2026-04-12",
      expiryDate: "2028-04-11",
      purityVerified: "99.85%",
      status: "APPROVED FOR RELEASE",
      labInspector: "QC Dept - Station 4"
    };
  }

  window.ChemHiveCompliance = {
    downloadMockSDS: downloadMockSDS,
    openSdsPreview: openSdsPreview,
    verifyLotNumber: verifyLotNumber
  };
})();
