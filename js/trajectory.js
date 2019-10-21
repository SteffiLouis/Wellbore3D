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
  //   // Floor
  //   var floorGeometry = new THREE.PlaneGeometry(50, 50, 50),
  //   for (var i = 0, l = floorGeometry.vertices.length; i < l; i++) {
  //     floorGeometry.vertices[i].z = data[i] / 65535 * 5;
  // }
  //   var floorcolor = [
  //     new THREE.MeshBasicMaterial({
  //       color: "#E2B822",
  //       transparent: true,
  //       opacity: 0.3,
  //       side: THREE.DoubleSide
  //     }),
  //     new THREE.MeshBasicMaterial({
  //       color: "#E2B822",
  //       transparent: true,
  //       opacity: 5,
  //       side: THREE.DoubleSide
  //     }),

  //   ]
  //   var floorMaterial = new THREE.MeshFaceMaterial(floorcolor);
  //   var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  //   floor.rotation.x = Math.PI / 2;
  //   floor.rotation.y = 0;
  //   floor.rotation.z = Math.PI / Math.cos(270) * 0.492;
  //   floor.position.set(25, 0, 25);
  //   floor.receiveShadow = true;
  //   scene.add(floor);

  //   //floor2
  //   var floorcolor1 = [
  //     new THREE.MeshBasicMaterial({
  //       color: "#356AE8",
  //       transparent: true,
  //       opacity: 0.5,
  //       side: THREE.DoubleSide
  //     }),
  //     new THREE.MeshBasicMaterial({
  //       color: "#356AE8	",
  //       transparent: true,
  //       opacity: 0.5,
  //       side: THREE.DoubleSide
  //     }),

  //   ]
  //   var floorMaterial1 = new THREE.MeshFaceMaterial(floorcolor1);
  //   var floor1 = new THREE.Mesh(floorGeometry, floorMaterial1);
  //   floor1.rotation.x = Math.PI / 2;
  //   floor1.rotation.y = 0;
  //   floor1.rotation.z = Math.PI / Math.cos(270) * 0.492;
  //   floor1.position.set(25, height, 25);
  //   floor1.receiveShadow = true;
  //   scene.add(floor1);

  //   //floor4
  //   var floorcolor3 = [
  //     new THREE.MeshBasicMaterial({
  //       color: "#6AA121",
  //       transparent: true,
  //       opacity: 0.5,
  //       side: THREE.DoubleSide
  //     }),
  //     new THREE.MeshBasicMaterial({
  //       color: "#6AA121",
  //       transparent: true,
  //       opacity: 0.5,
  //       side: THREE.DoubleSide
  //     }),
  //   ]
  //   var floorMaterial3 = new THREE.MeshFaceMaterial(floorcolor3);
  //   var floor3 = new THREE.Mesh(floorGeometry, floorMaterial3);
  //   floor3.rotation.x = Math.PI / 2;
  //   floor3.rotation.y = 0;
  //   floor3.rotation.z = Math.PI / Math.cos(270) * 0.492;
  //   var y1 = height + 20;
  //   floor3.position.set(25, y1, 25);
  //   floor3.receiveShadow = true;
  //   scene.add(floor3);

  //   var floorcolor2 = [
  //     new THREE.MeshBasicMaterial({
  //       color: "#C88141",
  //       transparent: true,
  //       opacity: 0.5,
  //       side: THREE.DoubleSide
  //     }),
  //     new THREE.MeshBasicMaterial({
  //       color: "#C88141",
  //       transparent: true,
  //       opacity: 0.5,
  //       side: THREE.DoubleSide
  //     }),

  //   ]
  //   var floorMaterial2 = new THREE.MeshFaceMaterial(floorcolor2);
  //   var floor2 = new THREE.Mesh(floorGeometry, floorMaterial2);
  //   floor2.rotation.x = Math.PI / 2;
  //   floor2.rotation.y = 0;
  //   floor2.rotation.z = Math.PI / Math.cos(270) * 0.492;
  //   var y = height + 10;
  //   floor2.position.set(25, y, 25);
  //   floor2.receiveShadow = true;
  //   scene.add(floor2);
  var ah = new THREE.AxesHelper(50);
  ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
  scene.add(ah);
  camera.position.x = 10;
  camera.position.y = 10;
  camera.position.z = 100;
  render();
};
window.addEventListener('resize', function () {
  var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
  renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix;
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}