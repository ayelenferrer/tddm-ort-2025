const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const REGISTRO = document.querySelector("#pantalla-registro");
const LOGIN = document.querySelector("#pantalla-login");
const VER_EVALUACIONES = document.querySelector(
  "#pantalla-listar-evaluaciones"
);
const AGREGAR_EVALUACION = document.querySelector(
  "#pantalla-agregar-evaluacion"
);
const URLBASE = "https://goalify.develotion.com/";
const INFORME_OBJETIVOS = document.querySelector("#pantalla-informe-objetivos");
const MAPA = document.querySelector("#pantalla-mapa");
const NAV = document.querySelector("ion-nav");

Inicio();

function Inicio() {
  Eventos();
  ArmarMenu();
}

function Eventos() {
  ROUTER.addEventListener("ionRouteDidChange", Navegar);
  document
    .querySelector("#btnRegistrar")
    .addEventListener("click", TomarDatosRegistro);
  document
    .querySelector("#btnLogin")
    .addEventListener("click", TomarDatosLogin);
  document
    .querySelector("#btnAgregarEvaluacion")
    .addEventListener("click", AgregarEvaluacion);
}

function CerrarMenu() {
  MENU.close();
}

function ArmarMenu() {
  let hayToken = localStorage.getItem("token");
  let html = `
      <ion-item href="/" onclick="CerrarMenu()">
        <ion-icon slot="start" name="home" color="secondary"></ion-icon>
        Home
      </ion-item>
    `;
  if (hayToken) {
    html += `
    <ion-item href="/agregar-evaluacion" onclick="CerrarMenu()">
      <ion-icon slot="start" name="add" color="secondary"></ion-icon>
      Agregar evaluación
    </ion-item>
    <ion-item href="/ver-evaluaciones" onclick="CerrarMenu()">
      <ion-icon slot="start" name="list" color="secondary"></ion-icon>
      Evaluaciones
    </ion-item>
    <ion-item href="/informe-objetivos" onclick="CerrarMenu()">
      <ion-icon slot="start" name="stats-chart" color="secondary"></ion-icon>
      Estadísticas
    </ion-item>
    <ion-item href="/mapa" onclick="CerrarMenu()">
      <ion-icon slot="start" name="map-outline" color="secondary"></ion-icon>
      Mapa
    </ion-item>
    <ion-item onclick="Logout()">
      <ion-icon slot="start" name="log-out" color="secondary"></ion-icon>
      Logout
    </ion-item>
  `;
  } else {
    html += `
                <ion-item href="/login" onclick="CerrarMenu()">
                <ion-icon slot="start" name="log-in" color="secondary"></ion-icon>
                    Login
                </ion-item>
                <ion-item href="/registro" onclick="CerrarMenu()">
                <ion-icon slot="start" name="person-add" color="secondary"></ion-icon>
                    Registro
                </ion-item>
        `;
  }
  document.querySelector("#menu-opciones").innerHTML = html;
}

function Navegar(evt) {
  console.log(evt);
  OcultarPantallas();
  var ruta = evt.detail.to;

  if (ruta === "/") {
    HOME.style.display = "block";
  } else if (ruta === "/registro") {
    REGISTRO.style.display = "block";
    PoblarSelectPaises();
  } else if (ruta === "/login") {
    LOGIN.style.display = "block";
  } else if (ruta === "/ver-evaluaciones") {
    VER_EVALUACIONES.style.display = "block";
    CrearFiltroFechas();
    ListarEvaluaciones("todo");
  } else if (ruta === "/agregar-evaluacion") {
    AGREGAR_EVALUACION.style.display = "block";
    PoblarSelectObjetivos();
  } else if (ruta === "/informe-objetivos") {
    INFORME_OBJETIVOS.style.display = "block";
    MostrarInformeObjetivos();
  } else if (ruta === "/mapa") {
    MAPA.style.display = "block";
    PoblarMapa();
  }
}

function OcultarPantallas() {
  HOME.style.display = "none";
  REGISTRO.style.display = "none";
  LOGIN.style.display = "none";
  VER_EVALUACIONES.style.display = "none";
  AGREGAR_EVALUACION.style.display = "none";
  INFORME_OBJETIVOS.style.display = "none";
  MAPA.style.display = "none";
}

async function PoblarSelectPaises() {
  try {
    PrenderLoading("Cargando países...");
    let response = await fetch("https://goalify.develotion.com/paises.php");
    let body = await response.json();

    let html = ``;
    for (let p of body.paises) {
      html += `
            <ion-select-option value="${p.id}">${p.name}</ion-select-option>
            `;
    }
    document.querySelector("#slcRegistroPais").innerHTML = html;
    ApagarLoading();
  } catch (e) {
    ApagarLoading();
    MostrarToast("Error al cargar países", 3000, "error");
  }
}

let loading = document.createElement("ion-loading");
function PrenderLoading(texto) {
  document.body.appendChild(loading);
  loading.cssClass = "my-custom-class";
  loading.message = texto;
  //loading.duration = 2000;
  loading.present();
}

function ApagarLoading() {
  loading.dismiss();
}

function Alertar(titulo, subtitulo, mensaje) {
  const alert = document.createElement("ion-alert");
  alert.cssClass = "my-custom-class";
  alert.header = titulo;
  alert.subHeader = subtitulo;
  alert.message = mensaje;
  alert.buttons = ["OK"];
  document.body.appendChild(alert);
  alert.present();
}

function MostrarToast(mensaje, duracion, tipo) {
  const toast = document.createElement("ion-toast");

  toast.message = mensaje;
  toast.duration = duracion;

  if (tipo === "exito") {
    toast.color = "success";
    toast.icon = "checkmark-circle-outline";
  } else if (tipo === "error") {
    toast.color = "danger";
    toast.icon = "close-circle-outline";
  } else if (tipo === "aviso") {
    toast.color = "warning";
    toast.icon = "alert-circle-outline";
  }

  document.body.appendChild(toast);
  toast.present();
}

async function TomarDatosRegistro() {
  // Función para validar datos
  function DatosValidos(u, p, c) {
    if (!u || u.trim() === "") {
      MostrarToast("El nombre de usuario no puede estar vacío", 3000, "aviso");
      return false;
    }
    if (!c || c.trim() === "") {
      MostrarToast("La contraseña no puede estar vacía", 3000, "aviso");
      return false;
    }
    if (!p) {
      MostrarToast("Debe seleccionar un país", 3000, "aviso");
      return false;
    }
    return true;
  }

  var u = document.querySelector("#txtRegistroUsuario").value;
  var c = document.querySelector("#txtRegistroPassword").value;
  var p = document.querySelector("#slcRegistroPais").value;

  if (DatosValidos(u, p, c)) {
    try {
      var registroObj = new Object();
      registroObj.usuario = u;
      registroObj.password = c;
      registroObj.idPais = p;
      PrenderLoading("Registrando Usuario...");

      var response = await fetch(URLBASE + "usuarios.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registroObj),
      });

      var body = await response.json();
      if (body.codigo == 200) {
        MostrarToast("Usuario creado con éxito", 3000, "exito");
        ApagarLoading();
        LoginAutomatico(u, c);
      } else {
        MostrarToast("Error en los datos", 3000, "error");
        ApagarLoading();
      }
    } catch (e) {
      ApagarLoading();
      Alertar("Error", "Alta de usuario", "Error en la conexión o servidor.");
    }
  }
}

async function LoginAutomatico(usuario, password) {
  try {
    PrenderLoading("Iniciando sesión...");
    var loginObj = new Object();
    loginObj.usuario = usuario;
    loginObj.password = password;

    var response = await fetch(URLBASE + "login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginObj),
    });

    var body = await response.json();

    if (body.codigo == 200) {
      localStorage.setItem("token", body.token);
      localStorage.setItem("usuario", body.usuario);
      localStorage.setItem("password", body.password);
      localStorage.setItem("iduser", body.id);
      MostrarToast("Cuenta creada y sesión iniciada con éxito", 3000, "exito");
      ArmarMenu();
      NAV.push("page-home");
    } else {
      MostrarToast("Error al iniciar sesión", 3000, "error");
    }
    ApagarLoading();
  } catch (e) {
    ApagarLoading();
    Alertar("Error", "Login automático", "Error en la conexión o servidor.");
  }
}

async function TomarDatosLogin() {
  let u = document.querySelector("#txtLoginUsuario").value;
  let c = document.querySelector("#txtLoginPassword").value;

  let loginObj = new Object();
  loginObj.usuario = u;
  loginObj.password = c;

  try {
    PrenderLoading("Iniciando sesión...");
    let response = await fetch(`${URLBASE}login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginObj),
    });

    let body = await response.json();

    if (body.codigo == 200) {
      localStorage.setItem("token", body.token);
      localStorage.setItem("usuario", body.usuario);
      localStorage.setItem("password", body.password);
      localStorage.setItem("iduser", body.id);
      console.log("Token:", body.token);
      console.log("iduser:", body.id);
      MostrarToast("Login exitoso", 3000, "exito");
      ApagarLoading();
      ArmarMenu();
      NAV.push("page-home");
    } else {
      MostrarToast("Error en los datos", 3000, "error");
      ApagarLoading();
    }
  } catch (e) {
    ApagarLoading();
    Alertar("Error", "Login", "Error en la conexión o servidor.", "error");
  }
}

function Logout() {
  localStorage.clear();
  ArmarMenu();
  NAV.push("page-home");
  CerrarMenu();
}

const rangoCalificacion = document.querySelector("#rangoCalificacion");
rangoCalificacion.addEventListener("ionChange", (event) => {
  console.log("Valor de calificación:", event.target.value);
});

async function PoblarSelectObjetivos() {
  let token = localStorage.getItem("token");
  let iduser = localStorage.getItem("iduser");
  let response = await fetch("https://goalify.develotion.com/objetivos.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
      iduser: iduser,
    },
  });
  if (response.status == 401) {
    MostrarToast("No autorizado para cargar objetivos", 3000, "aviso");
    return;
  }
  let body = await response.json();

  if (!body.objetivos) {
    MostrarToast("No se encontraron objetivos", 3000, "error");
    return;
  }

  let html = ``;
  for (let o of body.objetivos) {
    html += `
    <ion-select-option value="${o.id}">${o.emoji} ${o.nombre}</ion-select-option>
    `;
  }
  document.querySelector("#slcAgregarObjetivo").innerHTML = html;
}

async function ObtenerEvaluaciones() {
  let token = localStorage.getItem("token");
  let iduser = localStorage.getItem("iduser");
  if (!token) {
    MostrarToast("Debe iniciar sesión para ver evaluaciones", 3000, "aviso");
    return;
  }

  let response = await fetch(`${URLBASE}evaluaciones.php?idUsuario=${iduser}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
      iduser: iduser,
    },
  });
  let body = await response.json();
  console.log("Evaluaciones recibidas:", body);
  return body.evaluaciones;
}

async function ListarEvaluaciones(filtro) {
  try {
    PrenderLoading("Buscando evaluaciones...");
    let evaluaciones = await ObtenerEvaluaciones();
    ApagarLoading();

    if (!evaluaciones || !evaluaciones.length) {
      MostrarToast("No se encontraron evaluaciones", 3000, "error");
      ApagarLoading();
      return;
    }

    // Obtener objetivos para sacar emojis
    let objetivosResponse = await fetch(
      "https://goalify.develotion.com/objetivos.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          iduser: localStorage.getItem("iduser"),
        },
      }
    );
    let objetivosBody = await objetivosResponse.json();
    let objetivos = objetivosBody.objetivos;
    let html = ``;
    for (var i = 0; i < evaluaciones.length; i++) {
      var e = evaluaciones[i];
      // Buscar el objetivo correspondiente para obtener el emoji
      var objetivo = objetivos.find(function (o) {
        return o.id === e.idObjetivo;
      });
      var emoji = objetivo ? objetivo.emoji : "";

      html += `
        <ion-item-sliding>
          <ion-item-options side="start">
            <ion-item-option id="Eli${e.id}" color="danger" onclick="EliminarEvaluaciones(this.id)">Eliminar</ion-item-option>
          </ion-item-options>
          <ion-item>
            <ion-label>
              <h2>${emoji} Objetivo ID: ${e.idObjetivo}</h2>
              <p>Fecha: ${e.fecha}</p>
              <p>Calificación: ${e.calificacion}</p>
            </ion-label>
          </ion-item>
        </ion-item-sliding>
      `;
    }
    document.querySelector("#listar-evaluaciones").innerHTML = html;
    ApagarLoading();
  } catch (error) {
    ApagarLoading();
    MostrarToast("Error al cargar evaluaciones", 3000, "error");
  }
}

async function EliminarEvaluaciones(idE) {
  let token = localStorage.getItem("token");
  let iduser = localStorage.getItem("iduser");

  // Extrae solo el número quitando 'Eli'
  let idNumerico = idE.replace("Eli", "");

  try {
    PrenderLoading("Eliminando evaluación...");

    let response = await fetch(
      `${URLBASE}evaluaciones.php?idEvaluacion=${idNumerico}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
          iduser: iduser,
        },
        // NO body JSON porque si no, no funciona
      }
    );

    let result = await response.json();
    ApagarLoading();

    if (result.codigo === 200) {
      MostrarToast("Evaluación eliminada con éxito", 3000, "exito");
      await ListarEvaluaciones();
    } else {
      MostrarToast(
        "Error al eliminar evaluación: " + (result.mensaje || ""),
        3000,
        "error"
      );
    }
  } catch (error) {
    ApagarLoading();
    MostrarToast(
      "Error en la conexión para eliminar evaluación",
      3000,
      "error"
    );
  }
}

// Función para filtrar las evaluaciones según la opción seleccionada
function filtrarEvaluacionesPorFecha(evaluaciones, filtro) {
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  var fechaLimite = new Date(hoy);

  if (filtro === "ultimaSemana") {
    fechaLimite.setDate(hoy.getDate() - 7);
  } else if (filtro === "ultimoMes") {
    fechaLimite.setMonth(hoy.getMonth() - 1);
  } else if (filtro === "todo") {
    return evaluaciones;
  }

  var evaluacionesFiltradas = [];
  for (var i = 0; i < evaluaciones.length; i++) {
    var e = evaluaciones[i];
    var fechaEval = new Date(e.fecha);
    fechaEval.setHours(0, 0, 0, 0);
    if (fechaEval >= fechaLimite && fechaEval <= hoy) {
      evaluacionesFiltradas.push(e);
    }
  }
  return evaluacionesFiltradas;
}

// Función para crear el filtro en la pantalla de evaluaciones
function CrearFiltroFechas() {
  var filtroContenedor = document.querySelector("#filtro-fechas");
  if (!filtroContenedor) {
    filtroContenedor = document.createElement("div");
    filtroContenedor.id = "filtro-fechas";
    var padre = document.querySelector("#slcFiltroFechas");
    padre.appendChild(filtroContenedor);
  }

  var html =
    "" +
    '<ion-select label="Filtrar por fecha:" id="selectFiltroFecha" >' +
    '<ion-select-option value="todo">Todas</ion-select-option>' +
    '<ion-select-option value="ultimaSemana">Última semana</ion-select-option>' +
    '<ion-select-option value="ultimoMes">Último mes</ion-select-option>' +
    "</ion-select>";

  filtroContenedor.innerHTML = html;

  var selectFiltro = document.querySelector("#selectFiltroFecha");
  selectFiltro.value = "todo";

  selectFiltro.addEventListener("ionChange", function (event) {
    ListarEvaluaciones(event.target.value);
  });
}

function InicializarFiltroFechas() {
  var selectFiltro = document.querySelector("#slcFiltrarEvaluaciones");
  if (!selectFiltro) {
    console.error("No se encontró el ion-select para filtro de fechas.");
    return;
  }
  selectFiltro.innerHTML =
    "" +
    '<ion-select-option value="todo">Todo el histórico</ion-select-option>' +
    '<ion-select-option value="ultimaSemana">Última semana</ion-select-option>' +
    '<ion-select-option value="ultimoMes">Último mes</ion-select-option>';

  // Establecer valor por defecto
  selectFiltro.value = "todo";

  //Forzar actualización visual en Ionic
  selectFiltro.interface = "popover";
  selectFiltro.placeholder = "Filtrar por fecha";

  selectFiltro.addEventListener("ionChange", function (event) {
    console.log("Filtro elegido:", event.target.value);
    ListarEvaluaciones(event.target.value);
  });
}

async function ListarEvaluaciones(filtro) {
  if (!filtro) {
    filtro = "todo";
  }

  try {
    PrenderLoading("Buscando evaluaciones...");
    var evaluaciones = await ObtenerEvaluaciones();
    ApagarLoading();

    if (!evaluaciones || evaluaciones.length === 0) {
      MostrarToast("No se encontraron evaluaciones", 3000, "error");
      document.querySelector("#listar-evaluaciones").innerHTML = "";
      return;
    }

    evaluaciones = filtrarEvaluacionesPorFecha(evaluaciones, filtro);

    // Obtener objetivos para mostrar emojis
    var token = localStorage.getItem("token");
    var iduser = localStorage.getItem("iduser");
    var response = await fetch("https://goalify.develotion.com/objetivos.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
        iduser: iduser,
      },
    });
    var body = await response.json();
    var objetivos = body.objetivos || [];

    var html = "";
    for (var i = 0; i < evaluaciones.length; i++) {
      var e = evaluaciones[i];
      var emoji = "";
      for (var j = 0; j < objetivos.length; j++) {
        if (objetivos[j].id === e.idObjetivo) {
          emoji = objetivos[j].emoji;
          break;
        }
      }

      html +=
        "" +
        "<ion-item-sliding>" +
        '<ion-item-options side="start">' +
        '<ion-item-option id="Eli' +
        e.id +
        '" color="danger" onclick="EliminarEvaluaciones(this.id)">Eliminar</ion-item-option>' +
        "</ion-item-options>" +
        "<ion-item>" +
        "<ion-label>" +
        "<h2>" +
        emoji +
        " Objetivo ID: " +
        e.idObjetivo +
        "</h2>" +
        "<p>Fecha: " +
        e.fecha +
        "</p>" +
        "<p>Calificación: " +
        e.calificacion +
        "</p>" +
        "</ion-label>" +
        "</ion-item>" +
        "</ion-item-sliding>";
    }

    document.querySelector("#listar-evaluaciones").innerHTML = html;
  } catch (error) {
    ApagarLoading();
    MostrarToast("Error al cargar evaluaciones", 3000, "error");
  }
}

async function AgregarEvaluacion() {
  let objetivo = document.querySelector("#slcAgregarObjetivo").value;
  let calificacion = document.querySelector("#rangoCalificacion").value;
  let datetime = document.querySelector("#datetime");
  let fecha = datetime ? datetime.value : null;

  if (!objetivo) {
    MostrarToast("Debe seleccionar un objetivo", 3000, "aviso");
    return;
  }
  if (calificacion === null || calificacion === "") {
    MostrarToast("Debe seleccionar una calificación", 3000, "aviso");
    return;
  }
  if (!fecha) {
    MostrarToast("Debe seleccionar una fecha", 3000, "aviso");
    return;
  }

  // Extraer solo la parte fecha (YYYY-MM-DD)
  let fechaSolo = fecha.split("T")[0];
  // Validar que fecha no sea futura
  let fechaSeleccionada = new Date(fecha);
  fechaSeleccionada.setHours(0, 0, 0, 0);
  let hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaSeleccionada > hoy) {
    MostrarToast("La fecha no puede ser posterior a hoy", 3000, "aviso");
    return;
  }

  let token = localStorage.getItem("token");
  let iduser = localStorage.getItem("iduser");

  if (!token || !iduser) {
    MostrarToast(
      "Debe iniciar sesión para agregar evaluaciones",
      3000,
      "aviso"
    );
    return;
  }
  console.log("Fecha seleccionada para evaluación:", fechaSolo);

  // Objeto a enviar
  let evaluacionObj = {
    idObjetivo: objetivo,
    calificacion: parseInt(calificacion),
    fecha: fechaSolo,
    idUsuario: iduser,
  };

  try {
    PrenderLoading("Agregando evaluación...");
    let response = await fetch(`${URLBASE}evaluaciones.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
        iduser: iduser,
      },
      body: JSON.stringify(evaluacionObj),
    });

    let body = await response.json();

    if (body.codigo === 200) {
      MostrarToast("Evaluación agregada exitosamente", 3000, "exito");
      document.querySelector("#slcAgregarObjetivo").value = "";
      document.querySelector("#rangoCalificacion").value = null;
      document.querySelector("#datetime").value = "";
      await ListarEvaluaciones(); // Refrescar lista justo después de agregar
    } else {
      MostrarToast("Error al agregar evaluación", 3000, "error");
    }

    ApagarLoading();
  } catch (e) {
    ApagarLoading();
    Alertar(
      "Error",
      "Agregar evaluación",
      "Error en la conexión o servidor.",
      "error"
    );
  }
}

async function MostrarInformeObjetivos() {
  var token = localStorage.getItem("token");
  var iduser = localStorage.getItem("iduser");

  if (!token || !iduser) {
    MostrarToast("Debes iniciar sesión para ver el informe", 3000, "aviso");
    return;
  }

  PrenderLoading("Cargando estadísticas...");

  try {
    // Obtener todas las evaluaciones del usuario
    var evaluaciones = await ObtenerEvaluaciones();

    if (!evaluaciones || evaluaciones.length === 0) {
      ApagarLoading();
      document.getElementById("puntaje-global").textContent =
        "No hay evaluaciones para mostrar.";
      document.getElementById("puntaje-diario").textContent =
        "No hay evaluaciones para mostrar.";
      return;
    }

    var sumaGlobal = 0;
    var cantidadGlobal = 0;
    var sumaDiaria = 0;
    var cantidadDiaria = 0;

    // Obtener fecha de hoy en formato YYYY-MM-DD
    var hoy = new Date();
    var anioHoy = hoy.getFullYear();
    var mesHoy = hoy.getMonth() + 1; // mes comienza en 0
    var diaHoy = hoy.getDate();

    // Función simple para formato 'YYYY-MM-DD' con ceros a la izquierda
    function formatoFecha(date) {
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      return date.getFullYear() + "-" + m + "-" + d;
    }
    console.log("Evaluaciones recibidas para informe:");
    evaluaciones.forEach(function (ev) {
      console.log("Fecha:", ev.fecha, "Calificación:", ev.calificacion);
    });

    var hoyStr = formatoFecha(hoy);

    for (var i = 0; i < evaluaciones.length; i++) {
      var e = evaluaciones[i];
      var calificacion = parseInt(e.calificacion, 10);

      if (!isNaN(calificacion)) {
        sumaGlobal += calificacion;
        cantidadGlobal++;

        // La fecha en e.fecha viene en 'YYYY-MM-DD', comparamos con hoyStr directamente
        if (e.fecha === hoyStr) {
          sumaDiaria += calificacion;
          cantidadDiaria++;
        }
      }
    }

    var promedioGlobal =
      cantidadGlobal > 0 ? (sumaGlobal / cantidadGlobal).toFixed(2) : "N/A";
    var promedioDiario =
      cantidadDiaria > 0 ? (sumaDiaria / cantidadDiaria).toFixed(2) : "N/A";

    document.getElementById("puntaje-global").textContent = promedioGlobal;
    document.getElementById("puntaje-diario").textContent = promedioDiario;

    ApagarLoading();
  } catch (error) {
    ApagarLoading();
    MostrarToast("Error al cargar informe", 3000, "error");
    document.getElementById("puntaje-global").textContent = "Error al cargar";
    document.getElementById("puntaje-diario").textContent = "Error al cargar";
  }
}

//gps
navigator.geolocation.getCurrentPosition(SetearCoordenadas);

function SetearCoordenadas(position) {
  console.log(position);
}

//MAPA

function CargarMapa() {
  setTimeout(function () {
    CrearMapa();
  }, 500);
}

var map = null;
function CrearMapa() {
  if (map != null) {
    map.remove();
  }

  map = L.map("map").setView([-34.89458987251908, -56.15295883918693], 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var marker = L.marker([-34.89458987251908, -56.15295883918693])
    .addTo(map)
    .bindPopup("Estadio Centenario");

  var circle = L.circle([-34.89458987251908, -56.15295883918693], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
  }).addTo(map);

  var polygon = L.polygon([
    [-34.82114756785866, -56.21183140917086],
    [-34.84943878427799, -56.157401877435056],
    [-34.905817959825484, -56.17113693785857],
  ]).addTo(map);
  map.on("click", capturarCursor);
}

function capturarCursor(e) {
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

async function PoblarMapa() {
  let token = localStorage.getItem("token");
  let iduser = localStorage.getItem("iduser");

  try {
    PrenderLoading("Cargando mapa y datos...");

    let responsePaises = await fetch(
      "https://goalify.develotion.com/paises.php"
    );
    let dataPaises = await responsePaises.json();
    let listaPaises = dataPaises.paises;

    let responseUsuarios = await fetch(
      "https://goalify.develotion.com/usuariosPorPais.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          iduser: iduser,
        },
      }
    );
    if (responseUsuarios.status === 401) {
      ApagarLoading();
      MostrarToast(
        "No autorizado para cargar usuarios por país",
        3000,
        "aviso"
      );
      return;
    }
    let dataUsuarios = await responseUsuarios.json();
    let listaUsuarios = dataUsuarios.paises;

    if (map != null) {
      map.remove();
    }

    // Crear mapa
    map = L.map("map").setView([-20, -60], 3);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      minZoom: 1,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Agregar marcadores
    for (var i = 0; i < listaPaises.length; i++) {
      var pais = listaPaises[i];
      var cantidad = 0;
      for (var j = 0; j < listaUsuarios.length; j++) {
        if (listaUsuarios[j].id === pais.id) {
          cantidad = listaUsuarios[j].cantidadDeUsuarios;
          break;
        }
      }
      var marcador = L.marker([pais.latitude, pais.longitude])
        .addTo(map)
        .bindPopup(pais.name + ": " + cantidad + " usuarios");
    }
    setTimeout(function () {
      map.invalidateSize();
    }, 200);

    ApagarLoading();
  } catch (e) {
    ApagarLoading();
    MostrarToast("Error al cargar mapa o datos", 3000, "error");
  }
}
