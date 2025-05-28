//Special Thanks for www.shadedrelief.com for their amazing earth's textures. M.GIGARD for the code idea and few code itself. And the three.js team for creating such good 3D web tools.
// Images by https://www.solarsystemscope.com/, used under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).

import CameraControls from 'https://cdn.jsdelivr.net/npm/camera-controls@2.10.1/+esm';

CameraControls.install( { THREE: THREE } );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
window.innerHeight, 0.1, 1000);

camera.position.set(0, 50, 0);
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls( camera, renderer.domElement );
cameraControls.dollyToCursor = true;
cameraControls.minDistance = 5;
cameraControls.maxDistance = 120;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


function createPlanet(size, texture, distance) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,      // 0 = brillant, 1 = rugueux (réaliste pour une planète)
        metalness: 0       // en général 0 pour les planètes
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    return planet;
}

function createPlanetWithRing(size, texture, distance, innerDiameter, outerDiameter, ringTexture) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture});
    const planet = new THREE.Mesh(geometry, material);

    const ringMaterial = new THREE.MeshPhongMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        shininess: 15
    });

    const ringGeometry = new THREE.RingGeometry(innerDiameter, outerDiameter, 64);
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

    ringMesh.rotation.z = 0.2;
    ringMesh.receiveShadow = true;
    ringMesh.position.copy(planet.position);
    ringMesh.rotation.x = Math.PI / 2;

    const fullPlanet = new THREE.Group();
    fullPlanet.add(planet);
    fullPlanet.add(ringMesh);

    fullPlanet.position.x = distance;

    scene.add(fullPlanet);

    return fullPlanet;
}

function createSun(size, texture, intensity = 0.5, lightDistance = 1000) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sun = new THREE.Mesh(geometry, material);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // avant : 1.5
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xfdffbe, intensity, lightDistance);
    sun.add(light);

    scene.add(sun);
    return sun;
}

function MakeRotate (planet, distance, speed, axialrotation) {
    planet.position.x = distance * Math.cos(Date.now() * speed);
    planet.position.z = distance * Math.sin(Date.now() * speed);
    planet.rotation.y += axialrotation;
}

function addSunHalo(sun, size = 6, color = 0xffffaa, intensity = 0.5) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const halo = new THREE.Mesh(geometry, material);
    halo.position.set(0, 0, 0);
    sun.add(halo);
    return halo;
}



const textureLoader = new THREE.TextureLoader();

const textures = {
    sun: textureLoader.load('textures/sun.jpg'),
    mercure: textureLoader.load('textures/mercure.jpg'),
    venus: textureLoader.load('textures/venus.jpg'),
    earth: textureLoader.load('textures/earth.jpg'),
    mars: textureLoader.load('textures/mars.jpg'),
    jupiter: textureLoader.load('textures/jupiter.jpg'),
    saturne: textureLoader.load('textures/saturne.jpg'),
    ring: textureLoader.load('textures/saturneRing.png'),
    uranus: textureLoader.load('textures/uranus.jpg'),
    neptune: textureLoader.load('textures/neptune.jpg'),
    pluton: textureLoader.load('textures/pluton.jpg'),
};

const sun = createSun(4, textures.sun, 1.25);
const mercure = createPlanet(0.3, textures.mercure, 10);
const venus = createPlanet(0.4, textures.venus, 14);
const earth = createPlanet(0.8, textures.earth, 20);
const mars = createPlanet(0.6, textures.mars, 25);
const jupiter = createPlanet(2, textures.jupiter, 37);
const saturne = createPlanetWithRing(1.8, textures.saturne, 50, 0.5, 4, textures.ring);
const uranus = createPlanet(0.8, textures.uranus, 68);
const neptune = createPlanet(0.7, textures.neptune, 76);
const pluton = createPlanet(0.3, textures.pluton, 85);

const halo = addSunHalo(sun, 4.5, 0xffffaa, 0.1);

const starfieldTexture = new THREE.TextureLoader().load('textures/starfield.jpg');

const skyGeo = new THREE.SphereGeometry(300, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("textures/starfield.jpg"),
    side: THREE.BackSide // important !
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);


const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

const particulescount = 10000;
const starRadius = 275; // Sphere radius for stars

for (let i = 0; i < particulescount; i++) {
    let theta = Math.random() * Math.PI * 2;
    let phi = Math.acos((Math.random() * 2) - 1);
    let x = starRadius * Math.sin(phi) * Math.cos(theta);
    let y = starRadius * Math.sin(phi) * Math.sin(theta);
    let z = starRadius * Math.cos(phi);

    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const particulesTextures = new THREE.TextureLoader().load("textures/star.png");

const starMaterial = new THREE.PointsMaterial({
    map: particulesTextures,
    size: 3.5,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const planets = [mercure, venus, earth, mars, jupiter, saturne, uranus, neptune, pluton];

function createTextSprite(message, parameters = {}) {
    const fontface = parameters.fontface || 'Arial';
    const fontsize = parameters.fontsize || 24;
    const borderThickness = parameters.borderThickness || 4;
    const borderColor = parameters.borderColor || { r:0, g:0, b:0, a:1.0 };
    const backgroundColor = parameters.backgroundColor || { r:255, g:255, b:255, a:1.0 };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    const metrics = context.measureText(message);
    const textWidth = metrics.width;

    canvas.width = textWidth + borderThickness * 2;
    canvas.height = fontsize * 1.4 + borderThickness * 2;

    context.font = fontsize + "px " + fontface;

    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;
    context.lineWidth = borderThickness;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(0,0,0,1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);


    sprite.scale.set(canvas.width / 50, canvas.height / 50, 1);

    return sprite;
}

const mytext = createTextSprite("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
mytext.position.set(50, 50, 50);


function animate() {

    const delta = clock.getDelta();
    cameraControls.update(delta);

    requestAnimationFrame(animate);

    MakeRotate(stars, 0, 0, 0.00002)
    MakeRotate(sun, 0, 0, 0.00045)
    MakeRotate(mercure,10,0.0002, 0.01);
    MakeRotate(venus,15,0.00012, 0.005);
    MakeRotate(earth,20,0.000085, 0.001);
    MakeRotate(mars,25,0.00008, 0.001);
    MakeRotate(jupiter,37,0.00002, 0.0007);
    MakeRotate(saturne,50,0.00001, 0.00045);
    MakeRotate(uranus, 68, 0.000007, 0.00001);
    MakeRotate(neptune,76,0.000006, 0.0003);
    MakeRotate(pluton,85,0.000005, 0.00015);

    stars.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001);
    halo.material.opacity = 0.1 + 0.01 * Math.sin(Date.now() * 0.001);


    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}

animate();
