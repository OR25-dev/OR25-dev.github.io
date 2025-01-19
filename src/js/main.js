import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Szene, Kamera und Renderer initialisieren
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });  // Hintergrund transparent machen

// Setze die Renderer-Größe auf die halbe Breite und Höhe des Viewports
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2); // Halbe Größe für den Renderer
document.getElementById('donut').appendChild(renderer.domElement);

// OrbitControls für die Interaktivität
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Verhindert, dass das Modell zu stark geneigt wird
controls.enableZoom = false; // Deaktiviert das Zoomen mit der Maus
controls.enableRotate = true; // Nur drehen und schwenken, keine Position ändern

// Lichter hinzufügen
// Umgebungslicht für allgemeine, gleichmäßige Beleuchtung
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);  // Schwaches Ambient Light
scene.add(ambientLight);

// Viele Richtungslichter aus verschiedenen Richtungen
const numberOfLights = 10;  // Anzahl der Richtungslichter

for (let i = 0; i < numberOfLights; i++) {
    // Erstelle ein neues Richtungslicht mit niedriger Intensität
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    
    // Zufällige Position und Richtung für jedes Licht
    directionalLight.position.set(
        Math.random() * 10 - 5,  // Zufällige Position in X
        Math.random() * 10 - 5,  // Zufällige Position in Y
        Math.random() * 10 - 5   // Zufällige Position in Z
    );

    // Optional: Richtungslichter auf das Zentrum des Modells ausrichten
    directionalLight.target.position.set(0, 0, 0); // Ziel ist das Modellzentrum
    scene.add(directionalLight.target);  // Ziel dem Licht hinzufügen

    scene.add(directionalLight);  // Licht zur Szene hinzufügen
}

// Optional: Ein schwaches Umgebungslicht für eine gleichmäßige Beleuchtung
const ambientLight2 = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight2);

// GLTFLoader für das Laden der .glb Datei
const loader = new GLTFLoader();
let donutModel;

loader.load('glb/lucaauto.glb', (gltf) => {
    console.log('Modell geladen:', gltf);
    donutModel = gltf.scene;
    scene.add(donutModel);

    // Berechne die Bounding Box des Modells
    const box = new THREE.Box3().setFromObject(donutModel);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Skalierung des Modells anpassen (initiale Skalierung)
    donutModel.scale.set(0.8, 0.8, 0.8);

    // Kamera so positionieren, dass das Modell vollständig sichtbar ist
    const modelSize = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);  // Field of View in Radiant
    const cameraDistance = Math.abs(modelSize / (2 * Math.tan(fov / 2))); // Berechne den Abstand der Kamera zum Modell
    camera.position.z = cameraDistance * 1.2;  // Kamera etwas weiter weg

    // Modell zentrieren und leicht höher positionieren
    donutModel.position.sub(center);  // Das Modell zentrieren
    donutModel.position.y = 0.65; // Das Modell auf halber Höhe platzieren

    // Kamera leicht anheben, um das Modell von oben zu betrachten
    camera.position.y = 1; // Kamera leicht höher
    camera.lookAt(donutModel.position); // Kamera so ausrichten, dass sie auf das Modell schaut

    animate();
}, undefined, (error) => {
    console.error('Fehler beim Laden des Modells:', error);
});

// Funktion zum Anpassen der Skalierung basierend auf der Fenstergröße
function adjustModelScale() {
    if (donutModel) {
        const scale = window.innerWidth / 2000; // Berechne Skalierung basierend auf der Breite des Fensters
        donutModel.scale.set(scale, scale, scale); // Skalierung auf alle Achsen anwenden
    }
}

// Resize Event für die Anpassung der Ansicht und Skalierung
window.addEventListener('resize', () => {
    // Renderer-Größe an die halbe Größe des Fensters anpassen
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Skalierung des Modells anpassen
    adjustModelScale();
    
    // Um das Modell auch nach einer Resize-Aktion zu zentrieren, setzen wir es immer ins Zentrum
    adjustModelPosition();
});

// Diese Funktion sorgt dafür, dass das Modell immer im Zentrum bleibt
function adjustModelPosition() {
    if (donutModel) {
        // Stelle sicher, dass das Modell zentriert bleibt
        const box = new THREE.Box3().setFromObject(donutModel);
        const center = box.getCenter(new THREE.Vector3());
        donutModel.position.sub(center);  // Modell auf seinen Mittelpunkt verschieben
        donutModel.position.y = 0.65; // Leicht höher setzen
    }
}

// Animationsloop
function animate() {
    requestAnimationFrame(animate);

    // Aktualisiere die Steuerung
    controls.update();

    // Renderer mit der Szene und der Kamera anzeigen
    renderer.render(scene, camera);
}

// Initiale Skalierung und Position anpassen
adjustModelScale();
adjustModelPosition();

const text = "Erfindungen von Schüler*innen am Gymnasium Langenhagen!";
const initialDelay = 500; // milliseconds
const letterDelay = 50; // milliseconds

let index = 0;

function writeText() {
  document.getElementById('text').innerText = text.slice(0, index);
  index++;
  
  if(index <= text.length) {
    setTimeout(writeText, letterDelay);
  }
}

setTimeout(writeText, initialDelay);

document.addEventListener("DOMContentLoaded", function() {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');

  hamburgerMenu.addEventListener('click', function() {
      navLinks.classList.toggle('show');
  });
});
