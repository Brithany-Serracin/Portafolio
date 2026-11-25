# Portafolio — Brithany Serracín

Sitio estático (HTML + CSS + JS, sin instalar nada). Bilingüe EN/ES con botón para cambiar de idioma.

## Estructura

```
portafolio Bri/
├── index.html                  ← Página principal (perfil, skills, proyectos, experiencia, certificaciones, contacto)
├── proyectos/
│   ├── enterprise-network.html ← Proyecto 01 completo
│   └── _plantilla-proyecto.html← Copia esto para cada proyecto nuevo
├── css/styles.css              ← Colores, tipografías y diseño (variables arriba del archivo)
├── js/main.js                  ← Idioma, menú, globo animado, visor de imágenes (no hace falta tocarlo)
├── assets/
│   ├── img/
│   │   ├── foto-perfil.jpg     ← ⚠️ PON AQUÍ TU FOTO (este nombre exacto)
│   │   ├── og-image.jpg        ← (opcional) imagen que sale al compartir el link, 1200×630
│   │   └── favicon.svg         ← Ícono de la pestaña
│   ├── cv/                     ← CV en inglés y español (el botón descarga el del idioma activo)
│   ├── certs/                  ← Insignias de certificaciones (png)
│   └── projects/
│       └── enterprise-network/ ← Imágenes del proyecto 01
├── _originales/                ← PDFs originales (NO se publican)
├── vercel.json                 ← Configuración de Vercel (URLs limpias + headers de seguridad)
└── .vercelignore
```

## ✅ Lista de cosas por llenar

Abre `index.html` y busca **EDITAR** con Ctrl+F. En resumen:

| Qué | Dónde |
|---|---|
| **Tu foto** | Guárdala como `assets/img/foto-perfil.jpg`. Ideal: cara y hombros, **fondo liso y oscuro**, buena luz, mínimo 900×900 px. En la web publicada se convierte sola en un **retrato de partículas cian** (al abrir el archivo directo en tu PC se ve como foto con filtro cian; es normal). |
| Ubicación (ciudad) | `index.html` → ficha del inicio y sección Contacto (ahora dice "Costa Rica") |
| GitHub | `index.html` → sección Contacto (está comentado) |
| Teléfono | Está oculto a propósito; descoméntalo en Contacto si lo quieres público |
| Insignias de certificaciones | Guarda los PNG en `assets/certs/` y descomenta la línea `<img>` de cada una |
| Links de verificación (Credly / Netacad) | Descomenta `<a class="verify">` en cada certificación |
| Imagen para redes (og-image) | `assets/img/og-image.jpg` y la URL final en el `<head>` de `index.html` |
| Números de la barra de métricas (03 casos · 08 certificaciones · 06 protocolos) | `index.html` → bloque `hero-stats` |
| Más proyectos | Ver abajo |

### Cómo funcionan los dos idiomas
Cada texto está dos veces:
```html
<span lang="en">Download CV</span><span lang="es">Descargar CV</span>
```
Si cambias uno, cambia el otro. El sitio abre en el idioma del navegador de quien lo visita.

### Agregar un proyecto nuevo
1. Duplica `proyectos/_plantilla-proyecto.html` → ej. `proyectos/wireshark-lab.html` (sin espacios ni tildes).
2. Crea `assets/projects/wireshark-lab/` y pon tus capturas ahí.
3. Llena la plantilla (todo lo que está entre `[corchetes]`) y borra la línea `noindex`.
4. En `index.html`, sección PROJECTS, hay una tarjeta comentada de ejemplo: descoméntala, llénala y borra la tarjeta "PROJECT_02 · In progress".

### Cambiar colores
Arriba de `css/styles.css`:
```css
--navy: #0a1730;        /* azul noche */
--cerulean: #3fd8f2;   /* cian eléctrico (líneas y acentos) */
--cyan-solid: #2fe3ff; /* botón principal */
--midnight: #040912;   /* fondo */
```

## Ver el sitio en tu computadora
Doble clic en `index.html` y se abre en el navegador. O, con VS Code, la extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.

## Publicar en Vercel

**Opción A — con GitHub (recomendada, se actualiza sola):**
1. Crea un repositorio en GitHub y sube esta carpeta (la carpeta `_originales/` no se sube, está en `.gitignore`).
2. Entra a [vercel.com](https://vercel.com) → *Sign up with GitHub*.
3. *Add New → Project* → elige el repositorio → **Framework Preset: Other** → *Deploy*.
4. Cada vez que subas cambios a GitHub, Vercel republica automáticamente.

**Opción B — sin GitHub:**
```bash
npm i -g vercel
vercel          # primera vez: te pide iniciar sesión y crea el proyecto
vercel --prod   # publica a producción
```

Tip: en Vercel → *Settings → Domains* puedes cambiar el nombre a algo como `brithany-serracin.vercel.app`.
