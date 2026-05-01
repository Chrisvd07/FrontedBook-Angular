# fronted Angular

Aplicación web desarrollada en Angular 19 para la gestión de libros y autores. Este frontend consume una API REST en .NET que actúa como intermediario con una API externa (FakeRestAPI).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu equipo:
- [Node.js](https://nodejs.org/) (Se recomienda la versión 18 o superior).
- [Angular CLI](https://angular.io/cli) (Puedes instalarlo con `npm install -g @angular/cli`).

## Guía de Instalación

1. **Abrir el proyecto**: Localiza la carpeta `book-frontend` en tu terminal o editor de código.
2. **Instalar dependencias**: Ejecuta el siguiente comando para descargar todas las librerías necesarias:
   ```bash
   npm install
   ```

##  Cómo Ejecutar la Aplicación

Para iniciar el servidor local de desarrollo, usa el comando:
```bash
npm start
```
Una vez iniciado, abre tu navegador en: `http://localhost:4200/`.

> **Importante:** Para que la aplicación muestre datos, el servidor backend (API .NET) debe estar encendido y corriendo en la dirección `https://localhost:7278`.


##  Funciones Principales

- **Gestión de Libros**: Registro, edición y eliminación de libros con campos técnicos (Páginas, Resumen, Fecha).
- **Relación Automática**: El sistema vincula cada libro con su autor correspondiente de forma inteligente.
- **Directorio de Autores**: Visualización organizada de autores con el número total de sus obras publicadas.
- **Diseño Adaptable**: Interfaz optimizada para trabajar cómodamente en cualquier dispositivo.
- **Notificaciones**: Sistema de mensajes (SnackBars) que confirman cada acción realizada por el usuario.

---
