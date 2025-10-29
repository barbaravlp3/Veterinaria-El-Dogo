const URL = '/barbaravolpe/eldogo_vet/api/clientes.php?tabla=clientes';

export async function seleccionarClientes() {
  const res = await fetch(URL);
  return await res.json();
}

export async function insertarClientes(formData) {
  // Transformar FormData a objeto JSON
  const payload = Object.fromEntries(formData.entries());
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function actualizarClientes(formData, id) {
  // ✅ Enviar como JSON (no FormData)
  const payload = Object.fromEntries(formData.entries());
  payload.id = id;
  const res = await fetch(URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function eliminarProductos(id) {
  const res = await fetch(URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id })
  });
  return await res.json();
}
