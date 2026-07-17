# SmartCalc AI

**Open-source AI-powered calculator**  
Ask any math problem in plain language and get clear, step-by-step solutions.

![SmartCalc AI](https://img.shields.io/badge/AI-Powered-orange) ![Open Source](https://img.shields.io/badge/Open%20Source-MIT-green) ![Multi-Model](https://img.shields.io/badge/Multi--Model-OpenRouter%20%2B%20Anthropic-blue) ![React](https://img.shields.io/badge/React-19-blue)

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
- **Multi-model support**
  - **OpenRouter** (free models available)
  - **Anthropic Claude**
- **Demo Mode** — try the full UI without any API key
- Clean, modern dark UI
- Fully client-side (your API key never leaves the browser)
- Open source & MIT licensed

---

### Supported Models (OpenRouter)

| Model | Notes |
|-------|-------|
| `openrouter/free` | Auto free router |
| `meta-llama/llama-3.3-70b-instruct:free` | Strong free model |
| `qwen/qwen3-32b:free` | Excellent reasoning |
| `nvidia/nemotron-3-super-120b-a12b:free` | High quality free |
| + more free models | Easy to add |

---

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: OpenRouter + Anthropic (browser direct)
- **Routing**: wouter

---

### Getting Started

```bash
git clone https://github.com/princeruhulofficial/calculator-ai.git
cd calculator-ai

pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### How to use

1. Choose **Demo Mode** (no key) or **Real Mode**
2. In Real Mode select provider:
   - **OpenRouter** → paste `sk-or-...` key + choose free model
   - **Anthropic** → paste `sk-ant-...` key
3. Type any math problem in plain English
4. Get instant answer + detailed steps

> Your API key is stored only in the current browser session and is sent directly to the provider. Nothing is stored on any server.

---

### Get Free API Key (OpenRouter)

1. Go to [openrouter.ai](https://openrouter.ai) and sign in
2. Create a key at [openrouter.ai/keys](https://openrouter.ai/keys)
3. Use any model ending with `:free`

No credit card required for free models.

---

### Roadmap

- [x] OpenRouter + multi-model support
- [x] Free models support
- [ ] History saved in localStorage
- [ ] Shareable result links
- [ ] Dark / Light theme toggle
- [ ] More example problems

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
