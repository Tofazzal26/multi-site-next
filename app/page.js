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
      <div className="bg-blue-300">
        <h1 className="text-lg container mx-auto py-4">Multi-site Generator</h1>
      </div>
      <div>
        <div>
          <div className="my-10 container mx-auto">
            <button
              onClick={onGenerate}
              disabled={busy}
              className="bg-red-300 px-4 py-2 rounded-md "
            >
              {busy ? "Building..." : "Generate Sites"}
            </button>
          </div>

          <div className="bg-green-300 py-4">
            <h3 className="container mx-auto text-lg">All Sites</h3>
          </div>
          <ul className="container mx-auto my-10 space-y-6">
            {sites.map((s) => (
              <li key={s.domain}>
                <strong>{s.domain}</strong> — {s.title} — {s.phone}
                <br />
                <small>{s.address}</small>
              </li>
            ))}
          </ul>

          <div className="bg-amber-300 py-4">
            <p className="container mx-auto text-lg">
              After build: <code>./build/&lt;domain&gt;/</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
