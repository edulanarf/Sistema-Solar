# Sistema Solar en Three.js

Este proyecto simula el **Sistema Solar en 3D** utilizando **Three.js**, con texturas, rotaciones, órbitas elípticas, lunas, anillos y un fondo que intenta representar las estrellas del universo.  
Incluye un panel interactivo (**dat.GUI**) para seleccionar o modificar los planetas y un **modo de navegación libre en primera persona**.

---

## Índice

1. [Características principales](#características-principales)  
2. [Inicialización y configuración](#inicialización)  
3. [Datos de los planetas](#datos-de-los-planetas)  
4. [Funciones principales](#funciones-principales)  
5. [Modo Nave](#modo-nave)  
6. [Editor de planetas](#editor-de-planetas)  
7. [Eventos y animación](#eventos-y-animación)  
8. [Imágenes y video](#imagenes-y-video)

---

## Características principales

- Representación completa del **Sistema Solar** con órbitas elípticas e inclinaciones realistas.  
- **Texturas** de planetas, lunas, anillos y fondo estelar (vía NASA).  
- **Rotación** de planetas y lunas en tiempo real.  
- **Iluminación mixta:** luz puntual (Sol) + luz ambiental suave.  
- **Cámara interactiva (OrbitControls)** con seguimiento de planetas.  
- **Panel de control (dat.GUI)** para seleccionar o editar planetas.  
- **Sombras suaves** activadas (`PCFSoftShadowMap`).  
- **Modo Nave:** control libre en primera persona.  
- **Selección por clic:** elegir y resaltar planetas directamente en la escena.  
- **Panel dinámico de estadísticas** poder editar los planetas en tiempo real.

---

## Inicialización

La función principal `init()`:

- Crea la **escena**, la **cámara** y el **renderer**.  
- Configura las **luces** (solar y ambiental).  
- Inicializa los **controles de cámara (`OrbitControls`)**.  
- Añade el **fondo estelar** (textura de la Vía Láctea).  
- Genera planetas y lunas a partir del arreglo `planetsData`.  
- Configura el menú `dat.GUI` para seleccionar el planeta.
- Crea un submenú para el **modo Nave**.

---

## Datos de los planetas

Cada planeta se define dentro del arreglo `planetsData` con las siguientes propiedades:

| Propiedad | Descripción |
|------------|-------------|
| `nombre` | Nombre del planeta |
| `r` | Radio relativo |
| `dist` | Distancia al Sol |
| `vel` | Velocidad angular |
| `col` | Color base |
| `inclinacionX`, `inclinacionZ` | Inclinación orbital |
| `f1`, `f2` | Elipticidad |
| `texture` | Textura del planeta |
| `lunas` | Array de lunas (puede no tener lunas) |

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

## Funciones principales

### `init()`
Inicializa toda la escena 3D.  
Se encarga de crear la cámara, el renderizador y las luces, configurar los controles (`OrbitControls`), generar los planetas y añadir el fondo estelar.  
También crea la interfaz gráfica con **dat.GUI**, permitiendo seleccionar el planeta a seguir.

### `Estrella(radio, color, textura)`
Crea el Sol como una esfera con material básico y una textura.  
El Sol actúa además como fuente de luz principal mediante una luz puntual colocado en el mismo punto.
A parte de la luz puntual, se ha añadido una luz ambiente para que los planetas no se vean totalmente oscuros por la parte contraria del sol. En 
la vida real, esta luz podría darse por la luz de otras estrellas por ejemplo.

### `Planeta(nombre, radio, dist, vel, col, f1, f2, inclinacionX, inclinacionZ, lunas, textura, texturaAnilloSaturno)`
Genera un planeta con sus parámetros físicos y orbitales.  
- Crea la geometría esférica del planeta y le aplica el color o textura correspondiente.  
- Calcula su órbita en base a los factores de elipticidad (`f1`, `f2`) e inclinaciones (`inclinacionX`, `inclinacionZ`).  
- Dibuja su órbita como una línea en la escena.  
- Si el planeta es **Saturno**, añade su anillo.  
- Si el planeta posee **lunas**, las crea y las vincula como hijas del planeta, de modo que orbiten junto a él.

### `animationLoop()`
Controla el bucle de animación principal mediante `requestAnimationFrame()`.  
En cada fotograma:
- Actualiza las posiciones de los planetas según su velocidad angular.  
- Calcula la rotación propia de cada planeta para simular su giro sobre el eje.  
- Actualiza la posición de las lunas alrededor de su planeta.  
- Reposiciona la cámara si se está siguiendo un planeta.  
- Llama al renderizador para dibujar la escena.  

### `onWindowResize()`
Tiene en cuenta los cambios de tamaño de ventana y actualiza automáticamente la relación de aspecto de la cámara y el tamaño del `renderer`.  
Esto garantiza que la escena se mantenga correctamente proporcionada en cualquier resolución o dispositivo o también en caso de hacer la ventana
mas pequeña o mas grande.

### `crearOrbitas(dist, f1, f2, inclinacionX, inclinacionZ)`
Dibuja la trayectoria orbital del planeta alrededor del Sol.  
Usa una `THREE.EllipseCurve` para generar una órbita elíptica y aplica rotaciones según los ángulos de inclinación.  
La órbita se añade a la escena como una `THREE.LineLoop` gris que sirve como referencia visual.

### `seguimientoPlaneta()`
Permite que la cámara siga automáticamente al planeta seleccionado en el panel `dat.GUI`.  
Calcula el desplazamiento del planeta entre fotogramas y aplica ese movimiento tanto a la posición de la cámara como al punto de enfoque.  
Esto crea un efecto de seguimiento suave y dinámico.



---

- **OrbitControls** permite rotar, desplazar y hacer zoom con el ratón para explorar la escena libremente.  
- El panel `dat.GUI` incluye una lista desplegable con todos los planetas y el Sol.  
  - Al seleccionar un planeta, la cámara se centra y sigue automáticamente su movimiento.  
  - El seguimiento de planeta se logra calculando el desplazamiento entre frames y aplicándolo a la posición de la cámara y al objetivo de los controles.
  - 
---

## Modo nave

El **Modo Nave** permite moverse libremente por el espacio en primera persona.
- Se activa desde el panel **dat.GUI**:
  - “Modo Nave” → “Entrar en la nave”  
  - “Salir de la nave” para volver al control normal, haciendo que se enfoque la vista hacia el sol. (IMPORTANTE) para salir del modo de nave se ha de hacer "escape" y luego elegir la opción "salir de la nave".  
 
### Controles de la nave:
  W: moverse hacia delante  
  S: moverse hacia atrás  
  A: moverse hacia la izquierda  
  D: moverse hacia la derecha  
  Q: moverse hacia arriba  
  E: moverse hacia abajo

### Implementación

- Implementado con **PointerLockControls**.  
- Desactiva `OrbitControls` al activarse.  
- Se bloquea el cursor dentro del canvas mientras está activo.  
- Permite explorar libremente el sistema solar sin seguir planetas.  
- La posición de la cámara se actualiza en cada frame según las teclas presionadas y la orientación actual.

### Funciones

- `activarNave()`
  - Activa el Modo Nave en primera persona.
  - Desactiva `OrbitControls` y bloquea el cursor.
  - Inicializa los controles de la nave (`PointerLockControls`) si aún no existen.
  - Permite que la cámara se mueva libremente.

- `salirNave()`
  - Desactiva el Modo Nave y reactiva `OrbitControls`.
  - Desbloquea el cursor.
  - Centra la cámara nuevamente hacia el Sol.
  - Resetea el estado de teclas presionadas.

- `moverNave()`
  - Se ejecuta en cada frame mientras el Modo Nave está activo.
  - Calcula la dirección de movimiento según las teclas presionadas (`W`, `A`, `S`, `D`, `Q`, `E`).
  - Combina dirección y altura para mover la cámara suavemente.
  - Actualiza la posición del objeto de control de la nave (`naveControls.getObject()`).

- `onKeyDown(e)` y `onKeyUp(e)`
  - Detectan cuándo se presionan o sueltan las teclas de movimiento.
  - Actualizan el objeto `keysPressed` para controlar el movimiento de la nave.
 
## Editor de planetas

El **Editor de planetas** permite modificar parámetros de los planetas en tiempo real desde la interfaz gráfica (`dat.GUI`).

### Cómo se activa

- Se activa automáticamente al seleccionar un planeta en la escena (por clic o desde la lista de dat.GUI).  
- Al seleccionar un planeta, se crea un **submenú dinámico** en el panel dat.GUI con los parámetros editables.

### Parámetros editables

- `dist`: distancia del planeta al Sol.  
- `vel`: velocidad orbital del planeta.  
- `r`: radio del planeta.

### Funcionalidad

- Los cambios se aplican **inmediatamente en la escena**, modificando la órbita, posición y tamaño del planeta.  
- Solo un planeta puede ser editado a la vez; al seleccionar otro, el menú anterior se cierra automáticamente.  
- Permite experimentar con diferentes configuraciones de planetas y observar cómo afectan la simulación en tiempo real.  
- La estrella no es modificable

### Funciones importantes del Editor de planetas

- `mostrarEstadisticasPlaneta(planeta)`
  - Crea el submenú dinámico en dat.GUI para el planeta seleccionado.  
  - Permite modificar `dist`, `vel` y `r` directamente desde el panel.  
  - Actualiza los valores del planeta en la escena en tiempo real.

- `resaltarPlaneta(planeta)`
  - Resalta visualmente el planeta seleccionado en la escena.  
  - Apaga el resaltado de cualquier otro planeta previamente seleccionado.

- Interacción con eventos:
  - La selección de un planeta se realiza mediante `Raycaster` en el evento `click`.


## Eventos y animación

- Los planetas giran alrededor del Sol usando sus parámetros de velocidad (`speed`) y distancia (`dist`).  
  - La posición se calcula con trigonometría:  
    ```text
    x = cos(angulo) * f1 * dist
    y = sin(angulo) * f2 * dist
    ```
    donde `f1` y `f2` deforman la órbita para hacerla elíptica y `angulo = tiempo * velocidad`.
  - Luego se aplican rotaciones en los ejes X y Z según la inclinación de la órbita:
    ```text
    vector.applyAxisAngle(ejeX, inclinacionX)
    vector.applyAxisAngle(ejeZ, inclinacionZ)
    ```
- Las lunas se posicionan respecto al planeta padre, usando un cálculo similar para su órbita pero con `angleOffset` para variar el inicio del movimiento (evitando que colapse con otra luna).  
- El renderizado se actualiza continuamente mediante `requestAnimationFrame(animationLoop)`, recalculando posiciones y rotaciones de todos los planetas en cada frame.  

---

## Imagenes y video

- Júpiter y algunas de sus lunas, con sombras (ambiente y puntual)

![Júpiter](ImagenesReadme/SistemaSolar1.PNG)

- Órbitas Elípticas con inclinación

![Órbitas](ImagenesReadme/SistemaSolar2.PNG)

- GUI para seleccionar la vista de cada planeta

![GUI](ImagenesReadme/SistemaSolar3.PNG)

- GUI para entrar en modo nave | Salir modo nave.  
- GUI modo edición.

![GUI](ImagenesReadme/SistemaSolar5.PNG)

- Planeta seleccionado haciendo click (Aparece una especie de capa azul que lo rodea).  

![GUI](ImagenesReadme/SistemaSolar4.PNG)

- Video: En el video se puede ver cada planeta del sistema solar, junto con la GUI para seleccionar la vista de cada planeta. También se pueden observar el dibjudo de cada órbita, viendo como cada una tiene una inclinación respecto al plano XY y un factor de elipticidad diferente

https://drive.google.com/file/d/1MD9Zjg4I7IR3MAolVDCewIcMSLQ-WgYV/view?usp=sharing
  
