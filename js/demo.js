//SET UP SCENE & CAMERA

var scene;
var camera;
var surface;

//SET UP SHAPES & MATERIAL
var geometry;
var material;
var mesh;
/* 
  add geomerty and material to mesh.
  mesh(geomerty, matrial)
*/

//RENDER THE SCENE
var renderer;

init();

function init() {
  surface = document.getElementById("surface");

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, surface.offsetWidth / surface.offsetHeight, .1, 1000); /* 10000 the vanishing point(how far you can see) */

  camera.lookAt(scene.position);

  //set size to full screen
  renderer = new THREE.WebGLRenderer({ canvas: surface });
  renderer.setSize(surface.offsetWidth, surface.offsetHeight);

  // //add to the DOM
  // surface.appendChild(renderer.domElement);
  var controls = new THREE.OrbitControls(camera);
  controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: THREE.MOUSE.MIDDLE,
    PAN: THREE.MOUSE.LEFT
  };

  // Floor
  var floorGeometry = new THREE.PlaneGeometry(100, 100, 20);
  var floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xecebec,
    specular: 0x000000,
    shininess: 100
  });

  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  scene.add(floor);
  //controls.update() must be called after any manual changes to the camera's transform
  var ah = new THREE.AxesHelper(50);
  ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
  scene.add(ah);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(15, 30, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);
  var material = new THREE.MeshPhysicalMaterial({
    color: "#F57316",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
  });
  var tubularSegments = 150;
  var radius = 6;
  var radialSegments = 64;
  var closed = false;
  depth = 30;
  var x = Math.acos(0.587);
  var y = Math.asin(0.567);
  var z = Math.cos(360);
  var x1 = Math.atan(0.879);
  var y1 = Math.sin(49);
  var z1 = Math.cos(90);
  var curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(depth * x, depth * y, depth * z),
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(x1 * depth, depth * y1, depth * z1)
  ]);
  var geometry = new THREE.TubeBufferGeometry(curve, tubularSegments, radius, radialSegments, closed);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 32;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  camera.position.x = 0;
  camera.position.y = 60;
  camera.position.z = 75;
  scene.add(mesh);
  var light = new THREE.PointLight(0xffffff, 0.5);
  light.position.set(20, 20, 50);
  scene.add(light);
  render();
}

// Render Loop
function render() {
  var controls = new THREE.OrbitControls(camera);

  controls.enableDamping = true; // For that slippery Feeling
  controls.dampingFactor = 0.12; // Needs to call update on render loop 
  controls.rotateSpeed = 0.001; // Rotate speed
  controls.autoRotate = false; // turn this guy to true for a spinning camera
  controls.autoRotateSpeed = 0.001; // 30
  controls.maxPolarAngle = Math.PI / 4; // Don't let to go below the ground
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, true);
render();

// Functions :
function onWindowResize() {
  camera.aspect = surface.offsetWidth / surface.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(surface.offsetWidth, surface.offsetHeight);
}