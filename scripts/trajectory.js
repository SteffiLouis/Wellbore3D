$(document).ready(function () {
  var scene, camera, trajectorySurface, renderer, controls, curve, well;
  var animateTimeSpan, previousCoordinates, nextCoordinates, startQuaternion, endQuaternion; //for camera animation 
  var up = new THREE.Vector3(0, 1, 0);
  var axis = new THREE.Vector3();
  var pt, radians, axis, tangent, marker;
  var wellTangent = 1;

  var labels = []; //label array
  var point, totalDepth = 0; //for goto depth
  init();

  function init() {
    trajectorySurface = document.getElementById("trajectory_3d");
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x9c9c9c);
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
      _addLabel(font, axisPoints, labelPosition, curveFields);
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
    curve = new THREE.CatmullRomCurve3(trajectoryData);
    var curveCoordinates = curve.getPointAt(0.5);
    point = curve.getPoints(150);
    var geometry = new THREE.BufferGeometry().setFromPoints(point);
    for (var i = 0; i < point.length; i++) {
      if (i + 1 < point.length) {
        totalDepth = totalDepth + Math.sqrt((point[i + 1].x - point[i].x) * (point[i + 1].x - point[i].x) + (point[i + 1].y - point[i].y) * (point[i + 1].y - point[i].y) + (point[i + 1].z - point[i].z) * (point[i + 1].z - point[i].z));
      }
    };
    // label along trajectory curve.
    var curvePoints = Object.assign([], curve.points);
    var loader = new THREE.FontLoader();
    loader.load('fonts/droid_sans_regular.typeface.json', function (font) {
      var uniqueKey = {};
      curvePoints = curvePoints.filter(ele => {
        if (!uniqueKey[ele.y]) {
          uniqueKey[ele.y] = true;
          return true
        }
      });
      var curvePositions = [];
      var curveLables = [];
      for (var i = 0; i < curvePoints.length; i++) {
        var cordinate = _perpendicularPoints(i, curvePoints);
        curvePositions.push({
          x: cordinate.x,
          y: cordinate.y,
          z: curvePoints[i].z
        });
        curveLables.push(curvePoints[i].y);
        var textMaterial = new THREE.MeshPhongMaterial({
          color: "black"
        });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(curvePoints[i].x, curvePoints[i].y, curvePoints[i].z));
        geometry.vertices.push(new THREE.Vector3(cordinate.x, cordinate.y, curvePoints[i].z));
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
      _addLabel(font, curveLables, curvePositions, curveFields);
    });
    var material = new THREE.MeshPhysicalMaterial({
      color: 0xd0d9d9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    var geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
    well = new THREE.Mesh(geometry, material);
    scene.add(well);
    marker = _getCube();
    scene.add(marker);
    //rotation and zoom controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(curveCoordinates.x, curveCoordinates.y, curveCoordinates.z);
    controls.update();
    _axisHelper(curveCoordinates);
    render();
    var interaction = new THREE.Interaction(renderer, scene, camera);
  }

  function render() {
    requestAnimationFrame(render);
    //set label with respect to camera rotation
    if (labels) {
      for (var index = 0; index < labels.length; index++) {
        labels[index].lookAt(camera.position);
      }
    }
    _wellAnimate();
    renderer.render(scene, camera);
  }

  function _wellAnimate() {
    if (wellTangent <= 0) {
      return;
    }
    pt = curve.getPoint(wellTangent);
    marker.position.set(pt.x, pt.y, pt.z);
    // get the tangent to the curve
    tangent = curve.getTangent(wellTangent).normalize();
    // calculate the axis to rotate around
    axis.crossVectors(up, tangent).normalize();
    // calcluate the angle between the up vector and the tangent
    radians = Math.acos(up.dot(tangent));
    // set the quaternion
    marker.quaternion.setFromAxisAngle(axis, radians);
    wellTangent = (wellTangent <= 0) ? 1 : wellTangent -= 0.002;
  }

  window.addEventListener('resize', _onWindowResize, true);
  render();

  function _onWindowResize() {
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

  function _getCube() {
    var geometry = new THREE.BoxGeometry( 4, 4, 4 );
    var material = new THREE.MeshBasicMaterial( {color: 0xfcba03} );
    var cube = new THREE.Mesh( geometry, material );
    return cube;
  }

  function _addLabel(font, pointsdata, curvePositions, curveFields) {
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
      labels.push(label);
      scene.add(label);
    }
  }

  function _perpendicularPoints(index, curvePoints) {
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

  function _axisHelper(coordinates) {
    var selectedObject = scene.getObjectByName('axisHelper');
    scene.remove(selectedObject);
    var axisHelper = new THREE.AxesHelper(20);
    var colors = axisHelper.geometry.attributes.color;
    colors.setXYZ(0, 1, 0, 0); // index, R, G, B
    colors.setXYZ(1, 1, 0, 0); // red
    colors.setXYZ(2, 1, 0, 0);
    colors.setXYZ(3, 1, 0, 0); // green
    colors.setXYZ(4, 1, 0, 0);
    colors.setXYZ(5, 1, 0, 0); // blue
    axisHelper.name = 'axisHelper';
    axisHelper.position.set(coordinates.x, coordinates.y, coordinates.z);
    scene.add(axisHelper);
    if(previousCoordinates) {
      _cameraSetAnimate(new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z));
    } else {
      previousCoordinates = coordinates;
    }
    controls.target = new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z);
    controls.update();
  }

  function _cameraSetAnimate(coordinates) {
    if(previousCoordinates) {
      camera.lookAt(new THREE.Vector3(previousCoordinates.x, previousCoordinates.y, previousCoordinates.z));
      startQuaternion = new THREE.Quaternion().copy(camera.quaternion);
    } else {
      camera.lookAt(new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z));
      startQuaternion = new THREE.Quaternion().copy(camera.quaternion);
    }
    camera.lookAt(new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z));
    endQuaternion = new THREE.Quaternion().copy(camera.quaternion);
    animateTimeSpan = 0;
    nextCoordinates = coordinates;
    _cameraAnimate();
  }

  function _cameraAnimate() {
    if (animateTimeSpan > 1) {
      previousCoordinates = nextCoordinates;
      return;
    }
    animateTimeSpan += 0.01;
    requestAnimationFrame(_cameraAnimate);
    THREE.Quaternion.slerp(startQuaternion, endQuaternion, camera.quaternion, animateTimeSpan);
    renderer.render(scene, camera);
  }

  well.on('click', function (ev) {
    var element = ev.intersects[0].point
    if (element) {
      _axisHelper(element);
    }
  });

  $("#clickButton").click(function () {
    var curveDepth = $("#data").val();
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
          previousPoint = point[i];
          _axisHelper(previousPoint);
          break;
        }
      }
    };
  });

  $('#btnBitAnimate').click(function(){
    wellTangent = 1;
    _wellAnimate();
  });
});