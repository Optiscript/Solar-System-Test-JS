// Importing dependencies.
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
renderer.setPixelRatio(1);

//Setting the page size to the good resolution.
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*

//VR integration.
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

document.body.appendChild(renderer.domElement);

const controller_l = renderer.xr.getController(0);
const controller_r = renderer.xr.getController(1);
scene.add(controller_l);
scene.add(controller_r);
*/

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
  0, // I'm Dumb
  // Planets
  0.9420, // [1] Mercure
  2.3371, // [2] Venus
  2.4604, // [3] Terre
  1.3090, // [4] Mars
  26.9978, // [5] Jupiter
  22.4879, // [6] Saturne
  9.7948, // [7] Uranus
  9.5094, // [8] Neptune
  0.4589, // [9] Pluton

  // Lunes
  0.6710, // [10] Moon → Earth
  0.7031, // [11] Io
  0.6029, // [12] Europa
  1.0171, // [13] Ganymede
  0.9307, // [14] Callisto
  0.9940, // [15] Titan
  0.5225  // [16] Triton
];


const p_distances = [
  0.1476,   // [0] Moon → Earth
  23.866  + 170,   // [1] Mercure
  64.216  + 170,   // [2] Venus
  110.717 + 170,   // [3] Earth
  172.472 + 170,   // [4] Mars
  320.095 + 170,   // [5] Jupiter
  586.553 + 170,   // [6] Saturn
  1180.488 + 170,  // [7] Uranus
  1300.710 + 170,  // [8] Neptune
  1500.390 + 170,  // [9] Pluton

  // Lunes → planète
  5.2160,   // [10] Moon → Earth
  54.7333,  // [11] Io → Jupiter
  62.5573,  // [12] Europa → Jupiter
  73.0877,  // [13] Ganymede → Jupiter
  81.8959,  // [14] Callisto → Jupiter
  60.4852,  // [15] Titan → Saturn
  19.6593   // [16] Triton → Neptune
];
scene.scale.setScalar(0.2); // ou 0.8 / 1.2




const p_camera = [[1.5,1,0.85,1],[3,3,3,3],[4,4,4,1],[2,1.8,2,1.55],[5,5,5,4.5],[5,5,5,4.75],[4,4,4,4],[3,3,3,3],[2,2,2,2]];

const sun = myfunctions.createSun(scene, 170, textures.sun, 1.5);
const mercure = myfunctions.createPlanet(scene, p_sizes[1], textures.mercure, p_distances[1]);
const venus = myfunctions.createPlanet(scene, p_sizes[2], textures.venus, p_distances[2]);
const earth = myfunctions.createPlanet(scene, p_sizes[3], textures.earth, 20, p_distances[3]);
const moon = myfunctions.createSatelite(scene, earth, p_sizes[10], textures.moon, p_distances[0]);
const mars = myfunctions.createPlanet(scene, p_sizes[4], textures.mars, p_distances[4]);
const jupiter = myfunctions.createPlanet(scene, p_sizes[5], textures.jupiter, p_distances[5]);
const io = myfunctions.createSatelite(scene, jupiter, p_sizes[11], textures.io, p_distances[11]);
const europa = myfunctions.createSatelite(scene, jupiter, p_sizes[12], textures.europa, p_distances[12]);
const ganymede = myfunctions.createSatelite(scene, jupiter, p_sizes[13], textures.ganymede, p_distances[13]);
const callisto = myfunctions.createSatelite(scene, jupiter, p_sizes[14], textures.callisto, p_distances[14]);
const saturne = myfunctions. createPlanetWithRing(scene, p_sizes[5], textures.saturne, p_distances[6], 30, 50, textures.ring);
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

const halo = myfunctions.addSunHalo(sun, 180, 0xffffaa, 0.1);

const skyGeo = new THREE.SphereGeometry(2400, 32, 32);
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
myfunctions.initializeEnvironment(camera, cameraControls, planets, raycaster, mouse, halo, renderer, clock, followedPlanet);

const select = document.getElementById('planetSelect');

select.addEventListener('change', () => {

    // myfunctions.disableCollision();

    myfunctions.removePlanetMenu();
    const index = parseInt(select.value);
    
    const planet_change = planets[index];
    const planet_info_change = planets_info[index].description;

    myfunctions.focusOnPlanet(planet_change, planet_info_change);
    cameraControls.smoothTime = 0.7;
});

select.addEventListener("mouseenter", (event) => {isChoosing = true;})

select.addEventListener("mouseout", (event) => {isChoosing = false;})

window.addEventListener('click', (event) => {

    if (isChoosing === false) {
        myfunctions.removePlanetMenu();
        myfunctions.onClickPlanet(event, planets_info)
        cameraControls.smoothTime = 0.7;
        // myfunctions.disableCollision();
    }
}, false);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



// Main loop to make all stick together.
myfunctions.animate(scene, camera, rotationData, sun, sky, galaxy, null); // sky est la sphère d’étoiles

myfunctions.MakeStars(scene);
