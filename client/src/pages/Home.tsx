import { useState, useRef } from "react";

const SYSTEM_PROMPT = `You are an expert mathematician. When given a math problem, return ONLY valid JSON (no markdown, no extra text):
{
  "result": "final answer",
  "steps": [
    { "step": 1, "label": "Step title", "detail": "Explanation", "expression": "math expression or empty string" }
  ],
  "summary": "One sentence summary"
}
If not math-related: { "error": "Please enter a math or calculation problem." }`;

const DEMO_RESULT = {
  result: "1,312.50",
  steps: [
    { step: 1, label: "Identify values", detail: "Principal amount = 8,750 and percentage rate = 15%", expression: "P = 8750, r = 15%" },
    { step: 2, label: "Apply formula", detail: "Multiply principal by rate divided by 100", expression: "8750 × (15 ÷ 100)" },
    { step: 3, label: "Calculate result", detail: "8750 multiplied by 0.15 gives us the final answer", expression: "8750 × 0.15 = 1,312.50" },
  ],
  summary: "15% of 8,750 equals 1,312.50"
};

const EXAMPLES = ["15% of 8,750?","Solve x² - 5x + 6 = 0","$10k at 7% for 5 years","Circle area radius 12cm","98.6°F to Celsius","12 factorial"];

export default function Home() {
  const [mode, setMode] = useState<"demo" | "real" | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [setupErr, setSetupErr] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [calcErr, setCalcErr] = useState("");
  const [history, setHistory] = useState<Array<{q: string; r: string}>>([]);
  const ref = useRef<HTMLTextAreaElement>(null);

  const isDemo = mode === "demo";

  const handleSave = () => {
    if (isDemo) { setSaved(true); setSetupErr(""); return; }
    const t = keyInput.trim();
    if (!t.startsWith("sk-")) { setSetupErr("Invalid key — must start with 'sk-'"); return; }
    setApiKey(t); setSaved(true); setSetupErr("");
  };

  const handleCalc = async () => {
    if (!query.trim() || !saved) return;
    setLoading(true); setResult(null); setCalcErr("");
    if (isDemo) {
      await new Promise(r => setTimeout(r, 1100));
      setResult(DEMO_RESULT);
      setHistory(p => [{ q: query.trim(), r: DEMO_RESULT.result }, ...p].slice(0, 5));
      setLoading(false); return;
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: query.trim() }],
        }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error((d as any)?.error?.message || `Error ${res.status}`); }
      const data = await res.json();
      const txt = (data as any).content?.map((b: any) => b.text || "").join("") || "";
      const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());
      if (parsed.error) { setCalcErr(parsed.error); }
      else { setResult(parsed); setHistory(p => [{ q: query.trim(), r: parsed.result }, ...p].slice(0, 5)); }
    } catch (e) { setCalcErr((e as Error).message || "Something went wrong. Check your API key."); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        body{font-family:'Outfit',sans-serif;background:#090909;color:#e2e2e2;min-height:100vh;}
        :root{
          --bg:#090909;--s1:#111;--s2:#171717;--b1:#1d1d1d;--b2:#282828;
          --am:#f0a500;--am2:#b87b00;--amg:rgba(240,165,0,0.09);--aml:rgba(240,165,0,0.16);
          --tx:#e2e2e2;--td:#7a7a7a;--tm:#404040;
          --gr:#4ade80;--rd:#f87171;
          --mono:'JetBrains Mono',monospace;
        }
        .app{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:28px 14px 64px;}
        .wrap{width:100%;max-width:600px;display:flex;flex-direction:column;gap:10px;}

        /* Header */
        .hd{text-align:center;margin-bottom:28px;padding:0 8px;}
        .badge{display:inline-flex;align-items:center;gap:6px;background:var(--amg);border:1px solid rgba(240,165,0,.2);border-radius:20px;padding:4px 13px;margin-bottom:14px;font-family:var(--mono);font-size:10px;color:var(--am);letter-spacing:.08em;text-transform:uppercase;}
        .dot{width:6px;height:6px;background:var(--am);border-radius:50%;animation:p 2s infinite;}
        @keyframes p{0%,100%{opacity:1;}50%{opacity:.2;}}
        .hd h1{font-size:clamp(1.8rem,7vw,2.8rem);font-weight:800;letter-spacing:-.03em;line-height:1;color:#fff;margin-bottom:8px;}
        .hd h1 em{color:var(--am);font-style:normal;}
        .hd p{color:var(--td);font-size:14px;line-height:1.55;}

        /* Card */
        .card{background:var(--s1);border:1px solid var(--b1);border-radius:14px;overflow:hidden;}
        .ch{padding:10px 16px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:7px;font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--tm);}
        .ci{width:6px;height:6px;border-radius:50%;background:var(--tm);flex-shrink:0;}
        .ci.a{background:var(--am);}
        .ci.g{background:var(--gr);}
        .ci.r{background:var(--rd);}

        /* Setup */
        .sb{padding:18px 16px;}
        .sq{font-size:14px;color:var(--td);line-height:1.5;margin-bottom:14px;}
        .mg{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        @media(max-width:380px){.mg{grid-template-columns:1fr;}}
        .mb{border:1.5px solid var(--b2);border-radius:12px;padding:15px 13px;background:var(--s2);cursor:pointer;text-align:left;transition:all .18s;outline:none;}
        .mb:hover,.mb.on{border-color:var(--am);background:var(--amg);}
        .mi{font-size:20px;margin-bottom:7px;}
        .mn{font-size:13px;font-weight:700;color:#fff;margin-bottom:2px;}
        .md{font-size:11px;color:var(--td);line-height:1.4;}
        .sf{margin-top:14px;display:flex;flex-direction:column;gap:8px;}
        .ar{display:flex;gap:7px;align-items:center;}
        .ai{flex:1;min-width:0;background:var(--bg);border:1px solid var(--b2);border-radius:9px;padding:11px 13px;font-family:var(--mono);font-size:12px;color:var(--tx);outline:none;transition:border-color .2s;letter-spacing:.03em;}
        .ai:focus{border-color:var(--am);}
        .ai::placeholder{color:var(--tm);}
        .ib{background:none;border:1px solid var(--b2);border-radius:9px;width:40px;height:40px;cursor:pointer;color:var(--td);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .2s;}
        .ib:hover{color:var(--am);}
        .pb{background:var(--am);color:#000;border:none;border-radius:9px;padding:11px 18px;font-family:'Outfit',sans-serif;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;transition:background .2s;flex-shrink:0;}
        .pb:hover{background:#ffd060;}
        .pb.full{width:100%;padding:13px;border-radius:10px;font-size:14px;}
        .nt{font-family:var(--mono);font-size:11px;padding:8px 11px;border-radius:8px;}
        .nt.ok{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.18);color:var(--gr);}
        .nt.wn{background:var(--amg);border:1px solid rgba(240,165,0,.2);color:var(--am);}
        .nt.er{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);color:var(--rd);}
        .lnk{font-family:var(--mono);font-size:11px;color:var(--am);text-decoration:none;}
        .lnk:hover{text-decoration:underline;}

        /* Status bar */
        .stbar{padding:10px 16px;display:flex;align-items:center;gap:8px;}
        .dtag{font-family:var(--mono);font-size:10px;background:var(--amg);border:1px solid rgba(240,165,0,.2);border-radius:5px;padding:2px 8px;color:var(--am);letter-spacing:.05em;}

        /* Input */
        .ib2{padding:16px;}
        .qb{position:relative;}
        .qt{width:100%;background:var(--bg);border:1.5px solid var(--b2);border-radius:11px;padding:13px 52px 13px 15px;font-family:'Outfit',sans-serif;font-size:15px;color:var(--tx);resize:none;outline:none;min-height:70px;transition:border-color .2s,box-shadow .2s;line-height:1.5;}
        .qt:focus{border-color:var(--am);box-shadow:0 0 0 3px var(--amg);}
        .qt::placeholder{color:var(--tm);}
        .gb{position:absolute;right:9px;bottom:9px;width:36px;height:36px;background:var(--am);border:none;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;}
        .gb:hover:not(:disabled){background:#ffd060;transform:scale(1.06);}
        .gb:disabled{opacity:.3;cursor:not-allowed;}
        .cs{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
        .ck{background:var(--s2);border:1px solid var(--b1);border-radius:7px;padding:5px 10px;font-family:var(--mono);font-size:11px;color:var(--td);cursor:pointer;transition:all .15s;}
        .ck:hover{border-color:var(--am);color:var(--am);background:var(--amg);}

        /* Loading */
        .lb{padding:26px;display:flex;flex-direction:column;align-items:center;gap:11px;}
        .sp{width:34px;height:34px;border:2px solid var(--b2);border-top-color:var(--am);border-radius:50%;animation:s .7s linear infinite;}
        @keyframes s{to{transform:rotate(360deg);}}
        .lt{font-family:var(--mono);font-size:12px;color:var(--tm);letter-spacing:.04em;}

        /* Result */
        .rc{animation:up .32s ease;}
        @keyframes up{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .rt{padding:18px 16px;border-bottom:1px solid var(--b1);}
        .rl{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--tm);margin-bottom:7px;}
        .rv{font-family:var(--mono);font-size:clamp(1.55rem,5vw,2.3rem);color:var(--am);font-weight:500;letter-spacing:-.02em;line-height:1.15;word-break:break-all;}
        .rs{margin-top:7px;font-size:13px;color:var(--td);line-height:1.5;}
        .sw{padding:16px;}
        .sl{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--tm);margin-bottom:13px;}
        .ss{display:flex;flex-direction:column;gap:10px;}
        .si{display:flex;gap:11px;align-items:flex-start;}
        .sn{flex-shrink:0;width:25px;height:25px;background:var(--amg);border:1px solid rgba(240,165,0,.18);border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;color:var(--am);}
        .sc{flex:1;min-width:0;padding-top:2px;}
        .sk{font-weight:700;font-size:13px;color:#fff;margin-bottom:3px;}
        .sd{font-size:12px;color:var(--td);line-height:1.55;}
        .se{display:inline-block;margin-top:5px;background:var(--bg);border:1px solid var(--b2);border-radius:5px;padding:3px 9px;font-family:var(--mono);font-size:11px;color:var(--am2);}

        /* Calc Error */
        .ce{margin:0 16px 16px;padding:11px 13px;background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);border-radius:9px;font-family:var(--mono);font-size:12px;color:var(--rd);}

        /* History */
        .hb{padding:12px 14px;}
        .hi{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;background:var(--bg);border:1px solid var(--b1);border-radius:9px;margin-bottom:6px;cursor:pointer;transition:border-color .15s;}
        .hi:last-child{margin-bottom:0;}
        .hi:hover{border-color:var(--b2);}
        .hq{font-size:12px;color:var(--td);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .hr{font-family:var(--mono);font-size:12px;color:var(--am);}

        /* Footer */
        .ft{margin-top:42px;text-align:center;font-family:var(--mono);font-size:10px;color:var(--tm);letter-spacing:.04em;line-height:2.2;}
        .ft a{color:var(--am);text-decoration:none;}
        .ft a:hover{text-decoration:underline;}
        .ft-by{font-size:12px;color:var(--td);margin-top:2px;font-family:'Outfit',sans-serif;font-weight:500;letter-spacing:0;}
      `}</style>

      <div className="app">
        {/* Header */}
        <div className="hd">
          <div className="badge"><span className="dot"/>Open Source · AI Powered</div>
          <h1>Smart<em>Calc</em> AI</h1>
          <p>Ask any math problem in plain language — get instant answers with step-by-step breakdown</p>
        </div>

        <div className="wrap">

          {/* ── SETUP (hidden once saved) ── */}
          {!saved && (
            <div className="card">
              <div className="ch"><span className="ci a"/>Setup · Choose Mode</div>
              <div className="sb">
                <div className="sq">How would you like to use SmartCalc AI?</div>
                <div className="mg">
                  <button className={`mb${mode==="demo"?" on":""}`} onClick={() => { setMode("demo"); setSetupErr(""); }}>
                    <div className="mi">🧪</div>
                    <div className="mn">Demo Mode</div>
                    <div className="md">Try it instantly with a sample response. No API key needed.</div>
                  </button>
                  <button className={`mb${mode==="real"?" on":""}`} onClick={() => { setMode("real"); setSetupErr(""); }}>
                    <div className="mi">🔑</div>
                    <div className="mn">Real Mode</div>
                    <div className="md">Use your Anthropic API key for live AI calculations.</div>
                  </button>
                </div>

                {mode === "demo" && (
                  <div className="sf">
                    <div className="nt wn">Demo shows a pre-built response so you can explore the UI freely.</div>
                    <button className="pb full" onClick={handleSave}>Start Demo →</button>
                  </div>
                )}

                {mode === "real" && (
                  <div className="sf">
                    <div className="ar">
                      <input className="ai" type={showKey?"text":"password"} placeholder="sk-ant-api03-..." value={keyInput} onChange={e=>setKeyInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSave()}/>
                      <button className="ib" onClick={()=>setShowKey(v=>!v)}>
                        {showKey
                          ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10 10 0 0112 20C5 20 1 12 1 12a18 18 0 015.06-5.94M9.9 4.24A9 9 0 0112 4c7 0 11 8 11 8a18 18 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                      <button className="pb" onClick={handleSave}>Save</button>
                    </div>
                    {setupErr && <div className="nt er">{setupErr}</div>}
                    <div className="nt wn">Key stored in session only — never sent anywhere except Anthropic directly.</div>
                    <a className="lnk" href="https://console.anthropic.com" target="_blank" rel="noopener">→ Get your API key from Anthropic Console</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STATUS BAR (after saved) ── */}
          {saved && (
            <div className="card">
              <div className="stbar">
                <span className="ci g"/>
                <span style={{fontFamily:"var(--mono)",fontSize:11,color:"#5a5a5a",letterSpacing:".05em",textTransform:"uppercase"}}>
                  {isDemo ? "Demo Mode" : "Connected · Real Mode"}
                </span>
                {isDemo && <span className="dtag">DEMO</span>}
              </div>
            </div>
          )}

          {/* ── CALCULATOR INPUT ── */}
          <div className="card">
            <div className="ch"><span className="ci a"/>Your Problem</div>
            <div className="ib2">
              <div className="qb">
                <textarea ref={ref} className="qt" placeholder="e.g. What is 15% of 8,750?  or  Solve x² - 5x + 6 = 0" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleCalc();}}} rows={3}/>
                <button className="gb" onClick={handleCalc} disabled={loading||!query.trim()||!saved}>
                  {loading
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".2"/><path d="M12 2a10 10 0 010 20" strokeLinecap="round"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                </button>
              </div>
              {!saved && <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--tm)",marginTop:8}}>Complete setup above to start calculating</div>}
              <div className="cs">
                {EXAMPLES.map((ex,i)=>(
                  <button key={i} className="ck" onClick={()=>setQuery(ex)}>{ex}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── LOADING ── */}
          {loading && (
            <div className="card">
              <div className="lb"><div className="sp"/><div className="lt">Calculating step by step...</div></div>
            </div>
          )}

          {/* ── CALC ERROR ── */}
          {calcErr && !loading && <div className="card rc"><div style={{height:12}}/><div className="ce">✗ {calcErr}</div></div>}

          {/* ── RESULT ── */}
          {result && !loading && (
            <div className="card rc">
              <div className="ch"><span className="ci g"/>Result {isDemo&&<span className="dtag">DEMO</span>}</div>
              <div className="rt">
                <div className="rl">Answer</div>
                <div className="rv">{result.result}</div>
                {result.summary && <div className="rs">{result.summary}</div>}
              </div>
              {result.steps?.length > 0 && (
                <div className="sw">
                  <div className="sl">Step-by-Step Breakdown</div>
                  <div className="ss">
                    {result.steps.map((s: any,i: number)=>(
                      <div key={i} className="si">
                        <div className="sn">{s.step||i+1}</div>
                        <div className="sc">
                          <div className="sk">{s.label}</div>
                          <div className="sd">{s.detail}</div>
                          {s.expression&&s.expression.trim()&&<div className="se">{s.expression}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY ── */}
          {history.length > 0 && (
            <div className="card">
              <div className="ch"><span className="ci"/>Recent</div>
              <div className="hb">
                {history.map((h,i)=>(
                  <div key={i} className="hi" onClick={()=>setQuery(h.q)}>
                    <div className="hq">{h.q}</div>
                    <div className="hr">= {h.r}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ft">
          Open Source · MIT License ·{" "}
          <a href="https://github.com/princeruhulofficial/calculator-ai" target="_blank" rel="noopener">View on GitHub</a>
          {" "}·{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener">Get API Key</a>
          <br/>
          Your key stays in your browser session only — never stored anywhere
          <div className="ft-by">Crafted with ♥ by <a href="https://github.com/princeruhulofficial">Prince Ruhul</a> · Founder, Prevalid</div>
        </div>
      </div>
    </>
  );
}
