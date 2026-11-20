# AplicacionesWeb20262Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.3.

## Aplicación desplegada

- **Frontend (Firebase Hosting):** https://aplicaciones-y-servicios-web26.web.app
- **Backend (Render):** https://aplicaciones-web-2026-2-kcfi.onrender.com

El backend gratuito de Render se duerme tras un rato sin uso: la primera
petición puede tardar cerca de un minuto en responder.

Cada merge a `main` compila el frontend y lo publica en Firebase Hosting
(workflow `.github/workflows/firebase-hosting-merge.yml`).

## Cómo ejecutar el frontend en local

Frontend Angular (sidebar + CRUD por entidad) que consume la API del curso.
Entidades: **Vendedores**, **Productos**, **Inventario** y **Clientes** (GET lista,
GET por id, POST, PUT y DELETE).

**URL base del backend:** `https://aplicaciones-web-2026-2-kcfi.onrender.com`
(se configura en un solo lugar: `src/environments/environment.ts`, campo `apiUrl`).

### Requisitos

- Node.js 20 o superior y npm.
- El backend del curso con CORS habilitado para `http://localhost:4200`
  (repositorio [Aplicaciones-web-2026-2](https://github.com/thecont15/Aplicaciones-web-2026-2)).

### Pasos

1. Instalar dependencias (una sola vez, en esta carpeta):

   ```bash
   npm install
   ```

2. Iniciar Angular:

   ```bash
   npm start
   ```

3. Abrir `http://localhost:4200/` y entrar a **Productos** en el menú lateral.

Si prefieres usar un backend local, levántalo con
`uvicorn src.main:app --host 127.0.0.1 --port 8000` y cambia `apiUrl` a
`http://127.0.0.1:8000` en `src/environments/environment.ts`.

Si la API no está encendida, la pantalla muestra
"No hubo conexión con el servidor" y no se muestran datos.

### Despliegue manual (opcional)

```bash
npm run build
npx firebase-tools deploy --only hosting
```

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
