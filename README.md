# Cost Per Use — Chrome Extension

> The final product should feel like a premium, free, privacy-friendly shopping decision helper that users can open instantly before buying an expensive product.

**Cost Per Use** is a beautiful, privacy-first Chrome Extension that helps you calculate the real value of a purchase based on how frequently you expect to use it. Make smarter buying decisions, compare alternatives, and keep a history of your product assessments completely locally.

---

## 🌟 Key Features

1.  **Cost-Per-Use Calculation**: Input the product price, ownership duration, and weekly usage to get the estimated cost per use.
2.  **Advanced Adjustment (Net Cost)**: Factor in potential resale value and recurring maintenance costs.
3.  **Smart Value Rating**: Visual badges indicating whether a purchase represents *Excellent Value*, *Good Value*, *Think Twice*, or *Expensive* relative to how often it is used.
4.  **Product Comparison**: Contrast up to 3 products side-by-side (e.g., a cheap item that wears out fast vs. a premium, durable one).
5.  **Local History**: Save and clear calculations locally.
6.  **Beautiful, Minimal UI**: High-polish dark and light modes, soft animations, custom focus states, and count-up numbers.
7.  **100% Private**: Zero analytics, zero cloud databases, no user accounts, no background trackers, and zero unnecessary Chrome permissions.

---

## 🛠️ Technology Stack

*   **Manifest Version**: Manifest V3
*   **Frontend**: React (TypeScript) + Vite
*   **Styling**: Tailwind CSS + PostCSS
*   **State Management**: Zustand
*   **Data Persistence**: `chrome.storage.local` (with standard browser `localStorage` fallback for rapid development)
*   **Testing**: Vitest

---

## 🚀 Setup & Development

### 1. Installation
Clone the repository, navigate to the folder, and install dependencies:
```bash
npm install
```

### 2. Development Server
Start the local development server:
```bash
npm run dev
```

### 3. Build Project
Create a production-ready package:
```bash
npm run build
```

### 4. Run Tests
Verify logic, calculations, formatting, and storage functions:
```bash
npm run test
```

### 5. Package for Store
Create a zip file of the build to upload to the Chrome Web Store:
```bash
npm run zip
```

---

## 📦 Loading the Extension in Chrome

1.  Open Google Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** in the top-right corner.
3.  Click **Load unpacked** in the top-left corner.
4.  Select the `dist` directory created inside this project after running `npm run build`.
5.  Pin the **Cost Per Use** extension to your toolbar.

---

## 🛡️ Privacy Statement

**Cost Per Use** is built on local-first principles.
*   **No Accounts**: There is no login, subscription, or payment.
*   **No Analytics**: We do not track your shopping behaviors or website visits.
*   **No Cloud Sync**: Your data never leaves your browser. All calculation histories are saved to `chrome.storage.local` and can be cleared instantly from the settings.
