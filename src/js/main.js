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

// init'd LocalStorage key
const OBJECT_LOCAL_KEY = "park3d.objects";

// init'd objects from localStorage
if (!localStorage.getItem(OBJECT_LOCAL_KEY)) {
	localStorage.setItem(OBJECT_LOCAL_KEY, "[]")
}

let objects = JSON.parse(localStorage.getItem(OBJECT_LOCAL_KEY));

console.log(objects);

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

const animate = (time) => {
	time *= 0.001;

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

	localStorage.setItem(OBJECT_LOCAL_KEY, JSON.stringify(objects));

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

		case "tree2":
			const tree2 = createObject.createTree2(x, y);
			scene.add(tree2);
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

		default:
			return;
	}
}

// const canvas = renderer.domElement;

// const elem = document.querySelector('#takeScreenshot');
// elem.addEventListener('click', () => {
// 	canvas.toBlob((blob) => {
// 		saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
// 	});
// });
 
// const saveBlob = (function() {
// 	const a = document.createElement('a');
// 	document.body.appendChild(a);
// 	a.style.display = 'none';
// 	return function saveData(blob, fileName) {
// 		const url = window.URL.createObjectURL(blob);
// 		a.href = url;
// 		a.download = fileName;
// 		a.click();
// 	};
// }());