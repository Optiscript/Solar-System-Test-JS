<<<<<<< HEAD
export let activeMenu = null;

let followedPlanet;
let camera = null;
let cameraControls = null;
let planets = [];
=======
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
>>>>>>> origin/main
let raycaster = null;
let mouse = null;
let halo = null;
let renderer = null;
let clock = null;
<<<<<<< HEAD
let ifcolisionsenabled;

export let transition = true

export function initializeEnvironment(cam, controls, planetsArray, ray, mouseVec, sunHalo, render, clk, p_sizes, p_camera, followedPlanet) {
=======

export function initializeEnvironment(cam, controls, planetsArray, ray, mouseVec, sunHalo, render, clk, p_sizes, p_camera) {
>>>>>>> origin/main
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
<<<<<<< HEAD
    followedPlanet = followedPlanet;
=======
>>>>>>> origin/main
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
<<<<<<< HEAD

    planet.castShadow = true;
    planet.receiveShadow = true;

    return planet;
}

export function createSatelite(scene, planet, size, texture, distance) {

=======
    return planet;
}

export function createPlanet_satelite(scene, size, size_sat, texture, texture_sat, distance, distance_sat) {
>>>>>>> origin/main
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0
    });

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
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

<<<<<<< HEAD
    planet.castShadow = true;
    planet.receiveShadow = true;

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
    light.castShadow = true;
    light.shadow.mapSize.width = 1028;
    light.shadow.mapSize.height = 1028;

    light.shadow.camera.left = -4000;
    light.shadow.camera.right = 4000;
    light.shadow.camera.top = 4000;
    light.shadow.camera.bottom = -4000;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 10000;

=======
>>>>>>> origin/main
    scene.add(sun);
    return sun;
}

<<<<<<< HEAD

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



=======
export function MakeRotate(obj, distance, speed, axialrotation) {
    obj.position.x = distance * Math.cos(Date.now() * speed);
    obj.position.z = distance * Math.sin(Date.now() * speed);
    obj.rotation.y += axialrotation;
}

>>>>>>> origin/main
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
<<<<<<< HEAD
    const starRadius = 2300;
=======
    const starRadius = 275;
>>>>>>> origin/main

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
<<<<<<< HEAD
        fontface = 'Libertinus Serif, Linux Libertine, serif',
        fontsize = 24,
        borderThickness = 4,
        borderColor = { r: 162, g: 169, b: 177, a: 1.0 }, // #616569ff
        backgroundColor = { r: 248, g: 249, b: 250, a: 1.0 }, // #f8f9fa
        lineHeight = fontsize * 0.9,
        scaleFactor = 100,
        vertical = false
=======
        fontface = 'Arial',
        fontsize = 16,
        borderThickness = 4,
        borderColor = { r: 0, g: 0, b: 0, a: 1.0 },
        backgroundColor = { r: 255, g: 255, b: 255, a: 1.0 },
        lineHeight = fontsize * 1.2,
        scaleFactor = 100, // smaller text
        vertical = false    // stack vertically if true
>>>>>>> origin/main
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

<<<<<<< HEAD
    sprite.scale.set( 
=======
    // Make sprite smaller and optionally taller
    sprite.scale.set(
>>>>>>> origin/main
        (canvas.width / scaleFactor) * 0.6,   // narrower
        (canvas.height / scaleFactor) * 1.2,  // taller
        1
    );

    return sprite;
}

<<<<<<< HEAD
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
=======



export function onClickPlanet(event, planetsInfo, p_sizes, p_camera) {
>>>>>>> origin/main
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets, true);

    if (intersects.length > 0) {
        const selectedPlanet = intersects[0].object;
        const index = planets.findIndex(p => p === selectedPlanet || p.children?.includes(selectedPlanet));
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
}

export function createPlanetMenu(planet, info) {
    const menuGroup = new THREE.Group();

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.001, 0.01),
        new THREE.MeshBasicMaterial({ color: 0x222244, transparent: true, opacity: 0.8 })
    );

<<<<<<< HEAD
    const label = createTextSprite(info, { fontsize: planet.geometry.parameters.radius * 35 });
    label.position.set(0, 0, 0);
=======
    const label = createTextSprite(info, { fontsize: 32 });
    label.position.set(2, 0.5, 0.1);
>>>>>>> origin/main

    menuGroup.add(box);
    menuGroup.add(label);

    planet.add(menuGroup);
<<<<<<< HEAD
    const sep = planet.geometry.parameters.radius * 2.5;
    menuGroup.position.set(0, sep, 0);
=======
    menuGroup.position.set(0, 0, 0);
>>>>>>> origin/main

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
<<<<<<< HEAD
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
=======
}

export function animate(scene, camera, planetList, sun, stars) {
>>>>>>> origin/main

    renderer.setAnimationLoop(() => {

        const delta = clock.getDelta();
<<<<<<< HEAD

        if (!renderer.xr.isPresenting) {
        cameraControls.update(delta);
        }

        planetList.forEach(([planet, distance, speed, axial, ifsatellite, link]) => {
            MakeRotate(planet, distance, speed, axial, ifsatellite, link);
=======
        cameraControls.update(delta);

        planetList.forEach(([planet, distance, speed, axial]) => {
            MakeRotate(planet, distance, speed, axial);
>>>>>>> origin/main
        });

        stars.material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001);
        if (halo) halo.material.opacity = 0.1 + 0.01 * Math.sin(Date.now() * 0.001);

        if (followedPlanet) {
<<<<<<< HEAD

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
=======
            cameraControls.fitToSphere(followedPlanet, true);
        } else {
            removePlanetMenu();
>>>>>>> origin/main
        }

        renderer.render(scene, camera);
    });
<<<<<<< HEAD
}
=======
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

>>>>>>> origin/main
