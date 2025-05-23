//Special Thanks for www.shadedrelief.com for their amazing earth's textures. M.GIGARD for the code idea and few code itself. And the three.js team for creating such good 3D web tools.
// Images by https://www.solarsystemscope.com/, used under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).

import CameraControls from 'https://cdn.jsdelivr.net/npm/camera-controls@2.10.1/+esm';

CameraControls.install( { THREE: THREE } );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
window.innerHeight, 0.1, 1000);
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls( camera, renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


function createPlanet(size, texture, distance) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texture) });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    return planet;
}

function createPlanetWithRing(size, texture, distance, innerDiameter, outerDiameter, ringTexture) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texture) });
    const planet = new THREE.Mesh(geometry, material);

    const ringTex = new THREE.TextureLoader().load(ringTexture);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true
    });

    const ringGeometry = new THREE.RingGeometry(innerDiameter, outerDiameter, 64);
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

    ringMesh.position.copy(planet.position);
    ringMesh.rotation.x = Math.PI / 2;

    const fullPlanet = new THREE.Group();
    fullPlanet.add(planet);
    fullPlanet.add(ringMesh);

    fullPlanet.position.x = distance;

    scene.add(fullPlanet);

    return fullPlanet;
}

function MakeRotate (planet, distance, speed, axialrotation) {
    planet.position.x = distance * Math.cos(Date.now() * speed);
    planet.position.z = distance * Math.sin(Date.now() * speed);
    planet.rotation.y += axialrotation;
}


const sunTexture = 'textures/sun.jpg';
const mercureTexture = 'textures/mercure.jpg';
const venusTexture = 'textures/venus.jpg';
const earthTexture = 'textures/earth.jpg';
const marsTexture = 'textures/mars.jpg';
const jupiterTexture = 'textures/jupiter.jpg';
const saturneTexture = 'textures/saturne.jpg';
const ringTexture = 'textures/saturneRing.png';
const uranusTexture = 'textures/uranus.jpg';
const neptuneTexture = 'textures/neptune.jpg';
const plutonTexture = 'textures/pluton.jpg';

const sun = createPlanet(4, sunTexture, 0);
const mercure = createPlanet(0.3, mercureTexture, 10);
const venus = createPlanet(0.4, venusTexture, 14);
const earth = createPlanet(0.8, earthTexture, 20);
const mars = createPlanet(0.6, marsTexture, 25);
const jupiter = createPlanet(2, jupiterTexture, 37);
const saturne = createPlanetWithRing(1.8, saturneTexture, 50, 0.5, 4, ringTexture);
const uranus = createPlanet(0.8, uranusTexture, 68);
const neptune = createPlanet(0.7, neptuneTexture, 76);
const pluton = createPlanet(0.3, plutonTexture, 85);

const ambientlight = new THREE.AmbientLight(0xffffff,10);
scene.add(ambientlight);

const pointlight = new THREE.PointLight(0xffffff, 10);
pointlight.castShadow = true;
scene.add(pointlight);


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


camera.position.z = 30;

let mouseX = 0;
let mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function animate() {

    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update( delta );

    if ( hasControlsUpdated ) {

		renderer.render( scene, camera );

	}

    requestAnimationFrame(animate);

    MakeRotate(stars, 0, 0, 0.00002)
    MakeRotate(sun, 0, 0, 0.00045)
    MakeRotate(mercure,10,0.002, 0.01);
    MakeRotate(venus,15,0.0012, 0.005);
    MakeRotate(earth,20,0.00085, 0.001);
    MakeRotate(mars,25,0.0008, 0.001);
    MakeRotate(jupiter,37,0.0002, 0.0007);
    MakeRotate(saturne,50,0.0001, 0.00045);
    MakeRotate(uranus, 68, 0.00007, 0.00001);
    MakeRotate(neptune,76,0.00006, 0.0003);
    MakeRotate(pluton,85,0.00005, 0.00015);

    camera.position.x = (mouseX - windowHalfX) / 10;
    camera.position.y = (mouseY - windowHalfY) / 10;
    camera.lookAt(sun.position);

    stars.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001);

    renderer.render(scene, camera);
}
    
animate();

