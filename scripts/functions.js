import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
export let followedPlanet = null;
export let activeMenu = null;

let camera = null;
let cameraControls = null;
let planets = [];
let c_distance = null;
let p_camera = [];
let p_camx = null;
let p_camy = null;
let p_camz = null;
let p_camd = null;
let raycaster = null;
let mouse = null;
let halo = null;
let renderer = null;
let clock = null;

export function initializeEnvironment(cam, controls, planetsArray, ray, mouseVec, sunHalo, render, clk, p_sizes, p_camera) {
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
    return planet;
}

export function createPlanet_satelite(scene, size, size_sat, texture, texture_sat, distance, distance_sat) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0
    });

    const geometry_sat = new THREE.SphereGeometry(size_sat, 32, 32);
    const material_sat = new THREE.MeshStandardMaterial({
        map: texture_sat,
        roughness: 1,
        metalness: 0
    });

    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    const satellite = new THREE.Mesh(geometry_sat, material_sat);
    scene.add(satellite);
    

    const plan_sat_group = new THREE.Group();
    plan_sat_group.add(planet);
    plan_sat_group.add(satellite);
    plan_sat_group.position.x = distance;

    return plan_sat_group;
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

    scene.add(sun);
    return sun;
}

export function MakeRotate(obj, distance, speed, axialrotation) {
    obj.position.x = distance * Math.cos(Date.now() * speed);
    obj.position.z = distance * Math.sin(Date.now() * speed);
    obj.rotation.y += axialrotation;
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
    const starRadius = 275;

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
    console.log(stars);
    scene.add(stars);
}

export function createTextSprite(message, parameters = {}) {
    const {
        fontface = 'Arial',
        fontsize = 16,
        borderThickness = 4,
        borderColor = { r: 0, g: 0, b: 0, a: 1.0 },
        backgroundColor = { r: 255, g: 255, b: 255, a: 1.0 },
        lineHeight = fontsize * 1.2,
        scaleFactor = 100, // smaller text
        vertical = false    // stack vertically if true
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

    // Make sprite smaller and optionally taller
    sprite.scale.set(
        (canvas.width / scaleFactor) * 0.6,   // narrower
        (canvas.height / scaleFactor) * 1.2,  // taller
        1
    );

    return sprite;
}




export function onClickPlanet(event, planetsInfo, p_sizes, p_camera) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets, true);

    if (intersects.length > 0) {
        const selectedPlanet = intersects[0].object;
        const index = planets.findIndex(p => p === selectedPlanet || p.children?.includes(selectedPlanet));
        if (index >= 0) focusOnPlanet(planets[index], planetsInfo[index].description, p_sizes[index], p_camera[index]);
    } else {
        followedPlanet = null;
    }
}

export function focusOnPlanet(planet, info, p_sizes, p_camera) {
    followedPlanet = planet;
    c_distance = p_sizes;
    p_camx = p_camera[0];
    p_camy = p_camera[1];
    p_camz = p_camera[2];
    p_camd = p_camera[3];
//    if (activeMenu) {
//        activeMenu.parent.remove(activeMenu);
//        activeMenu = null;
//    }

//    activeMenu = createPlanetMenu(planet, info);

//    const target = planet.position;
//    cameraControls.setLookAt(
//        target.x + 5, target.y + 3, target.z + 5,
//        target.x, target.y, target.z,
//        true
//    );
}

export function createPlanetMenu(planet, info) {
    const menuGroup = new THREE.Group();

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.001, 0.01),
        new THREE.MeshBasicMaterial({ color: 0x222244, transparent: true, opacity: 0.8 })
    );

    const label = createTextSprite(info, { fontsize: 32 });
    label.position.set(2, 0.5, 0.1);

    menuGroup.add(box);
    menuGroup.add(label);

    planet.add(menuGroup);
    menuGroup.position.set(0, 0, 0);

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
}

export function animate(scene, camera, planetList, sun, stars) {

    renderer.setAnimationLoop(() => {

        const delta = clock.getDelta();
        cameraControls.update(delta);

        planetList.forEach(([planet, distance, speed, axial]) => {
            MakeRotate(planet, distance, speed, axial);
        });

        stars.material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001);
        if (halo) halo.material.opacity = 0.1 + 0.01 * Math.sin(Date.now() * 0.001);

        if (followedPlanet) {
            cameraControls.fitToSphere(followedPlanet, true);
        } else {
            removePlanetMenu();
        }

        renderer.render(scene, camera);
    });
}


/* export function animate(scene, camera, planetList, sun, stars) {
    const renderLoop = () => {
        const delta = clock.getDelta();
        cameraControls.update(delta);

        planetList.forEach(([planet, distance, speed, axial]) => {
            MakeRotate(planet, distance, speed, axial);
        });

        stars.material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001);
        if (halo) halo.material.opacity = 0.1 + 0.01 * Math.sin(Date.now() * 0.001);

        if (followedPlanet) {
            const target = followedPlanet.position.clone();
            const pc_distance = p_camera;
            //cameraControls.setLookAt(
              //  target.x + p_camx, target.y + p_camy, target.z + p_camz,
                //target.x, target.y, target.z,
                //true
            //);
            cameraControls.fitToSphere(followedPlanet, true)
            console.log(p_camera[0]);
            console.log(p_camd);
            console.log(p_camx);
            //activeMenu.rotation.y = 0;
            //activeMenu.rotation.z = 0;
            //activeMenu.rotation.x = 0;
            //console.log(activeMenu.rotation);

        } else {
            removePlanetMenu();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(renderLoop);
    };

    renderLoop();
}
*/
//planets.forEach((planet) => {
//    cameraControls.colliderMeshes.push(planet);
//});

//cameraControls.colliderMeshes.push(sun)

//const bb = new THREE.Box3(
    //new THREE.Vector3( -20, 0, -20 ),
  //  new THREE.Vector3( -10, 10, -10 )
//);

//const centerHelper = new THREE.Mesh(
//	new THREE.SphereGeometry( 4 ),
//	new THREE.MeshBasicMaterial( { color: 0xffff00 } )
//)
//scene.add( centerHelper );

//cameraControls.getTarget( centerHelper.position );

//cameraControls.setBoundary( bb );



