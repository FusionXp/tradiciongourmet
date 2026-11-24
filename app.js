const numeroWhatsApp = "593987558870";
const maximo = 20;

const cakes = [
  { nombre: "Cake Sencillo", descripcion: "Banana tradicional con chips de chocolate", precio: 5, imagen: "img/cake_sencillo.jpg" },
  { nombre: "Cake Completo", descripcion: "Banana con manjar y crema de avellanas. ¡Doble sabor!", precio: 7, imagen: "img/cake_completo.jpg" },
  { nombre: "Cake Especial", descripcion: "Banana con frutos secos, arándanos, nueces y ciruelas pasas", precio: 8, imagen: "img/cake_especial.jpg" }
];

let cantidades = [0, 0, 0];
let ubicacion = null;
let mapa = null;
let marcadorYo = null;

function leer(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    if (valor === null) {
      return porDefecto;
    }
    return JSON.parse(valor);
  } catch (e) {
    return porDefecto;
  }
}

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
  }
}

function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mostrarMensaje(texto) {
  const caja = document.getElementById("mensaje");
  caja.textContent = texto;
  caja.classList.remove("oculto");
  clearTimeout(caja.tiempo);
  caja.tiempo = setTimeout(function () {
    caja.classList.add("oculto");
  }, 3000);
}

function rebote(elemento) {
  elemento.classList.add("rebote");
  setTimeout(function () {
    elemento.classList.remove("rebote");
  }, 150);
}

function totalCakes() {
  let total = 0;
  for (let i = 0; i < cantidades.length; i++) {
    total = total + cantidades[i];
  }
  return total;
}

function totalPrecio() {
  let total = 0;
  for (let i = 0; i < cantidades.length; i++) {
    total = total + cantidades[i] * cakes[i].precio;
  }
  return total;
}

function mostrarCatalogo() {
  let html = "";
  for (let i = 0; i < cakes.length; i++) {
    html += `
      <article class="tarjeta" id="tarjeta${i}">
        <div class="foto">
          <img src="${cakes[i].imagen}" alt="${cakes[i].nombre}">
          <div class="precio">$${cakes[i].precio}</div>
        </div>
        <div class="tarjeta-texto">
          <h4>${cakes[i].nombre}</h4>
          <p>${cakes[i].descripcion}</p>
          <div class="contador">
            <button class="btn-redondo" aria-label="Quitar uno" data-accion="restar" data-i="${i}">−</button>
            <span class="numero" id="numero${i}">0</span>
            <button class="btn-redondo lleno" aria-label="Agregar uno" data-accion="sumar" data-i="${i}">+</button>
            <span class="subtotal" id="subtotal${i}"></span>
          </div>
        </div>
      </article>`;
  }
  document.getElementById("listaCakes").innerHTML = html;
}

function actualizarTodo() {
  for (let i = 0; i < cakes.length; i++) {
    document.getElementById("numero" + i).textContent = cantidades[i];
    const subtotal = cantidades[i] * cakes[i].precio;
    document.getElementById("subtotal" + i).textContent = cantidades[i] > 0 ? "Subtotal: $" + subtotal : "";
    document.getElementById("tarjeta" + i).classList.toggle("elegida", cantidades[i] > 0);
  }

  const cantidad = totalCakes();
  let texto = "Tu carrito está vacío";
  if (cantidad === 1) {
    texto = "1 cake en tu carrito";
  } else if (cantidad > 1) {
    texto = cantidad + " cakes en tu carrito";
  }
  document.getElementById("resumenCantidad").textContent = texto;
  document.getElementById("resumenTotal").textContent = "$" + totalPrecio();
  document.getElementById("totalCarrito").textContent = "$" + totalPrecio();

  if (!document.getElementById("pantallaCarrito").classList.contains("oculto")) {
    mostrarCarrito();
  }
}

function sumar(i) {
  if (cantidades[i] >= maximo) {
    mostrarMensaje("Máximo " + maximo + " por pedido 😊 Para más, escríbenos por WhatsApp");
    return;
  }
  cantidades[i]++;
  actualizarTodo();
  rebote(document.getElementById("tarjeta" + i));
  rebote(document.querySelector("#pantallaCatalogo .barra"));
}

function restar(i) {
  if (cantidades[i] > 0) {
    cantidades[i]--;
    actualizarTodo();
  }
}

function irAlCarrito() {
  if (totalCakes() === 0) {
    mostrarMensaje("Agrega al menos un cake 🍌");
    return;
  }
  document.getElementById("pantallaCatalogo").classList.add("oculto");
  document.getElementById("pantallaCarrito").classList.remove("oculto");
  window.scrollTo(0, 0);
  mostrarCarrito();
}

function volverAlCatalogo() {
  document.getElementById("pantallaCarrito").classList.add("oculto");
  document.getElementById("pantallaCatalogo").classList.remove("oculto");
  window.scrollTo(0, 0);
}

function mostrarCarrito() {
  let html = "";
  for (let i = 0; i < cakes.length; i++) {
    if (cantidades[i] > 0) {
      html += `
        <div class="item">
          <img src="${cakes[i].imagen}" alt="">
          <div class="item-texto">
            <strong>${cakes[i].nombre}</strong>
            <span>${cantidades[i]} x $${cakes[i].precio}</span>
            <b>$${cantidades[i] * cakes[i].precio}</b>
          </div>
          <button class="btn-redondo chico" aria-label="Quitar uno" data-accion="restar" data-i="${i}">−</button>
          <span class="numero">${cantidades[i]}</span>
          <button class="btn-redondo chico lleno" aria-label="Agregar uno" data-accion="sumar" data-i="${i}">+</button>
        </div>`;
    }
  }
  document.getElementById("listaCarrito").innerHTML = html;

  const vacio = totalCakes() === 0;
  document.getElementById("carritoVacio").classList.toggle("oculto", !vacio);
  document.getElementById("btnPedir").disabled = vacio;
}

function cargarDatosGuardados() {
  const datos = leer("datosCliente", null);
  if (datos !== null) {
    document.getElementById("nombre").value = datos.nombre;
    document.getElementById("telefono").value = datos.telefono;
    document.getElementById("btnBorrarDatos").classList.remove("oculto");
  }
}

function borrarDatos() {
  try {
    localStorage.removeItem("datosCliente");
  } catch (e) {
  }
  document.getElementById("nombre").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("btnBorrarDatos").classList.add("oculto");
  mostrarMensaje("Datos borrados");
}

function mostrarUbicacionesGuardadas() {
  const lista = leer("ubicaciones", []);
  const zona = document.getElementById("zonaGuardadas");

  if (lista.length === 0) {
    zona.classList.add("oculto");
    return;
  }

  zona.classList.remove("oculto");
  let html = "";
  for (let i = 0; i < lista.length; i++) {
    html += `
      <div class="chip">
        <button data-accion="usar" data-i="${i}">🏠 ${escapar(lista[i].nombre)}</button>
        <button class="borrar" aria-label="Borrar ${escapar(lista[i].nombre)}" data-accion="borrar" data-i="${i}">✕</button>
      </div>`;
  }
  document.getElementById("chipsUbicaciones").innerHTML = html;
}

function usarUbicacion(i) {
  const lista = leer("ubicaciones", []);
  const elegida = lista[i];
  ubicacion = { lat: elegida.lat, lon: elegida.lon, link: "https://maps.google.com/?q=" + elegida.lat + "," + elegida.lon };
  document.getElementById("direccion").value = elegida.direccion;
  actualizarTextoUbicacion();
  document.getElementById("btnGuardarUbicacion").classList.add("oculto");
  mostrarMensaje("Usando: " + elegida.nombre + " 📍");
}

function borrarUbicacion(i) {
  const lista = leer("ubicaciones", []);
  if (confirm("¿Borrar \"" + lista[i].nombre + "\"?")) {
    lista.splice(i, 1);
    guardar("ubicaciones", lista);
    mostrarUbicacionesGuardadas();
  }
}

function guardarUbicacionActual() {
  let nombre = prompt("¿Cómo quieres llamar esta ubicación? (Ej: Casa, Trabajo)", "Casa");
  if (nombre === null) {
    return;
  }
  if (nombre.trim() === "") {
    nombre = "Mi ubicación";
  }
  const lista = leer("ubicaciones", []);
  lista.push({ nombre: nombre, direccion: document.getElementById("direccion").value, lat: ubicacion.lat, lon: ubicacion.lon });
  guardar("ubicaciones", lista);
  mostrarUbicacionesGuardadas();
  document.getElementById("btnGuardarUbicacion").classList.add("oculto");
  mostrarMensaje("Ubicación guardada 💾");
}

function actualizarTextoUbicacion() {
  if (ubicacion !== null) {
    document.getElementById("textoUbicacion").innerHTML = '✅ Ubicación marcada. <a href="' + escapar(ubicacion.link) + '" target="_blank" rel="noopener">Verla en Google Maps</a>';
    document.getElementById("btnMapa").textContent = "🗺️ Cambiar ubicación en el mapa";
  }
}

function abrirMapa() {
  document.getElementById("pantallaMapa").classList.remove("oculto");

  if (mapa === null) {
    let centro = [-3.2581, -79.9554];
    let zoom = 15;
    if (ubicacion !== null) {
      centro = [ubicacion.lat, ubicacion.lon];
      zoom = 18;
    }
    mapa = L.map("mapa").setView(centro, zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(mapa);
  }

  setTimeout(function () {
    mapa.invalidateSize();
  }, 100);
}

function cerrarMapa() {
  document.getElementById("pantallaMapa").classList.add("oculto");
}

function buscarMiUbicacion() {
  if (!navigator.geolocation) {
    mostrarMensaje("No te encontramos 😊 Desliza el mapa hasta tu casa");
    return;
  }

  const boton = document.getElementById("btnMiUbicacion");
  boton.textContent = "⏳ Buscando tu ubicación...";
  boton.disabled = true;

  navigator.geolocation.getCurrentPosition(
    function (posicion) {
      const punto = [posicion.coords.latitude, posicion.coords.longitude];
      if (marcadorYo === null) {
        const icono = L.divIcon({ className: "", html: '<div class="punto-yo"></div>', iconSize: [30, 30], iconAnchor: [15, 15] });
        marcadorYo = L.marker(punto, { icon: icono }).addTo(mapa);
      } else {
        marcadorYo.setLatLng(punto);
      }
      mapa.setView(punto, 18);
      boton.textContent = "📍 Mi ubicación actual";
      boton.disabled = false;
    },
    function (error) {
      if (error.code === 1) {
        mostrarMensaje("Activa el permiso de ubicación en tu navegador 😊");
      } else {
        mostrarMensaje("No te encontramos 😊 Desliza el mapa hasta tu casa");
      }
      boton.textContent = "📍 Mi ubicación actual";
      boton.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}

function confirmarPunto() {
  const centro = mapa.getCenter();
  const lat = centro.lat.toFixed(6);
  const lon = centro.lng.toFixed(6);
  ubicacion = { lat: lat, lon: lon, link: "https://maps.google.com/?q=" + lat + "," + lon };

  const boton = document.getElementById("btnConfirmarPunto");
  boton.textContent = "⏳ Buscando la dirección...";
  boton.disabled = true;

  const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=" + lat + "&lon=" + lon;

  fetch(url)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      if (datos.address) {
        const a = datos.address;
        const partes = [a.road, a.house_number, a.neighbourhood || a.suburb, a.city || a.town || a.village];
        const texto = partes.filter(function (p) { return p; }).join(", ");
        if (texto !== "") {
          document.getElementById("direccion").value = texto;
        }
      }
    })
    .catch(function () {
    })
    .finally(function () {
      boton.textContent = "✅ Confirmar este punto";
      boton.disabled = false;
      cerrarMapa();
      actualizarTextoUbicacion();
      document.getElementById("btnGuardarUbicacion").classList.remove("oculto");
      mostrarMensaje("Ubicación guardada ✅");
    });
}

function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

function pedir() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const fecha = document.getElementById("fecha").value;
  const notas = document.getElementById("notas").value.trim();
  const pagoElegido = document.querySelector('input[name="pago"]:checked');

  if (totalCakes() === 0) {
    mostrarMensaje("Agrega al menos un cake 🍌");
    return;
  }
  if (nombre === "" || telefono === "") {
    mostrarMensaje("Completa tu nombre y celular");
    return;
  }

  let telefonoLimpio = telefono.replace(/[\s-]/g, "");
  if (telefonoLimpio.startsWith("+593")) {
    telefonoLimpio = "0" + telefonoLimpio.substring(4);
  }
  if (!/^09[0-9]{8}$/.test(telefonoLimpio)) {
    mostrarMensaje("Escribe un celular válido de 10 dígitos, ej: 0991234567");
    return;
  }
  if (direccion === "" && ubicacion === null) {
    mostrarMensaje("Escribe tu dirección o marca tu ubicación 📍");
    return;
  }
  if (fecha === "") {
    mostrarMensaje("Elige la fecha de entrega");
    return;
  }
  if (pagoElegido === null) {
    mostrarMensaje("Elige cómo vas a pagar");
    return;
  }

  const ahora = Date.now();
  const espera = 60000 - (ahora - leer("ultimoPedido", 0));
  if (espera > 0) {
    mostrarMensaje("Espera " + Math.ceil(espera / 1000) + " segundos para enviar otro pedido ⏳");
    return;
  }

  const partesFecha = fecha.split("-");
  const fechaBonita = partesFecha[2] + "/" + partesFecha[1] + "/" + partesFecha[0];

  let productos = "";
  for (let i = 0; i < cakes.length; i++) {
    if (cantidades[i] > 0) {
      productos += "• " + cantidades[i] + " x " + cakes[i].nombre + " = $" + (cantidades[i] * cakes[i].precio) + "\n";
    }
  }

  let textoUbicacion = "No enviada";
  if (ubicacion !== null) {
    textoUbicacion = ubicacion.link;
  }

  const texto = "*NUEVO PEDIDO - Tradición Gourmet* 🍌\n\n"
    + productos + "\n"
    + "*TOTAL: $" + totalPrecio() + "*\n\n"
    + "👤 Nombre: " + nombre + "\n"
    + "📞 Teléfono: " + telefono + "\n"
    + "🏠 Dirección: " + direccion + "\n"
    + "📍 Ubicación: " + textoUbicacion + "\n"
    + "📅 Entrega: " + fechaBonita + "\n"
    + "💳 Pago: " + pagoElegido.value + "\n"
    + "📝 Notas: " + notas;

  const resumen = "¿Confirmar tu pedido? 🍌\n\n" + productos + "\nTotal: $" + totalPrecio() + "\nEntrega: " + fechaBonita;

  if (!confirm(resumen)) {
    return;
  }

  guardar("ultimoPedido", ahora);
  if (document.getElementById("guardarDatos").checked) {
    guardar("datosCliente", { nombre: nombre, telefono: telefono });
  }

  window.location.href = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(texto);
}

function mostrarIntro() {
  const intro = document.getElementById("intro");
  let yaVisto = false;
  try {
    yaVisto = sessionStorage.getItem("introVisto") === "si";
    sessionStorage.setItem("introVisto", "si");
  } catch (e) {
  }

  if (yaVisto) {
    intro.remove();
    return;
  }

  setTimeout(function () {
    intro.classList.add("salir");
    setTimeout(function () {
      intro.remove();
    }, 700);
  }, 2200);
}

mostrarIntro();
mostrarCatalogo();
actualizarTodo();
cargarDatosGuardados();
mostrarUbicacionesGuardadas();

function clicEnBotones(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (boton === null) {
    return;
  }
  const i = Number(boton.dataset.i);
  const accion = boton.dataset.accion;
  if (accion === "sumar") {
    sumar(i);
  } else if (accion === "restar") {
    restar(i);
  } else if (accion === "usar") {
    usarUbicacion(i);
  } else if (accion === "borrar") {
    borrarUbicacion(i);
  }
}

document.getElementById("listaCakes").addEventListener("click", clicEnBotones);
document.getElementById("listaCarrito").addEventListener("click", clicEnBotones);
document.getElementById("chipsUbicaciones").addEventListener("click", clicEnBotones);
document.getElementById("fecha").min = fechaDeHoy();
document.getElementById("btnVerCarrito").addEventListener("click", irAlCarrito);
document.getElementById("btnVolver").addEventListener("click", volverAlCatalogo);
document.getElementById("btnBorrarDatos").addEventListener("click", borrarDatos);
document.getElementById("btnMapa").addEventListener("click", abrirMapa);
document.getElementById("btnCerrarMapa").addEventListener("click", cerrarMapa);
document.getElementById("btnMiUbicacion").addEventListener("click", buscarMiUbicacion);
document.getElementById("btnConfirmarPunto").addEventListener("click", confirmarPunto);
document.getElementById("btnGuardarUbicacion").addEventListener("click", guardarUbicacionActual);
document.getElementById("btnPedir").addEventListener("click", pedir);

const opcionesPago = document.querySelectorAll('input[name="pago"]');
for (let i = 0; i < opcionesPago.length; i++) {
  opcionesPago[i].addEventListener("change", function () {
    const esTransferencia = opcionesPago[i].value.startsWith("Transferencia") && opcionesPago[i].checked;
    document.getElementById("avisoTransferencia").classList.toggle("oculto", !esTransferencia);
  });
}
