# M.A.B TRADERS – Agricultural Commission Agent Billing PWA

> **सोलापूर कृषी उत्पन्न बाजार समिती (APMC) कांदा, बटाटे, लसूण व शेंगा आडत / कमिशन एजंट पावती बिलिंग ऍप्लिकेशन**  
> **गाळा नं. सी - ७, ई - ५८, श्री सिध्देश्वर मार्केट यार्ड, सोलापूर (महाराष्ट्र)**

---

## 🌾 Overview

**M.A.B TRADERS Billing Application** is a specialized, zero-backend, offline-capable Progressive Web Application (PWA) built specifically for agricultural commission agents (आडत्या / कमिशन एजंट). Designed for non-technical shop owners, it operates like a native smartphone/desktop app without requiring logins, complex setup, or external database servers.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + Vite | Fast, responsive, component-driven client architecture |
| **Local Database** | IndexedDB via **Dexie.js** | 100% offline, persistent browser storage; zero external server needed |
| **Spreadsheet Engine** | **ExcelJS** | Native client-side .xlsx workbook export and restore with 3 distinct sheets |
| **App Shell & Caching** | **Service Worker (PWA)** | Complete offline asset and navigation caching |
| **Receipt Printing** | HTML5 / CSS3 Print Engine | Tailored for 8-inch continuous tractor-feed dot-matrix & 80mm thermal rolls |
| **Hosting & Deploy** | **Vercel** | Single-page application with automatic HTTPS and CDN caching |

---

## 📱 Device Compatibility

The application is thoroughly optimized and responsive across all screens:
1. **Android Mobile (Chrome)**: Full touch controls, numeric keyboards, single-tap PWA installation.
2. **iPhone & iPad (Safari)**: Smooth Add to Home Screen standalone experience with custom Apple touch icons.
3. **Windows Laptops & Desktops (Chrome / Edge)**: Standalone window mode, keyboard-friendly `Enter`-key navigation for high-speed lot entry, two-panel live receipt preview.
4. **Tablets**: Adaptive layout adjusting between two-panel desktop mode and single-column mobile workflow.

---

## 💾 Local Data Storage & Important Limitation

### How Data is Stored
- Every bill, lot entry, weighment, rate, and deduction is saved automatically into your device's internal **IndexedDB** database using Dexie.js.
- Data persists across browser restarts, device reboots, and offline periods.

> [!IMPORTANT]
> **Data Storage Limitation (Device-Local Data):**  
> IndexedDB stores data **strictly inside the browser on that specific phone or laptop**.  
> The application does **not** rely on a central cloud server, so a bill created on your Android mobile **will not automatically sync to your Windows laptop**.  
> 
> **To transfer bills between devices:**
> 1. On your mobile, tap **Excel बॅकअप** $\rightarrow$ **'Export Excel Backup'**.
> 2. Send the downloaded `.xlsx` file (via WhatsApp, Google Drive, or Email) to your laptop.
> 3. On your laptop, open the app, tap **Excel बॅकअप** $\rightarrow$ **'Restore from Excel Backup'** and select the file.

---

## 📊 Excel Backup & Restore Guide

### 1. Export Excel Backup
- Click **'Export Excel Backup'** in the **Excel बॅकअप** tab or top toolbar.
- Downloads a file formatted as `MAB_TRADERS_Backup_YYYY-MM-DD.xlsx`.
- **Sheet 1: `Bills`** – Summary of all receipts (Receipt No, Date, Farmer Name, Bags, Weight, Gross, Deductions, Net Payable, and Grand Totals).
- **Sheet 2: `Items`** – Complete item-by-item breakdown (Bags, Weight in KG, Rate per quintal, Rupees, Paise).
- **Sheet 3: `Expenses`** – Full deduction register (अडत, हमाली, तोलाई, स्त्री ह., लेव्ही, मो. भाडा, वारणी, रोख उचल, बारदाना, इतर).

### 2. Restore from Excel Backup
- Click **'Restore from Excel Backup'**.
- Select a previously exported `.xlsx` backup file.
- The system automatically validates sheet structure and prompts for confirmation before merging records to prevent accidental loss.

---

## 🖨️ Printer & Paper Setup

### Primary Printer: Dot-Matrix Tractor-Feed Paper
- **Recommended Paper**: Standard 8-inch continuous paper (~203mm width).
- **Height**: Automatic / continuous based on the number of item rows (no forced page breaks, no clipped footers).
- **High-Speed Ribbon Mode**: In **सेटिंग्ज (Settings)** or above the receipt preview, uncheck **'चित्रे (Graphics)'**. This disables produce graphics and prints crisp high-contrast text to maximize dot-matrix ribbon speed.

### Thermal POS Paper (80mm)
- Select **'८०mm थर्मल'** in the paper size toolbar.
- The receipt automatically condenses headers, switches expenses to single-column, and formats for 80mm roll width.

---

## 📲 PWA Installation Instructions

### Android (Google Chrome)
1. Open the website in Chrome.
2. Tap the **'📲 ॲप इन्स्टॉल करा'** button in the top navigation bar (or Chrome's menu $\rightarrow$ *'Install app'* / *'Add to Home screen'*).
3. The app will install directly onto your home screen and open full-screen without address bars.

### iPhone (Apple Safari)
1. Open the website in Safari.
2. Tap the **Share button [⎋]** at the bottom of the screen.
3. Scroll down and tap **'Add to Home Screen' (होम स्क्रीनवर जोडा)**.
4. Tap **'Add'** in the top right corner. The MAB Traders icon will appear on your iPhone screen.

### Windows Laptop / Desktop (Chrome or Edge)
1. Open the website in Chrome or Edge.
2. Click the install icon $\oplus$ in the right side of the browser address bar (or click the **'ॲप इन्स्टॉल करा'** button).
3. Click **'Install'**. The application will launch as an independent desktop window with its own taskbar icon.

---

## 🚀 Local Development & Build

### Prerequisites
- Node.js v18+ (tested on Node v26)
- npm v9+

### Commands
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (Dexie, ExcelJS, etc.)
npm install

# 3. Start local development server with hot-reload
npm run dev

# 4. Build optimized production bundle
npm run build
```

---

## 🌐 Deploying to Vercel

The project is pre-configured with `vercel.json` for zero-configuration deployment on Vercel:

### Option A: Deploy via GitHub (Recommended)
1. Push the project repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **'Add New Project'**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend` (if prompted).
5. Framework Preset: **Vite**
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click **'Deploy'**.

### Option B: Deploy via Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel
# Follow the interactive prompts and select default settings
```

---

## 🖨️ Windows 8-Inch Custom Paper Size & Dot-Matrix Printer Setup

To print continuous tractor-feed receipts without A4 blank space or unwanted page breaks:

### Step-by-Step Configuration:
1. **Open Windows Settings** on your PC and navigate to **Printers & Scanners** (or `Control Panel` $\rightarrow$ `Devices and Printers`).
2. **Select your connected Dot-Matrix Printer** (e.g., Epson LX-310, TVS MSP 240, WeP, or generic 9-pin/24-pin printer).
3. Click **Printing Preferences** (or **Printer Properties**).
4. Go to the **Paper / Quality** or **Advanced** tab:
   - Click **Custom Paper Size** / **User Defined Paper Size**.
   - Set **Width**: `203 mm` (or `8.0 inches`).
   - Set **Length / Height**: `Continuous` (or `Auto / Dynamic`). If a fixed form length is required by your driver, set it to `150 mm` or `5.5 inches` (standard half-letter continuous).
5. Ensure the paper source is set to **Tractor Feed** (Continuous).
6. In Google Chrome or Microsoft Edge print dialog:
   - Select your printer.
   - Choose the custom paper size created above.
   - Set margins to **None** or **Minimum**.
   - Uncheck **Headers and Footers**.
   - Disable **Fit to Page / Shrink to Fit** so the receipt prints at 100% actual scale.

