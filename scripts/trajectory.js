$(document).ready(function () {
  var scene, camera, trajectorySurface;
  var geometry, material, mesh;
  var renderer;
  var label;
  var points = [];
  init();

  function init() {
    trajectorySurface = document.getElementById("trajectory_3d");
    scene = new THREE.Scene();

    var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
    startPosition = new THREE.Vector3(50, 50, 200);
    camera = new THREE.PerspectiveCamera(95, aspectRatio, 1, 10000);
    camera.position.set(startPosition.x, startPosition.y, startPosition.z);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      canvas: trajectorySurface
    });
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
    renderer.setClearColor(0xffffff, 1);

    var controls = new THREE.OrbitControls(camera);
    scene.add(controls);
    var size = 150;
    var divisions = 5;
    var markPoints = size / divisions;
    var loader = new THREE.FontLoader();
    loader.load('https://rawgit.com/mrdoob/three.js/dev/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
      for (var i = 0; i <= divisions; i++) {
        var textGeo = new THREE.TextGeometry((markPoints * i).toString(), {
          font: font,
          size: 7,
          height: 0.1,
          curveSegments: 12,
          weight: "Regular",
          bevelEnabled: false,
          bevelThickness: 1,
          bevelSize: 0.2,
          bevelSegments: 10,
        });

        var textMaterial = new THREE.MeshPhongMaterial({
          color: "black"
        });
        label = new THREE.Mesh(textGeo, textMaterial);
        label.position.set(0, markPoints * i, 0);
        points.push(label);
        scene.add(label);
      };
    });

    // grid xz
    var gridXZ = new THREE.GridHelper(size, divisions);
    gridXZ.position.set(size / 2, 0, size / 2);
    scene.add(gridXZ);

    //grid xy
    var gridXY = new THREE.GridHelper(size, divisions);
    gridXY.rotation.x = Math.PI / 2;
    gridXY.position.set(size / 2, size / 2, 0);
    gridXY.setColors(new THREE.Color(0xff0000), new THREE.Color(0xffffff));
    scene.add(gridXY);

    //grid yz
    var gridYZ = new THREE.GridHelper(size, divisions);
    gridYZ.position.set(0, size / 2, size / 2);
    gridYZ.rotation.z = Math.PI / 2;
    gridYZ.setColors(new THREE.Color(0xffffff), new THREE.Color(0x00ff00));
    scene.add(gridYZ);
    
    //texture
    const img = new Image();
    img.crossOrigin = "";
    img.src = 'img/jotunheimen-texture.jpg';
    var terrainLoader = new THREE.TerrainLoader();
    terrainLoader.load('img/jotunheimen.bin', function (data) {
      var geometry = new THREE.PlaneGeometry(150,150,150);
      for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].z = data[i] / 65535 * 5;
      }
      var material = new THREE.MeshPhongMaterial({
        map: THREE.TextureLoader(img.src),
      });
      var plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = Math.PI / 2 + Math.PI;
      plane.rotation.y = 0;
      plane.rotation.z = Math.PI / Math.cos(270) * 0.492;
      plane.position.set(75, 0, 75);
      plane.receiveShadow = true;
      scene.add(plane);

    });
    //light
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(50, 50, 50);
    camera.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(50, 50, -50);
    camera.add(light);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-50, 75, 200);
    scene.add(spotLight);

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
      new THREE.Vector3(10, 10, 150),
      new THREE.Vector3(40, 10, 140),
      new THREE.Vector3(60, 10, 130),
      new THREE.Vector3(85, 10, 120),
      new THREE.Vector3(100, 10, 100),
      new THREE.Vector3(88, 20, 50),
      new THREE.Vector3(72, 50, 50),
      new THREE.Vector3(60, 100, 50),
      new THREE.Vector3(60, 150, 50)
    ];
    var curve = new THREE.CatmullRomCurve3(trajectoryData);

    var geometry = new THREE.TubeBufferGeometry(curve, tubularSegments, radius, radialSegments, closed);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    render();
  }

  function render() {
    requestAnimationFrame(render);
    if (points) {
      for (var index = 0; index < points.length; index++) {
        points[index].lookAt(camera.position);
      }
    }
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', onWindowResize, true);
  render();
  function render() {
    requestAnimationFrame(render);
    if (points) {
      for (var index = 0; index < points.length; index++) {
        points[index].lookAt(camera.position);
      }
    }
    renderer.render(scene, camera);
  }

  // Functions :
  function onWindowResize() {
    camera.aspect = surface.offsetWidth / surface.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(surface.offsetWidth, surface.offsetHeight);
  }

  function formatTrajectoryData(trajectoryList) {
    var measuredDepth, radian, degree, RF, north, east, tvd;
    var trajectoryArray = [];
    for (var index = 0; index < trajectoryList.length; index++) {
      var firstData = trajectoryList[index];
      var secondData = trajectoryList[index + 1];
      if (secondData) {
        measuredDepth = secondData.depth - firstData.depth;
        radian = Math.acos(Math.cos(secondData.inclination - firstData.inclination) - Math.sin(firstData.inclination) * Math.sin(secondData.inclination) * (1 - Math.cos(secondData.azimuth - firstData.azimuth)));
        degree = radian * 180 / Math.PI;
        RF = (2 / radian) * Math.tan(degree / 2);
        north = (measuredDepth / 2) * (Math.sin(firstData.inclination) * Math.cos(firstData.azimuth) + Math.sin(secondData.inclination) * Math.cos(secondData.azimuth)) * RF;
        east = (measuredDepth / 2) * (Math.sin(firstData.inclination) * Math.sin(firstData.azimuth) + Math.sin(secondData.inclination) * Math.cos(secondData.azimuth)) * RF;
        tvd = (measuredDepth / 2) * (Math.cos(firstData.inclination) + Math.cos(secondData.inclination)) * RF;
        trajectoryArray.push(new THREE.Vector3(north, tvd, east));
      }
    }
    return trajectoryArray;
  }
});

