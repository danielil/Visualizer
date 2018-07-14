/**
 * The MIT License (MIT)
 * Copyright (c) 2015-2018 Daniel Sebastian Iliescu, http://dansil.net
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

var processor = new AudioProcessor();

window.addEventListener("load", Init);

var scene;
var camera;
var renderer;

var CUBE_MARGIN = 5;
var COUNT = 128;
var CONTAINER_LENGTH = window.innerWidth;
var EXTREME_X = -(window.innerWidth / 1.4);
var SIZE = CONTAINER_LENGTH / COUNT;

var cubes = [];
var gui;

/*
 * Initialize the canvas and GUI elements.
 */
function Init() {
	GenerateStaticVisualization();
	RenderTheme();
	gui = new GUI();
}
/*
 * Generate the static elements of the scene like the camera and scene properties.
 */
function GenerateStaticVisualization() {
	CreateScene();
}

/*
 * Renders the current theme. TODO: Add more themes.
 */
function RenderTheme() {
	GenerateCubeTheme();
	CreateCubeContainer();
}

/**
 * Creates a scene, camera, and appends the WebGL canvas to the body of the page.
 */
function CreateScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

	camera.position.set(0, 500, CONTAINER_LENGTH);
	camera.lookAt(0, 0, 0);

	renderer = new THREE.WebGLRenderer(
		{
			alpha: true,
			antialias: true
		});

	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMapEnabled = true;
	renderer.antialias = true;

	camera.updateProjectionMatrix();

	document.body.appendChild(renderer.domElement);
}

/**
* Generate the cube theme.
*/
function GenerateCubeTheme() {
	var lightGroup = new THREE.Group();

	scene.fog = new THREE.Fog(0x808080, 2000, 4000);

	var ambientLight = new THREE.AmbientLight(0x222222);

	var directionalLightTop = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	directionalLightTop.position.set(200, 400, 500);

	var directionalLightSide = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	directionalLightSide.position.set(-50, 250, -200);

	lightGroup.add(ambientLight);
	lightGroup.add(directionalLightTop);
	lightGroup.add(directionalLightSide);

	scene.add(lightGroup);
}

/*
 * Creates and returns a cube.
 */
function CreateCube(sizeX, sizeY, sizeZ) {
	var geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
	var material = new THREE.MeshNormalMaterial({ color: 0xE3E3E6, reflectivity: 0.9 });

	var cube = new THREE.Mesh(geometry, material);

	return cube;
}

/*
 * Generate and stores an array of cubes.
 */
function CreateCubeContainer() {
	for (var i = 0; i < COUNT; i++) {
		var cube = CreateCube(SIZE, SIZE, SIZE);
		cube.position.x = EXTREME_X + ((SIZE + CUBE_MARGIN) * i);

		scene.add(cube);
		cubes.push(cube);
	}
}

/*
 * Clears the container.
 */
function Clear() {
	cubes.splice(0, cubes.length);
}

/*
* Animates the the elements of the cube theme.
*/
function AnimateCubeTheme() {
	for (var i = 0; i < cubes.length; i++) {
		var audioScale = processor.elements[i * (processor.elements.length / cubes.length)] / 4;

		if (audioScale < 1) {
			audioScale = 1;
		}

		cubes[i].scale.y = audioScale;
	}
}

function Animate() {
	AnimateCubeTheme();
}

function render() {
	requestAnimationFrame(render);

	Animate();

	renderer.render(scene, camera);
}
