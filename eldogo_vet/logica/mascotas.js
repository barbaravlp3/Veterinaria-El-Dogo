import {
  seleccionarMascotas,
  insertarMascotas,
  actualizarMascotas,
  eliminarMascotas,
} from "../modelos/mascotas.js";
import { seleccionarClientes } from "../modelos/clientes.js";

export async function renderMascotasView() {
  const content = document.getElementById("content");

  try {
    const mascotas = await seleccionarMascotas();
    const clientes = await seleccionarClientes();

    const rows = mascotas
      .map((m) => {
        // 🔹 En la BD el campo se llama 'duenio_asociado'
        const dueno = clientes.find((c) => c.id == m.duenio_asociado);
        return `
        <tr>
          <td>${m.id}</td>
          <td>${m.nombre}</td>
          <td>${m.especie} (${m.raza})</td>
          <td>${dueno ? dueno.nombre : "Sin dueño"}</td>
          <td>
            <button data-id="${m.id}" class="btn small edit">📝</button>
            <button data-id="${m.id}" class="btn small delete">🗑️</button>
          </td>
        </tr>`;
      })
      .join("");

    content.innerHTML = `
      <div class="container">
        <h2>MASCOTAS</h2>
        <button class="btn primary-btn" id="add-mascota-btn">Agregar Mascota</button>
        <table>
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Detalle</th><th>Dueño</th><th>Acciones</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    // Eventos
    document
      .getElementById("add-mascota-btn")
      .addEventListener("click", renderMascotaForm);

    content.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", () => editarMascota(btn.dataset.id))
    );

    content.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => eliminarMascota(btn.dataset.id))
    );
  } catch (err) {
    content.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

function renderMascotaForm(mascota = null) {
  const content = document.getElementById("content");

  // 🔹 Detectamos si estamos creando o editando
  const modoEdicion = mascota && mascota.id;

  content.innerHTML = `
    <div class="container">
      <h2>${modoEdicion ? "Editar Mascota" : "Registrar Mascota"}</h2>
      <form id="mascota-form">
        ${modoEdicion ? `<input type="hidden" name="id" value="${mascota.id}">` : ""}
        
        <label>Nombre:</label>
        <input name="nombre" value="${mascota?.nombre || ""}" required>

        <label>Especie:</label>
        <input name="especie" value="${mascota?.especie || ""}" required>

        <label>Raza:</label>
        <input name="raza" value="${mascota?.raza || ""}">

        <label>Edad:</label>
        <input type="number" name="edad" value="${mascota?.edad || ""}">

        <label>Problemas de Salud:</label>
        <textarea name="problemas_de_salud">${mascota?.problemas_de_salud || ""}</textarea>

        <label>Dueño:</label>
        <select name="duenio_asociado" id="duenoIdSelect"></select>

        <button class="btn primary-btn" type="submit">
          ${modoEdicion ? "Guardar" : "Registrar"}
        </button>
        <button class="btn secondary-btn" type="button" onclick="renderView('mascotas')">
          Cancelar
        </button>
      </form>
    </div>
  `;

  // 🔹 Cargar lista de dueños
  seleccionarClientes().then((clientes) => {
    const select = document.getElementById("duenoIdSelect");
    select.innerHTML =
      '<option value="">Seleccione un dueño...</option>' +
      clientes
        .map(
          (c) =>
            `<option value="${c.id}" ${
              mascota?.duenio_asociado == c.id ? "selected" : ""
            }>${c.nombre}</option>`
        )
        .join("");
  });

  // 🔹 Envío del formulario
  const form = document.getElementById("mascota-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    const payload = Object.fromEntries(datos.entries());
    console.log("🐾 Payload:", payload);
    console.log("🔍 Modo edición:", modoEdicion);

    try {
      if (modoEdicion) {
        console.log("✏️ Actualizando mascota...");
        await actualizarMascotas(datos, mascota.id);
      } else {
        console.log("➕ Creando nueva mascota...");
        await insertarMascotas(datos);
      }

      renderMascotasView();
    } catch (error) {
      console.error("❌ Error en el envío:", error);
    }
  });
}

async function editarMascota(id) {
  const mascotas = await seleccionarMascotas();
  const mascota = mascotas.find((m) => m.id == id);
  renderMascotaForm(mascota);
}

async function eliminarMascota(id) {
  if (confirm("¿Eliminar esta mascota?")) {
    await eliminarMascotas(id);
    renderMascotasView();
  }
}
