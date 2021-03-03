import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { DragControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';

import createObject from "./createObject.js";

let horizontalCoords = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector("#main-3d").appendChild( renderer.domElement );

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// const raycaster = new THREE.Raycaster();

// console.log(performance.now())

// init'd LocalStorage key
const OBJECT_LOCAL_KEY = "park3d.objects";

// init'd objects from localStorage
if (!localStorage.getItem(OBJECT_LOCAL_KEY)) {
	localStorage.setItem(OBJECT_LOCAL_KEY, "[]")
}

const objects = JSON.parse(localStorage.getItem(OBJECT_LOCAL_KEY));

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const land = createObject.createLand();
scene.add(land);
objects.push(land);

camera.position.z = 200;
camera.position.y = -5;

objects.forEach((obj) => {
	console.log(obj.name);
});

// const drag = new DragControls(objects, camera, renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const animate = () => {
	  if (resizeRendererToDisplaySize(renderer)) {
	    const canvas = renderer.domElement;
	    camera.aspect = canvas.clientWidth / canvas.clientHeight;
	    camera.updateProjectionMatrix();
	  }
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

const addObjectForm = document.querySelector("form");

addObjectForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const [name, size, x, y] = [
		event.target.object.value,
		event.target.size.value,
		event.target.x.value,
		event.target.y.value
	];

	switch (name) {
		case "tree":
			const tree = createObject.createTree(x, y);
			scene.add(tree);
			objects.push(tree);
			break;

		case "mountain":
			const mountain1 = createObject.createMountain(x, y);
			scene.add(mountain1);
			objects.push(mountain1);
			break;

		case "human":
			const human = createObject.createHumanObject();
			scene.add(human);
			objects.push(human);
			break;

		default:
			return;
	}

	localStorage.setItem(OBJECT_LOCAL_KEY, JSON.stringify(objects));

	[ event.target.object.value, event.target.size.value,
		event.target.x.value, event.target.y.value ] = ["", 0, 0, 0];
});

animate();

