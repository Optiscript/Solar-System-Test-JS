export let activeMenu = null;

let followedPlanet;
let camera = null;
let cameraControls = null;
let planets = [];
let raycaster = null;
let mouse = null;
let halo = null;
let renderer = null;
let clock = null;
let ifcolisionsenabled;

export let transition = true

export function initializeEnvironment(cam, controls, planetsArray, ray, mouseVec, sunHalo, render, clk, p_sizes, p_camera, followedPlanet) {
    camera = cam;
    cameraControls = controls;
    planets = planetsArray;
    raycaster = ray;
    mouse = mouseVec;
    halo = sunHalo;
    renderer = render;
    clock = clk;
    p_sizes = p_sizes;
    p_camera = p_camera;
    followedPlanet = followedPlanet;
}

export function createPlanet(scene, size, texture, distance) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);

    planet.castShadow = true;
    planet.receiveShadow = true;

    return planet;
}

export function createSatelite(scene, planet, size, texture, distance) {

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0
    });

    const satellite = new THREE.Mesh(geometry, material);
    const positions = new THREE.Vector3();
    planet.getWorldPosition(positions);
    satellite.position.copy(positions);

    planet.add(satellite);

    satellite.position.x += distance;
         
    scene.add(satellite);


    satellite.castShadow = true;
    satellite.receiveShadow = true;

        
    return satellite;
}

export function createPlanetWithRing(scene, size, texture, distance, innerDiameter, outerDiameter, ringTexture) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);

    const ringMaterial = new THREE.MeshPhongMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        shininess: 15
    });

    planet.castShadow = true;
    planet.receiveShadow = true;

    const ringGeometry = new THREE.RingGeometry(innerDiameter, outerDiameter, 64);
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.receiveShadow = true;
    ringMesh.position.copy(planet.position);

    const fullPlanet = new THREE.Group();
    fullPlanet.add(planet);
    fullPlanet.add(ringMesh);

    fullPlanet.position.x = distance;
    scene.add(fullPlanet);

    return fullPlanet;
}

export function createSun(scene, size, texture, intensity = 0.5, lightDistance = 1000) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sun = new THREE.Mesh(geometry, material);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xfdffbe, intensity, lightDistance);
    sun.add(light);

    light.castShadow = true;
    light.shadow.mapSize.width = 1028;
    light.shadow.mapSize.height = 1028;

    light.shadow.camera.left = -4000;
    light.shadow.camera.right = 4000;
    light.shadow.camera.top = 4000;
    light.shadow.camera.bottom = -4000;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 10000;

    scene.add(sun);
    return sun;
}


export function MakeRotate(obj, distance, speed, axialrotation, ifsatellite, link) {
    if (ifsatellite == false) {
    obj.position.x = distance * Math.cos(Date.now() * speed);
    obj.position.z = distance * Math.sin(Date.now() * speed);
    obj.rotation.y += axialrotation;
    } else {
        const linkPosition = new THREE.Vector3();
        link.getWorldPosition(linkPosition);
        
        obj.position.x = (link.position.x) + distance * Math.cos(Date.now() * speed);
        obj.position.z = (link.position.z) + distance * Math.sin(Date.now() * speed);
        obj.rotation.y += axialrotation;
    }
}



export function addSunHalo(sun, size = 6, color = 0xffffaa, intensity = 0.5) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const haloMesh = new THREE.Mesh(geometry, material);
    haloMesh.position.set(0, 0, 0);
    sun.add(haloMesh);
    return haloMesh;
}

export function MakeStars(scene) {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    const particulescount = 10000;
    const starRadius = 2300;

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
}

export function createTextSprite(message, parameters = {}) {
    const {
        fontface = 'Libertinus Serif, Linux Libertine, serif',
        fontsize = 24,
        borderThickness = 4,
        borderColor = { r: 162, g: 169, b: 177, a: 1.0 }, // #616569ff
        backgroundColor = { r: 248, g: 249, b: 250, a: 1.0 }, // #f8f9fa
        lineHeight = fontsize * 0.9,
        scaleFactor = 100,
        vertical = false
    } = parameters;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontsize}px ${fontface}`;

    // make text vertical if requested
    const lines = vertical ? message.split('') : message.split('\n');

    let maxWidth = 0;
    for (let line of lines) {
        const metrics = context.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width);
    }

    const padding = borderThickness * 2;
    canvas.width = maxWidth + padding;
    canvas.height = lineHeight * lines.length + padding;

    context.font = `${fontsize}px ${fontface}`;
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;
    context.lineWidth = borderThickness;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(0,0,0,1.0)";
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], borderThickness, borderThickness + lineHeight * (i + 0.8));
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set( 
        (canvas.width / scaleFactor) * 0.6,   // narrower
        (canvas.height / scaleFactor) * 1.2,  // taller
        1
    );

    return sprite;
}

/* export function enableCollision(cameraC, galaxy) {
    galaxy.forEach((planeta) => {
            cameraC.colliderMesh.push(planeta);
        });
} */

export function disableCollision() {
    ifcolisionsenabled = cameraControls.colliderMesh;
    cameraControls.colliderMesh = [];
}


export function onClickPlanet(event, planetsInfo) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets, true);

    if (intersects.length > 0) {
        const selectedPlanet = intersects[0].object;
        const index = planets.findIndex(p => p === selectedPlanet || p.children?.includes(selectedPlanet));
        if (index >= 0) focusOnPlanet(planets[index], planetsInfo[index].description);
    } 
    
    else {
        followedPlanet = null;
        removePlanetMenu();
    }

}

export function focusOnPlanet(planet, info) {
    followedPlanet = planet;

    if (followedPlanet.type == "Group") {

        followedPlanet = followedPlanet.children[0];
        planet = followedPlanet;
   }

    activeMenu = createPlanetMenu(planet, info);
}

export function createPlanetMenu(planet, info) {
    const menuGroup = new THREE.Group();

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.001, 0.01),
        new THREE.MeshBasicMaterial({ color: 0x222244, transparent: true, opacity: 0.8 })
    );

    const label = createTextSprite(info, { fontsize: planet.geometry.parameters.radius * 35 });
    label.position.set(0, 0, 0);

    menuGroup.add(box);
    menuGroup.add(label);

    planet.add(menuGroup);
    const sep = planet.geometry.parameters.radius * 2.5;
    menuGroup.position.set(0, sep, 0);

    return menuGroup;
}

export function removePlanetMenu() {
    if (activeMenu) {
        activeMenu.parent.remove(activeMenu);
        activeMenu.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        });
        activeMenu = null;
    }
    followedPlanet = null;
    transition = true;
    cameraControls.smoothTime = 0.7
    cameraControls.colliderMesh = ifcolisionsenabled;
}

export async function loadLanguage(lang) {
    const res = await fetch(`lang/planets_info_${lang}.json`);
    return res.json();
}

export async function GetLanguage(promise) {
    const responded_promise = await loadLanguage(promise);
    return responded_promise;
}

export function animate(scene, camera, planetList, sun, stars, galaxy, output) {

    renderer.setAnimationLoop(() => {

        const delta = clock.getDelta();

        if (!renderer.xr.isPresenting) {
        cameraControls.update(delta);
        }

        planetList.forEach(([planet, distance, speed, axial, ifsatellite, link]) => {
            MakeRotate(planet, distance, speed, axial, ifsatellite, link);
        });

        stars.material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001);
        if (halo) halo.material.opacity = 0.1 + 0.01 * Math.sin(Date.now() * 0.001);

        if (followedPlanet) {

            const targetSize = followedPlanet.geometry.parameters.radius;
            const target = new THREE.Vector3();
            followedPlanet.getWorldPosition(target);

            cameraControls.setLookAt(
                target.x + targetSize * 0.7, target.y + targetSize * 0.9, target.z + targetSize * 0.7,
                target.x, target.y + (targetSize * 0.075), target.z,
                transition
            );

            if (cameraControls.smoothTime >= 0.01) {
                cameraControls.smoothTime -= 0.005;
                transition = true;
            };

            if (cameraControls.smoothTime <= 0.01) {
                transition = false;
            };
            

        } else {
            cameraControls.smoothTime = 0.7;
            transition = true;
        }

        renderer.render(scene, camera);
    });
}
