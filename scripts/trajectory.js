$(document).ready(function () {
  var scene, camera, trajectorySurface, renderer;
  var points = [];
  var point;
  var totalDepth = 0;
  init();

  function init() {
    trajectorySurface = document.getElementById("trajectory_3d");
    scene = new THREE.Scene();

    //camera
    var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
    var startPosition = new THREE.Vector3(50, 50, 200);
    camera = new THREE.PerspectiveCamera(95, aspectRatio, 1, 10000);
    camera.position.set(startPosition.x, startPosition.y, startPosition.z);
    scene.add(camera);

    //renderer
    renderer = new THREE.WebGLRenderer({
      canvas: trajectorySurface
    });
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
    renderer.setClearColor(0xffffff, 1);

    //label on y-axis
    var size = 150;
    var divisions = 5;
    var markPoints = size / divisions;
    var axisPoints = [];
    var labelPosition = [];
    for (var i = 0; i <= divisions; i++) {
      axisPoints.push(markPoints * i);
      labelPosition.push({
        x: 0,
        y: markPoints * i,
        z: 0
      });
    };
    var curveFields = {
      size: 7,
      height: 0.1,
      curveSegments: 12,
      weight: "Regular",
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 0.2,
      bevelSegments: 10,
      color: "black"
    }
    var loader = new THREE.FontLoader();
    loader.load('fonts/droid_sans_regular.typeface.json', function (font) {
      labelText(font, axisPoints, labelPosition, curveFields);
    });

    // grid along xz-axis
    var gridXZ = new THREE.GridHelper(size, divisions);
    gridXZ.position.set(size / 2, 0, size / 2);
    scene.add(gridXZ);

    //grid along xy-axis
    var gridXY = new THREE.GridHelper(size, divisions);
    gridXY.rotation.x = Math.PI / 2;
    gridXY.position.set(size / 2, size / 2, 0);
    scene.add(gridXY);

    //grid along yz-axis
    var gridYZ = new THREE.GridHelper(size, divisions);
    gridYZ.position.set(0, size / 2, size / 2);
    gridYZ.rotation.z = Math.PI / 2;
    scene.add(gridYZ);

    // terrain texture
    var terrainLoader = new THREE.TerrainLoader();
    terrainLoader.load('img/jotunheimen.bin', function (data) {
      var planeGeometry = new THREE.PlaneGeometry(150, 150, 150);
      for (var i = 0, l = planeGeometry.vertices.length; i < l; i++) {
        planeGeometry.vertices[i].z = data[i] / 65535 * 5;
      }
      var terrainMaterial = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('img/jotunheimen-texture.jpg')
      });
      var planeMesh = new THREE.Mesh(planeGeometry, terrainMaterial);
      planeMesh.rotation.x = Math.PI / 2 + Math.PI;
      planeMesh.rotation.z = Math.PI / Math.cos(270) * 0.492;
      planeMesh.position.set(size / 2, 0, size / 2);
      scene.add(planeMesh);
    });

    //Light
    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    camera.add(pointLight);

    var spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(-50, 75, 200);
    scene.add(spotLight);

    //draw trajectory tube
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
    var curveCoordinates = curve.getPoints(0.5);
    var points = curve.getPoints(150);
    point = curve.getPoints(150);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    for (var i = 0; i < points.length; i++) {
      if (i + 1 < points.length) {
        totalDepth = totalDepth + Math.sqrt((points[i + 1].x - points[i].x) * (points[i + 1].x - points[i].x) + (points[i + 1].y - points[i].y) * (points[i + 1].y - points[i].y) + (points[i + 1].z - points[i].z) * (points[i + 1].z - points[i].z));
      }
    };
    // label along trajectory curve.
    var loader = new THREE.FontLoader();
    loader.load('fonts/droid_sans_regular.typeface.json', function (font) {
      var uniqueKey = {};
      curve.points = curve.points.filter(ele => {
        if (!uniqueKey[ele.y]) {
          uniqueKey[ele.y] = true;
          return true
        }
      });
      var curvePositions = [];
      var curveLables = [];
      for (var i = 0; i < curve.points.length; i++) {
        var cordinate = perpendicularPoints(i, curve.points);
        curvePositions.push({
          x: cordinate.x,
          y: cordinate.y,
          z: curve.points[i].z
        });
        curveLables.push(curve.points[i].y);
        var textMaterial = new THREE.MeshPhongMaterial({
          color: "black"
        });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(curve.points[i].x, curve.points[i].y, curve.points[i].z));
        geometry.vertices.push(new THREE.Vector3(cordinate.x, cordinate.y, curve.points[i].z));
        var line = new THREE.Line(geometry, textMaterial);
        scene.add(line);
      };
      var curveFields = {
        size: 4,
        height: 0.1,
        curveSegments: 12,
        weight: "Regular",
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0.2,
        bevelSegments: 10,
        color: "black"
      }
      labelText(font, curveLables, curvePositions, curveFields);
    });
    var material = new THREE.MeshPhysicalMaterial({
      color: 0xd0d9d9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });
    var geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
    var well = new THREE.Mesh(geometry, material);
    scene.add(well);

    //rotation and zoom controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(curveCoordinates[0].x, curveCoordinates[0].y, curveCoordinates[0].z);
    controls.update();
    render();
    var interaction = new THREE.Interaction(renderer, scene, camera);
    var element;
    well.on('click', function (ev) {
      element = ev.intersects[0].point
      if (element) {
        controls.target = new THREE.Vector3(element.x, element.y, element.z)
      }
      element.x;
      element.y;
      element.z;
    });
  }

  function render() {
    requestAnimationFrame(render);
    //set label with respect to camera rotation
    if (points) {
      for (var index = 0; index < points.length; index++) {
        points[index].lookAt(camera.position);
      }
    }
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', onWindowResize, true);
  render();

  function onWindowResize() {
    camera.aspect = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
  }

  function _drawPerpendicularToPoint(P1, P2, distance, position = 'left') {
    var slope = (P2.y - P1.y) / (P2.x - P1.x);
    if ((P2.y == P1.y) && (P2.x == P1.x)) {
      slope = 1;
    }
    var slopePerpendicular = -(1 / slope);
    var dx = 1 / (Math.sqrt(Math.pow(slopePerpendicular, 2) + 1));
    var dy = slopePerpendicular / (Math.sqrt(Math.pow(slopePerpendicular, 2) + 1));
    var pX, pY;
    switch (position) {
      case 'right':
        pX = P1.x - (distance * dx);
        pY = P1.y - (distance * dy);
        break;
      case 'left':
      default:
        pX = P1.x + (distance * dx);
        pY = P1.y + (distance * dy);
        break;
    }
    return {
      'x': pX,
      'y': pY
    }
  }

  function labelText(font, pointsdata, curvePositions, curveFields) {
    for (var i = 0; i < pointsdata.length; i++) {
      var textGeo = new THREE.TextGeometry((pointsdata[i]).toString(), {
        font: font,
        size: curveFields.size ? curveFields.size : 4,
        height: curveFields.height ? curveFields.height : 0.1,
        curveSegments: curveFields.curveSegments ? curveFields.curveSegments : 5,
        weight: curveFields.weight ? curveFields.weight : "Regular",
        bevelEnabled: curveFields.bevelEnabled ? curveFields.bevelEnabled : false,
        bevelThickness: curveFields.bevelThickness ? curveFields.bevelThickness : 1,
        bevelSize: curveFields.bevelSize ? curveFields.bevelSize : 0.2,
        bevelSegments: curveFields.bevelSegments ? curveFields.bevelSegments : 10,
      });
      var textMaterial = new THREE.MeshPhongMaterial({
        color: curveFields.color ? curveFields.color : "black"
      });
      var label = new THREE.Mesh(textGeo, textMaterial);
      label.position.set(curvePositions[i].x, curvePositions[i].y, curvePositions[i].z);
      points.push(label);
      scene.add(label);
    }
  }

  function perpendicularPoints(index, curvePoints) {
    var distance = 10;
    var P1 = {
      'x': curvePoints[index].x,
      'y': curvePoints[index].y
    }
    if (index == (curvePoints.length - 1)) {
      var P2 = {
        'x': curvePoints[index - 1].x,
        'y': curvePoints[index - 1].y
      }
    } else {
      var P2 = {
        'x': curvePoints[index + 1].x,
        'y': curvePoints[index + 1].y
      }
    }
    return _drawPerpendicularToPoint(P1, P2, distance)
  }

  var curveDepth;
  $("#clickButton").click(function () {
    curveDepth = $("#data").val();
    if (curveDepth > totalDepth) {
      return;
    }
    var value = 0;
    var previousPoint;
    for (var i = 0; i < point.length; i++) {
      if (i + 1 < point.length) {
        value = value + Math.sqrt((point[i + 1].x - point[i].x) *
          (point[i + 1].x - point[i].x) + (point[i + 1].y - point[i].y) *
          (point[i + 1].y - point[i].y) + (point[i + 1].z - point[i].z) *
          (point[i + 1].z - point[i].z));
        if (value >= curveDepth) {
          console.log(previousPoint);
          previousPoint = point[i];
          var material = new THREE.LineBasicMaterial({
            color: "red"
          });
          var geometry = new THREE.Geometry();
          geometry.vertices.push(
            new THREE.Vector3(previousPoint.x, previousPoint.y, previousPoint.z),
            new THREE.Vector3(0, 0, 0),
          );
          var line = new THREE.Line(geometry, material);
          var mesh = new THREE.Mesh(geometry, material);
          scene.add(line);
          scene.add(mesh);
          break;
        } else {
          previousPoint = point[i];
        }
      }
    };
  });

});