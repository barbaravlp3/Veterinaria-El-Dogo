import {
  seleccionarClientes,
  insertarClientes,
  actualizarClientes,
  eliminarProductos as eliminarClientes,
} from "../modelos/clientes.js";

export async function renderClientesView() {
  const content = document.getElementById("content");

  try {
    const clientes = await seleccionarClientes();
console.log(clientes);
    const rows = clientes
      .map(
        (c) => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.direccion}</td>
        <td>
          <button data-id="${c.id}" class="btn small edit">📝</button>
          <button data-id="${c.id}" class="btn small delete">❌</button>
        </td>
      </tr>`
      )
      .join("");

    content.innerHTML = `
      <div class="container">
        <h2>CLIENTES</h2>
        <button class="btn primary-btn" id="add-cliente-btn">Agregar Cliente</button>
        <table>
          <thead><tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Dirección</th><th>Acciones</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    document.getElementById("add-cliente-btn").addEventListener("click", () => renderClienteForm(null));
    content.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", () => editarCliente(btn.dataset.id))
    );
    content.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => eliminarCliente(btn.dataset.id))
    );
  } catch (err) {
    content.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

function renderClienteForm(cliente = null) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="container">
      <h2>${cliente ? "Editar Cliente" : "Registrar Cliente"}</h2>
      <form id="cliente-form">
        ${cliente ? `<input type="hidden" name="id" value="${cliente.id}">` : ""}
        <label>Nombre:</label><input name="nombre" value="${cliente?.nombre || ""}" required>
        <label>Apellido:</label><input name="apellido" value="${cliente?.apellido || ""}">
        <label>DNI:</label><input name="dni" value="${cliente?.dni || ""}">
        <label>Teléfono:</label><input name="telefono" value="${cliente?.telefono || ""}">
        <label>Dirección:</label><input name="direccion" value="${cliente?.direccion || ""}">
        <button class="btn primary-btn" type="submit">${cliente ? "Guardar" : "Registrar"}</button>
        <button class="btn secondary-btn" type="button" onclick="renderView('clientes')">Cancelar</button>
      </form>
    </div>
  `;

  document.getElementById("cliente-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = new FormData(e.target);
    console.log("Cliente en formulario:", cliente);

    if (cliente) await actualizarClientes(datos, cliente.id);
    else await insertarClientes(datos);
    renderClientesView();
  });
}

async function editarCliente(id) {
  const clientes = await seleccionarClientes();
  const cliente = clientes.find((c) => c.id == id);
  renderClienteForm(cliente);
}

async function eliminarCliente(id) {
  if (confirm("¿Eliminar este cliente?")) {
    await eliminarClientes(id);
    renderClientesView();
  }
}
