# Frontend - Biblioteca Digital

Este es el frontend de la aplicación **Funny Library**, desarrollado en **Angular 20.1.6**. Permite la gestión de usuarios, libros y préstamos de una biblioteca, interactuando con el backend mediante una API REST.

## Requisitos previos

- Tener instalado [Node.js](https://nodejs.org/) y [Angular CLI](https://angular.dev/tools/cli).
- Es **necesario** que el backend de Funny Library esté en ejecución antes de iniciar el frontend, ya que todas las operaciones dependen de la API.

## Instalación

1. Clona el repositorio y navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Levantar el servidor de desarrollo

1. Asegúrate de que el backend esté corriendo (por ejemplo, en `http://localhost:3000`).
2. Inicia el servidor de Angular:
   ```bash
   ng serve
   ```
3. Abre tu navegador en [http://localhost:4200](http://localhost:4200).

La aplicación se recargará automáticamente al detectar cambios en los archivos fuente.

## Estructura de rutas principales

La aplicación utiliza rutas protegidas según el rol del usuario:

- `/login`: Página de inicio de sesión.
- `/register`: Registro de nuevos usuarios.
- `/forget-password`: Recuperación de contraseña.
- `/main`: Página principal, muestra los libros y permite a los usuarios prestar libros.
- `/maintenances`: Acceso solo para administradores. Permite gestionar:
  - `/maintenances/users`: CRUD de usuarios.
  - `/maintenances/books`: CRUD de libros.
  - `/maintenances/loans`: CRUD de préstamos.

> **Nota:** Solo los usuarios con rol `admin` pueden acceder a las rutas de mantenimiento.

## Dependencia con el backend

El frontend consume la API REST del backend para todas las operaciones. Si el backend no está disponible, la aplicación no funcionará correctamente.

## Scripts útiles

- `ng serve`: Levanta el servidor de desarrollo.
- `ng build`: Compila la aplicación para producción.
- `ng test`: Ejecuta los tests unitarios.

## Recursos adicionales

- [Documentación oficial de Angular CLI](https://angular.dev/tools/cli)


