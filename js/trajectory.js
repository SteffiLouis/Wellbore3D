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

    renderer = new THREE.WebGLRenderer({ canvas: trajectorySurface },{antialias:true});
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
    renderer.setClearColor('lightgray', 1);

    var controls = new THREE.OrbitControls(camera);
    scene.add(controls)

 //axes
  var axes = new THREE.AxisHelper(50);
  // axes.scale(50);
  scene.add(axes);


  var size = 50;
  var divisions = 5;
  var points = [];
  var markPoints = size / divisions;
  var countValue = 0

  var textFont;
  var loader = new THREE.FontLoader();
  loader.load( 'https://rawgit.com/mrdoob/three.js/dev/examples/fonts/droid/droid_sans_regular.typeface.json', function ( font ) {
  for(var i = 0; i <= divisions ; i++){   
    points.push((markPoints * i ).toString());
    
    var textGeo = new THREE.TextGeometry( (markPoints * i ).toString(), {
      
      font: font,
      size: 1,
      height: 1,
      bevelSegments: 20,
      // bevelThickness: -1,
      color : "red"
    });
 
    var textMaterial = new THREE.MeshPhongMaterial( {color :"black"} );
    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 0, markPoints * i, 0);
    // mesh.lookAt(camera.position);
    scene.add( mesh );

    var textMaterial = new THREE.MeshPhongMaterial( { color: "black" } );
    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( markPoints * i, 0, 0);
    // mesh.lookAt(camera.position);
    scene.add( mesh );
    
    var textMaterial = new THREE.MeshPhongMaterial( { color: "black" } );
    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 0, 0, markPoints * i);
    // mesh.lookAt(camera.position);
    scene.add( mesh );
  };
  });
  

  // grid xz
 var gridXZ = new THREE.GridHelper(size ,divisions);
 gridXZ.position.set(25,0,25);
// scene.scale(50)
 scene.add(gridXZ);

  
 //grid xy
 var gridXY = new THREE.GridHelper(size,divisions);
 gridXY.rotation.x = Math.PI/2;
 gridXY.position.set(25,25,0);
 gridXY.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff) );
 scene.add(gridXY);
  
 //grid yz
 var gridYZ = new THREE.GridHelper(size,divisions );
 gridYZ.position.set( 0,25,25 );
 gridYZ.rotation.z = Math.PI/2;
 gridYZ.setColors( new THREE.Color(0xffffff), new THREE.Color(0x00ff00) );
 scene.add(gridYZ);

//text//
var light = new THREE.AmbientLight( "white" ); // soft white light
scene.add( light );
    var ah = new THREE.AxesHelper(50);
    ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
    scene.add(ah);
    camera.position.x = 20;
    camera.position.y = 30;
    camera.position.z = 70;   
    render();


function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

}
}