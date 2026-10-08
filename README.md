# ChemHive — Global Chemical Supply Website Structure

A modern, responsive, corporate dummy website structure for **ChemHive Global Chemical Supply Co.** Engineered specifically for chemical distribution, industrial raw materials, and pharmaceutical excipient supply chains.

---

## 🚀 Quick Start / How to Run

You can view and preview this website immediately in two ways:

### Option 1: Direct Browser Open (No installation required)
Simply double-click [`index.html`](file:///c:/Users/naman/Desktop/ChemHive/index.html) in your file manager to open it directly in Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Local HTTP Server (Recommended)
From PowerShell or Terminal inside this directory (`c:\Users\naman\Desktop\ChemHive`):

```bash
# Using Python (built-in)
python -m http.server 3000

# OR using Node / npm
npx serve -l 3000 .
```

Then open your browser at **`http://localhost:3000`**.

---

## 📁 Project Architecture & File Structure

```text
ChemHive/
├── index.html              # Main Landing Page: Hero, value proposition, quick catalog search,
│                           # featured chemicals, industries served, and global RFQ callout.
├── products.html           # Interactive Chemical Catalog: Live search by Name, CAS Registry Number,
│                           # or Chemical Formula. Dynamic category pills, grade filters, sorting,
│                           # and detailed modal preview.
├── services.html           # Supply Chain & Capabilities: Custom blending, hazmat road transport,
│                           # contract repackaging, bulk terminal storage (VMI), and packaging specs.
├── compliance.html         # Regulatory, SDS & COA Hub: Interactive GHS Rev 9 Safety Data Sheet finder,
│                           # interactive Certificate of Analysis (COA) lot verification, ISO 9001 & REACH.
├── about.html              # Corporate Profile: Global terminal network (Houston, Rotterdam, Singapore),
│                           # quality control processes, and executive leadership team.
├── contact.html            # Contact & RFQ Center: Full Request for Quotation (RFQ) form, international
│                           # office locations, 24/7 Hazmat emergency hotline, and buyer FAQs.
│
├── css/
│   └── style.css           # Custom styles, chemical hex patterns, custom scrollbars, and print stylesheets.
│
├── js/
│   ├── products-data.js    # Comprehensive mock chemical database (16+ industrial chemicals with CAS#,
│   │                       # molecular formulas, purities, hazard classes, packaging, and applications).
│   ├── rfq-cart.js         # Client-side quote basket system (localStorage, drawer UI, quantity adjuster,
│   │                       # live badge count, and RFQ submission generator).
│   ├── catalog.js          # Live search engine, multi-criteria filtering (category + grade), sorting,
│   │                       # and product detail modal dialogs.
│   ├── compliance.js       # Interactive SDS preview/printer and COA Lot Number verification engine.
│   └── main.js             # Global navigation controller, mobile menu drawer, and form bindings.
│
├── assets/
│   ├── logo.svg            # Modern ChemHive vector logo (chemical honeycomb lattice).
│   ├── logo-white.svg      # White variant for dark backgrounds & footer.
│   └── favicon.svg         # Hexagonal favicon.
│
├── package.json            # Dev server scripts (serve, dev).
└── README.md               # Complete architecture guide and customization instructions.
```

---

## 🧪 Included Features & Dummy Data

1. **Realistic Chemical Database (`js/products-data.js`)**:
   - Includes real chemical products: Isopropyl Alcohol (IPA), Caustic Soda (NaOH), Sulfuric Acid 98%, Titanium Dioxide (TiO2), Citric Acid Anhydrous, Acetone, Glycerin USP, Phosphoric Acid, Hydrogen Peroxide 50%, Polyethylene Glycol (PEG 400), Methanol, Hydrochloric Acid, etc.
   - Contains authentic CAS Registry Numbers, Molecular Formulas, molecular weights, and hazard classifications (UN Hazmat Class 3, Class 8, Class 5.1).

2. **Interactive Quote Inquiry Basket (RFQ Drawer)**:
   - Buyers can click **"+ Request Quote"** on any chemical card to add items to an inquiry basket stored in `localStorage`.
   - Slide-over drawer lets users adjust quantities (Drums, IBC Totes, Metric Tons, Bags) and submit a formal RFQ.
   - Generates simulated official RFQ reference numbers (e.g. `RFQ-CH-829143`).

3. **Interactive SDS & COA Verification Engine (`compliance.html`)**:
   - **Safety Data Sheet (SDS) Viewer**: Instant GHS-compliant 16-section document preview with printable format.
   - **Certificate of Analysis (COA) Verification Tool**: Enter any batch lot code (e.g., `LOT-2026-CH842`) to simulate lot inspection data (assay purity, manufacture date, QA release status).

4. **Industrial Packaging Specifications (`services.html`)**:
   - Detailed comparison of 200L Steel/HDPE Drums, 1,000L Composite IBC Totes, 25kg Kraft Bags, and Bulk ISO Tank Containers.

---

## 🛠️ How to Customize

- **Add New Chemicals**: Open `js/products-data.js` and add new object entries to the `CHEMICAL_PRODUCTS` array.
- **Connect Real Form Backend**: In `js/main.js` or `contact.html`, connect the `rfq-submit-form` submit handler to your backend API or services like Formspree, Formkeep, or EmailJS.
- **Change Company Branding**: Modify colors in the Tailwind configuration block located in the `<head>` of each HTML page.
