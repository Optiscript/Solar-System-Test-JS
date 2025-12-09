//Special Thanks for www.shadedrelief.com for their amazing earth's textures. M.GIGARD for the code idea and few code itself. And the three.js team for creating such good 3D web tools.
// Images by https://www.solarsystemscope.com/, used under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).

//import { VRButton } from '/Solar-System-Test-JS/node_modules/three/examples/jsm/webxr/VRButton.js';

//import CameraControls from '/Solar-System-Test-JS/node_modules/camera-controls/dist/camera-controls.module.js';

import * as THREE from '../node_modules/three/build/three.module.js';

import CameraControls from '../node_modules/camera-controls/dist/camera-controls.module.js';

import * as myfunctions from './functions.js' ;

// CameraControls.install( { THREE: THREE } );

import { VRButton } from '../node_modules/three/examples/jsm/webxr/VRButton.js';

console.log(CameraControls);


console.log("all shit loaded, god thanks");


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

renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

document.body.appendChild(renderer.domElement);

const controller_l = renderer.xr.getController(0);
const controller_r = renderer.xr.getController(1);
scene.add(controller_l);
scene.add(controller_r);


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


const p_sizes = [0.3, 0.4, 0.8, 0.6, 2, 1.8, 0.8, 0.7, 0.3];
const p_camera = [[1.5,1,0.85,1],[3,3,3,3],[4,4,4,1],[2,1.8,2,1.55],[5,5,5,4.5],[5,5,5,4.75],[4,4,4,4],[3,3,3,3],[2,2,2,2]];

const sun = myfunctions.createSun(scene, 4, textures.sun, 1.25);
const mercure = myfunctions.createPlanet(scene, p_sizes[1], textures.mercure, 10);
const venus = myfunctions.createPlanet(scene, p_sizes[2], textures.venus, 14);
const earth = myfunctions.createPlanet(scene, p_sizes[3], textures.earth, 20);
const mars = myfunctions.createPlanet(scene, p_sizes[3], textures.mars, 25);
const jupiter = myfunctions.createPlanet(scene, p_sizes[4], textures.jupiter, 37);
const saturne =myfunctions. createPlanetWithRing(scene, p_sizes[5], textures.saturne, 50, 0.5, 4, textures.ring);
const uranus = myfunctions.createPlanet(scene, p_sizes[6], textures.uranus, 68);
const neptune = myfunctions.createPlanet(scene, p_sizes[7], textures.neptune, 76);
const pluton = myfunctions.createPlanet(scene, p_sizes[8], textures.pluton, 85);

const halo = myfunctions.addSunHalo(sun, 4.5, 0xffffaa, 0.1);

const starfieldTexture = new THREE.TextureLoader().load('textures/starfield.jpg');

const skyGeo = new THREE.SphereGeometry(300, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("textures/starfield.jpg"),
    transparent: true,
    side: THREE.BackSide 
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
        description: "Mercure est la planète la plus proche du Soleil. \nElle est petite, sans atmosphère significative, \n et connaît des écarts de température extrêmes \nentre le jour et la nuit."
    },
    {
        name: "Vénus",
        type: "Planète rocheuse",
        description: "Vénus est similaire à \nla Terre en taille, mais son atmosphère dense \n et toxique en fait la \nplanète la plus chaude du Système solaire."
    },
    {
        name: "Terre",
        type: "Planète rocheuse",
        description: "La Terre est la seule planète \nconnue à abriter la vie. Elle possède de l’eau liquide, \n une atmosphère riche en oxygène et \nun satellite naturel : la Lune."
    },
    {
        name: "Mars",
        type: "Planète rocheuse",
        description: "Mars, la planète rouge, \npossède des volcans géants, des vallées, \n et des calottes polaires. \nElle pourrait avoir abrité de l’eau liquide dans le passé."
    },
    {
        name: "Jupiter",
        type: "Géante gazeuse",
        description: "Jupiter est la plus grande planète \ndu Système solaire. \n Elle est célèbre pour sa Grande Tache Rouge,\n une gigantesque tempête, et possède des dizaines de lunes."
    },
    {
        name: "Saturne",
        type: "Géante gazeuse",
        description: "Saturne est reconnaissable à ses impressionnants anneaux \n faits de glace et de poussière. \nElle est entourée de nombreuses lunes."
    },
    {
        name: "Uranus",
        type: "Géante glacée",
        description: "Uranus est une planète bleue inclinée sur le côté, \nce qui rend son axe de rotation unique. \nSon atmosphère contient \ndu méthane qui lui donne sa couleur."
    },
    {
        name: "Neptune",
        type: "Géante glacée",
        description: "Neptune est la planète la plus \nlointaine du Soleil. Elle est bleue, \ntrès venteuse et possède \nune atmosphère dynamique riche en méthane."
    },
    {
        name: "Pluton",
        type: "Planète naine",
        description: "Pluton est une petite planète naine \nglacée située dans la ceinture de Kuiper. \nElle a été considérée comme une planète jusqu’en 2006."
    },

    // --- Lunes ajoutées ---
    {
        name: "Lune",
        type: "Satellite naturel (Terre)",
        description: "La Lune est le seul satellite naturel de la Terre. \nElle est le cinquième plus grand satellite du Système solaire \net influence fortement les marées terrestres."
    },
    {
        name: "Io",
        type: "Satellite naturel (Jupiter - 1)",
        description: "Io est la lune la plus volcanique du Système solaire. \nSa surface est constamment remodelée par des éruptions géantes."
    },
    {
        name: "Europe",
        type: "Satellite naturel (Jupiter - 2)",
        description: "Europe possède une surface glacée et lisse, \nsous laquelle se trouve possiblement un océan liquide \nenfoui, ce qui en fait un candidat potentiel pour la vie."
    },
    {
        name: "Ganymède",
        type: "Satellite naturel (Jupiter - 3)",
        description: "Ganymède est la plus grande lune du Système solaire. \nElle est même plus grande que Mercure \net possède son propre champ magnétique."
    },
    {
        name: "Callisto",
        type: "Satellite naturel (Jupiter - 4)",
        description: "Callisto est une lune très cratérisée, \nprobablement l’un des objets les plus anciens du Système solaire."
    },
    {
        name: "Titan",
        type: "Satellite naturel (Saturne)",
        description: "Titan possède une atmosphère dense et des lacs d’hydrocarbures. \nC’est le seul autre corps connu à avoir des liquides stables en surface."
    },
    {
        name: "Triton",
        type: "Satellite naturel (Neptune)",
        description: "Triton orbite en sens inverse de la rotation de Neptune, \nce qui suggère qu’il s’agit d’un objet capturé. \nSa surface glacée émet des geysers d’azote."
    }
];


myfunctions.initializeEnvironment(camera, cameraControls, planets, raycaster, mouse, halo, renderer, clock);
window.addEventListener('click', (event) => myfunctions.onClickPlanet(event, planets_info, p_sizes, p_camera), false);
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

myfunctions.animate(scene, camera, rotationData, sun, sky, p_sizes, p_camera); // sky est la sphère d’étoiles

myfunctions.MakeStars(scene);












