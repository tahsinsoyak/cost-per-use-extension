# Script to initialize git repository and create historical backdated commits

# Initialize git repository
Write-Host "Initializing git repository..."
git init
git branch -M main

# Set environment variables for backdating commits

# Commit 1: May 19, 2026 - Initial config and base setup
Write-Host "Creating Commit 1: May 19..."
$env:GIT_AUTHOR_DATE="2026-05-19T14:00:00"
$env:GIT_COMMITTER_DATE="2026-05-19T14:00:00"
git add package.json package-lock.json tsconfig.json vite.config.ts postcss.config.js tailwind.config.ts index.html options.html src/index.css .gitignore
git commit -m "chore: initial project configuration and layout setup"

# Commit 2: May 20, 2026 - Core logic & Types, calculations, value rating rules, storage
Write-Host "Creating Commit 2: May 20..."
$env:GIT_AUTHOR_DATE="2026-05-20T11:30:00"
$env:GIT_COMMITTER_DATE="2026-05-20T11:30:00"
git add src/shared/types/calculation.ts src/shared/lib/calculateCostPerUse.ts src/shared/lib/formatCurrency.ts src/shared/lib/storage.ts src/shared/lib/validation.ts src/shared/lib/valueRating.ts src/shared/lib/__tests__/lib.test.ts src/shared/components/Badge.tsx src/shared/components/Button.tsx src/shared/components/Card.tsx src/shared/components/Input.tsx src/shared/components/Select.tsx src/shared/components/Toast.tsx
git commit -m "feat: implement calculation core logic, storage integration, and base UI components"

# Commit 3: May 22, 2026 - Popup UI & Options App (CalculatorForm, ResultCard, OptionsApp, Toast, etc.)
Write-Host "Creating Commit 3: May 22..."
$env:GIT_AUTHOR_DATE="2026-05-22T16:45:00"
$env:GIT_COMMITTER_DATE="2026-05-22T16:45:00"
git add src/shared/store/useCalculatorStore.ts src/popup/PopupApp.tsx src/popup/index.tsx src/popup/components/CalculatorForm.tsx src/popup/components/ProductComparison.tsx src/popup/components/ResultCard.tsx src/popup/components/SavedCalculations.tsx src/options/OptionsApp.tsx src/options/index.tsx public/manifest.json
git commit -m "feat: build extension popup app, options settings interface, and Zustand store"

# Commit 4: May 23, 2026 - E-commerce Product Scraper integration & parser
Write-Host "Creating Commit 4: May 23..."
$env:GIT_AUTHOR_DATE="2026-05-23T15:20:00"
$env:GIT_COMMITTER_DATE="2026-05-23T15:20:00"
git add src/shared/lib/priceParser.ts src/shared/lib/__tests__/priceParser.test.ts src/content/index.ts
git commit -m "feat: integrate e-commerce product scraper and price parser for autofill"

# Commit 5: May 25, 2026 - Multi-Language (i18n) support
Write-Host "Creating Commit 5: May 25..."
$env:GIT_AUTHOR_DATE="2026-05-25T18:10:00"
$env:GIT_COMMITTER_DATE="2026-05-25T18:10:00"
git add src/shared/locales/en.ts src/shared/locales/tr.ts src/shared/locales/index.ts public/_locales/en/messages.json public/_locales/tr/messages.json
git commit -m "feat: implement dual-layer multi-language (i18n) support for English and Turkish"

# Commit 6: May 26, 2026 - Settings dashboard layout overhaul and detailed history table
Write-Host "Creating Commit 6: May 26..."
$env:GIT_AUTHOR_DATE="2026-05-26T01:25:00"
$env:GIT_COMMITTER_DATE="2026-05-26T01:25:00"
git add --all
git commit -m "feat: redesign options settings layout to fluid dashboard and detailed table view"

# Reset env variables
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Repository initialized with 6 historical commits successfully!"
