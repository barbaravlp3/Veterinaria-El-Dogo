// ==============================
//  DASHBOARD PRINCIPAL - EL DOGO
// ==============================

import { renderClientesView } from "../logica/clientes.js";
import { renderMascotasView } from "../logica/mascotas.js";

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const loginView = document.getElementById("login-view");
  const mainApp = document.getElementById("main-app");
  const navButtons = document.querySelectorAll(".nav-btn");

  let isAuthenticated = false;

  // ===== LOGIN =====
  document.getElementById("login-btn").addEventListener("click", () => {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === "veterinario" && pass === "1234") {
      isAuthenticated = true;
      loginView.style.display = "none";
      mainApp.style.display = "block";
      renderDashboard();
    } else {
      document.getElementById("login-error").textContent =
        "Usuario o contraseña incorrectos";
    }
  });

  // ===== LOGOUT =====
  document.getElementById("logout-btn").addEventListener("click", () => {
    isAuthenticated = false;
    loginView.style.display = "flex";
    mainApp.style.display = "none";
  });

  // ===== NAVEGACIÓN =====
  navButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const view = e.target.getAttribute("data-view");
      if (view) renderView(view);
    });
  });

  function renderView(view) {
    navButtons.forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`nav-${view}`)?.classList.add("active");

    switch (view) {
      case "dashboard":
        renderDashboard();
        break;
      case "clientes":
        renderClientesView();
        break;
      case "mascotas":
        renderMascotasView();
        break;
      default:
        content.innerHTML = "<p>Vista no encontrada</p>";
    }
  }

  async function renderDashboard() {
    content.innerHTML = `
      <div class="container">
        <h2>PANEL DE CONTROL</h2>
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>CLIENTES</h3>
            <button class="btn primary-btn" id="go-clientes">Ver Clientes</button>
          </div>
          <div class="dashboard-card">
            <h3>MASCOTAS</h3>
            <button class="btn primary-btn" id="go-mascotas">Ver Mascotas</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("go-clientes").addEventListener("click", renderClientesView);
    document.getElementById("go-mascotas").addEventListener("click", renderMascotasView);
  }
});

