var scene, camera, trajectorySurface;
var geometry, material, mesh;
var renderer;

init();

function init() {
  trajectorySurface = document.getElementById("trajectory_3d");
  scene = new THREE.Scene();

  var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 1000);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    canvas: trajectorySurface
  }, {
    antialias: true
  });
  renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
  renderer.setClearColor("#ddd", 1);

  var controls = new THREE.OrbitControls(camera);
  controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: THREE.MOUSE.MIDDLE,
    PAN: THREE.MOUSE.LEFT
  };

 
  // Floor
  var floorGeometry = new THREE.PlaneGeometry(80,100,0);
  var floorMaterial = new THREE.MeshPhongMaterial({
    color: "#E2B822",
    shininess: 100
  });
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.position.x=10;
  floor.receiveShadow = true;
  scene.add(floor);
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(15, 30, 50);
  // spotLight.castShadow = true;
  scene.add(spotLight);
  let ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);
  var light = new THREE.PointLight(0xffffff, 0.5);
  light.position.set(20, 20, 50);
  scene.add(light);
  var ah = new THREE.AxesHelper(50);
  ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
  scene.add(ah);
  camera.position.x = 20;
  camera.position.y = 30;
  camera.position.z = 70;
  render();
};

function render() {
  var controls = new THREE.OrbitControls(camera);
  controls.enableDamping = true; // For that slippery Feeling
  controls.dampingFactor = 0.12; // Needs to call update on render loop 
  controls.rotateSpeed = 0.001; // Rotate speed
  controls.autoRotate = false; // turn this guy to true for a spinning camera
  controls.autoRotateSpeed = 0.001; // 30
  controls.maxPolarAngle = Math.PI / 2; // Don't let to go below the ground
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}