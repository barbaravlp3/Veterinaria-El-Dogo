const URL = '/barbaravolpe/eldogo_vet/api/mascotas.php?tabla=mascotas';

// 📥 LISTAR
export async function seleccionarMascotas() {
  const res = await fetch(URL);
  const data = await res.json();
  console.log("📥 Mascotas obtenidas:", data);
  return data;
}

// ➕ INSERTAR
export async function insertarMascotas(formData) {
  const payload = Object.fromEntries(formData.entries());

  console.log("📤 Enviando nueva mascota:", payload);

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("✅ Respuesta insertar:", data);
  return data;
}

// ✏️ ACTUALIZAR
export async function actualizarMascotas(formData, id) {
  const payload = Object.fromEntries(formData.entries());
  payload.id = id; // 🔹 enviamos el id en el JSON

  console.log("📤 Enviando actualización:", payload);

  const res = await fetch(URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("✅ Respuesta actualizar:", data);
  return data;
}

// ❌ ELIMINAR
export async function eliminarMascotas(id) {
  const res = await fetch(URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id }),
  });
  const data = await res.json();
  console.log("🗑️ Respuesta eliminar:", data);
  return data;
}
