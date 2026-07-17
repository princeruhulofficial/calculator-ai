# SmartCalc AI

**Open-source AI-powered calculator**  
Ask any math problem in plain language and get clear, step-by-step solutions.

![SmartCalc AI](https://img.shields.io/badge/AI-Powered-orange) ![Open Source](https://img.shields.io/badge/Open%20Source-MIT-green) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

---

### Try it

Just type naturally:

- `What is 15% of 8,750?`
- `Solve x² - 5x + 6 = 0`
- `$10,000 at 7% interest for 5 years`
- `Convert 98.6°F to Celsius`
- `12 factorial`

You get the final answer + a clean step-by-step breakdown.

---

### Features

- **Natural language input** — no need to write equations
- **Step-by-step solutions** — understand *how* the answer was reached
- **Demo Mode** — try the full UI without an API key
- **Real Mode** — use your own Anthropic API key for live calculations
- Clean, modern dark UI
- Fully client-side (your API key never leaves the browser)
- Open source & MIT licensed

---

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion
- **AI**: Anthropic Claude (direct browser call)
- **Routing**: wouter

---

### Getting Started

```bash
# Clone the repo
git clone https://github.com/princeruhulofficial/calculator-ai.git
cd calculator-ai

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### How it works

1. Choose **Demo Mode** (no key needed) or **Real Mode**
2. In Real Mode, paste your Anthropic API key (starts with `sk-ant-`)
3. Type any math problem in plain English
4. Get instant answer + detailed steps

> Your API key is stored only in the current browser session and is sent directly to Anthropic. Nothing is stored on any server.

---

### Roadmap

- [ ] OpenRouter / multi-model support (free models)
- [ ] History saved in localStorage
- [ ] More example problems
- [ ] Shareable result links
- [ ] Dark / Light theme toggle
- [ ] Mobile polish

---

### Contributing

Pull requests are welcome.  
For major changes, please open an issue first.

---

### License

MIT © [Prince Ruhul](https://github.com/princeruhulofficial)

---

<div align="center">
  <strong>Crafted with ♥ by Prince Ruhul</strong><br>
  Founder of <a href="https://www.prevalid.net">Prevalid</a> — Making AI Accountable
</div>
