const THREE = require("three");
const OrbitControls = require('three-orbit-controls')(THREE);
const clock = new THREE.Clock();
let scene, renderer, camera, controls;
let plane;
let fraction = 0, lineLength;
let ftArr = [];
let divergence = Math.floor(Math.random() * 90);
let angle = Math.floor(Math.random() * 15);
// let divergence = 45;
let skysphere;



let init = () => {

    //boilerplate
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333333);
    document.querySelector("#container").appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
    );
    scene.add(camera);
    camera.position.set(-40, 4, 40);

    controls = new OrbitControls(camera);
    controls.enableZoom = false;
    controls.target = new THREE.Vector3(0, -10, 0);
    camera.lookAt(new THREE.Vector3(0, -10, 0));

    //plane (now a sphere)

    plane = new THREE.Mesh(new THREE.SphereGeometry(6, 30, 30), new THREE.MeshNormalMaterial())
    // plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, -20, 0);
    plane.material.wireframe = true;
    plane.material.side = THREE.DoubleSide;
    plane.name = "plane";

    for (let i = 0; i < plane.geometry.vertices; i++) {
        plane.geometry.vertices[i].y = math.random() * 400;
        plane.geometry.verticesNeedUpdate = true;

    }

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 20, 0);
    scene.add(light);

    //sphere
    scene.add(plane);

    // skysphere.rotation.x = Math.PI / 2;
    // plane.rotation.x = -Math.PI / 2;
    // skysphere.position.set(0, 60, 0);



    let geo = new THREE.Geometry();
    geo.vertices.push(new THREE.Vector3(0, 0, 0));
    geo.vertices.push(new THREE.Vector3(0, 6, 0));

    //the juice
    let createTree = (curLoc, r, angle) => {
        if (r < .07) {
            return;
        }
        let newX = curLoc.x + Math.cos(angle * Math.PI / 180) * r;
        let newY = curLoc.y + Math.sin(angle * Math.PI / 180) * r;
        let newBranch = new THREE.Vector3(newX, newY, newX);
        curLoc = newBranch;
        let nr = r * .67;
        geo.vertices.push(newBranch);
        createTree(curLoc, nr, angle + divergence);
        geo.vertices.push(newBranch);
        createTree(curLoc, nr, angle - divergence);        // createTree(curLoc, curLen, angle + Math.PI);
    }

    createTree(new THREE.Vector3(0, 0, 0), 10, angle);
    geo.computeLineDistances();

    for (var i = 0; i < geo.vertices.length; i += 2) {
        geo.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
        geo.colors[i + 1] = geo.colors[i];
    }

    let matDash = new THREE.LineDashedMaterial({

        color: 0xffffff,
        linewidth: 1,
        scale: 1,
        dashSize: 3,
        gapSize: 1e10,
        vertexColors: THREE.VertexColors
    });


    for (let i = 0; i < 8; i++) {
        let ft = new THREE.Line(geo, matDash, THREE.LineSegments);
        ftArr.push(ft);
        // ft.rotation.z = Math.PI / 2;
        ft.rotation.y += i * 0.785398;
        ft.position.y = 6;
        ft.name = "lineTree";
        plane.add(ft);
        ftArr.push(ft);
    }



}

let render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    fraction += 1;
    for (let i = 0; i < ftArr.length; i++) {
        ftArr[i].material.dashSize = fraction;
    }

    plane.rotation.y += 0.001;

}

init();
render();

//helpers
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("keydown", (e) => {
    console.log(e);
    if (e.key == " ") {
        console.log("pressed");
        destroyTrees();
    }
});

//kill the juice
let destroyTrees = () => {
    // console.log(plane);
    // for (let i = plane.children.length; i >= 0; i--) {
    //     plane.remove(plane.children[i]);
    // }
    location.reload();
}


setInterval(function () {
    // window.open(renderer.domElement.toDataURL('image/png'), './1.png');

}, 1000);