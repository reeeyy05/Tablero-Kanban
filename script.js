// Contador para generar IDs unicos
let contadorTarjetas = 1;

// Inicializa una columna
// Permite añadir, eliminar y arrastrar tarjetas
function inicializar(idBoton, idForm, idInput, idCancelar, idContenedor) {
    const boton = document.getElementById(idBoton);
    const formulario = document.getElementById(idForm);
    const input = document.getElementById(idInput);
    const botonCancelar = document.getElementById(idCancelar);
    const contenedor = document.getElementById(idContenedor);

    // Cuando hacemos clic muestra el formulario y oculta el boton
    boton.addEventListener("click", () => {
        formulario.classList.remove("oculto");
        boton.style.display = "none";
        input.focus();
    });

    // Cancelar: oculta el formulario y restaura el boton
    botonCancelar.addEventListener("click", () => {
        formulario.classList.add("oculto");
        boton.style.display = "inline-block";
        input.value = "";
    });

    // Confirmar: crea una tarjeta y la inserta en el contenedor
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const texto = input.value.trim();
        if (!texto) return;

        // Generemos IDs unicos para la tarjeta y su boton de eliminar
        const idTarjeta = `tarjeta-${contadorTarjetas}`;
        const idBotonEliminar = `eliminar-${idTarjeta}`;

        // Creamos la tarjeta
        const tarjeta = document.createElement("article");
        tarjeta.id = idTarjeta;
        tarjeta.className = "tarjeta";
        tarjeta.draggable = true;

        tarjeta.innerHTML = `
            <p class="texto-tarjeta">${texto}</p>
            <button id="${idBotonEliminar}" class="boton-eliminar">X</button>
        `;

        contenedor.appendChild(tarjeta);

        // Eliminacion
        const btnEliminar = document.getElementById(idBotonEliminar);
        btnEliminar.addEventListener("click", () => tarjeta.remove());

        // Arrastre
        tarjeta.addEventListener("dragstart", (ev) => {
            tarjeta.classList.add("dragging");
            ev.dataTransfer.setData("text/plain", idTarjeta);
        });

        tarjeta.addEventListener("dragend", () => {
            tarjeta.classList.remove("dragging");
        });

        // Reinicio para la siguiente tarjeta
        contadorTarjetas++;
        input.value = "";
        formulario.classList.add("oculto");
        boton.style.display = "inline-block";
    });
}

// Inicializamos las 3 columnas
inicializar("btn-por-hacer", "formulario-por-hacer", "input-por-hacer", "cancelar-por-hacer", "contenedor-por-hacer");
inicializar("btn-en-progreso", "formulario-en-progreso", "input-en-progreso", "cancelar-en-progreso", "contenedor-en-progreso");
inicializar("btn-hecho", "formulario-hecho", "input-hecho", "cancelar-hecho", "contenedor-hecho");

// Activamos el drag and drop en todos los contenedores
["contenedor-por-hacer", "contenedor-en-progreso", "contenedor-hecho"].forEach(id => {
    const contenedor = document.getElementById(id);

    // Permite soltar
    contenedor.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        contenedor.classList.add("drag-over");
    });

    contenedor.addEventListener("dragleave", () => {
        contenedor.classList.remove("drag-over");
    });

    // 
    contenedor.addEventListener("drop", (ev) => {
        ev.preventDefault();
        contenedor.classList.remove("drag-over");

        const idTarjeta = ev.dataTransfer.getData("text/plain");
        const tarjeta = document.getElementById(idTarjeta);

        if (tarjeta && !contenedor.contains(tarjeta)) {
            contenedor.appendChild(tarjeta);
        }
    });
});