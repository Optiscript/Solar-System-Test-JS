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
const marsTexture = 'textures/mars.png'; // Remplacez par le chemin vers votre texture de Mars
const starsTexture = 'textures/stars.jpg'; // Remplacez par le chemin vers votre texture d'étoiles
const jupiterTexture = 'textures/jupiter.jpg';
const jupiterRingTexture = 'textures/jupiterRing.jpg';

const sun = createPlanet(4, sunTexture, 0);
const earth = createPlanet(1, earthTexture, 10);
const mars = createPlanet(0.8, marsTexture, 15);

const jupiterPlanet = createPlanet(2, jupiterTexture, 30);
const jupiterRing = new THREE.RingGeometry( 3, 35, 32 );
const jupiterMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(jupiterTexture) }); 

const jupiterGroup = new THREE.Group();
jupiterGroup.position.x = 30;

jupiterGroup.add(jupiterPlanet);
jupiterGroup.add(jupiterRing);

scene.add(jupiterGroup);

const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
color: 0x000000, // Fond noir pour simplifier
side: THREE.BackSide});
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

    jupiterGroup.position.x = 30 * Math.cos(Date.now() * 0.001);
    jupiterGroup.position.z = 30 * Math.sin(Date.now() * 0.001);

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