import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { DragControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/DragControls.js';
import { TrackballControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/TrackballControls.js';

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

const getTimeScenery = (time) => {
	if (time >= 6 && time < 12) {
    	scene.background = new THREE.Color(0x2e4482);
			spotLight.position.set(105, 105, 10);
	} else if (time >= 12 && time < 18) {
    	scene.background = new THREE.Color(0x546bab);
			spotLight.position.set(0, 0, 100);
			spotLight.intensity = .25;
	} else {
    	scene.background = new THREE.Color(0x2e4482);
			spotLight.position.set(0, 0, 0);
  }
}

const objects = [
  { "name": "mountain2", "x": "33", "y": "33" },
  { "name": "mountain3", "x": "22", "y": "22" },
  { "name": "mountain", "x": "17", "y": "-8" },
  { "name": "tree", "x": "-1", "y": "22" },
  { "name": "tree", "x": "4", "y": "44" },
  { "name": "tree", "x": "21", "y": "-11" },
  { "name": "tree", "x": "-11", "y": "-11" },
  { "name": "mountain3", "x": "-7", "y": "50" },
  { "name": "mountain2", "x": "50", "y": "-37"},
  { "name": "tree", "x": "-5", "y": "14" },
  { "name": "tree", "x": "33", "y": "-43" },
  { "name": "tree", "x": "12", "y": "-21" },
  { "name": "tree", "x": "51", "y": "-2" },
  { "name": "tree", "x": "-51", "y": "-25" },
  { "name": "tree", "x": "-25", "y": "11" },
  { "name": "tree", "x": "51", "y": "-44" },
  { "name": "tree", "x": "67", "y": "-12" },

];

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const land = createObject.createLand();
scene.add(land);

const human = createObject.createHumanObject();
scene.add(human);

// var axes = new THREE.AxesHelper(20);
// scene.add(axes);

camera.position.z = 200;
camera.position.y = -5;

objects.forEach((obj) => {
	scene.add(generateObject(obj));
});

// const drag = new DragControls(objects, camera, renderer.domElement);
const controls = new TrackballControls(camera, renderer.domElement);

const spotLight = new THREE.SpotLight(0xf5c77f);
spotLight.castShadow = true;
scene.add(spotLight);

getTimeScenery(new Date().getHours());

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
	});

	getTimeScenery(new Date().getHours());

	controls.update();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

const addObjectFromForm = document.querySelector("form");

addObjectFromForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const object = {
		name: event.target.object.value,
		x: event.target.x.value,
		y: event.target.y.value
	};

	generateObject(object);
	objects.push(object);

	[ event.target.object.value,
		event.target.x.value, event.target.y.value ] = ["", 0, 0];
});

animate();

function generateObject({name, x, y}) {
	switch (name) {
		case "tree":
			const tree = createObject.createTree(x, y);
			scene.add(tree);
			break;

		case "mountain":
			const mountain1 = createObject.createMountain(x, y);
			scene.add(mountain1);
			break;

		case "mountain2":
			const mountain2 = createObject.createMountain2(x, y);
			scene.add(mountain2);
			break;

		case "mountain3":
			const mountain3 = createObject.createMountain3(x, y);
			scene.add(mountain3);
			break;

		case "human":
			const human = createObject.createHumanObject();
			scene.add(human);
			break;

		case "tree2":
			const tree2 = createObject.createTree2(x, y);
			scene.add(tree2);
			break;

		default:
			return;
	}
}
