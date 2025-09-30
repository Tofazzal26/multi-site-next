import Hero from "../components/Hero";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <section id="hero" style={{ textAlign: "center", padding: "40px 0" }}>
        <Hero />
      </section>
      <section id="contact" style={{ padding: "20px 0" }}>
        <Contact />
      </section>
    </main>
  );
}
