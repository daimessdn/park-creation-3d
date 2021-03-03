import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { DragControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';

import createObject from "./createObject.js";

let horizontalCoords = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector("#main-3d").appendChild( renderer.domElement );

const raycaster = new THREE.Raycaster();

console.log(performance.now())

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

// init'd empty objects
const objects = [];

const human = createObject.createHumanObject();
scene.add(human);
objects.push(human);

const land = createObject.createLand();
scene.add(land);
// objects.push(land);

const geometry = new THREE.ConeGeometry( 5, 20, 32 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const cone = new THREE.Mesh( geometry, material );
scene.add( cone );

// create tree
const treePosition = [[5, 9], [-20, 30], [15, -15], [17, -8], [-9, -23]];
treePosition.forEach(([x, y]) => {
	const tree = createObject.createTree(x, y);
	scene.add(tree);
	objects.push(tree);
});

camera.position.z = 100;

objects.forEach((obj) => {
	console.log(obj.name);
});

const drag = new DragControls(objects, camera, renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const animate = () => {
	// human control: WASD
	document.addEventListener("keydown", (event) => {
		if (event.key === "w" || event.key === "ArrowUp") {
			human.position.y += 0.001;
		} else if (event.key === "a" || event.key === "ArrowLeft") {
			human.position.x -= 0.001;
		} else if (event.key === "s" || event.key === "ArrowDown") {
			human.position.y -= 0.001;
		} else if (event.key === "d" || event.key === "ArrowRight") {
			human.position.x += 0.001;
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