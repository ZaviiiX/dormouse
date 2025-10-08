import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// u Hero.jsx i QuickStats.jsx već postoje id-ovi.
// Dodaj u main.jsx globalni listener za anchor smooth scroll:
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  const el = document.querySelector(id);
  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
});

// copy gumbi:
document.addEventListener("click", async (e) => {
  if (e.target.id === "copyBtn") {
    const ca = document.getElementById("contract")?.textContent.replace("CA: ","").trim();
    await navigator.clipboard.writeText(ca); e.target.textContent = "Copied!";
    setTimeout(()=> e.target.textContent = "Copy", 1200);
  }
  if (e.target.id === "copyCA") {
    const ca = "SOLANA_CONTRACT_ADDRESS";
    await navigator.clipboard.writeText(ca); e.target.textContent = "Copied!";
    setTimeout(()=> e.target.textContent = "Copy CA", 1200);
  }
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
