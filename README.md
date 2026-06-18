<div align="center">
  <h1>🧾 GST Invoice Generator & Validator</h1>
  <p><strong>A full-stack accounting tool for dynamically calculating GST tax brackets and generating professional PDFs.</strong></p>
</div>

<br />

## 🚀 Overview

This application automates the complex logic required for B2B tax compliance in India. By comparing the `State Code` of the seller and the buyer, the system instantly calculates whether an **Intra-state** (CGST + SGST) or **Inter-state** (IGST) tax bracket applies, mathematically splits the percentages across dynamic line items, and renders a government-standard PDF invoice.

Built with performance and aesthetic in mind, featuring a highly-optimized Vanilla CSS "Fintech SaaS" design system.

---

## ✨ Key Features

- **🧠 Dynamic Tax Engine:** Automatically switches between CGST/SGST (50% splits) and IGST (100%) based on matching State Codes.
- **📄 Instant PDF Generation:** Leverages `pdfkit` to perfectly draw B2B tax invoices directly on the server, ensuring identical formatting on all devices.
- **⚡ Live Preview:** A seamless React-powered grid that recalculates grand totals and tax breakdowns instantly as you type.
- **💾 Relational Database:** Utilizes SQLite natively, perfectly mapping a 4-table relational schema (`companies`, `clients`, `invoices`, `invoice_items`) that can be instantly ported to MySQL.

---

## 🛠️ Tech Stack

| Frontend                | Backend                 | Database                |
| :---------------------- | :---------------------- | :---------------------- |
| React (Vite)            | Node.js                 | SQLite                  |
| Vanilla CSS (SaaS UI)   | Express.js              | -                       |
| Axios                   | PDFKit                  | -                       |

---

## 💻 Getting Started

This project is built as a monorepo. You will need to run the client and the server simultaneously.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/AyushMishra-02/GST-Invoice-Pro.git
cd GST-Invoice-Pro
\`\`\`

### 2. Start the Backend (API & DB)
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`
*The SQLite database will automatically initialize and populate with mock data on the first run. The server runs on `http://localhost:5001`.*

### 3. Start the Frontend (UI)
Open a new terminal window:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
*Visit `http://localhost:5173` to view the application.*

---

## 📸 Usage Guide
1. Select a **Seller** and a **Client** from the dropdowns.
2. Add multiple line items, specifying the HSN code, Quantity, Rate, and GST percentage.
3. Watch the Tax Summary automatically adjust the math in real-time.
4. Click **Generate & Download PDF** to save the final tax-compliant invoice to your machine.

<br/>
<div align="center">
  <i>Developed to demonstrate core accounting engineering principles.</i>
</div>
