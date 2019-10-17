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
    controls.mouseButtons = {
        // ORBIT: THREE.MOUSE.RIGHT,
        // ZOOM: THREE.MOUSE.MIDDLE,
        // PAN: THREE.MOUSE.LEFT
    };

 //axes
  var axes = new THREE.AxisHelper(50);
  scene.add(axes);

  var size = 50;
  var divisions = 10;
  var points = [];
  var markPoints = size / divisions;
  var countValue = 0

  for(var i = 0; i <= divisions ; i++){debugger   
    points.push(markPoints * i );
    
  };

  var data = points;
  var width = 1500;
  function labelAxis(width, data){debugger
var direction ='y'
    var data = points;
    var separator = data.length,
        p = {
          x:10,
          y:25,
          z:0
        },
        dobj = new THREE.Object3D();
  
        var data = points;
    for ( var i = 0; i < data.length; i ++ ) {debugger
      var label = makeTextSprite(data[i]);
  
      label.position.set(p.x,p.y,p.z);
  
      dobj.add( label );
      if (direction=="y"){
        p[direction]+=separator;
      }else{
        p[direction]-=separator;
      }
  
    }
    return dobj;
  }
  labelAxis(width, data);

  function makeTextSprite( message, parameters ){debugger
    
	if ( parameters === undefined ) parameters = {};

	var fontface = parameters["fontface"] || "Helvetica";
	var fontsize = parameters["fontsize"] || 70;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";
	context.fillText( message, 0, fontsize);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
			texture.minFilter = THREE.LinearFilter;
			texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false});
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(25,0,25);
	return sprite;
};

var texture, material, plane;
texture = THREE.ImageUtils.loadTexture( ".../img/flor.jpg" );


// assuming you want the texture to repeat in both directions:
texture.wrapS = THREE.RepeatWrapping; 
texture.wrapT = THREE.RepeatWrapping;

// how many times to repeat in each direction; the default is (1,1),
//   which is probably why your example wasn't working
texture.repeat.set( 4, 4 ); 

material = new THREE.MeshLambertMaterial({ map : texture });
plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50,50), material);
plane.material.side = THREE.DoubleSide;
plane.position.set(25,0,25);

// rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
// Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
plane.rotation.x = Math.PI / 2;
plane.rotation.z = Math.PI / 550;
plane.rotation.y = 0;
scene.add(plane);


  // grid xz
 var gridXZ = new THREE.GridHelper(size ,divisions);
 gridXZ.position.set(25,0,25);
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

    var ah = new THREE.AxesHelper(50);
    ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
    scene.add(ah);
    camera.position.x = 20;
    camera.position.y = 30;
    camera.position.z = 70;   
    render();


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
}