📱 Goalify

Aplicación móvil para el seguimiento y evaluación de objetivos personales, desarrollada como parte del obligatorio de Taller de Desarrollo para Dispositivos Móviles en la Facultad de Ingeniería – ORT Uruguay.

🎯 Descripción

Goalify es un prototipo de aplicación en Ionic (JavaScript puro) que permite a los usuarios registrar, visualizar y analizar autoevaluaciones diarias de sus objetivos.

La persistencia de datos se realiza a través de una API REST externa provista por el equipo docente, con validación y control de errores del lado del cliente.

La aplicación fue diseñada para dispositivos Android, generando un APK instalable.

🚀 Funcionalidades

Registro e inicio de sesión

Creación de usuario con país de residencia.

Token de sesión persistente en localStorage.

Cierre de sesión seguro.

Gestión de autoevaluaciones

Registro de evaluaciones con:

Objetivo asociado (con ícono/emoji).

Calificación entre -5 y 5.

Fecha (hasta el día actual).

Eliminación de evaluaciones.

Listado completo con filtros:

Última semana.

Último mes.

Histórico.

Informes de rendimiento

Puntaje global promedio (todas las evaluaciones).

Puntaje diario promedio (evaluaciones del día actual).

Mapa interactivo

10 países con usuarios registrados.

Markers con tooltips que muestran la cantidad de usuarios por país.

⚙️ Requisitos técnicos

Framework: Ionic (JavaScript puro, sin Angular/React/Vue).

Plataforma destino: Android (APK instalable).

Almacenamiento local: localStorage.

Persistencia remota: API REST docente.

Validación: manejo completo de errores y control de datos desde el cliente.

📦 Entrega del proyecto

Código fuente completo.

APK generado e instalable.

📝 Notas
La API REST utilizada no realiza validaciones; todo el control se implementa desde el lado del cliente.
