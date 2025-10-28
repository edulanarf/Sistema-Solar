import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as dat from "dat.gui";

let scene, renderer, camera, controls;
let estrella,
  Planetas = [];
let t0 = 0;
let accglobal = 0.0008;
let timestamp;
const gui = new dat.GUI();

const texturaTierra = new THREE.TextureLoader().load(
  "textures/2k_earth_daymap.jpg"
);
const texturaMercurio = new THREE.TextureLoader().load(
  "textures/2k_mercury.jpg"
);
const texturaVenus = new THREE.TextureLoader().load(
  "textures/2k_venus_surface.jpg"
);
const texturaMarte = new THREE.TextureLoader().load("textures/2k_mars.jpg");
const texturaJupiter = new THREE.TextureLoader().load(
  "textures/2k_jupiter.jpg"
);
const texturaSaturno = new THREE.TextureLoader().load("textures/2k_saturn.jpg");
const texturaUrano = new THREE.TextureLoader().load("textures/2k_uranus.jpg");

const texturaNeptuno = new THREE.TextureLoader().load(
  "textures/2k_neptune.jpg"
);

const texturaSol = new THREE.TextureLoader().load("textures/2k_sun.jpg");

const loader = new THREE.TextureLoader();
const texturaMilkyWay = loader.load("textures/8k_stars_milky_way.jpg");

const texturaLunaTierra = new THREE.TextureLoader().load(
  "textures/2k_moon.jpg"
);
const texturaLuna1 = new THREE.TextureLoader().load("textures/Luna1.jpg");
const texturaLuna2 = new THREE.TextureLoader().load("textures/Luna2.jpg");
const texturaLuna3 = new THREE.TextureLoader().load("textures/Luna3.jpg");
const texturaLuna4 = new THREE.TextureLoader().load("textures/Luna4.jpg");

const texturaAnilloSaturno = new THREE.TextureLoader().load(
  "textures/2k_saturn_ring_alpha.png"
);

const planetsData = [
  {
    nombre: "Mercurio",
    r: 1,
    dist: 40.0,
    vel: 0.4,
    col: 0xffffff,
    inclinacionX: (7 * Math.PI) / 180, //Inclinacion de la orbita en el plano X
    inclinacionZ: (20 * Math.PI) / 180, //Lo mismo pero en el plano Z
    f1: 1.0,
    f2: 0.9, //Hago la orbita un poco eliptica
    texture: texturaMercurio,
  },
  {
    nombre: "Venus",
    r: 2,
    dist: 60.0,
    vel: 0.3,
    col: 0xffffff,
    inclinacionX: (3.4 * Math.PI) / 180,
    inclinacionZ: (40 * Math.PI) / 180,
    f1: 1.0,
    f2: 0.95,
    texture: texturaVenus,
  },
  {
    nombre: "Tierra",
    r: 2.4,
    dist: 80.0,
    vel: 0.2,
    col: 0xffffff,
    inclinacionX: 0,
    inclinacionZ: 0,
    f1: 1.0,
    f2: 0.93,
    lunas: [
      {
        nombre: "Luna",
        r: 0.6,
        inclinacionX: 0.05,
        inclinacionZ: 0.1,
        angleOffset: Math.PI / 2, //Añado un angulo para especificar desde donde empieza a girar
        dist: 1.57,
        vel: 1.2,
        col: 0xffffff,
        texture: texturaLunaTierra,
      },
    ],
    texture: texturaTierra,
  },
  {
    nombre: "Marte",
    r: 1.75,
    dist: 100.0,
    vel: 0.15,
    col: 0xff3300,
    inclinacionX: (1.85 * Math.PI) / 180,
    inclinacionZ: (120 * Math.PI) / 180,
    f1: 1.0,
    f2: 0.99,
    texture: texturaMarte,
  },
  {
    nombre: "Jupiter",
    r: 5.0,
    dist: 140.0,
    vel: 0.1,
    col: 0xffffff,
    inclinacionX: (1.3 * Math.PI) / 180,
    inclinacionZ: (200 * Math.PI) / 180,
    f1: 1.0,
    f2: 0.9988,
    lunas: [
      {
        nombre: "Io",
        r: 1,
        dist: 6.2,
        vel: 1.8,
        col: 0xffffff,
        angleOffset: 0,
        inclinacionX: 0.0,
        inclinacionZ: 0.0,
        texture: texturaLuna1,
      },
      {
        nombre: "Europa",
        r: 0.9,
        dist: 7.5,
        vel: 1.5,
        col: 0xffffff,
        angleOffset: Math.PI / 2,
        inclinacionX: 0.5,
        inclinacionZ: 0.2,
        texture: texturaLuna2,
      },
      {
        nombre: "Ganimedes",
        r: 1.1,
        dist: 9,
        vel: 1.2,
        col: 0xffffff,
        angleOffset: Math.PI,
        inclinacionX: 1.0,
        inclinacionZ: 0.5,
        texture: texturaLuna3,
      },
      {
        nombre: "Calisto",
        r: 1,
        dist: 11,
        vel: 1.0,
        col: 0xffffff,
        angleOffset: (3 * Math.PI) / 2,
        inclinacionX: 1.5,
        inclinacionZ: 0.8,
        texture: texturaLuna4,
      },
    ],
    texture: texturaJupiter,
  },
  {
    nombre: "Saturno",
    r: 4.6,
    dist: 180.0,
    vel: 0.075,
    col: 0xffffff,
    inclinacionX: (2.5 * Math.PI) / 180,
    inclinacionZ: (260 * Math.PI) / 180,
    f1: 1.0,
    f2: 0.9984,
    texture: texturaSaturno,
  },
  {
    nombre: "Urano",
    r: 2.8,
    dist: 220.0,
    vel: 0.06,
    col: 0xffffff,
    inclinacionX: (0.77 * Math.PI) / 180,
    inclinacionZ: (310 * Math.PI) / 180,
    f1: 1.0,
    f2: 0.9989,
    texture: texturaUrano,
  },
  {
    nombre: "Neptuno",
    r: 2.8,
    dist: 260.0,
    vel: 0.05,
    col: 0xffffff,
    inclinacionX: (1.77 * Math.PI) / 180,
    inclinacionZ: (340 * Math.PI) / 180,
    f1: 1.0,
    f2: 0.9999,
    texture: texturaNeptuno,
  },
];

const params = {
  planetaSeleccionado: "Sol",
};

const planetNames = [
  "Sol",
  "Mercurio",
  "Venus",
  "Tierra",
  "Marte",
  "Jupiter",
  "Saturno",
  "Urano",
  "Neptuno",
];
//camara
let planetaSeguido = null;
let prevPlanetaPos = new THREE.Vector3();

init();
animationLoop();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.set(0, -200, 120);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  //Sombra
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  //Ver Planeta
  gui.add(params, "planetaSeleccionado", planetNames).onChange((value) => {
    planetaSeguido =
      value === "Sol"
        ? estrella
        : Planetas.find((p) => p.userData.nombre === value);

    if (planetaSeguido && planetaSeguido !== estrella) {
      mostrarEstadisticasPlaneta(planetaSeguido);
    }
  });

  const naveFolder = gui.addFolder("Modo Nave");
  naveFolder.add({ entrar: activarNave }, "entrar").name("Entrar en la nave");
  naveFolder.add({ salir: salirNave }, "salir").name("Salir de la nave");
  naveFolder.open();

  // Luz del sol puntutal
  const Lpunt = new THREE.PointLight(0xffffff, 1, 0, 2);
  Lpunt.position.set(2, 2, 2);
  Lpunt.castShadow = true;
  scene.add(Lpunt);

  // Añado un poco de luz ambiental (La cual podria ser causada por otras estrellas cercanas etc)
  const ambient = new THREE.AmbientLight(0x080808);
  scene.add(ambient);

  Estrella(2.0, 0xffff00, texturaSol);

  const loader = new THREE.TextureLoader();
  loader.load("textures/8k_stars_milky_way.jpg", (texture) => {
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;

    const skyGeo = new THREE.SphereGeometry(4000, 256, 256);
    const skyMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      toneMapped: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
  });

  //----------------- PLANETAS -----------------
  // r = radio
  // dist = distancia al sol
  // vel = velocidad angular
  // f1 y f2 = representan como de eliptica es la orbita (1|1 para una orbita circular)

  // inclinacion X e Y: inclinacion de la orbita (algunos planetas del sistema solar tienen
  //una inclinacion mas notoria, normalmente son los mas cercanos al sol. Los mas lejanos
  // tienen una inclinacion muy muy pequeña (0.9998))
  //lunas = array de lunas (si tiene definidas)
  for (let p of planetsData) {
    Planeta(
      p.nombre,
      p.r,
      p.dist,
      p.vel,
      p.col,
      p.f1,
      p.f2,
      p.inclinacionX,
      p.inclinacionZ,
      p.lunas,
      p.texture,
      texturaAnilloSaturno
    );
  }

  t0 = Date.now();
  window.addEventListener("resize", onWindowResize); //En caso de cambiar el tamaño de la ventana
}

function Estrella(radio, col, textura) {
  const geometry = new THREE.SphereGeometry(radio, 50, 50); //50 para que se vea mas o menos esferico y no tenga "picos" (le pongo mas que los planetas porque el sol es mucho mas grande)
  const material = new THREE.MeshBasicMaterial({
    color: col,
  });
  material.map = textura;
  estrella = new THREE.Mesh(geometry, material);
  scene.add(estrella);
}

function Planeta(
  nombre,
  radio,
  dist,
  vel,
  col,
  f1,
  f2,
  inclinacionX = 0,
  inclinacionZ = 0,
  lunas = [],
  texture = undefined,
  texturaAnilloSaturno = undefined
) {
  const geometry = new THREE.SphereGeometry(radio, 30, 30); //30 para que se vea más esferico y no tenga "picos"
  const material = new THREE.MeshPhongMaterial({ color: col });
  const planeta = new THREE.Mesh(geometry, material);
  planeta.receiveShadow = true;
  planeta.castShadow = true;

  planeta.rotation.set(0, 0, 0);
  planeta.rotation.x = Math.PI / 2;

  if (texture != undefined) {
    material.map = texture;
  }

  planeta.userData = {
    nombre,
    dist,
    speed: vel,
    f1,
    f2,
    inclinacionX,
    inclinacionZ,
  };
  Planetas.push(planeta);
  scene.add(planeta);

  //Anillo para saturno
  if (nombre === "Saturno" && texturaAnilloSaturno) {
    const innerRadius = radio * 4;
    const outerRadius = radio * 8;
    const segments = 64;
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, segments);

    const ringMat = new THREE.MeshBasicMaterial({
      map: texturaAnilloSaturno,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = 0;
    planeta.add(ring);
  }

  const curve = new THREE.EllipseCurve(0, 0, dist * f1, dist * f2);

  const points = curve.getPoints(256); //Numero de puntos de la recta
  const pts3 = points.map((p) => {
    //Como he inclinado la orbita en los ejes X y Z, cambio la manera de dibujar las orbitas
    //Para aplicar las inclinaciones de los planetas a estas mismas
    const v = new THREE.Vector3(p.x, p.y, 0);
    v.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclinacionX);
    v.applyAxisAngle(new THREE.Vector3(0, 0, 1), inclinacionZ);
    return v;
  });
  const geome = new THREE.BufferGeometry().setFromPoints(pts3);
  const mate = new THREE.LineBasicMaterial({ color: 0x444444 });
  const orbita = new THREE.LineLoop(geome, mate);
  scene.add(orbita);

  // LUNAS
  //Si el planeta tiene lunas:
  if (Array.isArray(lunas) && lunas.length > 0) {
    for (let l of lunas) {
      const geom = new THREE.SphereGeometry(l.r, 16, 16);
      const mat = new THREE.MeshPhongMaterial({ color: l.col });
      const luna = new THREE.Mesh(geom, mat);
      luna.receiveShadow = true;
      //Valores de la luna
      luna.userData = {
        dist: l.dist,
        speed: l.vel,
        angleOffset: l.angleOffset,
        inclinacionX: l.inclinacionX,
        inclinacionY: l.inclinacionY,
      };
      mat.map = l.texture;
      planeta.add(luna); // Añado la luna a la orbita del planeta
    }
  }

  return planeta;
}

function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;
  requestAnimationFrame(animationLoop);

  for (let object of Planetas) {
    const ang = timestamp * object.userData.speed;
    const r = object.userData.dist;
    const f1 = object.userData.f1;
    const f2 = object.userData.f2;
    const inclinacionX = object.userData.inclinacionX;
    const inclinacionZ = object.userData.inclinacionZ;

    const x0 = Math.cos(ang) * f1 * r;
    const y0 = Math.sin(ang) * f2 * r;
    const vec = new THREE.Vector3(x0, y0, 0); //Creo un vector para realizar las rotaciones
    vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclinacionX); //Realiza una rotacion en el eje x (1,0,0)
    vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), inclinacionZ); //Y en el eje z (0,0,1)
    object.position.copy(vec);

    // Rotación propia del planeta
    object.rotation.x = Math.PI / 2;
    object.rotation.y += 0.002 * (1 + r * 0.02);

    // Lunas
    for (let luna of object.children) {
      if (luna.userData) {
        const angLuna =
          timestamp * luna.userData.speed + luna.userData.angleOffset;
        const rLuna = luna.userData.dist;

        // Vector independiente de la luna
        const vecLuna = new THREE.Vector3(
          Math.cos(angLuna) * rLuna,
          0,
          Math.sin(angLuna) * rLuna
        );

        // Aplicar inclinaciones de la luna si existen
        if (luna.userData.inclinacionX)
          vecLuna.applyAxisAngle(
            new THREE.Vector3(1, 0, 0),
            luna.userData.inclinacionX
          );
        if (luna.userData.inclinacionZ)
          vecLuna.applyAxisAngle(
            new THREE.Vector3(0, 0, 1),
            luna.userData.inclinacionZ
          );

        luna.position.copy(vecLuna);
      }
    }
  }

  if (naveActiva) {
    moverNave();
  } else {
    controls.update();
  }
  renderer.render(scene, camera);

  //Seguimiento de la camara
  if (!naveActiva && planetaSeguido) {
    const delta = new THREE.Vector3().subVectors(
      planetaSeguido.position,
      prevPlanetaPos
    );
    camera.position.add(delta);
    controls.target.add(delta);
    prevPlanetaPos.copy(planetaSeguido.position);
  }
}

function onWindowResize() {
  //Si se redimenciona la ventana actualizo
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------- Nave -----------

let naveActiva = false;
let keysPressed = {};
const moveSpeed = 2.0;
let naveControls;

function onKeyDown(e) {
  keysPressed[e.code] = true;
}
function onKeyUp(e) {
  keysPressed[e.code] = false;
}

function activarNave() {
  if (naveActiva) return;
  naveActiva = true;

  controls.enabled = false;
  planetaSeguido = null;
  controls.target.copy(camera.position);
  controls.update();

  if (!naveControls) {
    naveControls = new PointerLockControls(camera, renderer.domElement);
    scene.add(naveControls.getObject());
  }

  naveControls.lock();

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

function salirNave() {
  if (!naveActiva) return;
  naveActiva = false;

  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("keyup", onKeyUp);
  keysPressed = {};

  if (naveControls && naveControls.isLocked) naveControls.unlock();

  params.planetaSeleccionado = "Sol";
  planetaSeguido = estrella;
  prevPlanetaPos.copy(estrella.position);
  camera.position.set(0, -200, 120);
  controls.target.set(0, 0, 0);
  controls.enabled = true;
  controls.update();
}

function moverNave() {
  if (!naveActiva || !naveControls) return;

  const object = naveControls.getObject();
  const direction = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  camera.getWorldDirection(direction);
  direction.normalize();
  right.crossVectors(direction, up).normalize();

  const move = new THREE.Vector3();

  if (keysPressed["KeyW"]) move.addScaledVector(direction, moveSpeed);
  if (keysPressed["KeyS"]) move.addScaledVector(direction, -moveSpeed);
  if (keysPressed["KeyA"]) move.addScaledVector(right, -moveSpeed);
  if (keysPressed["KeyD"]) move.addScaledVector(right, moveSpeed);
  if (keysPressed["KeyQ"]) move.y += moveSpeed; //Para subir
  if (keysPressed["KeyE"]) move.y -= moveSpeed; //Para bajar

  object.position.add(move);
}

// Interaccion con el sistema solar
// Esta seccion hace que se pueda seleccionar un planeta simplemente haciendo click en el mismo
// Resaltando el planeta elegido

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", onMouseClick, false);

function onMouseClick(event) {
  // Normalizar coordenadas del "mouse"
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Detectar intersecciones con los planetas
  const intersects = raycaster.intersectObjects(Planetas);

  if (intersects.length > 0) {
    // Tomamos el primer planeta intersectado
    const planeta = intersects[0].object;
    planetaSeguido = planeta; // Seleccionamos el planeta
    console.log("Planeta seleccionado:", planeta.userData.nombre);
    mostrarEstadisticasPlaneta(planeta);
    resaltarPlaneta(planeta);
  }
}

function resaltarPlaneta(planeta) {
  Planetas.forEach((p) => p.material.emissive.set(0x000000));
  planeta.material.emissive.set(0x4444ff);
}

// Modificar los datos de los planetas
let planetaFolder = null;

function mostrarEstadisticasPlaneta(planeta) {
  if (planetaFolder) {
    gui.removeFolder(planetaFolder);
  }

  planetaFolder = gui.addFolder(`Planeta: ${planeta.userData.nombre}`);

  const data = planetsData.find((p) => p.nombre === planeta.userData.nombre);

  if (!data) return;

  // Datos modificables:
  planetaFolder
    .add(data, "dist", 10, 500)
    .name("Distancia al sol")
    .onChange((val) => {
      planeta.userData.dist = val;
    });
  planetaFolder
    .add(data, "vel", 0, 1)
    .name("Velocidad orbital")
    .onChange((val) => {
      planeta.userData.speed = val;
    });
  planetaFolder
    .add(data, "r", 0.1, 10)
    .name("Radio")
    .onChange((val) => {
      planeta.scale.set(val, val, val);
    });

  planetaFolder.open();
}

