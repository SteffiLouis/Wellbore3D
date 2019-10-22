var scene, camera, trajectorySurface;
var geometry, material, mesh;
var renderer;
init();

function init() {

    trajectorySurface = document.getElementById("trajectory_3d");
    scene = new THREE.Scene();

    var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
    startPosition = new THREE.Vector3( 50, 50, 200 );
    camera = new THREE.PerspectiveCamera( 95, aspectRatio, 1, 10000 );
    camera.position.set( startPosition.x, startPosition.y, startPosition.z );
    scene.add( camera );

    //light
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(50, 50, 50);
    camera.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(50, 50, -50);
    camera.add(light);
    
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 50, 200);
    scene.add(spotLight);

    //render
    renderer = new THREE.WebGLRenderer({ canvas: trajectorySurface });
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
    renderer.setClearColor(0xffffff, 1);

    //control
    var controls = new THREE.OrbitControls(camera);
    controls;

    var ah = new THREE.AxesHelper(150);
    ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
    scene.add(ah);

    var material = new THREE.MeshPhysicalMaterial({
        color: 0xd0d9d9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    var tubularSegments = 150;
    var radius = 3;
    var radialSegments = 64;
    var closed = false;
    var trajectoryData = [
      new THREE.Vector3(10, 5, 150),
      new THREE.Vector3(40, 5, 140),
      new THREE.Vector3(60, 5, 130),
      new THREE.Vector3(85, 5, 120),
      new THREE.Vector3(100, 5, 100),
      new THREE.Vector3(88, 20, 50),
      new THREE.Vector3(72, 50, 50),
      new THREE.Vector3(60, 100, 50)
    ];
    var curve = new THREE.CatmullRomCurve3(trajectoryData);

    var geometry = new THREE.TubeBufferGeometry(curve, tubularSegments, radius, radialSegments, closed);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    render();
};

function render() {
  requestAnimationFrame(render);
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

function formatTrajectoryData(trajectoryList) {
  var measuredDepth, radian, degree, RF, north, east, tvd;
  var trajectoryArray = [];
  for(var index = 0; index < trajectoryList.length; index++) {
    var firstData = trajectoryList[index];
    var secondData = trajectoryList[index + 1];
    if(secondData) {
      measuredDepth = secondData.depth - firstData.depth;
      radian = Math.acos(Math.cos(secondData.inclination - firstData.inclination) - Math.sin(firstData.inclination) * Math.sin(secondData.inclination) * (1 - Math.cos(secondData.azimuth - firstData.azimuth)));
      degree = radian *180 / Math.PI;
      RF = (2/radian) * Math.tan(degree/2);
      north = (measuredDepth/2) * (Math.sin(firstData.inclination) * Math.cos(firstData.azimuth) + Math.sin(secondData.inclination) * Math.cos(secondData.azimuth)) * RF;
      east = (measuredDepth/2) * (Math.sin(firstData.inclination) * Math.sin(firstData.azimuth) + Math.sin(secondData.inclination) * Math.cos(secondData.azimuth)) * RF;
      tvd = (measuredDepth/2) * (Math.cos(firstData.inclination) + Math.cos(secondData.inclination)) * RF;
      trajectoryArray.push(new THREE.Vector3(north, tvd, east));
    }
  }
  return trajectoryArray;
}