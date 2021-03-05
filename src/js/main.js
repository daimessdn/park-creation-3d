import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { DragControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/DragControls.js';
import { TrackballControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/TrackballControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/PointerLockControls.js';

import createObject from "./createObject.js";

let scene, camera, renderer, controls;
let raycaster, mouse;

let prevTime = performance.now();

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector("#main-3d").appendChild( renderer.domElement );

// init'd LocalStorage key
const OBJECT_LOCAL_KEY = "park3d.objects";

// init'd objects from localStorage
if (!localStorage.getItem(OBJECT_LOCAL_KEY)) {
	localStorage.setItem(OBJECT_LOCAL_KEY, "[]");
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

const objects = JSON.parse(localStorage.getItem(OBJECT_LOCAL_KEY));
const renderedObjects = [];

// create scene and camera
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const spotLight = new THREE.SpotLight(0xf5c77f);
spotLight.castShadow = true;
scene.add(spotLight);

getTimeScenery(new Date().getHours());

const land = createObject.createLand();
const human = createObject.createHumanObject();

scene.add(land);
scene.add(human);

camera.position.z = 200;
camera.position.y = -10;

objects.forEach((obj) => {
	const tempObject = generateObject(obj);
	scene.add(tempObject);
});

// controls = new PointerLockControls( camera, document.querySelector("#main-3d") );
// controls.lock();
// controls = new DragControls(renderedObjects, camera, renderer.domElement);
controls = new TrackballControls(camera, renderer.domElement);

window.addEventListener("resize", onWindowResize);

const animate = (time) => {
	time *= 0.001;

	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( scene.children, true );

	for ( let i = 0; i < intersects.length; i ++ ) {
		intersects[ i ].object.material.color.set( 0xff0000 );
	}

	const canvas = renderer.domElement;

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

	if (controls.constructor.name == "TrackballControls") {
		controls.update();
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

window.addEventListener( 'mousemove', onMouseMove, false );

document.addEventListener("drag", () => {
	console.log(controls.objects)
})

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
			renderedObjects.push(tree);
			break;

		case "tree2":
			const tree2 = createObject.createTree2(x, y);
			scene.add(tree2);
			renderedObjects.push(tree2);
			break;

		case "tree3":
			const tree3 = createObject.createTree3(x, y);
			scene.add(tree3);
			break;

		case "mountain":
			const mountain1 = createObject.createMountain(x, y);
			scene.add(mountain1);
			renderedObjects.push(mountain1);
			break;

		case "mountain2":
			const mountain2 = createObject.createMountain2(x, y);
			scene.add(mountain2);
			renderedObjects.push(mountain2);
			break;

		case "mountain3":
			const mountain3 = createObject.createMountain3(x, y);
			scene.add(mountain3);
			renderedObjects.push(mountain3);
			break;

		case "human":
			const human = createObject.createHumanObject();
			scene.add(human);
			break;

		default:
			return;
	}
}

const canvas = renderer.domElement;

const elem = document.querySelector('#takeScreenshot');
elem.addEventListener('click', () => {
	canvas.toBlob((blob) => {
		saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
	});
});
 
const saveBlob = (function() {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style.display = 'none';
	return function saveData(blob, fileName) {
		const url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = fileName;
		a.click();
	};
}());

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	animate();
}