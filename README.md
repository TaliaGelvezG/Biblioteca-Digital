# Biblioteca Digital

Este proyecto es una aplicación web completa que incluye un **backend** (Node.js + Express + MongoDB) y un **frontend** (Angular). Permite la gestión de usuarios, libros y préstamos de una biblioteca.

## Descripción General

La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre usuarios, libros y préstamos. El acceso a las funcionalidades depende del rol del usuario autenticado:

- **Administrador:** Puede administrar usuarios, libros y préstamos (CRUD completo).
- **Usuario estándar:** Solo puede prestar libros disponibles.

## Funcionalidades principales

- **Autenticación y autorización de usuarios** (con JWT).
- **CRUD de usuarios:** registro, edición, eliminación y listado.
- **CRUD de libros:** agregar, editar, eliminar y listar libros.
- **CRUD de préstamos:** registrar, editar, eliminar y listar préstamos de libros.
- **Interfaz web amigable** para la gestión y préstamo de libros.
- **Roles de usuario** para controlar el acceso a las funcionalidades administrativas.

## Estructura del proyecto

- `backend/`: Código fuente del backend (API REST, modelos, controladores, middlewares).
- `frontend/`: Código fuente del frontend (Angular).
- `biblioteca-digital.postman_collection.json`: Colección de Postman con ejemplos de peticiones a la API.

## Patrones de diseño aplicados
En el proyecto se aplican diferentes patrones de diseño, entre los más importantes o relevantes aplicados se tienen los siguientes:
-	**Singleton:** Este patrón se aplicó en la conexión de la base de datos, cuyo fin es tener una única instancia de dicha conexión y reutilizarla
-	**Observer:** Este patrón se utilizó cuando se realizaban solicitudes a la base de datos y se esperaba un resultado, por lo tanto, se estaba observando la promesa hasta completarse
-	**Adapter:** Este patrón se utilizó para modificar la salida de las peticiones, ya que la base de datos utilizaba un formato y se modificó para obtener otra salida al front
-	**Proxy:** Este patrón se aplicó más que todo en el front, ya que se tenía un gauard, tipo intercepto que permitía revisar sí el usuario estaba autenticado para poder permitir acciones, así como validar sí el usuario autenticado era admin
-	**Bridge:** Se aplica el patrón bridge cuando se crea un router que más adelante es utilizado para levantar la aplicación, lo que permite que se agregue un interceptor para poder validar en todas las peticiones el token de seguridad

## Patrones de arquitectura
Los patrones de arquitectura utilizados en la aplicación web, tanto para el back como para el front, se describen a continuación:
-	**MVC:** Este patrón de utiliza en el backend, lo que permitió distribuir y disponer todo el código en las tres capas, modelo, vista y controlado, esto permitió fácil organización y gestionar de una mejor manera las dependencias
-	**Monolito – Modular:** Este fue el patrón aplicado a nivel de frontend, se crea una aplicación angular y se distribuye en diferentes módulos, semánticamente asociados al impacto y a lo que le entrega a la aplicación web.
-	**Cliente – Servidor:** Cuando combinamos el backend y el frontend y vemos la aplicación como un todo, en este caso se aplica el patrón de cliente/servidor, siendo el cliente el frontend construido en Angular y el servidor, el backend construido en NodeJS con Express y MongoDB para la persistencia.



## Colección de Postman

Puedes encontrar ejemplos de uso de la API en el archivo [`biblioteca-digital.postman_collection.json`](biblioteca-digital.postman_collection.json).

## Instalación y ejecución

Consulta los README de [backend/README.md](backend/README.md) y [frontend/README.md](frontend/README.md) para instrucciones detalladas sobre cómo instalar dependencias y ejecutar cada parte del proyecto.
