import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { DragControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';

let horizontalCoords = 0;

function createTree(x, y) {
	const stemGeometry = new THREE.BoxGeometry(1, 1, 5);
	const stemMaterial = new THREE.MeshPhongMaterial({ emissive: 0x964B00 });

	const leafGeometry = new THREE.TetrahedronGeometry(5, 2);
	const leafMaterial = new THREE.MeshPhongMaterial({ emissive: 0x00ff00 });

	const treeObject = new THREE.Object3D();
	treeObject.position.set(x, y, 2);
	scene.add(treeObject);

	const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
	treeObject.add(stemMesh);
	const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
	leafMesh.position.z = 7;
	treeObject.add(leafMesh);
	objects.push(treeObject);
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector("#main-3d").appendChild( renderer.domElement );

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

// init'd empty objects
const objects = [];

// create land surface
const landGeometry = new THREE.PlaneGeometry(100, 100);
const landMaterial = new THREE.MeshPhongMaterial( { emissive: 0x004d00 } );

// create human object3d
const humanObject = new THREE.Object3D();
scene.add(humanObject);

// create pointer
const pointerGeometry = new THREE.PlaneGeometry(1, 2);
const pointerMaterial = new THREE.MeshBasicMaterial();

const pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial);
pointerMesh.position.y = 3;
humanObject.add(pointerMesh);

// create box geometry for body
const geometry = new THREE.BoxGeometry(2, 2, 4);
const greenMaterial = new THREE.MeshPhongMaterial({ emissive: 0x00ff00 });

// circle body for head
const circle = new THREE.SphereGeometry(1);
const skinMaterial = new THREE.MeshPhongMaterial({ emissive: 0x964B00 });

const cube = new THREE.Mesh(geometry, greenMaterial);
humanObject.position.z = 2;
humanObject.add(cube);

const headMesh = new THREE.Mesh(circle, skinMaterial);
headMesh.position.z = 3;
humanObject.add(headMesh);

const landMesh = new THREE.Mesh(landGeometry, landMaterial);
landMesh.position.z = 0;
scene.add(landMesh);

objects.push(humanObject);

// create tree
const treePosition = [[5, 9], [-20, 30], [15, -15], [17, -8], [-9, -23]];
treePosition.forEach(([x, y]) => {
	createTree(x, y);
});

camera.position.z = 20;

objects.forEach((obj) => {
	console.log(obj.name);
});

const drag = new DragControls(objects, camera, renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const animate = () => {
	// human control: WASD
	document.addEventListener("keydown", (event) => {
		if (event.key === "w" || event.key === "ArrowUp") {
			if (0.01 * horizontalCoords >= humanObject.rotation.x) {
				horizontalCoords = 0;
			}

			humanObject.position.y += 0.01;
			humanObject.position.x += 0.01 * horizontalCoords;
		} else if (event.key === "a" || event.key === "ArrowLeft") {
			// humanObject.position.x -= 0.01;
			humanObject.rotation.z -= 0.01;
			horizontalCoords += 0.01;
		} else if (event.key === "s" || event.key === "ArrowDown") {
			humanObject.position.y -= 0.01;
			humanObject.position.x -= 0.01 * horizontalCoords;
		} else if (event.key === "d" || event.key === "ArrowRight") {
			// humanObject.position.x += 0.01;
			humanObject.rotation.z += 0.01;
			horizontalCoords -= 0.01;
		}

		const hour = new Date().getHours();

		if (hour >= 6 && hour < 12) {
	    	scene.background = new THREE.Color(0x2e4482);
		} else if (hour >= 12 && hour < 19) {
	    	scene.background = new THREE.Color(0x546bab);
		} else {
	    	scene.background = new THREE.Color(0x2e4482);
	  }
	});

	controls.update();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

animate();