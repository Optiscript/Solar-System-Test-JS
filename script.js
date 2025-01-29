const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createPlanet(size, texture, distance) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: new
    THREE.TextureLoader().load(texture) });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    return planet;
}

const sunTexture = 'textures/sun.jpg'; // Remplacez par le chemin vers votre texture du soleil
const earthTexture = 'textures/earth.jpg'; // Remplacez par le chemin vers votre texture de la Terre
const marsTexture = 'textures/mars.jpg'; // Remplacez par le chemin vers votre texture de Mars
const starsTexture = 'textures/stars.jpg'; // Remplacez par le chemin vers votre texture d'étoiles
const jupiterTexture = 'textures/jupiter.jpg';
const saturneTexture = 'textures/saturne.jpg';
const neptuneTexture = 'textures/neptune.jpg';
const plutonTexture = 'textures/pluton.jpg';
const jupiterRingTexture = 'textures/jupiterRing.jpg';

const sun = createPlanet(4, sunTexture, 0);
const earth = createPlanet(1, earthTexture, 10);
const mars = createPlanet(0.8, marsTexture, 15);
const jupiter = createPlanet(2, jupiterTexture, 22.5);
const saturne = createPlanet(1.8, saturneTexture, 27);
const neptune = createPlanet(0.7, neptuneTexture, 32);
const pluton = createPlanet(0.3, plutonTexture, 35);

const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(starsTexture), side: THREE.BackSide}); // Fond noir pour simplifier; designed by freepik : https://fr.freepik.com/photos-gratuite/fond-galaxie-sombre_13463720.htm#fromView=keyword&page=1&position=20&uuid=5ab16b50-8b45-44e4-b665-9f796b26dc58&new_detail=true&query=Texture+Galaxie
const starField = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starField);

camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    
    // Rotation des planètes autour du soleil
    earth.position.x = 10 * Math.cos(Date.now() * 0.001);
    earth.position.z = 10 * Math.sin(Date.now() * 0.001);
    
    mars.position.x = 15 * Math.cos(Date.now() * 0.0008);
    mars.position.z = 15 * Math.sin(Date.now() * 0.0008);

    jupiter.position.x = 22.5 * Math.cos(Date.now() * 0.0005);
    jupiter.position.z = 22.5 * Math.sin(Date.now() * 0.0005);

    saturne.position.x = 27 * Math.cos(Date.now() * 0.0001);
    saturne.position.z = 27 * Math.sin(Date.now() * 0.0001);

    neptune.position.x = 32 * Math.cos(Date.now() * 0.00009);
    neptune.position.z = 32 * Math.sin(Date.now() * 0.00009);

    pluton.position.x = 35 * Math.cos(Date.now() * 0.00005);
    pluton.position.z = 35 * Math.sin(Date.now() * 0.00005);

    // Rotation des planètes sur elles-mêmes
    earth.rotation.y += 0.01; // Rotation sur l'axe Y pour la Terre
    mars.rotation.y += 0.008; // Rotation sur l'axe Y pour Mars

    // Rotation du soleil sur lui-même (si nécessaire)
    sun.rotation.y += 0.005; // Rotation sur l'axe Y pour le Soleil
    
    renderer.render(scene, camera);
}
    
animate();

// Fonction de zoom avec la molette
document.addEventListener('wheel', (event) => {
    const zoomSpeed = 1; // Ajustez la vitesse de zoom
    camera.position.z += event.deltaY * 0.01 * zoomSpeed;
    
    // Limitez le zoom
    camera.position.z = Math.max(10, Math.min(50, camera.position.z));
});