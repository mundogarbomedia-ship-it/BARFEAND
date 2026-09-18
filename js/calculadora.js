"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const formulari = document.getElementById("formulari-calculadora");
  const resultat = document.getElementById("resultat-calculadora");

  if (!formulari || !resultat) return;

  const percentatgesBase = {
    gos: { cadell: 6, adult: 2.5, senior: 2 },
    gat: { cadell: 5, adult: 3, senior: 2.5 }
  };

  const ajustActivitat = { baixa: -0.3, normal: 0, alta: 0.5 };
  const ajustObjectiu = { baixar: -0.3, mantenir: 0, augmentar: 0.4 };
  const limits = { cadell: [4, 10], adult: [1.5, 4], senior: [1.5, 3.5] };

  const formatDecimal = new Intl.NumberFormat("ca-AD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const arrodonir5 = (grams) => Math.round(grams / 5) * 5;

  function textPaquets1kg(quilogramsMensuals) {
    const mitjosQuilos = Math.ceil(quilogramsMensuals * 2);
    const paquetsQuilo = Math.floor(mitjosQuilos / 2);
    const migQuilo = mitjosQuilos % 2;
    const parts = [];

    if (paquetsQuilo > 0) {
      parts.push(`${paquetsQuilo} ${paquetsQuilo === 1 ? "paquet" : "paquets"} d’1 kg`);
    }
    if (migQuilo) parts.push("1 paquet de 500 g");
    return parts.join(" + ");
  }

  formulari.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formulari.checkValidity()) {
      formulari.reportValidity();
      return;
    }

    const especie = document.getElementById("especie").value;
    const pes = Number.parseFloat(document.getElementById("pes").value);
    const etapa = document.getElementById("etapa").value;
    const activitat = document.getElementById("activitat").value;
    const objectiu = document.getElementById("objectiu").value;

    if (!Number.isFinite(pes) || pes < 0.5 || pes > 120) {
      resultat.hidden = false;
      resultat.innerHTML = '<p class="calc-error">Introdueix un pes vàlid entre 0,5 i 120 kg.</p>';
      resultat.setAttribute("tabindex", "-1");
      resultat.focus();
      return;
    }

    let percentatge = percentatgesBase[especie][etapa] + ajustActivitat[activitat] + ajustObjectiu[objectiu];
    percentatge = Math.min(Math.max(percentatge, limits[etapa][0]), limits[etapa][1]);

    const gramsDiaris = arrodonir5(pes * (percentatge / 100) * 1000);
    const minim = arrodonir5(gramsDiaris * 0.9);
    const maxim = arrodonir5(gramsDiaris * 1.1);
    const quilosSetmanals = (gramsDiaris * 7) / 1000;
    const quilosMensuals = (gramsDiaris * 30) / 1000;
    const paquetsConill = Math.ceil(quilosMensuals / 0.5);

    resultat.hidden = false;
    resultat.innerHTML = `
      <p class="eyebrow">Ració diària orientativa</p>
      <h3>${gramsDiaris} g al dia</h3>
      <p>Rang aproximat: <strong>${minim}–${maxim} g diaris</strong>.</p>
      <ul>
        <li><strong>${formatDecimal.format(quilosSetmanals)} kg</strong> per setmana.</li>
        <li><strong>${formatDecimal.format(quilosMensuals)} kg</strong> cada 30 dies.</li>
      </ul>
      <div class="calc-packages">
        <strong>Formats aproximats per a 30 dies</strong>
        <p>Receptes amb formats d’1 kg i 500 g: ${textPaquets1kg(quilosMensuals)}.</p>
        <p>Si tries Conill, disponible només en 500 g: ${paquetsConill} ${paquetsConill === 1 ? "paquet" : "paquets"} de 500 g.</p>
      </div>
      <p class="small-copy">Percentatge aplicat al càlcul: ${formatDecimal.format(percentatge)} % del pes corporal.</p>
    `;

    resultat.setAttribute("tabindex", "-1");
    resultat.focus();
  });
});
