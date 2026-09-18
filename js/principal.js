"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonMenu = document.querySelector(".boto-menu");
    const menuPrincipal = document.querySelector(".menu-principal");
    const enlacesMenu = document.querySelectorAll(".menu-principal a");
    const preguntas = document.querySelectorAll(".acordio details");
    const anyActual = document.getElementById("any-actual");

    /*
     * MENÚ PARA MÓVILES
     */
    function cambiarEstadoMenu(abierto) {
        if (!botonMenu || !menuPrincipal) {
            return;
        }

        botonMenu.setAttribute("aria-expanded", String(abierto));
        botonMenu.setAttribute(
            "aria-label",
            abierto ? "Tancar el menú" : "Obrir el menú"
        );

        /*
         * Se añaden varias clases compatibles con los estilos
         * utilizados en la web.
         */
        botonMenu.classList.toggle("actiu", abierto);
        botonMenu.classList.toggle("obert", abierto);

        menuPrincipal.classList.toggle("actiu", abierto);
        menuPrincipal.classList.toggle("obert", abierto);

        document.body.classList.toggle("menu-obert", abierto);
    }

    if (botonMenu && menuPrincipal) {
        botonMenu.addEventListener("click", () => {
            const estaAbierto =
                botonMenu.getAttribute("aria-expanded") === "true";

            cambiarEstadoMenu(!estaAbierto);
        });

        enlacesMenu.forEach((enlace) => {
            enlace.addEventListener("click", () => {
                cambiarEstadoMenu(false);
            });
        });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") {
                cambiarEstadoMenu(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                cambiarEstadoMenu(false);
            }
        });
    }

    /*
     * PREGUNTAS FRECUENTES
     * Mantiene una sola respuesta abierta.
     */
    preguntas.forEach((preguntaActual) => {
        preguntaActual.addEventListener("toggle", () => {
            if (!preguntaActual.open) {
                return;
            }

            preguntas.forEach((otraPregunta) => {
                if (otraPregunta !== preguntaActual) {
                    otraPregunta.open = false;
                }
            });
        });
    });

    /*
     * AÑO AUTOMÁTICO DEL PIE DE PÁGINA
     */
    if (anyActual) {
        anyActual.textContent = new Date().getFullYear();
    }
});