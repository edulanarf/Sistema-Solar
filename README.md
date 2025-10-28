---
title: "🌌 Sistema Solar en Three.js"
output: github_document
---

# 🌞 Sistema Solar en Three.js

Este proyecto simula el **Sistema Solar en 3D** utilizando **Three.js**, con texturas realistas, rotaciones, órbitas elípticas, lunas y anillos.  
Incluye un panel interactivo (**dat.GUI**) para seleccionar el planeta que se desea seguir y un modo **"Libre"** para moverse manualmente por la escena como si fuera una nave.

---

## 📚 Índice

1. [Características principales](#características-principales)  
2. [Tecnologías utilizadas](#tecnologías-utilizadas)  
3. [Estructura del proyecto](#estructura-del-proyecto)  
4. [Inicialización y configuración](#inicialización-y-configuración)  
5. [Datos de los planetas](#datos-de-los-planetas)  
6. [Funciones principales](#funciones-principales)  
7. [Control de cámara y selección de planeta](#control-de-cámara-y-selección-de-planeta)  
8. [Eventos y animación](#eventos-y-animación)  
9. [Parámetros importantes](#parámetros-importantes)  
10. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)  
11. [Mejoras futuras](#mejoras-futuras)

---

## 🌠 Características principales

- Representación completa del **Sistema Solar** con órbitas elípticas e inclinaciones realistas.  
- **Texturas HD** de planetas, lunas y fondo estelar (vía NASA).  
- **Rotación** de planetas y lunas en tiempo real.  
- **Luz puntual (Sol)** y **luz ambiental** para simular la iluminación natural.  
- **Cámara interactiva** con `OrbitControls` y opción de modo **Libre/Nave**.  
- **Panel de control (dat.GUI)** para elegir qué planeta seguir.  
- **Fondo de estrellas 3D** con esfera invertida tipo “Milky Way”.

---

## 🧰 Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|-------------|
| **Three.js** | Motor 3D basado en WebGL |
| **dat.GUI** | Panel de control para manipular parámetros |
| **OrbitControls** | Control de cámara con ratón (rotar, acercar, orbitar) |
| **JavaScript (ES6)** | Lógica principal del sistema y animaciones |
| **Texturas NASA 2K/8K** | Mapas realistas de planetas y fondo estelar |

---

## 🗂️ Estructura del proyecto

```bash
├── index.html
├── main.js                 # Lógica principal con Three.js
├── textures/               # Carpeta de texturas
│   ├── 2k_earth_daymap.jpg
│   ├── 2k_mars.jpg
│   ├── 8k_stars_milky_way.jpg
│   ├── saturn_ring.png
│   └── ...
└── README.Rmd
```

---

## ⚙️ Inicialización y configuración

La función principal `init()`:

- Crea la **escena**, la **cámara** y el **renderer**.  
- Configura las **luces** (solar y ambiental).  
- Inicializa los **controles de cámara (`OrbitControls`)**.  
- Añade el **fondo estelar** (textura de la Vía Láctea).  
- Genera planetas y lunas a partir del arreglo `planetsData`.  
- Configura el menú `dat.GUI` para seleccionar el planeta o modo libre.

---

## 🪐 Datos de los planetas

Cada planeta se define dentro del arreglo `planetsData` con las siguientes propiedades:

| Propiedad | Descripción |
|------------|-------------|
| `nombre` | Nombre del planeta |
| `r` | Radio relativo |
| `dist` | Distancia al Sol |
| `vel` | Velocidad angular |
| `col` | Color base |
| `inclinacionX`, `inclinacionZ` | Inclinación orbital |
| `f1`, `f2` | Factores de elipticidad |
| `texture` | Textura del planeta |
| `lunas` | Arreglo de lunas (opcional) |

Ejemplo:

```js
{
  nombre: "Tierra",
  r: 0.45,
  dist: 80.0,
  vel: 0.1,
  col: 0x2266ff,
  inclinacionX: 0.5,
  inclinacionZ: 0.5,
  f1: 0.9,
  f2: 1.2,
  texture: "textures/2k_earth_daymap.jpg",
  lunas: [
    { nombre: "Luna", r: 0.1, dist: 2.0, vel: 2.0, col: 0xffffff }
  ]
}
```

---

## 🧮 Funciones principales

### `Planeta(nombre, radio, color, textura, ... )`
Crea la geometría y malla del planeta, aplica textura, color y añade lunas o anillos (en el caso de Saturno).

### `crearOrbitas(...)`
Dibuja la trayectoria de cada planeta como una línea delgada para representar la órbita.

### `animationLoop()`
Actualiza posiciones, rotaciones y cámara en cada frame del renderizado.

---

## 🎥 Control de cámara y selección de planeta

- **OrbitControls** permite rotar y hacer zoom con el ratón.  
- El panel `dat.GUI` incluye una lista con todos los planetas y una opción **"Libre"**.  
- En modo **Libre**, se puede mover con:
  - `W` / `S`: Avanzar / Retroceder  
  - `A` / `D`: Izquierda / Derecha  
  - `Q` / `E`: Subir / Bajar  

---

## 🕹️ Eventos y animación

- Los planetas giran en torno al Sol usando sus parámetros de velocidad.  
- Las lunas orbitan sus planetas correspondientes.  
- El renderizado se actualiza continuamente con `renderer.setAnimationLoop(animationLoop)` para garantizar fluidez.

---

## ⚙️ Parámetros importantes

| Variable | Función |
|-----------|----------|
| `acelglobal` | Factor global de velocidad del sistema |
| `movimientoLibre` | Activa/desactiva el modo nave |
| `teclasPresionadas` | Mapa de teclas activas para movimiento libre |
| `velocidadCamara` | Controla la velocidad de desplazamiento en modo libre |

---

## 🚀 Cómo ejecutar el proyecto

1. Instala un servidor local (por ejemplo con `Live Server` en VSCode).  
2. Coloca todos los archivos (`index.html`, `main.js`, `textures/`) en el mismo directorio.  
3. Abre `index.html` con el servidor local.  
4. Explora el sistema solar y utiliza el panel `dat.GUI` para seleccionar planetas o entrar en modo **Libre**.

---

## 💡 Mejoras futuras

- Implementar **shader de atmósfera** para planetas gaseosos.  
- Añadir **trayectorias de lunas y cometas**.  
- Soporte para **post-procesado** (bloom, lens flare).  
- Mejorar el **modo nave** con controles de rotación de cámara.  
- Agregar **HUD con información científica** (nombre, tamaño, distancia, etc.).

---

© 2025 — Proyecto educativo en **Three.js** desarrollado para visualización interactiva del Sistema Solar.
