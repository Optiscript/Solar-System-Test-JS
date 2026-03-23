// Importing dependencies idk why not change on git pages. what im supposed to do, blya.
import { VRButton } from './VRButton.js';

import CameraControls from './camera-controls.js';

import * as myfunctions from './functions.js' ;

console.log("All scripts got loaded, enjoy your experience!");


CameraControls.install( { THREE: THREE } );


//Initialising scene, rendering, cameracontrols, and clock.
const scene = new THREE.Scene();
const camera_g = new THREE.Group();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(125, 125, 50);


/* 
//May be userfull for debug if no error code.

const centerHelper = new THREE.Mesh(
	new THREE.SphereGeometry( 4 ),
	new THREE.MeshBasicMaterial( { color: 0xffff00 } )
)
scene.add( centerHelper );

cameraControls.getTarget( centerHelper.position );
*/

const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true, antialias: false });
const cameraControls = new CameraControls( camera, renderer.domElement );
cameraControls.dollyToCursor = true;
cameraControls.minDistance = 5;
cameraControls.maxDistance = 80;
cameraControls.smoothTime = 0.7;

const bb = new THREE.Box3(
    new THREE.Vector3( -125, -125, -125 ),
    new THREE.Vector3( 125, 125, 125 )
);

cameraControls.setBoundary( bb );

// Shadows enabled.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


//Setting the page size to the good resolution.
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//VR integration.
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

document.body.appendChild(renderer.domElement);

const controller_l = renderer.xr.getController(0);
const controller_r = renderer.xr.getController(1);
scene.add(controller_l);
scene.add(controller_r);

let isChoosing = false;

camera.position.set(25, 25, 0);

let followedPlanet = null;

//Textures loader
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
    moon: textureLoader.load('textures/moon.jpg'),
    io: textureLoader.load('textures/io.jpg'),
    europa: textureLoader.load('textures/europa.jpg'),
    ganymede: textureLoader.load('textures/callisto.jpg'),
    callisto: textureLoader.load('textures/callisto.jpg'),
    titan: textureLoader.load('textures/titan.jpg'),
    triton: textureLoader.load('textures/triton.jpg'),
};

for (const key in textures) {
    textures[key].minFilter = THREE.NearestFilter;
    textures[key].magFilter = THREE.NearestFilter;
    textures[key].generateMipmaps = false;
}


//Planets, Sun, Moons, etc... settings and functions called to make them appear.

const p_sizes = [
  17.0,      // Sun
  // Planets
  0.0942,    // [1] Mercure
  0.23371,   // [2] Venus
  0.24604,   // [3] Terre
  0.1309,    // [4] Mars
  2.69978,   // [5] Jupiter
  2.24879,   // [6] Saturne
  0.97948,   // [7] Uranus
  0.95094,   // [8] Neptune
  0.04589,   // [9] Pluton

  // Lunes
  0.0671,    // [10] Moon → Earth
  0.07031,   // [11] Io
  0.06029,   // [12] Europa
  0.10171,   // [13] Ganymede
  0.09307,   // [14] Callisto
  0.0994,    // [15] Titan
  0.05225    // [16] Triton
];

const p_distances = [
  0.01476,         // [0] Moon → Earth
  2.3866 + 17.0,   // [1] Mercure  (19.3866)
  6.4216 + 17.0,   // [2] Venus    (23.4216)
  11.0717 + 17.0,  // [3] Earth    (28.0717)
  17.2472 + 17.0,  // [4] Mars     (34.2472)
  32.0095 + 17.0,  // [5] Jupiter  (49.0095)
  58.6553 + 17.0,  // [6] Saturn   (75.6553)
  118.0488 + 17.0, // [7] Uranus   (135.0488)
  130.071 + 17.0,  // [8] Neptune  (147.071)
  150.039 + 17.0,  // [9] Pluton   (167.039)

  // Lunes → planète
  0.5216,          // [10] Moon → Earth
  5.47333,         // [11] Io → Jupiter
  6.25573,         // [12] Europa → Jupiter
  7.30877,         // [13] Ganymede → Jupiter
  8.18959,         // [14] Callisto → Jupiter
  6.04852,         // [15] Titan → Saturn
  1.96593          // [16] Triton → Neptune
];
// scene.scale.setScalar(1); // (0.2 / 20)

const p_camera = [
  [0.075, 0.05, 0.0425, 0.05], 
  [0.15, 0.15, 0.15, 0.15], 
  [0.2, 0.2, 0.2, 0.05], 
  [0.1, 0.09, 0.1, 0.0775], 
  [0.25, 0.25, 0.25, 0.225], 
  [0.25, 0.25, 0.25, 0.2375], 
  [0.2, 0.2, 0.2, 0.2], 
  [0.15, 0.15, 0.15, 0.15], 
  [0.1, 0.1, 0.1, 0.1]
];

const sun = myfunctions.createSun(scene, p_sizes[0], textures.sun, 1);
const mercure = myfunctions.createPlanet(scene, p_sizes[1], textures.mercure, p_distances[1]);
const venus = myfunctions.createPlanet(scene, p_sizes[2], textures.venus, p_distances[2]);
const earth = myfunctions.createPlanet(scene, p_sizes[3], textures.earth, 1.0, p_distances[3]);
const moon = myfunctions.createSatelite(scene, earth, p_sizes[10], textures.moon, p_distances[0]);
const mars = myfunctions.createPlanet(scene, p_sizes[4], textures.mars, p_distances[4]);
const jupiter = myfunctions.createPlanet(scene, p_sizes[5], textures.jupiter, p_distances[5]);
const io = myfunctions.createSatelite(scene, jupiter, p_sizes[11], textures.io, p_distances[11]);
const europa = myfunctions.createSatelite(scene, jupiter, p_sizes[12], textures.europa, p_distances[12]);
const ganymede = myfunctions.createSatelite(scene, jupiter, p_sizes[13], textures.ganymede, p_distances[13]);
const callisto = myfunctions.createSatelite(scene, jupiter, p_sizes[14], textures.callisto, p_distances[14]);
const saturne = myfunctions.createPlanetWithRing(scene, p_sizes[5], textures.saturne, p_distances[6], 0, 5, textures.ring);
const titan = myfunctions.createSatelite(scene, saturne, p_sizes[15], textures.titan, p_distances[15]);
const uranus = myfunctions.createPlanet(scene, p_sizes[6], textures.uranus, p_distances[7]);
const neptune = myfunctions.createPlanet(scene, p_sizes[7], textures.neptune, p_distances[8]);
const triton = myfunctions.createSatelite(scene, neptune, p_sizes[16], textures.titan, p_distances[16]);
const pluton = myfunctions.createPlanet(scene, p_sizes[8], textures.pluton, p_distances[9]);

const rotationData = [
    [sun, 0, 0, 0.00045, false, null],
    [mercure, p_distances[1], 0.000002, 0.01, false, null],
    [venus, p_distances[2], 0.000012, 0.005, false, null],
    [earth, p_distances[3], 0.00001, 0.004, false, null],
    [mars, p_distances[4], 0.000008, 0.001, false, null],
    [jupiter, p_distances[5], 0.000002, 0.0007, false, null],
    [saturne, p_distances[6], 0.000001, 0.00045, false, null],
    [uranus, p_distances[7], 0.0000007, 0.00001, false, null],
    [neptune, p_distances[8], 0.0000006, 0.0003, false, null],
    [pluton, p_distances[9], 0.0000005, 0.00015, false, null],
    [moon, p_distances[10], 0.0005, 0.001, true, earth],
    [io, p_distances[11], 0.000002, 0.025, true, jupiter],
    [europa, p_distances[12], 0.000002, 0.0005, true, jupiter],
    [ganymede, p_distances[13], 0.000008, 0.0005, true, jupiter],
    [callisto, p_distances[14], 0.00001, 0.0025, true, jupiter],
    [titan, p_distances[15], 0.000007, 0.015, true, saturne],
    [triton, p_distances[16], 0.000005, 0.001, true, neptune],
];

// const halo = myfunctions.addSunHalo(sun, 18, 0xffffaa, 0.1);

const halo = myfunctions.addSunHalo(sun, 20 , 0xffffaa, 0.02);
const halobloom = myfunctions.addSunHaloAdvanced(sun, 160, 0xffffaa, 0.8);

const skyGeo = new THREE.SphereGeometry(400, 24, 24); 

const skyMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("textures/starfield.jpg"),
    side: THREE.BackSide 
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const planets = [mercure, venus, earth, mars, jupiter, saturne, uranus, neptune, pluton, moon, io, europa, ganymede, callisto, titan, triton];
const galaxy = [sun, mercure, venus, earth, mars, jupiter, saturne, uranus, neptune, pluton, moon, io, europa, ganymede, callisto, titan, triton];

const userLanguage = navigator.language || navigator.userLanguage;
const planets_info = await myfunctions.GetLanguage(userLanguage);

// Listeners to Users action and their interactions. 
myfunctions.initializeEnvironment(camera, cameraControls, planets, raycaster, mouse, halo, halobloom, renderer, clock, followedPlanet);

const select = document.getElementById('planetSelect');

select.addEventListener('change', () => {

    // myfunctions.disableCollision();

    myfunctions.removePlanetMenu();
    const index = parseInt(select.value);
    
    const planet_change = planets[index];
    const planet_info_change = planets_info[index].description;

    myfunctions.focusOnPlanet(planet_change, planet_info_change);
    cameraControls.smoothTime = 0.7;

    // cameraControls.colliderMeshes = [];
});

select.addEventListener("mouseenter", (event) => {isChoosing = true;})

select.addEventListener("mouseout", (event) => {isChoosing = false;})

window.addEventListener('click', (event) => {

    if (isChoosing === false) {
        myfunctions.removePlanetMenu();
        myfunctions.onClickPlanet(event, planets_info)
        cameraControls.smoothTime = 0.7;
        // myfunctions.disableCollision();
        // cameraControls.colliderMeshes = [];
    }
}, false);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



// Main loop to make all stick together.
// cameraControls.colliderMeshes = galaxy;
// myfunctions.enableCollision(cameraControls.colliderMeshes, galaxy);
myfunctions.animate(scene, camera, rotationData, sun, sky, galaxy, null);

myfunctions.MakeStars(scene);
