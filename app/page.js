"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [sites, setSites] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then(setSites)
      .catch(console.error);
  }, []);

  async function onGenerate() {
    if (!confirm("Generate all sites?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const j = await res.json();
      if (j.ok) alert("Generated! check ./build/<domain>/");
      else alert("Error: " + (j.error || "unknown"));
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        style={{ maxWidth: 900, margin: "30px auto", fontFamily: "system-ui" }}
      >
        <h1>Multi-site Generator</h1>
        <div style={{ margin: "16px 0" }}>
          <button onClick={onGenerate} disabled={busy}>
            {busy ? "Building..." : "Generate Sites"}
          </button>
        </div>

        <h3>Sites</h3>
        <ul>
          {sites.map((s) => (
            <li key={s.domain}>
              <strong>{s.domain}</strong> — {s.title} — {s.phone}
              <br />
              <small>{s.address}</small>
            </li>
          ))}
        </ul>

        <p style={{ marginTop: 20 }}>
          After build: <code>./build/&lt;domain&gt;/</code>
        </p>
      </div>
    </div>
  );
}
