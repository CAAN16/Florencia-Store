# 👗 Florencia — Catálogo Web de Moda Femenina

Florencia es un sistema web de catálogo y gestión comercial diseñado para tiendas de accesorios, ropa y calzado para niñas, jóvenes y mujeres. El sistema consta de un frontend interactivo construido en **Next.js 16 + TypeScript + TailwindCSS v4** y un backend API REST robusto construido en **PHP 8+ y MySQL**.

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), TypeScript, TailwindCSS v4, Framer Motion, Lucide Icons.
- **Backend**: PHP 8+, PDO (Consultas preparadas, prepared statements).
- **Base de Datos**: MySQL (utf8mb4 para compatibilidad total con emojis y acentos del español).
- **Servidor Web Local Recomendado**: XAMPP, WAMP, Laragon o Apache local.

---

## ⚙️ Requisitos del Sistema

- **Node.js** v18 o superior.
- **PHP** v8.0 o superior (con extensión `pdo_mysql` habilitada).
- **MySQL/MariaDB** v5.7 o superior.
- **Servidor Apache** (incluido en XAMPP/Laragon) para hospedar el backend.

---

## 🚀 Instalación y Configuración Local

### 1. Configurar la Base de Datos

1. Abre tu panel de control de bases de datos (ej. phpMyAdmin en `http://localhost/phpmyadmin`).
2. Crea una nueva base de datos llamada **`florencia_db`** con el cotejamiento `utf8mb4_unicode_ci`.
3. Importa el archivo SQL de la base de datos ubicado en:
   `database/schema.sql`
   *(Esto creará la estructura de tablas e insertará los 12 productos del catálogo con sus categorías y datos iniciales de prueba)*.

### 2. Configurar el Backend PHP

1. Copia o mueve la carpeta `/backend/` al directorio de documentos de tu servidor web:
   - **XAMPP**: `C:\xampp\htdocs\florencia-store\backend`
   - **Laragon**: `C:\laragon\www\florencia-store\backend`
2. Verifica que el archivo `backend/.env` tenga las credenciales correctas de tu base de datos local:
   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=florencia_db
   DB_USER=root
   DB_PASS=
   FRONTEND_URL=http://localhost:3000
   ```
3. Asegúrate de habilitar los permisos de escritura en la carpeta `backend/uploads/productos/` para permitir la carga de imágenes.

### 3. Configurar el Frontend Next.js

1. Abre una terminal en la raíz del proyecto (`/florencia-store/`).
2. Instala las dependencias necesarias:
   ```bash
   pnpm install
   # o bien: npm install / yarn install
   ```
3. Configura las variables de entorno creando un archivo `.env.local` en la raíz del proyecto (ya creado por defecto):
   ```ini
   NEXT_PUBLIC_API_URL=http://localhost/florencia-store/backend
   ```
4. Inicia el servidor de desarrollo del frontend:
   ```bash
   pnpm dev
   # o bien: npm run dev
   ```
5. Abre en tu navegador la URL: `http://localhost:3000`.

---

## 🔑 Credenciales de Prueba

Para probar el panel administrativo y la simulación de compras, puedes usar los siguientes usuarios seed:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@florencia.com` | `admin123` |
| **Cliente** | `maria@ejemplo.com` | `cliente123` |

---

## 🗄️ Diagrama de la Base de Datos

![Diagrama ER](database/Diagrama%20ER%20Base%20de%20Datos%20florencia_db.png)

---

## 📂 Estructura Principal del Proyecto

```
/florencia-store/
├── app/               # Páginas y vistas principales (Next.js App Router)
├── backend/           # Lógica PHP API REST
│   ├── api/           # Endpoints organizados por recursos (auth, products, contact, newsletter)
│   ├── config/        # Configuración de base de datos y env loader
│   ├── middleware/    # Autenticación y cabeceras CORS
│   └── models/        # Capa de Acceso a Datos (UserModel, ProductModel, etc.)
├── components/        # Componentes UI de React y layouts
├── contexts/          # Context API de React (carrito, auth, tema)
├── database/          # Esquema SQL y Diagrama ER (formato Mermaid)
├── services/          # Clientes de API REST en TypeScript
└── public/            # Assets estáticos
```

---

## 🔒 Endpoints Disponibles (API REST)

### Autenticación
- **POST** `/api/auth/login.php` - Iniciar sesión de usuario (Sesión PHP)
- **POST** `/api/auth/register.php` - Registrar un nuevo usuario (rol cliente)
- **POST** `/api/auth/logout.php` - Cerrar sesión y destruir la cookie
- **GET** `/api/auth/session.php` - Obtener información del usuario autenticado actual

### Catálogo de Productos
- **GET** `/api/products/index.php` - Listar productos (soporta filtros `categoria`, `audiencia` y `busqueda`)
- **POST** `/api/products/index.php` - Crear un producto *(Requiere Rol Admin)*
- **GET** `/api/products/detail.php?id={id}` - Obtener detalles de un producto
- **PUT** `/api/products/detail.php?id={id}` - Actualizar un producto *(Requiere Rol Admin)*
- **DELETE** `/api/products/detail.php?id={id}` - Eliminar (desactivado lógico) un producto *(Requiere Rol Admin)*
- **POST** `/api/products/upload-image.php` - Subir una imagen al servidor *(Requiere Rol Admin)*

### Formulario de Contacto
- **POST** `/api/contact/index.php` - Enviar mensaje desde el formulario
- **GET** `/api/contact/index.php` - Listar mensajes de contacto recibidos *(Requiere Rol Admin)*

### Newsletter / Boletín
- **POST** `/api/newsletter/index.php` - Suscribir un correo electrónico
- **GET** `/api/newsletter/index.php` - Listar todos los suscriptores activos *(Requiere Rol Admin)*
