"use client";
import { useState, useEffect, useRef } from "react";

const MAGI_NODES = [
  {
    id: "melchior",
    label: "MELCHIOR·1",
    subtitle: "DR. AKAGI / SCIENTIST",
    model: "llama-3.3-70b-versatile",
    modelLabel: "Llama 3.3 70B",
    color: "#ff6600",
    role: "You are MELCHIOR-1, the scientific and logical mind of the MAGI system. Analyze problems with cold precision, data, and rational deduction. Be concise—2-4 sentences.",
  },
  {
    id: "balthasar",
    label: "BALTHASAR·2",
    subtitle: "DR. AKAGI / MOTHER",
    model: "mixtral-8x7b-32768",
    modelLabel: "Mixtral 8x7B",
    color: "#00ccff",
    role: "You are BALTHASAR-2, the maternal and strategic heart of the MAGI system. Assess situations through protection, consequence, and human cost. Be concise—2-4 sentences.",
  },
  {
    id: "casper",
    label: "CASPER·3",
    subtitle: "DR. AKAGI / WOMAN",
    model: "gemma2-9b-it",
    modelLabel: "Gemma 2 9B",
    color: "#cc00ff",
    role: "You are CASPER-3, the intuitive and ethical conscience of the MAGI system. Evaluate the hidden dimensions of decisions: ethics, desire, the unspoken. Be concise—2-4 sentences.",
  },
];

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, 14);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{displayed}</span>;
}

function HexSVG({ node, loading }) {
  const size = 140, cx = 70, cy = 70, r = 56;
  const pts = (scale) => Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 10px ${node.color})` }}>
      <polygon points={pts(1)} fill="none" stroke={node.color}
        strokeWidth={loading ? 2.5 : 1.5} opacity={loading ? 1 : 0.6}
        style={{ transition: "all 0.4s" }} />
      <polygon points={pts(0.72)} fill={`${node.color}14`} stroke={node.color}
        strokeWidth={0.5} opacity={0.4} />
      <circle cx={cx} cy={cy} r={loading ? 9 : 4} fill={node.color}
        opacity={loading ? 0.9 : 0.4} style={{ transition: "r 0.4s" }} />
      {loading && (
        <circle cx={cx} cy={cy} r={22} fill="none" stroke={node.color}
          strokeWidth={1.5} strokeDasharray="25 90"
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin 1s linear infinite" }} />
      )}
    </svg>
  );
}

export default function MagiSystem() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [history, setHistory] = useState([]);

  const callNode = async (node, q) => {
    setLoading(l => ({ ...l, [node.id]: true }));
    setResponses(r => ({ ...r, [node.id]: "" }));
    try {
      const res = await fetch("/api/magi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, nodeId: node.id, systemPrompt: node.role, model: node.model }),
      });
      const data = await res.json();
      setResponses(r => ({ ...r, [node.id]: data.text || "[ERROR]" }));
    } catch {
      setResponses(r => ({ ...r, [node.id]: "[CONNECTION ERROR]" }));
    }
    setLoading(l => ({ ...l, [node.id]: false }));
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    const q = query.trim();
    setHistory(h => [q, ...h.slice(0, 4)]);
    setQuery("");
    MAGI_NODES.forEach(n => callNode(n, q));
  };

  const isLoading = Object.values(loading).some(Boolean);

  const S = {
    root: {
      minHeight: "100vh", background: "#020810", color: "#88aacc",
      fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden",
    },
    grid: {
      position: "fixed", inset: 0, opacity: 0.07, pointerEvents: "none",
      backgroundImage: "linear-gradient(#00aaff22 1px,transparent 1px),linear-gradient(90deg,#00aaff22 1px,transparent 1px)",
      backgroundSize: "40px 40px",
    },
    scanlines: {
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 3, opacity: 0.35,
      backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)",
    },
    inner: { maxWidth: 1100, margin: "0 auto", padding: "20px 24px", position: "relative", zIndex: 4 },
  };

  return (
    <div style={S.root}>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scanbeam{from{transform:translateY(-100%)}to{transform:translateY(100vh)}}
        ::placeholder{color:#2a3a4a}
        *{box-sizing:border-box}
      `}</style>
      <div style={S.grid} />
      <div style={S.scanlines} />
      <div style={{
        position: "fixed", left: 0, right: 0, height: 2, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(90deg,transparent,#00aaff18,transparent)",
        animation: "scanbeam 7s linear infinite",
      }} />

      <div style={S.inner}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 8, letterSpacing: 6, color: "#2a3a4a", marginBottom: 8 }}>
            NERV HEADQUARTERS · TOKYO-3 · CLASSIFIED
          </div>
          <div style={{
            fontSize: 30, letterSpacing: 12, color: "#ff6600", fontWeight: "bold",
            textShadow: "0 0 20px #ff6600, 0 0 50px #ff660033",
          }}>
            MAGI SYSTEM
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#334455", marginTop: 6, display: "flex", justifyContent: "center", gap: 16 }}>
            {MAGI_NODES.map(n => <span key={n.id} style={{ color: `${n.color}88` }}>{n.modelLabel}</span>)}
          </div>
          <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#ff660033,#00ccff22,#cc00ff22,transparent)", marginTop: 12 }} />
        </div>

        {/* History chips */}
        {history.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
            {history.map((h, i) => (
              <button key={i} onClick={() => setQuery(h)} style={{
                background: "none", border: "1px solid #2a3a4a", color: "#445566",
                fontSize: 9, padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "monospace", letterSpacing: 1,
              }}>
                {h.length > 28 ? h.slice(0, 28) + "…" : h}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: "flex", marginBottom: 28, border: "1px solid #ff660033", boxShadow: "0 0 20px #ff660011" }}>
          <div style={{
            padding: "10px 14px", background: "#ff660018", color: "#ff6600",
            fontSize: 9, letterSpacing: 2, display: "flex", alignItems: "center",
            borderRight: "1px solid #ff660022", whiteSpace: "nowrap",
          }}>
            QUERY INPUT
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !isLoading && handleSubmit()}
            placeholder="Enter query for MAGI deliberation..."
            disabled={isLoading}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#c8d8e0", fontSize: 12, padding: "10px 16px",
              fontFamily: "'Courier New', monospace", letterSpacing: 1,
            }}
          />
          <button onClick={handleSubmit} disabled={isLoading || !query.trim()} style={{
            padding: "10px 20px", background: isLoading ? "#ff660011" : "#ff660022",
            border: "none", borderLeft: "1px solid #ff660022",
            color: isLoading ? "#ff660044" : "#ff6600",
            fontSize: 9, letterSpacing: 3, cursor: isLoading ? "not-allowed" : "pointer",
            fontFamily: "monospace",
          }}>
            {isLoading ? "PROCESSING" : "DELIBERATE"}
          </button>
        </div>

        {/* Three MAGI panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {MAGI_NODES.map(node => (
            <div key={node.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <HexSVG node={node} loading={!!loading[node.id]} />

              <div style={{ fontSize: 11, letterSpacing: 3, color: node.color, textShadow: `0 0 8px ${node.color}` }}>
                {node.label}
              </div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: `${node.color}55` }}>
                {node.subtitle}
              </div>

              {/* Response box */}
              <div style={{
                width: "100%", minHeight: 130,
                background: `linear-gradient(180deg,${node.color}08,#00000088)`,
                border: `1px solid ${node.color}33`,
                padding: "12px 14px", position: "relative", overflow: "hidden",
              }}>
                {/* Corner accents */}
                {[[0,0,"Top","Left"],[0,1,"Top","Right"],[1,0,"Bottom","Left"],[1,1,"Bottom","Right"]].map(([b,r,v,h])=>(
                  <div key={`${v}${h}`} style={{
                    position:"absolute",[v.toLowerCase()]:0,[h.toLowerCase()]:0,
                    width:10,height:10,
                    [`border${v}`]:`1px solid ${node.color}`,
                    [`border${h}`]:`1px solid ${node.color}`,
                  }}/>
                ))}
                <div style={{ fontSize: 11, lineHeight: 1.75, color: "#b8ccd8", position: "relative", zIndex: 1, minHeight: 80 }}>
                  {loading[node.id] ? (
                    <span style={{ color: node.color, fontSize: 9, letterSpacing: 2 }}>
                      PROCESSING<span style={{ animation: "blink 1s step-end infinite" }}>_</span>
                    </span>
                  ) : responses[node.id] ? (
                    <TypewriterText text={responses[node.id]} />
                  ) : (
                    <span style={{ color: `${node.color}22`, fontSize: 9, letterSpacing: 2 }}>AWAITING INPUT</span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 8, letterSpacing: 1 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%", background: node.color,
                  boxShadow: loading[node.id] ? `0 0 8px ${node.color}` : "none",
                  opacity: loading[node.id] ? 1 : responses[node.id] ? 0.6 : 0.2,
                  transition: "all 0.3s",
                }} />
                <span style={{ color: `${node.color}55` }}>
                  {loading[node.id] ? "ACTIVE" : responses[node.id] ? "COMPLETE" : "STANDBY"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 28, paddingTop: 10, borderTop: "1px solid #1a2a3a",
          display: "flex", justifyContent: "space-between",
          fontSize: 8, letterSpacing: 2, color: "#1a2a3a",
        }}>
          <span>S.C. MAGI SYSTEM · GEHIRN/NERV RESEARCH INSTITUTE</span>
          <span>PERSONALITY TRANSPLANT OS · v7.0</span>
          <span>SECURITY CLEARANCE: LEVEL 4</span>
        </div>
      </div>
    </div>
  );
}
