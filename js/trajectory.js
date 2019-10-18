var scene, camera, trajectorySurface;
var geometry, material, mesh;
var renderer;
var height=10;

init();

function init() {
  trajectorySurface = document.getElementById("trajectory_3d");
  scene = new THREE.Scene();
  var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 1000);
  // camera.lookAt(scene.position)
  scene.add(camera);
  renderer = new THREE.WebGLRenderer({
    canvas: trajectorySurface
  }, {
    antialias: true
  });
  renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
  renderer.setClearColor("#ddd", 1);
  var controls = new THREE.OrbitControls(camera, renderer.canvas);
  controls;
  // Floor
  var floorGeometry = new THREE.PlaneGeometry(50, 50, 50);
  var floorcolor = [
    new THREE.MeshBasicMaterial({
      color: "#E2B822",
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: "#E2B822",
      transparent: true,
      opacity: 5,
      side: THREE.DoubleSide
    }),

  ]
  var floorMaterial = new THREE.MeshFaceMaterial(floorcolor);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / 2;
  floor.rotation.y = 0;
  floor.rotation.z = Math.PI / Math.cos(270) * 0.492;
  floor.position.set(25, 0, 25);
  floor.receiveShadow = true;
  scene.add(floor);

  //floor2
  var floorcolor1 = [
    new THREE.MeshBasicMaterial({
      color: "#356AE8",
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: "#356AE8	",
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    }),

  ]
  var floorMaterial1 = new THREE.MeshFaceMaterial(floorcolor1);
  var floor1 = new THREE.Mesh(floorGeometry, floorMaterial1);
  floor1.rotation.x = Math.PI / 2;
  floor1.rotation.y = 0;
  floor1.rotation.z = Math.PI / Math.cos(270) * 0.492;
  floor1.position.set(25, height, 25);
  floor1.receiveShadow = true;
  scene.add(floor1);

   //floor4
   var floorcolor3 = [
    new THREE.MeshBasicMaterial({
      color: "#6AA121",
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: "#6AA121",
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    }),

  ]
  var floorMaterial3 = new THREE.MeshFaceMaterial(floorcolor3);
  var floor3 = new THREE.Mesh(floorGeometry, floorMaterial3);
  floor3.rotation.x = Math.PI / 2;
  floor3.rotation.y = 0;
  floor3.rotation.z = Math.PI / Math.cos(270) * 0.492;
  var y1= height+20;
  floor3.position.set(25, y1, 25);
  floor3.receiveShadow = true;
  scene.add(floor3);

  var floorcolor2 = [
    new THREE.MeshBasicMaterial({
      color: "#C88141",
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      color: "#C88141",
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    }),

  ]
  var floorMaterial2 = new THREE.MeshFaceMaterial(floorcolor2);
  var floor2 = new THREE.Mesh(floorGeometry, floorMaterial2);
  floor2.rotation.x = Math.PI / 2;
  floor2.rotation.y = 0;
  floor2.rotation.z = Math.PI / Math.cos(270) * 0.492;
  var y= height+10;
  floor2.position.set(25, y, 25);
  floor2.receiveShadow = true;
  scene.add(floor2);
  var ah = new THREE.AxesHelper(50);
  ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
  scene.add(ah);
  camera.position.x = 10;
  camera.position.y = 10;
  camera.position.z = 100;
  render();
};

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}