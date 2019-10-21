var scene, camera, trajectorySurface;
var geometry, material, mesh;
var renderer;
var height = 10;

init();

function init() {
  trajectorySurface = document.getElementById("trajectory_3d");
  scene = new THREE.Scene();
  var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 1000);
  scene.add(camera);
  camera.lookAt(scene.position)
  renderer = new THREE.WebGLRenderer({
    canvas: trajectorySurface
  }, {
    antialias: true
  });
  renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
  renderer.setClearColor("#ddd", 1);
  var controls = new THREE.OrbitControls(camera, renderer.canvas);
  controls.object.position.set(10, 10, 10);
  controls.target = new THREE.Vector3(20, 5, 5);
  //axes
  var axes = new THREE.AxesHelper(50);
  scene.add(axes);

  //grid xz
  var gridXZ = new THREE.GridHelper(50);
  gridXZ.position.set(25, 0, 25);
  scene.add(gridXZ);

  //grid xy
  var gridXY = new THREE.GridHelper(50);
  gridXY.rotation.x = Math.PI / 2;
  gridXY.position.set(25, 25, 0);
  gridXY.setColors(new THREE.Color(0xff0000), new THREE.Color(0xffffff));
  scene.add(gridXY);

  //grid yz
  var gridYZ = new THREE.GridHelper(50);
  gridYZ.position.set(0, 25, 25);
  gridYZ.rotation.z = Math.PI / 2;
  gridYZ.setColors(new THREE.Color(0xffffff), new THREE.Color(0x00ff00));
  scene.add(gridYZ);

  //texture
  const img = new Image();
  img.crossOrigin = "";
  img.src = 'https://raw.githubusercontent.com/takahirox/takahirox.github.io/master/three.js.mmdeditor/examples/textures/terrain/backgrounddetailed6.jpg';
  var terrainLoader = new THREE.TerrainLoader();
  terrainLoader.load(img.src, function (data) {
    var geometry = new THREE.PlaneGeometry(50, 50, 50);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      geometry.vertices[i].z = data[i] / 65535 * 5;
    }
    var material = new THREE.MeshPhongMaterial({
      // map: THREE.ImageUtils.loadTexture(img.src),
      Color:"red"
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2 + Math.PI;
    plane.rotation.y = 0;
    plane.rotation.z = Math.PI / Math.cos(270) * 0.492;
    plane.position.set(25, 0, 25);
    plane.receiveShadow = true;
    scene.add(plane);
    
  });

  //light
  var spotLight = new THREE.SpotLight("white");
  spotLight.position.set(100, 100, 100);
  scene.add(spotLight);
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