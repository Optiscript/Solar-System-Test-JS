//Special Thanks for www.shadedrelief.com for their amazing earth's textures. M.GIGARD for the code idea and few code itself. And the three.js team for creating such good 3D web tools.
// Images by https://www.solarsystemscope.com/, used under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).

import CameraControls from 'https://cdn.jsdelivr.net/npm/camera-controls@2.10.1/+esm';

import * as myfunctions from './functions.js' ;

console.log("all shit loaded, god thanks");


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



const sun = myfunctions.createSun(scene, 4, textures.sun, 1.25);
const mercure = myfunctions.createPlanet(scene, 0.3, textures.mercure, 10);
const venus = myfunctions.createPlanet(scene, 0.4, textures.venus, 14);
const earth = myfunctions.createPlanet(scene, 0.8, textures.earth, 20);
const mars = myfunctions.createPlanet(scene, 0.6, textures.mars, 25);
const jupiter = myfunctions.createPlanet(scene, 2, textures.jupiter, 37);
const saturne =myfunctions. createPlanetWithRing(scene, 1.8, textures.saturne, 50, 0.5, 4, textures.ring);
const uranus = myfunctions.createPlanet(scene, 0.8, textures.uranus, 68);
const neptune = myfunctions.createPlanet(scene, 0.7, textures.neptune, 76);
const pluton = myfunctions.createPlanet(scene, 0.3, textures.pluton, 85);

const halo = myfunctions.addSunHalo(sun, 4.5, 0xffffaa, 0.1);

const starfieldTexture = new THREE.TextureLoader().load('textures/starfield.jpg');

const skyGeo = new THREE.SphereGeometry(300, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("textures/starfield.jpg"),
    side: THREE.BackSide // important !
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const planets = [mercure, venus, earth, mars, jupiter, saturne, uranus, neptune, pluton];

var planets_info = [
    {
        name: "Mercure",
        type: "Planète rocheuse",
        description: "Mercure est la planète la plus proche du Soleil. Elle est petite, sans atmosphère significative, \n et connaît des écarts de température extrêmes entre le jour et la nuit."
    },
    {
        name: "Vénus",
        type: "Planète rocheuse",
        description: "Vénus est similaire à la Terre en taille, mais son atmosphère dense \n et toxique en fait la planète la plus chaude du Système solaire."
    },
    {
        name: "Terre",
        type: "Planète rocheuse",
        description: "La Terre est la seule planète connue à abriter la vie. Elle possède de l’eau liquide, \n une atmosphère riche en oxygène et un satellite naturel : la Lune."
    },
    {
        name: "Mars",
        type: "Planète rocheuse",
        description: "Mars, la planète rouge, possède des volcans géants, des vallées, \n et des calottes polaires. Elle pourrait avoir abrité de l’eau liquide dans le passé."
    },
    {
        name: "Jupiter",
        type: "Géante gazeuse",
        description: "Jupiter est la plus grande planète du Système solaire. \n Elle est célèbre pour sa Grande Tache Rouge, une gigantesque tempête, et possède des dizaines de lunes."
    },
    {
        name: "Saturne",
        type: "Géante gazeuse",
        description: "Saturne est reconnaissable à ses impressionnants anneaux \n faits de glace et de poussière. Elle est entourée de nombreuses lunes."
    },
    {
        name: "Uranus",
        type: "Géante glacée",
        description: "Uranus est une planète bleue inclinée sur le côté, ce qui rend son axe de rotation unique. \NSon atmosphère contient du méthane qui lui donne sa couleur."
    },
    {
        name: "Neptune",
        type: "Géante glacée",
        description: "Neptune est la planète la plus lointaine du Soleil. Elle est bleue, \ntrès venteuse et possède une atmosphère dynamique riche en méthane."
    },
    {
        name: "Pluton",
        type: "Planète naine",
        description: "Pluton est une petite planète naine glacée située dans la ceinture de Kuiper. \nElle a été considérée comme une planète jusqu’en 2006."
    }
];


myfunctions.initializeEnvironment(camera, cameraControls, planets, raycaster, mouse, halo, renderer, clock);
window.addEventListener('click', (event) => myfunctions.onClickPlanet(event, planets_info), false);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const rotationData = [
    [sun, 0, 0, 0.00045],
    [mercure, 10, 0.0002, 0.01],
    [venus, 15, 0.00012, 0.005],
    [earth, 20, 0.000085, 0.001],
    [mars, 25, 0.00008, 0.001],
    [jupiter, 37, 0.00002, 0.0007],
    [saturne, 50, 0.00001, 0.00045],
    [uranus, 68, 0.000007, 0.00001],
    [neptune, 76, 0.000006, 0.0003],
    [pluton, 85, 0.000005, 0.00015],
];

myfunctions.animate(scene, camera, rotationData, sun, sky); // sky est la sphère d’étoiles

