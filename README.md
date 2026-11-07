# AplicacionesWeb20262Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.3.

## Cómo ejecutar el frontend en local

Frontend Angular (sidebar + CRUD por entidad) que consume la API del curso.
Entidades: **Vendedores**, **Productos** y **Clientes** (`/clientes`: GET lista, GET por id,
POST, PUT y DELETE).

**URL base del backend:** `http://127.0.0.1:8000`
(se configura en un solo lugar: `src/environments/environment.ts`, campo `apiUrl`).

### Requisitos

- Node.js 20 o superior y npm.
- El backend del curso en marcha con CORS habilitado para `http://localhost:4200`
  (repositorio [Aplicaciones-web-2026-2](https://github.com/thecont15/Aplicaciones-web-2026-2)).

### Pasos

1. Levantar el backend (en la carpeta del repositorio del backend):

   ```bash
   uvicorn src.main:app --host 127.0.0.1 --port 8000
   ```

2. Instalar dependencias del frontend (una sola vez, en esta carpeta):

   ```bash
   npm install
   ```

3. Iniciar Angular:

   ```bash
   npm start
   ```

4. Abrir `http://localhost:4200/` y navegar a la entidad deseada (**Clientes**, **Productos** o **Vendedores**) en el menú lateral.

Si la API no está encendida, la pantalla muestra
"No hubo conexión con el servidor" y no se muestran datos.
Si el backend corre en otra dirección, cambia `apiUrl` en
`src/environments/environment.ts` y reinicia `npm start`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
