# Biblioteca Ducky

Proyecto final de Arquitectura de Software — **Manuel Bonavena (625440)**.

Aplicación web para gestionar el catálogo de libros de una biblioteca universitaria. Permite a usuarios autenticados listar, ver el detalle, dar de alta, editar y eliminar libros.

## Stack

**Backend**
- Node.js + [Express 5](https://expressjs.com/)
- PostgreSQL (alojado en [Neon Cloud](https://neon.tech))
- `pg` — cliente oficial de PostgreSQL para Node
- `bcryptjs` — hashing de contraseñas
- `cors` — habilitar pedidos del frontend
- `dotenv` — variables de entorno

**Frontend**
- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- Patrón MVC en el cliente: `controllers/`, `models/`, `views/`, `utils/`
- `fetch` API para hablar con el backend

## Estructura del proyecto

```
backend/
├── controllers/       # Handlers HTTP (auth, libros)
├── models/            # Acceso a la BD (libros, usuarios)
├── routes/            # Definición de endpoints Express
├── utils/             # Validadores
├── frontend/          # Cliente web (servir como archivos estáticos)
│   ├── *.html         # 5 pantallas: login, catálogo, detalle, alta, edición
│   ├── css/
│   ├── js/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── views/
│   │   └── utils/
│   └── imagenes_recortadas/   # Portadas de los libros
├── db.js              # Pool de conexión a PostgreSQL
├── server.js          # Punto de entrada (puerto 3000)
└── package.json
```

## Cómo correrlo

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/ManuelBonavena/ArqSoftware.git
cd ArqSoftware
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz copiando `.env.example`:

```bash
cp .env.example .env
```

Y completar con la cadena de conexión de Neon (pedírsela a Manu). Ejemplo:

```
DATABASE_URL=postgresql://usuario:password@host.neon.tech/neondb?sslmode=require
```

### 3. Levantar el backend

```bash
npm start
```

Si todo está bien, en consola tiene que aparecer:

```
Servidor corriendo en puerto 3000
Conectado a la BD: <fecha>
```

### 4. Abrir el frontend

Abrir cualquier archivo `.html` de `frontend/` en el navegador (por ejemplo `frontend/login.html`). El frontend pega contra `http://localhost:3000`, así que el backend tiene que estar levantado.

> **Tip**: si abrir el HTML directo da problemas de CORS, usar la extensión *Live Server* de VSCode sobre la carpeta `frontend/`.

## Endpoints del backend

Todos devuelven JSON. La identidad del libro es el **ISBN**.

| Método | Ruta              | Descripción                          | Códigos                    |
|--------|-------------------|--------------------------------------|----------------------------|
| POST   | `/login`          | Autenticar usuario                   | 200 / 400 / 401 / 500      |
| GET    | `/libros`         | Listar todos los libros              | 200 / 500                  |
| GET    | `/libros/:isbn`   | Obtener un libro por ISBN            | 200 / 404 / 500            |
| POST   | `/libros`         | Crear un libro                       | 201 / 400 / 409 / 500      |
| PUT    | `/libros/:isbn`   | Actualizar un libro (ISBN no cambia) | 200 / 400 / 404 / 500      |
| DELETE | `/libros/:isbn`   | Eliminar un libro                    | 200 / 404 / 500            |

### Funciones principales

**`controllers/authController.js`**
- `login(req, res)` — valida payload, busca el usuario, compara la contraseña con el hash bcrypt y responde con los datos básicos del usuario o el error correspondiente.

**`controllers/libroController.js`**
- `get_libros` — lista todos los libros.
- `get_libro_by_isbn` — devuelve uno por ISBN (404 si no existe).
- `create_libro` — alta de libro. Verifica ISBN duplicado antes del insert (409).
- `update_libro` — modifica los datos de un libro existente.
- `delete_libro` — borra el libro. Es irreversible.

**`models/libroModel.js`** — encapsula todo el SQL contra la tabla `libros` (`get_all`, `find_by_isbn`, `exists`, `create`, `update`, `remove`).

**`models/usuarioModel.js`** — busca usuarios por username.

**`db.js`** — exporta un único `Pool` de PostgreSQL compartido por todos los modelos.

**Frontend `js/utils/api.js`** — wrapper sobre `fetch` con `Api.get/post/put/del`. Todos los Models del frontend pasan por acá; ninguno llama a `fetch` directo.

## Pantallas (frontend)

| Archivo                    | Descripción                                |
|----------------------------|--------------------------------------------|
| `login.html`               | Inicio de sesión                           |
| `catalogo_libros.html`     | Listado del catálogo                       |
| `detalles_libro.html`      | Detalle de un libro                        |
| `nuevo_libro.html`         | Alta de un libro                           |
| `editar_libro.html`        | Edición de un libro existente              |

## Notas para el equipo

- `.env`, `node_modules/` y `.claude/` están **ignorados** — no los subas.
- Si modifican un endpoint, acuérdense de actualizar también el Model del frontend en `frontend/js/models/`.
- La BD está en Neon (gratis), si se cae o pasa el límite avisen a Manu.
