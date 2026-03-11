# Quick Start Guide - E2E Tests

## ⚡ 5-Minute Setup

### 1. Install Dependencies

```bash
cd frontend-react
npm install
npm run test:e2e:install
```

### 2. Start Application

```bash
# Terminal 1 - Start frontend
npm run dev

# Terminal 2 - Start backend (if needed)
cd ../backend-dotnet
dotnet run
```

### 3. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI (recommended for first time)
npm run test:e2e:ui
```

---

## 🎯 Common Commands

```bash
# Development
npm run test:e2e:ui          # Interactive UI mode
npm run test:e2e:headed      # See browser
npm run test:e2e:debug       # Debug mode

# Specific browsers
npm run test:e2e:chromium    # Chrome/Edge
npm run test:e2e:firefox     # Firefox
npm run test:e2e:webkit      # Safari

# Reports
npm run test:e2e:report      # View last report
```

---

## 📝 Running Specific Tests

```bash
# By test name
npx playwright test -g "Should successfully create"

# By file
npx playwright test tests/itinerary-creation.spec.ts

# By test ID
npx playwright test -g "TC-001"
```

---

## 🐛 Quick Debug

```bash
# Debug specific test
npx playwright test -g "TC-001" --debug

# See trace
npx playwright show-trace trace.zip

# View screenshots
open screenshots/
```

---

## ✅ Verify Installation

```bash
# Check Playwright version
npx playwright --version

# List installed browsers
npx playwright install --list

# Run sample test
npx playwright test tests/itinerary-creation.spec.ts -g "TC-001"
```

---

## 📚 Next Steps

1. Read [README.md](./README.md) for detailed documentation
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for writing tests
3. Review test files in `tests/` folder
4. Explore Page Objects in `pages/` folder

---

## 🆘 Having Issues?

### Frontend not running?
```bash
cd frontend-react
npm run dev
# Open http://localhost:5173
```

### Browsers not installed?
```bash
npx playwright install --with-deps
```

### Tests timing out?
```bash
# Check if application is accessible
curl http://localhost:5173

# Increase timeout in playwright.config.ts
actionTimeout: 30000
```

---

**Ready to go! 🚀**

For detailed information, see [README.md](./README.md)
