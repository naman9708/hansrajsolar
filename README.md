# ☀️ Hansraj Solar — Complete Website & Admin Panel

Hansraj Vastralay | Kedar Chowk, Madarpur, Vaishali, Bihar

---

## What Is Inside This Project

### Public Website (customers visit - no login needed)
- Home page (/) - Hero, Why Us, Calculator, Packages, Gallery, FAQ, Contact
- Packages (/packages) - All solar packages with pricing
- Gallery (/gallery) - Project photos
- Contact (/contact) - Contact form + phone + WhatsApp

### Admin Panel (only you access)
- Dashboard (/admin) - Stats and quick actions
- Invoice / Estimate (/admin/invoices) - Full invoice builder
- Product Master (/admin/products) - Manage products
- Package Builder (/admin/packages) - Build packages with costing
- Gallery Admin (/admin/gallery) - Manage project photos
- Settings (/admin/settings) - Company info, bank details

---

## HOW TO RUN IN VS CODE — EVERY STEP

### STEP 1 — Install Node.js
1. Go to https://nodejs.org
2. Click the green LTS button to download
3. Run the installer and click Next, Next, Install, Finish
4. RESTART YOUR COMPUTER after installing
5. Open Command Prompt and type: node --version
   You should see: v20.x.x or similar

### STEP 2 — Install VS Code
1. Go to https://code.visualstudio.com
2. Download for your OS (Windows/Mac/Linux)
3. Install it and open VS Code

### STEP 3 — Extract the ZIP File
- Windows: Right-click the zip -> Extract All -> Choose location -> Extract
- Mac: Double-click the zip file
- You will get a folder called "hansraj-solar"

### STEP 4 — Open Project in VS Code
1. Open VS Code
2. Click File -> Open Folder
3. Browse to the "hansraj-solar" folder
4. Click Select Folder (Windows) or Open (Mac)

### STEP 5 — Open Terminal
In VS Code: Click Terminal menu -> New Terminal
A panel opens at the bottom of VS Code

### STEP 6 — Install Dependencies
In the terminal type:
  npm install
Press Enter and wait 1-3 minutes until it finishes.

### STEP 7 — Start the Website
In the terminal type:
  npm run dev
Press Enter. You will see:
  Local: http://localhost:3000

### STEP 8 — Open in Browser
Open Chrome or any browser and go to:
  http://localhost:3000         (public home page)
  http://localhost:3000/admin   (admin panel)
  http://localhost:3000/admin/invoices  (invoice builder)

### STEP 9 — Stop the Server
Press Ctrl+C in the terminal to stop.

### STEP 10 — Start Again Next Time
Open terminal in VS Code and type: npm run dev

---

## Invoice Builder Usage

1. Go to /admin/invoices
2. Select Document Type: Estimate or Invoice
3. Enter number, date, customer name and address
4. Add products using the smart dropdowns:
   - Solar Panels / Inverters / Batteries: Category -> Brand -> Product
   - GI Structures / Solar BOS / Installation: Category -> Product
5. Enter Quantity and Unit Price
6. Everything else (HSN, GST, Total, Amount in Words) fills automatically
7. Click Preview to see the layout
8. Click Print / Save PDF and select Save as PDF in the print dialog

---

## Package Builder Usage

1. Go to /admin/packages
2. Click New Package
3. Add products from the grouped dropdown
4. Enter purchase cost for each product (admin only)
5. Enter installation cost, transport cost, other charges
6. Set profit margin percentage
7. System calculates the final selling price automatically
8. Click Customer PDF to generate a proposal PDF
   - Customer PDF shows: product list, features, warranty, final price only
   - Customer NEVER sees: purchase cost, margins, internal calculations

---

## Company Details (pre-configured)

Brand: Hansraj Solar
Legal Name: Hansraj Vastralay
Address: Kedar Chowk, Madarpur, Vaishali (Bihar)
Phone: 9311630228
Email: hansrajsolar@gmail.com
GSTIN: 10CFLPK7732R1ZX
Bank: STATE BANK OF INDIA, ANJANPIR
Account: 40799388415
IFSC: SBIN0012573

To change: edit src/lib/company.ts or use Admin -> Settings

---

## Deploy Online Free (Vercel)

1. Go to https://vercel.com and sign up free
2. In terminal run: npm install -g vercel
3. Then run: vercel
4. Follow prompts. Your site goes live in 2 minutes.

---

Hansraj Solar - Production Ready 2026
