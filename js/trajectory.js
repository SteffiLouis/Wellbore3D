var scene, camera, trajectorySurface;
var geometry, material, mesh;
var renderer;

init();

function init() {
    trajectorySurface = document.getElementById("trajectory_3d");
    scene = new THREE.Scene();

    var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, .1, 1000 );
    scene.add( camera );

    renderer = new THREE.WebGLRenderer({ canvas: trajectorySurface });
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
    renderer.setClearColor(0xffffff, 1);

    var controls = new THREE.OrbitControls(camera);
    controls.mouseButtons = {
        ORBIT: THREE.MOUSE.RIGHT,
        ZOOM: THREE.MOUSE.MIDDLE,
        PAN: THREE.MOUSE.LEFT
    };

    var ah = new THREE.AxesHelper(50);
    ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
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
  controls.maxPolarAngle = Math.PI / 4; // Don't let to go below the ground
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}