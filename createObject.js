import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';

const raycaster = new THREE.Raycaster();

function generateTime() {
	return new Date().getTime();
}

function createTree(x, y) {
	const stemGeometry = new THREE.BoxGeometry(1, 1, 5);
	const stemMaterial = new THREE.MeshPhongMaterial({ emissive: 0x964B00 });

	const leafGeometry = new THREE.TetrahedronGeometry(5, 2);
	const leafMaterial = new THREE.MeshPhongMaterial({ emissive: 0x00ff00 });

	const treeObject = new THREE.Object3D();
	treeObject.position.set(x, y, 2);

	const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
	treeObject.add(stemMesh);
	const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
	leafMesh.position.z = 7;
	treeObject.add(leafMesh);

	treeObject.name = "tree" + generateTime();

	return treeObject;
}

function createHumanObject() {
	// create human object3d
	const humanObject = new THREE.Object3D();

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

	humanObject.name = "human" + generateTime();

	return humanObject;
}

const createMountain = (x, y) => {
	const mountain1Geometry = new THREE.ConeGeometry( 20, 20, 8 );
	const mountain1Material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	const mountain = new THREE.Mesh(mountain1Geometry, mountain1Material);
	mountain.position.set(33, 33, 0);
	mountain.rotation.x = Math.PI / 2;

	mouuntain.name = "mountain" + generateTime();

	return mountain;
}

const createLand = function() {
	// create land surface
	const landGeometry = new THREE.BoxGeometry(200, 200, 5);
	const landMaterial = new THREE.MeshPhongMaterial( { emissive: 0x004d00 } );

	const landMesh = new THREE.Mesh(landGeometry, landMaterial);
	landMesh.position.z = -5;

	landMesh.name = "land" + generateTime();

	return landMesh;
}


export default { createTree, createHumanObject, createLand, createMountain };