import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Erstelle die Szenen, Kameras und Renderer für beide Modelle
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer1 = new THREE.WebGLRenderer({ alpha: true });
renderer1.setSize(window.innerWidth / 2, window.innerHeight / 2);
document.getElementById('donut').appendChild(renderer1.domElement);

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer2 = new THREE.WebGLRenderer({ alpha: true });
renderer2.setSize(window.innerWidth / 2, window.innerHeight / 2);
document.getElementById('second-model').appendChild(renderer2.domElement);

// Lichter für beide Szenen hinzufügen
function addLightsToScene(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);  // Schwaches Ambient Light
    scene.add(ambientLight);
    const numberOfLights = 10;
    for (let i = 0; i < numberOfLights; i++) {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
        directionalLight.target.position.set(0, 0, 0);
        scene.add(directionalLight.target);
        scene.add(directionalLight);
    }
}

// Lichter zu beiden Szenen hinzufügen
addLightsToScene(scene1);
addLightsToScene(scene2);

// OrbitControls für beide Szenen
const controls1 = new OrbitControls(camera1, renderer1.domElement);
controls1.enableDamping = true;
controls1.dampingFactor = 0.25;
controls1.screenSpacePanning = false;
controls1.maxPolarAngle = Math.PI / 2;  // Begrenzung der Drehung (keine vertikale Drehung über die Pole)
controls1.enableZoom = false;  // Zoom per Mausrad deaktivieren
controls1.enableRotate = true;

const controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.enableDamping = true;
controls2.dampingFactor = 0.25;
controls2.screenSpacePanning = false;
controls2.maxPolarAngle = Math.PI / 2;
controls2.enableZoom = false;  // Zoom per Mausrad deaktivieren
controls2.enableRotate = true;

// GLTFLoader für das Laden der Modelle
const loader = new GLTFLoader();

// Erstes Modell
let donutModel;
loader.load('./junis.glb', (gltf) => {

    donutModel = gltf.scene;
    console.log("Erstes Modell geladen:", donutModel); // Debugging: Modell erfolgreich geladen
    scene1.add(donutModel);
    positionAndScaleModel(donutModel, scene1, camera1);
    animate1();
}, undefined, (error) => {
    console.error('Fehler beim Laden des ersten Modells:', error);
});

// Zweites Modell
let secondModel;
loader.load('./yuheng.glb', (gltf) => {
    secondModel = gltf.scene;
    console.log("Zweites Modell geladen:", secondModel); // Debugging: Modell erfolgreich geladen
    scene2.add(secondModel);
    positionAndScaleModel(secondModel, scene2, camera2);
    animate2();
}, undefined, (error) => {
    console.error('Fehler beim Laden des zweiten Modells:', error);
});

// Funktion zum Positionieren und Skalieren von Modellen
function positionAndScaleModel(model, scene, camera) {
    // Berechne die Bounding Box des Modells
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Skalierung des Modells anpassen (hier explizit das zweite Modell größer machen)
    if (model === secondModel) {
        model.scale.set(0.9, 0.9, 0.9);  // Größere Skalierung für das zweite Modell
    } else {
        model.scale.set(0.8, 0.8, 0.8);  // Normal für das erste Modell
    }

    // Berechne den Modellabstand zur Kamera
    const modelSize = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(modelSize / (2 * Math.tan(fov / 2)));
    camera.position.z = cameraDistance * 1.2;
    model.position.sub(center);
    model.position.y = 0.65;

    // Kamera leicht anheben
    camera.position.y = 1;
    camera.lookAt(model.position);
}

// Animationsloop für das erste Modell
function animate1() {
    requestAnimationFrame(animate1);
    controls1.update();
    renderer1.render(scene1, camera1);
}

// Animationsloop für das zweite Modell
function animate2() {
    requestAnimationFrame(animate2);
    controls2.update();
    renderer2.render(scene2, camera2);
}

// Resize-Event für die Anpassung der Ansicht und Skalierung
window.addEventListener('resize', () => {
    renderer1.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer2.setSize(window.innerWidth / 2, window.innerHeight / 2);
    
    camera1.aspect = window.innerWidth / window.innerHeight;
    camera2.aspect = window.innerWidth / window.innerHeight;
    camera1.updateProjectionMatrix();
    camera2.updateProjectionMatrix();
});

const text = "Innovationen für die Zukunft!";
const initialDelay = 0; // milliseconds
const letterDelay = 50; // milliseconds

let index = 0;

function writeText() {
  const element = document.getElementById('text');
  
  // Starte die Einflieganimation, wenn sie noch nicht animiert wurde
  if (index === 0) {
    element.style.animation = `flyIn 3s ease-out forwards`;
  }

  element.innerText = text.slice(0, index);
  index++;

  if (index <= text.length) {
    setTimeout(writeText, letterDelay);
  }
}

setTimeout(writeText, initialDelay);

document.addEventListener("DOMContentLoaded", function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    hamburgerMenu.addEventListener('click', function() {
        navLinks.classList.toggle('show'); // Toggle die 'show'-Klasse
    });
});


let currentIndex = 0;
const slides = document.querySelectorAll('.image-slider img');

function moveSlide(direction) {
    currentIndex += direction;

    if (currentIndex >= slides.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    }

    updateSlider();
}

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
    });
}

updateSlider();  // Initial update

