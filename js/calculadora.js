"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulari-calculadora");
    const campoEspecie = document.getElementById("especie");
    const campoPes = document.getElementById("pes");
    const campoEtapa = document.getElementById("etapa");
    const campoActivitat = document.getElementById("activitat");
    const campoObjectiu = document.getElementById("objectiu");
    const resultado = document.getElementById("resultat-calculadora");

    if (
        !formulario ||
        !campoEspecie ||
        !campoPes ||
        !campoEtapa ||
        !campoActivitat ||
        !campoObjectiu ||
        !resultado
    ) {
        return;
    }

    /*
     * Porcentaje base orientativo sobre el peso corporal.
     */
    const porcentajesBase = {
        gos: {
            cadell: 6,
            adult: 2.5,
            senior: 2
        },
        gat: {
            cadell: 5,
            adult: 3,
            senior: 2.5
        }
    };

    /*
     * Ajuste según el nivel de actividad.
     */
    const ajustesActividad = {
        baixa: -0.3,
        normal: 0,
        alta: 0.5
    };

    /*
     * Ajuste según el objetivo.
     */
    const ajustesObjetivo = {
        baixar: -0.3,
        mantenir: 0,
        augmentar: 0.4
    };

    /*
     * Límites para evitar porcentajes excesivamente bajos o altos.
     */
    const limitesPorEtapa = {
        cadell: {
            minimo: 4,
            maximo: 10
        },
        adult: {
            minimo: 1.5,
            maximo: 4
        },
        senior: {
            minimo: 1.5,
            maximo: 3.5
        }
    };

    const formatoDecimal = new Intl.NumberFormat("ca-AD", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });

    function limitar(valor, minimo, maximo) {
        return Math.min(Math.max(valor, minimo), maximo);
    }

    function redondearGramos(gramos) {
        /*
         * Redondea la ración a intervalos de 5 gramos.
         */
        return Math.round(gramos / 5) * 5;
    }

    function formatearKg(cantidad) {
        return formatoDecimal.format(cantidad);
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const especie = campoEspecie.value;
        const peso = Number.parseFloat(campoPes.value);
        const etapa = campoEtapa.value;
        const actividad = campoActivitat.value;
        const objetivo = campoObjectiu.value;

        if (!Number.isFinite(peso) || peso < 0.5 || peso > 120) {
            resultado.hidden = false;
            resultado.innerHTML = `
                <h3>Revisa el pes introduït</h3>
                <p>El pes ha de ser un valor entre 0,5 kg i 120 kg.</p>
            `;

            campoPes.focus();
            return;
        }

        const porcentajeBase = porcentajesBase[especie][etapa];
        const ajusteActividad = ajustesActividad[actividad];
        const ajusteObjetivo = ajustesObjetivo[objetivo];
        const limites = limitesPorEtapa[etapa];

        let porcentajeFinal =
            porcentajeBase +
            ajusteActividad +
            ajusteObjetivo;

        porcentajeFinal = limitar(
            porcentajeFinal,
            limites.minimo,
            limites.maximo
        );

        /*
         * Peso × porcentaje = cantidad diaria.
         */
        const gramosDiarios = redondearGramos(
            peso * (porcentajeFinal / 100) * 1000
        );

        /*
         * Mostramos un rango aproximado del 10 %.
         */
        const minimoDiario = redondearGramos(gramosDiarios * 0.9);
        const maximoDiario = redondearGramos(gramosDiarios * 1.1);

        const kilosSemanales = (gramosDiarios * 7) / 1000;
        const kilosMensuales = (gramosDiarios * 30) / 1000;

        /*
         * Los productos BARFEAND se presentan en paquetes de 1 kg.
         */
        const paquetesMensuales = Math.ceil(kilosMensuales);

        resultado.hidden = false;
        resultado.setAttribute("tabindex", "-1");

        resultado.innerHTML = `
            <p class="calculadora__resultat-etiqueta">
                Ració diària orientativa
            </p>

            <h3>${gramosDiarios} g al dia</h3>

            <p>
                Rang aproximat:
                <strong>${minimoDiario}–${maximoDiario} g diaris</strong>
            </p>

            <ul>
                <li>
                    <strong>${formatearKg(kilosSemanales)} kg</strong>
                    per setmana
                </li>

                <li>
                    <strong>${formatearKg(kilosMensuales)} kg</strong>
                    cada 30 dies
                </li>

                <li>
                    Aproximadament
                    <strong>${paquetesMensuales} paquets d’1 kg</strong>
                    al mes
                </li>
            </ul>

            <p class="calculadora__resultat-percentatge">
                Càlcul aplicat: ${formatoDecimal.format(porcentajeFinal)} %
                del pes corporal.
            </p>

            <a
                class="boto boto--petit"
                href="https://elrebostdelnord.com/categoria/mascotes/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Veure els productes
            </a>
        `;

        resultado.focus();
    });
});