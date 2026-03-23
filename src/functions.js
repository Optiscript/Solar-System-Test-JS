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
let haloGroup;

export let transition = true

export function initializeEnvironment(cam, controls, planetsArray, ray, mouseVec, sunHalo, haloBloom, render, clk, p_sizes, p_camera, followedPlanet) {
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
    haloGroup = haloBloom;
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

export function createSun(scene, size, texture, intensity = 0.5, lightDistance = 500) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sun = new THREE.Mesh(geometry, material);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xfdffbe, intensity, lightDistance);
    sun.add(light);

    light.castShadow = true;

    light.shadow.camera.left = -4000;
    light.shadow.camera.right = 4000;
    light.shadow.camera.top = 4000;
    light.shadow.camera.bottom = -4000;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 10000;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.radius = 4;
    light.shadow.bias = -0.0005;

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
    const haloGroup = new THREE.Group();
    
    const layers = [
        { scale: 1.0, opacity: intensity * 0.6, segments: 32 },
        { scale: 1.3, opacity: intensity * 0.4, segments: 24 },
        { scale: 1.8, opacity: intensity * 0.2, segments: 16 },
    ];
    
    layers.forEach(layer => {
        const geometry = new THREE.SphereGeometry(size * layer.scale, layer.segments, layer.segments);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: layer.opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const haloMesh = new THREE.Mesh(geometry, material);
        haloMesh.position.set(0, 0, 0);
        haloGroup.add(haloMesh);
    });

    const coreGeometry = new THREE.SphereGeometry(size * 0.8, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: intensity * 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    haloGroup.add(coreMesh);
    
    sun.add(haloGroup);
    return haloGroup;
}

export function addSunHaloAdvanced(sun, size, color, intensity) {
    const haloGroup = new THREE.Group();
    const sprites = []; // On stocke les sprites pour les mettre à jour plus tard
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
    gradient.addColorStop(0.05, 'rgba(255, 255, 200, 0.8)');
    gradient.addColorStop(0.1, 'rgba(255, 200, 50, 0.3)'); 
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const glowTexture = new THREE.CanvasTexture(canvas);
    
    const spriteScales = [1.2, 2.5, 5.0]; 
    const spriteOpacities = [0.7, 0.4, 0.1];
    
    spriteScales.forEach((scale, index) => {
        const baseOpacity = spriteOpacities[index] * intensity;
        const spriteMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: color,
            transparent: true,
            opacity: baseOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(size * scale, size * scale, 1);
        
        // On sauvegarde l'opacité de base dans userData pour le calcul de l'update
        sprite.userData.baseOpacity = baseOpacity;
        
        haloGroup.add(sprite);
        sprites.push(sprite);
    });

    // On crée la méthode de mise à jour DYNAMIQUE
    haloGroup.update = (camera) => {
        const sunPos = new THREE.Vector3();
        sun.getWorldPosition(sunPos);

        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);

        const toSun = new THREE.Vector3().subVectors(sunPos, camera.position).normalize();
        
        // Produit scalaire : 1 si face au soleil, 0 à 90 degrés
        let dot = cameraDir.dot(toSun);
        
        // On utilise une puissance (10) pour que le halo disparaisse vite 
        // dès qu'on ne regarde plus directement le soleil
        let fade = Math.pow(Math.max(0, dot), 10); 

        sprites.forEach(s => {
            s.material.opacity = s.userData.baseOpacity * fade;
        });
    };

    sun.add(haloGroup);
    return haloGroup;
}

export function MakeStars(scene) {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    const particulescount = 5000;
    const starRadius = 390;

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
        fontsize = 32,
        borderThickness = 4,
        borderColor = { r: 162, g: 169, b: 177, a: 1.0 },
        backgroundColor = { r: 248, g: 249, b: 250, a: 1.0 },
        lineHeight = fontsize * 1.2,
    } = parameters;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    context.font = `${fontsize}px ${fontface}`;
    const lines = message.split('\n');
    
    let maxWidth = 0;
    lines.forEach(line => {
        maxWidth = Math.max(maxWidth, context.measureText(line).width);
    });

    const padding = borderThickness * 4;
    canvas.width = maxWidth + padding;
    canvas.height = lineHeight * lines.length + padding;

    context.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
    context.strokeStyle = `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`;
    context.lineWidth = borderThickness;

    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = `${fontsize}px ${fontface}`;
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    lines.forEach((line, i) => {
        const yPos = (i + 0.5) * (canvas.height / lines.length);
        context.fillText(line, canvas.width / 2, yPos);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    sprite.scale.set(canvas.width / 100, canvas.height / 100, 1);
    sprite.userData.aspect = canvas.width / canvas.height;

    return sprite;
}


export function enableCollision(cameraC, galaxy) {
    galaxy.forEach((planet) => {
            cameraC.colliderMesh.push(planet);
        });
};

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
    
    const label = createTextSprite(info, { fontsize: 64 });
    label.position.set(0, 0, 0);

    const targetHeight = planet.geometry.parameters.radius * 0.8; 
    const aspect = label.userData.aspect;

    label.scale.set(targetHeight * aspect, targetHeight, 1);
    menuGroup.add(box);
    menuGroup.add(label);

    planet.add(menuGroup);
    const sep = planet.geometry.parameters.radius * 2;
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
    try {
        const res = await fetch(`lang/planets_info_${lang}.json`);
        
        if (!res.ok) {
            throw new Error(`Language pack ${lang} not found.`);
        }
        
        return await res.json();
    } catch (error) {
        console.warn(`Falling back to English: ${error.message}`);
        const fallbackRes = await fetch(`lang/planets_info_en.json`);
        return await fallbackRes.json();
    }
}

export async function GetLanguage(langCode) {
    // We await the result here to return the actual data
    return await loadLanguage(langCode);
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
        // if (halo) halo.material.opacity = 0.1 + 0.01 * Math.sin(Date.now() * 0.001);

        if (followedPlanet) {

            const targetSize = followedPlanet.geometry.parameters.radius;
            const target = new THREE.Vector3();
            followedPlanet.getWorldPosition(target);

            cameraControls.setLookAt(
                target.x + targetSize * 3, target.y + targetSize * 3, target.z + targetSize * 3,
                target.x, target.y + (targetSize * 0.2), target.z,
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

        if (haloGroup && typeof haloGroup.update === 'function') {
            haloGroup.update(camera);
        };
        
        renderer.render(scene, camera);
    });
}


